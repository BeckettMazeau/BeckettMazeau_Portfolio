# Claude Design Handoff — Beckett Mazeau Portfolio Redesign

## How to use this brief
This is a **clean-room design brief**. Design a fresh visual system from scratch based on the
direction and references below. Do **not** ask to see or reference any existing version of this
site — there is an old design, and the entire goal is to NOT anchor to it. Work only from this brief.

---

## Who this is for
Beckett Mazeau — an engineer. The portfolio showcases hands-on engineering project case studies
(mechanical, aerospace, and embedded/electronics work) plus short dated "updates." The audience is
recruiters, collaborators, and fellow engineers. The site should read as **credible, sharp, and
modern** — the work is technical and real, and the design should make that feel impressive without
dressing it up in gimmicks.

## The one-sentence vision
A clean, confident, fast-to-read engineering portfolio with the editorial poise of a top design
studio and the sleek polish of a modern product site — bold through typography, scale, and decisive
layout, never through visual clutter.

## Identity & tagline
- Name: **Beckett Mazeau** (the identity anchor in the hero).
- Tagline / focus line: **"Making Mechatronics"** — pair it with the name; name = who, tagline =
  what. Mechatronics = the mechanical + electronics + control intersection his projects live in.

---

## Design DNA (derived from the owner's favorite sites)

Reference sites the owner loves, and why:
- **https://multiple.studio/** — absolute favorite. Clean, uncluttered, calm confidence.
- **https://www.pentagram.com/** — a quick read. Simple to navigate and understand at a glance.
- **https://vercel.com/** — sleek, slick, easy to read. Crisp product polish.
- **https://www.framer.com/** — same appeal as Vercel: sleek and effortless.
- **https://studioxag.com/** — sexy, sleek, easy to read.
- **https://snask.com/** — simple, clean, easy to navigate.

Common thread across ALL of them: **clean, fast to read, effortless to navigate.** None use 3D,
glassmorphism, or heavy generative effects. Honor that. "Bold & expressive" here means:
- Large, confident typography and a strong type hierarchy.
- Generous whitespace; let content breathe.
- Image-forward, grid-driven layouts.
- A restrained palette with one decisive accent.
- Tasteful, minimal micro-motion (smooth reveals, hover states) — motion supports, never distracts.

Explicitly AVOID: 3D/WebGL scenes, glassmorphism, gradient-mesh/aurora backgrounds, busy animation,
decorative noise, anything that slows comprehension. **A visitor should be able to scan the whole
site in under a minute if they want to.**

---

## Pages to design

1. **Home**
   - A strong hero: name, what he does, one short positioning line.
   - A "selected work" grid (a curated subset of projects — typically 4).
   - A brief "latest updates" area (dated entries).
   - Simple, obvious navigation.

2. **All Projects** (index page)
   - The full project grid (currently 6 projects).
   - Same card language as the home grid, just complete.

3. **Project Detail** (one template, reused for every project)
   - Title, the engineer's role/context, a date, a short summary.
   - Several body content sections (headings + paragraphs of technical writeup).
   - An **image gallery** with a **lightbox** (click to enlarge). Galleries vary in length per project.
   - Clear back-to-projects navigation.

4. **Update Detail** (one template, reused for every update)
   - A dated, lighter-weight page: title, date, a few paragraphs, possibly an image or two.

5. Shared **nav** and **footer** used across all pages.

---

## Content inventory (abstract — actual text is fixed and supplied separately)
- 6 engineering project case studies. Media is a mix of **real project photography** and
  **technical data-visualization charts/graphs**. Design the gallery and image treatment to flatter
  BOTH a wide hardware photo and a plotted graph.
- 2 dated updates (short posts).
- Card metadata per project: title, role/context, date, short summary, a thumbnail image.

---

## Hard constraints (the build must satisfy these — design within them)
1. **Static site, no build step.** Final output is plain HTML + CSS + a little JS, served as files.
   Design something implementable that way. No framework runtime required.
2. **Reuse existing images only.** All photography and charts already exist. Do not design around
   imagery that would need to be created or sourced. Assume a folder of mixed-aspect-ratio assets.
3. **Data-driven grids.** Project cards are generated from per-project metadata and a manifest that
   controls which projects appear on the home page and in what order. The design's card system must
   work from structured data, not hand-placed content.
4. **Two page depths.** Detail pages live one folder deep; links must work from both root and
   subfolders. (Affects nav/asset path handling, not the visual design — noted for completeness.)
5. **Responsive + mobile nav.** Must be clean on phone widths with a simple mobile navigation.
5b. **Light/dark toggle.** Design BOTH a light and a dark theme as first-class, equally-polished
   modes, with a simple toggle in the nav. Light should lean editorial (Pentagram/Multiple); dark
   should lean sleek-product (Vercel/Framer). Deliver the full palette + component states for each.
6. **Performance-minded.** Fast load, minimal heavy assets — consistent with the "quick read" goal.

## Explicit don'ts
- Don't rewrite, summarize, or invent any project text — the writeups are human-authored and final.
- Don't invent imagery or assume new photos/renders exist.
- Don't add complex navigation (mega-menus, nested trees). Keep it as simple as the reference sites.
- Don't over-animate.

---

## Deliverables requested from Claude Design
- A cohesive visual system: type scale, color palette + accent, spacing system, grid.
- Layouts for: Home, All Projects, Project Detail, Update Detail, plus nav + footer.
- The card component (default + hover), the gallery + lightbox treatment, and mobile states.
- 2–3 distinct directions within this brief are welcome before committing to one.
