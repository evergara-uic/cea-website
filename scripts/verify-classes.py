#!/usr/bin/env python3
"""Check that every utility class used in the built HTML exists in the CSS.

Astro and Tailwind both fail silently on a class they do not recognise: the
markup keeps the class name, the page builds, every internal reference resolves,
and the rule simply is not there. Nothing warns. This site already lost an
entire spacing scale that way — `--space-lg` is not a Tailwind namespace, so
`p-space-lg` and `py-space-xl` generated nothing and every page gutter, section
pad and grid gap on the site collapsed to zero while the class names still read
as though they were doing something.

So this walks dist/, collects every class the pages actually apply, and compares
it against the rules the stylesheet actually emits. Anything applied but not
emitted is a class doing nothing.

Run from the repository root after a build:  python3 scripts/verify-classes.py
"""

from __future__ import annotations

import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"

CLASS_ATTR = re.compile(r'class="([^"]*)"')
# `className = '…'` in the inline scripts. The programme and department filters
# restyle their tabs by assigning to className, so those strings are applied at
# runtime and would otherwise never be checked.
SCRIPT_CLASSNAME = re.compile(r"className\s*=\s*'([^']*)'")

# A class selector, kept whole: a leading `.` followed by escaped characters
# (`md\:grid-cols-2`) and/or characters that cannot end a name. A literal dot
# always starts a new selector, and a literal comma, colon, bracket or space
# always ends one, so none of them can appear unescaped inside the name. The
# brackets matter because Astro's scoped selectors run an attribute selector
# straight after the class — `.icon-rotate[data-astro-cid-…]` — and that
# attribute is part of the selector, not part of the class name.
CSS_CLASS = re.compile(r"\.((?:\\.|[^\\,;{}:+>~()\[\]\s])+)")


def selector_preludes(css: str) -> list[str]:
    """The text before each `{`, i.e. every selector list in the file.

    Parsed with a scanner rather than a regex because a stylesheet is
    brace-nested — `@media` inside `@supports` inside a rule — and a regex
    that cannot count braces would happily read a declaration as a selector.
    """
    preludes: list[str] = []
    start = 0
    index = 0
    length = len(css)
    while index < length:
        char = css[index]
        if char == "\\":
            index += 2
            continue
        if char == "{":
            preludes.append(css[start:index])
            index += 1
            start = index
            continue
        if char == "}":
            index += 1
            start = index
            continue
        if char == ";":
            # A declaration or a top-level custom property ends here, and
            # neither is part of any selector.
            index += 1
            start = index
            continue
        index += 1
    return preludes


def unescape(name: str) -> str:
    """`md\\:grid-cols-2` as written in CSS is `md:grid-cols-2` as used."""
    return re.sub(r"\\(.)", r"\1", name)


# Classes the site writes by hand in `@layer components`, and the few
# bookkeeping names that exist in the markup to drive behaviour rather than
# appearance. These are emitted, or deliberately emit nothing, so they are not
# a defect.
KNOWN = {
    # Hand-written component classes.
    "panel", "surface", "panel-lift", "btn", "btn-primary", "btn-ghost",
    "card", "chip", "eyebrow", "eyebrow-on-dark", "arrow-link", "field",
    "menu", "grain", "link-underline",
    # Applied by Base.astro's script rather than styled: `js` gates the
    # reveal-on-scroll so it never leaves content invisible without scripting.
    "js", "reveal", "is-visible",
    # Tailwind markers. `group` and `peer` are never styled themselves; they
    # exist to be the target of a `group-*` / `peer-*` variant.
    "group", "peer",
}


def main() -> int:
    if not DIST.is_dir():
        print("dist/ not found. Build first.")
        return 1

    stylesheets = sorted(DIST.glob("_astro/*.css"))
    if not stylesheets:
        print("No stylesheet in dist/_astro. Nothing to check against.")
        return 1

    emitted: set[str] = set()
    for sheet in stylesheets:
        for prelude in selector_preludes(sheet.read_text(encoding="utf-8")):
            for match in CSS_CLASS.finditer(prelude):
                emitted.add(unescape(match.group(1)))

    pages = sorted(DIST.rglob("*.html"))
    used: dict[str, set[str]] = {}
    for page in pages:
        text = page.read_text(encoding="utf-8", errors="replace")
        where = str(page.relative_to(DIST))
        tokens = list(CLASS_ATTR.findall(text))
        tokens += SCRIPT_CLASSNAME.findall(text)
        for attr in tokens:
            for token in attr.split():
                if token:
                    used.setdefault(token, set()).add(where)

    missing = {name: pages for name, pages in used.items()
               if name not in emitted and name not in KNOWN}

    print(f"{len(stylesheets)} stylesheet(s), {len(emitted)} class rules emitted")
    print(f"{len(used)} distinct classes applied across {len(pages)} pages")

    if not missing:
        print("\nevery class applied by the pages has a rule in the CSS")
        return 0

    print(f"\n{len(missing)} class(es) applied but with no rule in the CSS:")
    for name in sorted(missing):
        where = sorted(missing[name])
        shown = ", ".join(where[:3])
        more = f" (+{len(where) - 3} more)" if len(where) > 3 else ""
        print(f"  {name:52s} {shown}{more}")
    return 1


if __name__ == "__main__":
    sys.exit(main())
