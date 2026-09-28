#!/usr/bin/env python3
"""
One-shot scraper for the legacy UIC-CEA Google Sites site.

Walks every page of the legacy site, records the images and Drive documents it
finds, and downloads both into the Astro project's public/ tree. Writes a JSON
manifest describing what it got so the build can reference real files.

The Google image CDN answers 403 under rapid-fire requests, so every download
is throttled and retried with backoff, and the response content-type is checked
before anything touches disk -- otherwise a rate-limit error page silently
becomes a broken photo.

Run from the project root:  python3 scripts/migrate-assets.py
"""

from __future__ import annotations

import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

BASE = "https://sites.google.com/uic.edu.ph/collegeofengineeringandarchi"
ROOT = Path(__file__).resolve().parent.parent
# Images live in src/assets so the Astro image pipeline can emit responsive
# WebP/AVIF srcsets and LQIP placeholders. Documents are served verbatim, so
# public/ is the right home for those.
IMG_DIR = ROOT / "src" / "assets" / "gallery"
DOC_DIR = ROOT / "public" / "documents"
MANIFEST = ROOT / "scripts" / "assets-manifest.json"

# Politeness: the CDN 403s when hit hard, and these are not our servers.
DELAY_BETWEEN_REQUESTS = 0.35
DELAY_BETWEEN_PAGES = 1.0
MAX_ATTEMPTS = 5
TIMEOUT = 45

PAGES = [
    "/home",
    "/about-cea",
    "/about-cea/our-pride",
    "/about-cea/cea-logo-seal",
    "/about-cea/scholarships-offered",
    "/programs-offered",
    "/programs-offered/bs-architecture",
    "/programs-offered/bs-electronics-engineering",
    "/programs-offered/bs-civil-engineering",
    "/programs-offered/bs-computer-engineering",
    "/featured-works",
    "/featured-works/sy-2026-2027",
    "/featured-works/sy-2025-2026",
    "/featured-works/sy-2024-2025",
    "/archives",
]

UA = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/126.0 Safari/537.36"
)

_last_request = 0.0


def throttle() -> None:
    """Space out requests so the CDN keeps answering 200 instead of 403."""
    global _last_request
    wait = DELAY_BETWEEN_REQUESTS - (time.monotonic() - _last_request)
    if wait > 0:
        time.sleep(wait)
    _last_request = time.monotonic()


def fetch(url: str, binary: bool = False):
    """GET with throttling and exponential backoff. Returns None if it never works."""
    global _last_request
    for attempt in range(MAX_ATTEMPTS):
        throttle()
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        try:
            with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
                return resp.read() if binary else resp.read().decode("utf-8", "replace")
        except urllib.error.HTTPError as exc:
            # 403 here means "slow down", not "gone" -- back off and retry.
            if exc.code in (403, 429, 503) and attempt < MAX_ATTEMPTS - 1:
                time.sleep(2 ** attempt)
                continue
            print(f"    ! HTTP {exc.code} {url[:90]}", file=sys.stderr)
            return None
        except Exception as exc:  # noqa: BLE001 - network is allowed to be flaky
            if attempt < MAX_ATTEMPTS - 1:
                time.sleep(2 ** attempt)
                continue
            print(f"    ! {type(exc).__name__}: {exc}", file=sys.stderr)
            return None
    return None


def strip_tags(html: str) -> str:
    html = re.sub(r"<(script|style|noscript)[\s\S]*?</\1>", " ", html)
    text = re.sub(r"<[^>]+>", " ", html)
    for a, b in (
        ("&amp;", "&"), ("&nbsp;", " "), ("&#39;", "'"),
        ("&quot;", '"'), ("&lt;", "<"), ("&gt;", ">"),
    ):
        text = text.replace(a, b)
    return re.sub(r"\s+", " ", text).strip()


def slugify(value: str) -> str:
    value = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return value or "item"


def scrape() -> tuple[list[dict], list[dict]]:
    images: list[dict] = []
    documents: list[dict] = []
    seen_img: set[str] = set()
    seen_doc: set[str] = set()

    for path in PAGES:
        print(f"  scraping {path}")
        html = fetch(BASE + path)
        if html is None:
            print(f"    ! failed to fetch {path}", file=sys.stderr)
            continue
        slug = slugify(path.strip("/").replace("/", "-")) or "home"

        # Images carry their own resize hint (=w1280, =s600, ...). Keep the
        # bare URL as the identity so a page that uses the same photo at two
        # sizes does not become two downloads.
        for url in re.findall(
            r"https://sites\.google\.com/sitesv-images-rt/[A-Za-z0-9_-]+(?:=[a-z0-9,-]+)?", html
        ):
            bare = url.split("=")[0]
            if bare in seen_img:
                continue
            seen_img.add(bare)
            images.append({"page": path, "slug": slug, "url": bare, "hint": url})

        # Drive documents. The viewer emits several URL shapes per file; the
        # 18-character id is what actually identifies it.
        for doc_id in re.findall(r"drive\.google\.com/uc\?id=([A-Za-z0-9_-]{10,})", html):
            if doc_id in seen_doc:
                continue
            seen_doc.add(doc_id)
            documents.append({"page": path, "slug": slug, "id": doc_id})

        time.sleep(DELAY_BETWEEN_PAGES)

    return images, documents


def download_images(images: list[dict]) -> list[dict]:
    IMG_DIR.mkdir(parents=True, exist_ok=True)
    results: list[dict] = []

    def one(item: dict) -> dict:
        index = images.index(item)
        data = fetch(item["url"] + "=s1600", binary=True)
        if not data:
            return {**item, "file": None, "error": "download failed"}
        # The real check: a rate-limited 403 body is HTML, not an image.
        if data[:8] == b"\x89PNG\r\n\x1a\n":
            ext = "png"
        elif data[:2] == b"\xff\xd8":
            ext = "jpg"
        elif data[:4] == b"RIFF" and data[8:12] == b"WEBP":
            ext = "webp"
        else:
            return {**item, "file": None, "error": f"not an image ({data[:4]!r})"}

        name = f"{item['slug']}-{index:03d}.{ext}"
        (IMG_DIR / name).write_bytes(data)
        print(f"    + {name} ({len(data) // 1024} KB)")
        return {**item, "file": f"src/assets/gallery/{name}", "bytes": len(data)}

    # A small pool with a global throttle still respects the CDN, and turns a
    # ~6 minute serial walk into well under a minute.
    with ThreadPoolExecutor(max_workers=4) as pool:
        results = list(pool.map(one, images))
    return results


def download_documents(documents: list[dict]) -> list[dict]:
    DOC_DIR.mkdir(parents=True, exist_ok=True)
    results: list[dict] = []
    for index, item in enumerate(documents):
        url = f"https://drive.google.com/uc?id={item['id']}&export=download"
        data = fetch(url, binary=True)
        if not data:
            results.append({**item, "file": None, "error": "download failed"})
            continue
        if not data.startswith(b"%PDF"):
            results.append({**item, "file": None, "error": "not a PDF"})
            continue

        # Drive sends the real filename in Content-Disposition; without a
        # browser session it often falls back to the id, so keep ours stable
        # and readable instead.
        name = f"{item['slug']}-{index:02d}.pdf"
        (DOC_DIR / name).write_bytes(data)
        print(f"    + {name} ({len(data) // 1024} KB)")
        results.append({**item, "file": f"/documents/{name}", "bytes": len(data)})
    return results


def main() -> int:
    print("Scraping legacy site...")
    images, documents = scrape()
    print(f"  found {len(images)} images, {len(documents)} documents")

    print("Downloading images...")
    image_results = download_images(images)
    print("Downloading documents...")
    document_results = download_documents(documents)

    manifest = {
        "base": BASE,
        "images": image_results,
        "documents": document_results,
    }
    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST.write_text(json.dumps(manifest, indent=2))

    ok_i = sum(1 for r in image_results if r.get("file"))
    ok_d = sum(1 for r in document_results if r.get("file"))
    print(f"\nDone. images {ok_i}/{len(image_results)}, documents {ok_d}/{len(document_results)}")
    print(f"Manifest: {MANIFEST}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
