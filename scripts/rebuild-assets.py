#!/usr/bin/env python3
"""
Rebuild the project's image assets from the Google Sites export.

The first migration pulled images off the live site, which gave correct
ordering on a few pages but unusable names, and it lost 52 files to CDN rate
limiting. The export in .staging/takeout is authoritative: real filenames, real
event folders, and the school year the first pass never managed to fetch.

Only assets whose identity is certain are kept:

  brand/       the College mark, its seal and the small icon
  scholarships/ the two published scholarship posters
  events/<event>/  photographs from the four named event folders

Everything else the export contains is deliberately dropped. The AI-generated
page banners are site decoration rather than College content, and the square
"unnamed" images on the legacy Our Pride page match no file in the export, so
they cannot be attributed to named individuals and are not carried over.

Run from the project root, after staging the export:

    python3 scripts/rebuild-assets.py
"""

from __future__ import annotations

import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TAKEOUT = ROOT / ".staging" / "takeout"
ASSETS = ROOT / "src" / "assets"
LEGACY = ASSETS / "gallery"

# Event folder in the export -> slug used in content files and URLs.
EVENTS = {
    "Research Forum 2026": "research-forum-2026",
    "Freshmen Orientation 2026": "freshmen-orientation-2026",
    "Freshmen Tour 2026": "freshmen-tour-2026",
    "2024-2025 Research": "research-2024-2025",
}

# Brand assets carried over from the live-site migration. These were confirmed
# by their position on the College's own "CEA Logo and Seal" page.
BRAND = {
    "about-cea-cea-logo-seal-030.png": "cea-mark.png",
    "about-cea-cea-logo-seal-031.png": "cea-icon.png",
    "about-cea-cea-logo-seal-034.png": "cea-seal.png",
}

SCHOLARSHIPS = {
    "about-cea-scholarships-offered-037.png": "poster-1.png",
    "about-cea-scholarships-offered-038.png": "poster-2.png",
}

IMAGE_SUFFIXES = (".png", ".jpg", ".jpeg", ".webp")


def natural_key(name: str):
    """Sort IMG_7479 / 1 / 10 the way a human reads them, not as strings."""
    return [int(part) if part.isdigit() else part.lower() for part in re.split(r"(\d+)", name)]


def main() -> int:
    if not TAKEOUT.exists():
        print(f"error: {TAKEOUT} does not exist. Stage the export first.", file=sys.stderr)
        return 1

    # Start from a clean tree so files dropped below cannot linger and keep
    # being picked up by the image glob.
    for folder in ("brand", "scholarships", "events"):
        shutil.rmtree(ASSETS / folder, ignore_errors=True)

    brand_dir = ASSETS / "brand"
    brand_dir.mkdir(parents=True)

    missing = []
    for source, target in BRAND.items():
        origin = LEGACY / source
        if not origin.exists():
            missing.append(f"brand: {source}")
            continue
        shutil.copy2(origin, brand_dir / target)
    for source, target in SCHOLARSHIPS.items():
        origin = LEGACY / source
        if not origin.exists():
            missing.append(f"scholarships: {source}")
            continue
        (ASSETS / "scholarships").mkdir(parents=True, exist_ok=True)
        shutil.copy2(origin, ASSETS / "scholarships" / target)

    counts: dict[str, int] = {}
    for folder, slug in EVENTS.items():
        source_dir = TAKEOUT / folder
        if not source_dir.exists():
            missing.append(f"events: {folder}")
            continue

        photos = sorted(
            (p for p in source_dir.iterdir() if p.suffix.lower() in IMAGE_SUFFIXES),
            key=lambda p: natural_key(p.name),
        )
        target_dir = ASSETS / "events" / slug
        target_dir.mkdir(parents=True, exist_ok=True)

        for i, photo in enumerate(photos, start=1):
            # Renamed to a plain sequence so content files can reference them by
            # position without depending on camera filenames.
            suffix = ".jpg" if photo.suffix.lower() in (".jpg", ".jpeg") else photo.suffix.lower()
            shutil.copy2(photo, target_dir / f"{i:03d}{suffix}")
        counts[slug] = len(photos)

    if missing:
        print("warning: expected source files were not found:", file=sys.stderr)
        for item in missing:
            print(f"  {item}", file=sys.stderr)

    print("brand:       ", len(BRAND) - sum(1 for m in missing if m.startswith("brand")), "files")
    print("scholarships:", len(SCHOLARSHIPS) - sum(1 for m in missing if m.startswith("scholar")), "files")
    for slug, count in counts.items():
        print(f"events/{slug}: {count} photos")
    print("total photos:", sum(counts.values()))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
