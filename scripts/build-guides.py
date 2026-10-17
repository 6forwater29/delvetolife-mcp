#!/usr/bin/env python3
"""Regenerate src/guides.json from ../delvetolife/dist so search_guides stays in sync."""
import glob, html, json, re
from pathlib import Path
here = Path(__file__).resolve().parent.parent
dist = here.parent / "delvetolife" / "dist"
out = []
files = sorted(glob.glob(str(dist / "guides/*/index.html"))) + [str(dist / "insights/screen-style-index/index.html"), str(dist / "references/index.html")]
for f in files:
    s = open(f, encoding="utf-8").read()
    path = "/" + f.split("/dist/")[1].replace("index.html", "")
    t = re.sub(r"\s*\|\s*Delve to Life$", "", html.unescape(re.search(r"<title>(.*?)</title>", s).group(1)))
    d = html.unescape(re.search(r'name="description" content="(.*?)"', s).group(1))
    hs = [html.unescape(re.sub("<[^>]+>", "", h)).strip() for h in re.findall(r"<h2[^>]*>(.*?)</h2>", s, re.S)]
    qa = re.search(r'class="quick-answer">(.*?)</div>', s, re.S)
    quick = re.sub(r"\s+", " ", html.unescape(re.sub("<[^>]+>", " ", qa.group(1)))).replace("THE QUICK ANSWER", "").replace("THE SHORT VERSION", "").strip() if qa else ""
    out.append({"title": t, "url": "https://delvetolife.com" + path, "description": d, "sections": hs, "quick_answer": quick})
(here / "src/guides.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
print("guides:", len(out))
