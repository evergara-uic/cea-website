#!/usr/bin/env python3
"""
Second pass over the legacy asset migration.

The first run used a thread pool to go faster, but the Google image CDN
rate-limits by request rate rather than by total volume, so concurrency only
bought 403s: 52 of 170 images were lost, including every photo from the
2024-2025 school year.

This pass is deliberately single-threaded and slow. It also recovers the real
filename of each Drive document from the Content-Disposition header, which the
first pass threw away in favour of positional names.

Re-running this immediately after the first pass tends to fail: the CDN
applies a long cool-down once it has been hit hard. Wait several minutes, then
run it with a comfortable delay. Nothing here is required for the site to
build -- the images already migrated cover two full school years, the whole
faculty roster and the College mark.

    python3 scripts/retry-assets.py [--delay 6]
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
IMG_DIR = ROOT / "src" / "assets" / "gallery"
DOC_DIR = ROOT / "public" / "documents"
MANIFEST = ROOT / "scripts" / "assets-manifest.json"

# Seconds between image requests. Raise this if you keep seeing 403s.
DEFAULT_DELAY = 4.0
MAX_ATTEMPTS = 4
TIMEOUT = 60

UA = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/126.0 Safari/537.36"
)


def get(url: str, headers: dict | None = None, binary: bool = False):
    for attempt in range(MAX_ATTEMPTS):
        req = urllib.request.Request(url, headers={"User-Agent": UA, **(headers or {})})
        try:
            with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
                body = resp.read() if binary else b""
                return body, dict(resp.headers)
        except urllib.error.HTTPError as exc:
            if exc.code in (403, 429, 503) and attempt < MAX_ATTEMPTS - 1:
                time.sleep(3 * (attempt + 1))
                continue
            print(f"    ! HTTP {exc.code}", file=sys.stderr)
            return None, {}
        except Exception as exc:  # noqa: BLE001
            if attempt < MAX_ATTEMPTS - 1:
                time.sleep(3 * (attempt + 1))
                continue
            print(f"    ! {type(exc).__name__}: {exc}", file=sys.stderr)
            return None, {}
    return None, {}


def sniff(data: bytes) -> str | None:
    if data[:8] == b"\x89PNG\r\n\x1a\n":
        return "png"
    if data[:2] == b"\xff\xd8":
        return "jpg"
    if data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return "webp"
    return None


def safe_name(raw: str) -> str:
    """Turn a Drive filename into a readable, url-safe slug."""
    stem = re.sub(r"\.pdf$", "", raw, flags=re.I)
    stem = stem.replace("&", "and")
    slug = re.sub(r"[^a-z0-9]+", "-", stem.lower()).strip("-")
    return slug or "document"


def retry_images(manifest: dict, request_delay: float) -> int:
    failed = [i for i in manifest["images"] if not i.get("file")]
    print(f"Retrying {len(failed)} images at {request_delay}s intervals...")
    recovered = 0
    for n, item in enumerate(failed, 1):
        data, _ = get(item["url"] + "=s1600", binary=True)
        ext = sniff(data) if data else None
        if not ext:
            print(f"  [{n}/{len(failed)}] still failing {item['url'][-24:]}")
            time.sleep(request_delay)
            continue

        # Reuse the positional name the first pass would have used, so the
        # content files and the manifest stay consistent.
        index = manifest["images"].index(item)
        page_slug = item["slug"]
        name = f"{page_slug}-{index:03d}.{ext}"
        (IMG_DIR / name).write_bytes(data)
        item["file"] = f"src/assets/gallery/{name}"
        item["bytes"] = len(data)
        recovered += 1
        print(f"  [{n}/{len(failed)}] + {name} ({len(data) // 1024} KB)")
        time.sleep(request_delay)
    return recovered


def rename_documents(manifest: dict) -> None:
    """Give each PDF the name it actually has in Drive."""
    print("Recovering document filenames...")
    for doc in manifest["documents"]:
        path = ROOT / doc["file"].lstrip("/")
        if not path.exists():
            continue
        # A one-byte range is enough to read the headers without re-downloading
        # multi-megabyte files.
        _, headers = get(
            f"https://drive.google.com/uc?id={doc['id']}&export=download",
            headers={"Range": "bytes=0-0"},
        )
        disposition = headers.get("Content-Disposition", "")
        match = re.search(r'filename\*?=(?:UTF-8\'\')?"?([^";]+)"?', disposition)
        if not match:
            print(f"  ? no filename for {path.name}, keeping positional name")
            continue
        raw = match.group(1).strip()
        new_path = DOC_DIR / f"{safe_name(raw)}.pdf"
        if new_path == path:
            print(f"  = {path.name} already correct")
            continue
        path.rename(new_path)
        doc["file"] = f"public/documents/{new_path.name}"
        doc["title"] = raw
        print(f"  > {path.name} -> {new_path.name}")
        time.sleep(0.4)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--delay",
        type=float,
        default=DEFAULT_DELAY,
        help=f"seconds between image requests (default {DEFAULT_DELAY})",
    )
    args = parser.parse_args()

    manifest = json.loads(MANIFEST.read_text())
    recovered = retry_images(manifest, args.delay)
    rename_documents(manifest)
    MANIFEST.write_text(json.dumps(manifest, indent=2, ensure_ascii=False))
    print(f"\nRecovered {recovered} images.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
