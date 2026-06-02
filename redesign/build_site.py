#!/usr/bin/env python3
"""
Assemble new-site/ by pouring the verbatim content layer (content/*.json) into the
Claude Design template (Portfoio Rework/). Non-destructive: writes only into new-site/.
Re-runnable.

- Generates new-site/assets/data.js (window.SITE) from content + site-manifest.json.
- Copies the design's CSS/JS (with minimal edits) and page shells.
- Generates project-N / update-N detail stubs.
- Copies images/ into new-site/images/.
- Sanitizes section/update body HTML to an allowlist (drops old layout classes,
  keeps every word verbatim) and normalizes image paths to lowercase images/.
"""
import json, re, shutil, html
from pathlib import Path
from html.parser import HTMLParser

ROOT = Path(__file__).resolve().parent.parent
SRC_DESIGN = ROOT / "Portfoio Rework"
# Generated site lives at the repo root (deployed as-is by Netlify, publish=".").
OUT = ROOT
CONTENT = ROOT / "content"
MANIFEST = json.loads((ROOT / "site-manifest.json").read_text())

# ---------- helpers ----------
PHOTO_KEYS = ["internalwideshot", "electroniccompartment", "teamphoto",
              "rotarymech", "poster", "headshot"]
TALL_KEYS = ["calendar", "pomodoro", "sleep", "task", "settingsui", "newtask",
             "alltasks", "uncompleted", "screen"]
WIDE_KEYS = ["graph", "diagram", "schematic", "render", "simulation",
             "mechanical", "electrical", "lightspeed", "pcb", "gui", "testscene"]

def norm_img(src, prefix=""):
    """Strip ../ and force lowercase images/ folder. prefix '' for structured fields
    (site.js adds ROOT), '../' for raw-HTML on depth-1 detail pages."""
    base = re.sub(r'^(\.\./)+', '', src or '')
    base = re.sub(r'^[Ii]mages/', 'images/', base)
    if not base.startswith('images/'):
        base = 'images/' + base.split('/')[-1]
    return prefix + base

def is_photo(src):
    s = src.lower()
    return any(k in s for k in PHOTO_KEYS)

def span_for(src):
    s = src.lower()
    if any(k in s for k in WIDE_KEYS): return "wide"
    if any(k in s for k in TALL_KEYS): return "tall"
    return ""

ALLOWED = {"p","br","ul","ol","li","a","strong","b","em","i","u","h3","h4","h5","h6",
           "img","figure","figcaption","blockquote","code","pre","sup","sub","hr"}
KEEP_ATTR = {"a": {"href"}, "img": {"src", "alt"}}

class Sanitizer(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.out = []
    def handle_starttag(self, tag, attrs):
        if tag not in ALLOWED: return
        ad = dict(attrs)
        kept = ""
        for a in KEEP_ATTR.get(tag, set()):
            if a in ad and ad[a] is not None:
                v = ad[a]
                if tag == "img" and a == "src":
                    v = norm_img(v, prefix="../")
                kept += f' {a}="{html.escape(v, quote=True)}"'
        self.out.append(f"<{tag}{kept}>")
    def handle_startendtag(self, tag, attrs):
        if tag in ("img","br","hr"):
            self.handle_starttag(tag, attrs)
    def handle_endtag(self, tag):
        if tag in ALLOWED and tag not in ("img","br","hr"):
            self.out.append(f"</{tag}>")
    def handle_data(self, data):
        self.out.append(data)
    def result(self):
        s = "".join(self.out)
        s = re.sub(r'[ \t]+', ' ', s)
        s = re.sub(r'\n\s*\n+', '\n', s)
        return s.strip()

def sanitize(htmltext):
    p = Sanitizer(); p.feed(htmltext or ""); return p.result()

# ---------- build window.SITE ----------
def load_project(slug):
    d = json.loads((CONTENT / "projects" / f"{slug}.json").read_text())
    meta = []
    if d.get("role"): meta.append({"k": "Role", "v": d["role"]})
    if d.get("date"): meta.append({"k": "Date", "v": d["date"]})
    thumb = norm_img(d.get("thumbnail", ""))
    sections = [{"h": s.get("heading", ""), "html": sanitize(s.get("body", ""))}
                for s in d.get("sections", []) if s.get("heading") or s.get("body")]
    gallery = []
    for g in d.get("gallery", []):
        src = norm_img(g.get("src", ""))
        gallery.append({"src": src, "caption": g.get("caption", ""),
                        "contain": not is_photo(src), "span": span_for(src)})
    return {
        "slug": slug, "title": d.get("title", ""), "role": d.get("role", "") or "—",
        "year": d.get("date", ""), "summary": d.get("summary", ""),
        "thumb": thumb, "contain": not is_photo(thumb),
        "meta": meta, "sections": sections, "gallery": gallery,
    }

def load_update(slug):
    d = json.loads((CONTENT / "updates" / f"{slug}.json").read_text())
    figs = [{"src": norm_img(g.get("src", "")), "caption": g.get("caption", ""),
             "contain": not is_photo(g.get("src", ""))} for g in d.get("gallery", [])]
    return {"slug": slug, "title": d.get("title", ""), "date": d.get("date", ""),
            "dateISO": "", "lede": "", "html": sanitize(d.get("body", "")), "figures": figs}

def slug_of(fn): return fn.replace(".html", "")

all_proj = [slug_of(f) for f in MANIFEST["allProjects"]]
sel_proj = [slug_of(f) for f in MANIFEST["selectedProjects"]]
upd = [slug_of(f) for f in MANIFEST["updates"]]

SITE = {
    "profile": {
        "name": "Beckett Mazeau",
        "tagline": "Making Mechatronics",
        "blurb": "Engineer & Designer — building at the intersection of precision mechanics, embedded systems, and industrial design.",
        "status": "Mechatronics & Mechanical Engineering",
        "email": "beckettmazeau@gmail.com",
        "links": [
            {"label": "GitHub", "href": "https://github.com/BeckettMazeau"},
            {"label": "LinkedIn", "href": "https://www.linkedin.com/in/beckett-mazeau/"},
            {"label": "GrabCAD", "href": "https://grabcad.com/beckett.mazeau-1"},
        ],
        "focus": [
            {"k": "Mechanical design", "v": "SolidWorks · Fusion 360"},
            {"k": "Embedded systems", "v": "C / C++"},
            {"k": "PCB layout", "v": "KiCad"},
            {"k": "Simulation", "v": "FEA / CFD"},
        ],
    },
    "home": sel_proj,
    "projects": [load_project(s) for s in all_proj],
    "updates": [load_update(s) for s in upd],
}

# ---------- write files ----------
# Only ever remove the artifacts this script manages — NEVER the whole tree.
# (OUT == ROOT, so a blind rmtree(OUT) would delete the entire repo.)
MANAGED = ["index.html", "projects.html", "assets", "projects", "updates"]
for name in MANAGED:
    p = OUT / name
    if p.is_dir(): shutil.rmtree(p)
    elif p.exists(): p.unlink()
(OUT / "assets").mkdir(parents=True)
(OUT / "projects").mkdir()
(OUT / "updates").mkdir()

# images: source images/ already lives at the repo root, which IS the served
# path when OUT == ROOT, so there's nothing to copy. Copy only when building
# into a separate output directory.
if OUT.resolve() != ROOT.resolve():
    shutil.copytree(ROOT / "images", OUT / "images",
                    ignore=shutil.ignore_patterns(".DS_Store"))

# data.js
data_js = "/* AUTO-GENERATED by redesign/build_site.py — do not edit by hand. */\n" \
          "window.SITE = " + json.dumps(SITE, ensure_ascii=False, indent=2) + ";\n"
(OUT / "assets" / "data.js").write_text(data_js)

# css (copy + append content-tag styles for sanitized bodies)
css = (SRC_DESIGN / "assets" / "site.css").read_text()
css += """

/* --- appended: styling for sanitized verbatim content bodies --- */
.body-sections ul, .body-sections ol { margin: 0 0 16px; padding-left: 22px; }
.body-sections li { font-size: 18px; line-height: 1.7; margin: 6px 0; color: color-mix(in srgb, var(--text) 86%, var(--muted)); }
.body-sections a, .post .content a { color: var(--accent); text-decoration: underline; text-underline-offset: 3px; }
.body-sections strong, .post .content strong { color: var(--text); font-weight: 600; }
.body-sections img, .post .content img { max-width: 100%; height: auto; border-radius: 10px; border: 1px solid var(--line); margin: 8px 0 20px; }
.body-sections h3, .body-sections h4 { margin: 22px 0 10px; font-size: 20px; letter-spacing: -0.01em; }
.post .content ul, .post .content ol { padding-left: 22px; margin: 0 0 16px; }
.post .content li { margin: 6px 0; line-height: 1.7; }
"""
(OUT / "assets" / "site.css").write_text(css)

# js (copy + edits: render section.html raw, render update.html raw, optional lede)
js = (SRC_DESIGN / "assets" / "site.js").read_text()

js = js.replace(
'''    document.getElementById("bodySections").innerHTML = pr.sections.map(function (b) {
      return \'<div class="blk"><h2>\' + esc(b.h) + "</h2>" + b.body.map(function (t) { return "<p>" + esc(t) + "</p>"; }).join("") + "</div>";
    }).join("");''',
'''    document.getElementById("bodySections").innerHTML = pr.sections.map(function (b) {
      var inner = (b.html != null) ? b.html : (b.body || []).map(function (t) { return "<p>" + esc(t) + "</p>"; }).join("");
      return \'<div class="blk">\' + (b.h ? "<h2>" + esc(b.h) + "</h2>" : "") + inner + "</div>";
    }).join("");''')

js = js.replace(
'''      \'<p class="lede">\' + esc(u.lede) + "</p>" +
      \'<div class="content">\' + u.content.map(function (t) { return "<p>" + esc(t) + "</p>"; }).join("") + figs + "</div>";''',
'''      (u.lede ? \'<p class="lede">\' + esc(u.lede) + "</p>" : "") +
      \'<div class="content">\' + ((u.html != null) ? u.html : u.content.map(function (t) { return "<p>" + esc(t) + "</p>"; }).join("")) + figs + "</div>";''')
(OUT / "assets" / "site.js").write_text(js)

# home + projects index (root-relative; copy verbatim)
shutil.copy(SRC_DESIGN / "index.html", OUT / "index.html")
shutil.copy(SRC_DESIGN / "projects.html", OUT / "projects.html")

# fix the home "Selected work / NN" count to match selection
home_html = (OUT / "index.html").read_text()
home_html = re.sub(r'(Selected work <b>/ )\d+(</b>)', lambda m: m.group(1) + f"{len(sel_proj):02d}" + m.group(2), home_html)
(OUT / "index.html").write_text(home_html)
# fix projects index count
pj = (OUT / "projects.html").read_text()
pj = re.sub(r'Index — \d+ projects', f"Index — {len(all_proj):02d} projects", pj)
(OUT / "projects.html").write_text(pj)

PROJ_STUB = '''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Project — Beckett Mazeau</title>
<link rel="stylesheet" href="../assets/site.css"/>
</head>
<body data-page="project" data-root="../" data-slug="{slug}">
<div id="nav"></div>
<main>
  <section class="wrap"><div class="pagehead" id="ph"></div></section>
  <section class="wrap"><div class="body-sections" id="bodySections"></div></section>
  <section class="wrap">
    <div class="section-head gallery-head">
      <span class="eyebrow label">Gallery</span>
      <span class="all mono">click any image to enlarge ⤢</span>
    </div>
    <div class="gallery" id="gallery"></div>
  </section>
  <section class="wrap"><div class="pn-nav" id="pnNav"></div></section>
</main>
<div id="foot"></div>
<script src="../assets/data.js"></script>
<script src="../assets/site.js"></script>
</body>
</html>
'''
for s in all_proj:
    (OUT / "projects" / f"{s}.html").write_text(PROJ_STUB.format(slug=s))

UPD_STUB = '''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Update — Beckett Mazeau</title>
<link rel="stylesheet" href="../assets/site.css"/>
</head>
<body data-page="update" data-root="../" data-slug="{slug}">
<div id="nav"></div>
<main>
  <section class="wrap"><article class="post" id="post"></article></section>
</main>
<div id="foot"></div>
<script src="../assets/data.js"></script>
<script src="../assets/site.js"></script>
</body>
</html>
'''
for s in upd:
    (OUT / "updates" / f"{s}.html").write_text(UPD_STUB.format(slug=s))

print("Built site at repo root")
print("  projects:", all_proj)
print("  selected:", sel_proj)
print("  updates :", upd)
print("  images  :", len(list((OUT / 'images').glob('*'))), "files")
