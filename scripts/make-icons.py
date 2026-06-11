#!/usr/bin/env python3
"""Generate PWA PNG icons from inline SVG."""
import os, sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

try:
    from PIL import Image, ImageDraw
except ImportError:
    print("Pillow not installed. Skipping PNG generation.")
    sys.exit(0)

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public"

PALETTE = {
    "bg": (253, 247, 236),
    "bark": (90, 63, 43),
    "leaf": (155, 197, 157),
    "postit": (255, 244, 163),
    "postit_edge": (232, 217, 113),
}

def draw_tree(size: int) -> Image.Image:
    img = Image.new("RGB", (size, size), PALETTE["bg"])
    d = ImageDraw.Draw(img)
    # trunk
    s = size / 64
    # trunk path simplified — bezier-ish thick line
    pts = [(32, 52), (30, 38), (33, 26), (35, 18), (33, 12)]
    pts_px = [(int(x * s), int(y * s)) for x, y in pts]
    for i in range(len(pts_px) - 1):
        d.line([pts_px[i], pts_px[i + 1]], fill=PALETTE["bark"], width=int(3 * s))
    # canopy circles
    leaf_circles = [(24, 20, 9), (40, 18, 11), (34, 30, 9)]
    for cx, cy, r in leaf_circles:
        d.ellipse(
            [int((cx - r) * s), int((cy - r) * s), int((cx + r) * s), int((cy + r) * s)],
            fill=PALETTE["leaf"],
        )
    # postit
    pad = int(28 * s)
    sz = int(9 * s)
    d.rectangle([pad, int(24 * s), pad + sz, int(24 * s) + sz], fill=PALETTE["postit"], outline=PALETTE["postit_edge"], width=max(1, int(s)))
    return img

for size in (192, 512):
    out = OUT / f"icon-{size}.png"
    img = draw_tree(size)
    img.save(out, "PNG")
    print(f"wrote {out}")
