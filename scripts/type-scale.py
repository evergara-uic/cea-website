#!/usr/bin/env python3
"""
Move the inner pages onto the design system's type scale.

The homepage, header, footer and programme card were rebuilt against the
Institutional Modernism scale (`text-headline-*`, `text-body-*`, `text-label-*`).
The other twelve routes were written earlier against Tailwind's default steps
(`text-3xl`, `text-sm`, ...), so the two halves of the site set type at different
sizes and the design system's scale only reached half the pages.

The scale has twelve named steps and Tailwind's default has fourteen, and they
are not parallel ramps, so this is a remap rather than a rename. Two rules, and
they are applied by position so nothing has to be guessed:

  * inside an <h1>-<h4>, a size step means a *heading* step
  * anywhere else, a size step means a *body* or *label* step

Only the size token is touched. Colour, weight, tracking and the responsive
prefix are all left exactly as they were, so the change is confined to font-size
and line-height.

Run with --check to see the plan without writing.
"""

import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"

# Heading steps, in the order the scale names them. `text-3xl` was used both for
# a page title and for a large section heading, so it takes the larger of the
# two; where the pages already distinguished them with a `sm:` variant that
# distinction survives.
HEADING = {
    "text-xl": "text-headline-sm",
    "text-lg": "text-headline-sm",
    "text-2xl": "text-headline-md",
    "text-3xl": "text-headline-lg",
    "text-4xl": "text-headline-lg",
    "text-5xl": "text-display-hero",
    "text-6xl": "text-display-hero",
}

# Body and label steps. `text-base` sat between Stitch's body-md and body-lg;
# body-md is the reading size, so that is what it becomes.
BODY = {
    "text-xs": "text-label-md",
    "text-sm": "text-body-sm",
    "text-base": "text-body-md",
    "text-lg": "text-body-lg",
    "text-xl": "text-headline-sm",
    "text-2xl": "text-headline-md",
}

# A size step, optionally behind a responsive variant (`sm:text-3xl`) or a dark
# modifier (`dark:text-ivory-50`, which is a colour and must not match). This
# cannot match a step that is already on the design system — `text-headline-sm`
# has no `xs`/`sm`/`base`/... immediately after its hyphen — so no separate
# "already migrated" guard is needed.
SIZE_TOKEN = re.compile(r"(?P<prefix>(?:[\w-]+:)?)text-(?P<step>xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl)\b")


def remap(class_value: str, table: dict) -> tuple[str, list[tuple[str, str]]]:
    """Rewrite size steps in one class attribute. Returns the new value and the
    substitutions made, so the caller can report them."""
    changes = []

    def swap(match: re.Match) -> str:
        step = "text-" + match.group("step")
        replacement = table.get(step)
        # A `dark:` prefix on a *size* step would be a dark-mode size override,
        # which nothing here uses; if one ever appears it is left alone rather
        # than silently promoted to a light-mode size.
        if replacement is None or match.group("prefix").startswith("dark"):
            return match.group(0)
        changes.append((step, replacement))
        return match.group("prefix") + replacement

    return SIZE_TOKEN.sub(swap, class_value), changes


# `<h1 class="...">` through `<h4 class="...">`, plus any class attribute later in
# the same tag. Astro allows newlines inside the tag, so this is not line-based.
HEADING_TAG = re.compile(r"<(h[1-4])\b([^>]*)>", re.I | re.S)
CLASS_ATTR = re.compile(r'class="([^"]*)"')
# An explicit line-height on a heading, which the scale's own leading supersedes.
LEADING = re.compile(r"\s+leading-(?:tight|normal|relaxed|loose|snug|none|\[[^\]]+\])")


def process(text: str) -> tuple[str, list[str]]:
    """Rewrite one file's contents. Returns the new text and a log of edits."""
    log: list[str] = []

    def handle_tag(match: re.Match) -> str:
        tag, attrs = match.group(1), match.group(2)
        new_attrs = attrs
        for attr in CLASS_ATTR.finditer(attrs):
            original = attr.group(1)
            updated, changes = remap(original, HEADING)
            # A hand-rolled `leading-*` on a heading fights the token's own
            # line-height, which is part of the scale. Two page titles carried
            # `leading-tight`; dropping it lets the scale's leading govern, so
            # the display step is set the way the system sets it.
            if tag.lower() == "h1" and LEADING.search(updated):
                for before in LEADING.findall(updated):
                    log.append(f"  <{tag}> dropped {before} (the scale sets leading)")
                updated = LEADING.sub("", updated)
            if not changes and updated == original:
                continue
            for before, after in changes:
                log.append(f"  <{tag}> {before} -> {after}")
            new_attrs = new_attrs.replace(f'class="{original}"', f'class="{updated}"', 1)
        return f"<{tag}{new_attrs}>"

    out = HEADING_TAG.sub(handle_tag, text)

    # Body pass: whatever size steps are left are outside a heading tag. Heading
    # tags have already been rewritten, so their new steps do not match here.
    def handle_attrs(match: re.Match) -> str:
        original = match.group(1)
        updated, changes = remap(original, BODY)
        for before, after in changes:
            log.append(f"  body  {before} -> {after}")
        return f'class="{updated}"'

    out = CLASS_ATTR.sub(handle_attrs, out)
    return out, log


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="report without writing")
    args = parser.parse_args()

    # The homepage is `pages/index.astro`; the section indexes of /programs,
    # /faculty and /featured-works share that filename, so pages are selected by
    # path rather than by name. The three ported components are excluded because
    # they already speak the design system's scale.
    files = [
        p
        for p in sorted(SRC.rglob("*.astro"))
        if p != SRC / "pages" / "index.astro"
        and p.name not in {"ProgramCard.astro", "Header.astro", "Footer.astro"}
    ]

    total = 0
    for path in files:
        text = path.read_text(encoding="utf-8")
        updated, log = process(text)
        if not log:
            continue
        rel = path.relative_to(ROOT)
        print(f"{rel}  ({len(log)} step(s))")
        for line in log:
            print(line)
        total += len(log)
        if not args.check:
            path.write_text(updated, encoding="utf-8")

    verb = "would change" if args.check else "changed"
    print(f"\n{total} type step(s) {verb} across {len(files)} file(s).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
