#!/usr/bin/env python3
"""Verify the built site: every route serves, every internal reference resolves.

    python3 scripts/verify-dist.py

Checks that each HTML file in dist/ has a matching route on disk, that no page
links to a missing internal path, that public/_redirects contains no redirect
loop, and reports the total weight of the build.
"""
import glob
import html
import os
import re
import sys
from urllib.parse import unquote, urlparse

DIST = "dist"

# Attributes that can carry a URL.
URL_ATTR = re.compile(
    r'(?:href|src|data-src|poster|content)\s*=\s*"([^"]+)"', re.I
)
# srcset is a comma-separated list of "url descriptor".
SRCSET_ATTR = re.compile(r'srcset\s*=\s*"([^"]+)"', re.I)


def local_refs(markup):
    """Every internal path a page references, from href/src/poster/srcset."""
    refs = set()
    for m in URL_ATTR.finditer(markup):
        refs.add(m.group(1))
    for m in SRCSET_ATTR.finditer(markup):
        for part in m.group(1).split(","):
            candidate = part.strip().split(" ")[0]
            if candidate:
                refs.add(candidate)
    return refs


def is_internal(ref):
    if not ref or ref.startswith(("#", "mailto:", "tel:", "data:", "javascript:")):
        return False
    p = urlparse(ref)
    if p.scheme or p.netloc:
        return False
    return p.path.startswith("/")


def resolves(path):
    """Does this internal path exist in the build?"""
    clean = unquote(urlparse(path).path)
    if clean.endswith("/"):
        clean += "index.html"
    elif "." not in os.path.basename(clean):
        # Extensionless route: /programs/bs-architecture -> .../index.html
        clean += "/index.html"
    return os.path.isfile(os.path.join(DIST, clean.lstrip("/")))


def check_redirects():
    """Audit dist/_redirects: no loop, no shadowed route, no dead destination.

    This is the one defect that a build on this machine cannot catch and a
    deploy turns catastrophic. The local preview serves dist through Caddy,
    which uses `try_files` and never reads _redirects, so a rule here is inert
    until Cloudflare honours it. A rule whose destination is its own source
    answers every request with a redirect to the address just requested, and
    the visitor gets ERR_TOO_MANY_REDIRECTS on a page that works perfectly
    locally.
    """
    path = os.path.join(DIST, "_redirects")
    if not os.path.isfile(path):
        return 0

    loops, shadowed, dangling = [], [], []
    for lineno, raw in enumerate(open(path, encoding="utf-8"), 1):
        line = raw.split("#", 1)[0].strip()
        if not line:
            continue
        parts = line.split()
        if len(parts) < 2:
            continue
        src, dest = parts[0], parts[1]

        if src.rstrip("/") == dest.rstrip("/"):
            loops.append((lineno, src, dest))
        elif resolves(src) and resolves(dest) and src.rstrip("/") != dest.rstrip("/"):
            # Both addresses are real pages. Redirecting one to the other is
            # legal but it means one of them can never be reached directly.
            shadowed.append((lineno, src, dest))
        elif not resolves(dest):
            dangling.append((lineno, src, dest))

    total = len(loops) + len(shadowed) + len(dangling)
    if total:
        print("REDIRECT PROBLEMS")
        for lineno, src, dest in loops:
            print(f"  _redirects:{lineno}  LOOP  {src} -> {dest}")
        for lineno, src, dest in dangling:
            print(f"  _redirects:{lineno}  DEAD  {src} -> {dest}  (no such page)")
        for lineno, src, dest in shadowed:
            print(f"  _redirects:{lineno}  SHADOW  {src} -> {dest}  (both are real pages)")
        print()
    else:
        print("no redirect loops, dead ends or shadowed routes")
        print()

    return len(loops) + len(dangling)


def main():
    pages = sorted(glob.glob(os.path.join(DIST, "**", "*.html"), recursive=True))
    if not pages:
        sys.exit(f"no HTML in {DIST}/ — run the build first")

    print(f"{len(pages)} pages in {DIST}/\n")

    broken = {}
    ref_count = 0
    for page in pages:
        with open(page, encoding="utf-8", errors="ignore") as f:
            markup = f.read()
        missing = set()
        for ref in local_refs(markup):
            if not is_internal(ref):
                continue
            ref_count += 1
            if not resolves(ref):
                missing.add(ref)
        if missing:
            rel = os.path.relpath(page, DIST)
            broken[rel] = sorted(missing)

    if broken:
        print("BROKEN REFERENCES")
        for page, refs in broken.items():
            for ref in refs:
                print(f"  {page}  ->  {ref}")
        print(f"\n{sum(len(v) for v in broken.values())} broken of {ref_count} internal refs")
    else:
        print(f"all {ref_count} internal references resolve")

    redirect_failures = check_redirects()

    # Weight, and the largest files, which is what a CDN actually has to move.
    files = [os.path.join(r, n) for r, _, ns in os.walk(DIST) for n in ns]
    total = sum(os.path.getsize(p) for p in files)
    print(f"\n{len(files)} files, {total / 1048576:.1f} MB")

    print("\nlargest files")
    for p in sorted(files, key=os.path.getsize, reverse=True)[:10]:
        print(f"  {os.path.getsize(p) / 1048576:>7.1f} MB  {os.path.relpath(p, DIST)}")

    return 1 if (broken or redirect_failures) else 0


if __name__ == "__main__":
    sys.exit(main())
