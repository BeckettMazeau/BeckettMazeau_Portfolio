# Content Layer Schema

One JSON file per project and per update, holding the human-authored content extracted verbatim
from the existing HTML pages. The new design templates render from these files. No prose is ever
rewritten — body text is preserved exactly, as HTML fragments.

## Location
- `content/projects/project-1.json` … `project-6.json`
- `content/updates/update-1.json` … `update-2.json`

## Project schema
```json
{
  "slug": "project-1",
  "title": "string — verbatim from the page",
  "role": "string — the author's role/context, verbatim (empty string if none)",
  "date": "YYYY-MM-DD or the exact date string shown (empty if none)",
  "summary": "string — the short summary/lede, verbatim HTML allowed",
  "thumbnail": "images/SomeFile.JPG — the existing card/hero image path, exactly as referenced",
  "sections": [
    {
      "heading": "string — section heading, verbatim (empty string if the block has no heading)",
      "body": "string — the section's prose as a verbatim HTML fragment (keep <p>, <ul>, <a>, <strong>, etc.)"
    }
  ],
  "gallery": [
    { "src": "images/File.JPG", "caption": "verbatim caption text, or empty string" }
  ]
}
```

## Update schema
```json
{
  "slug": "update-1",
  "title": "string — verbatim",
  "date": "YYYY-MM-DD or exact date string shown",
  "body": "string — full update prose as a verbatim HTML fragment",
  "gallery": [
    { "src": "images/File.JPG", "caption": "verbatim caption or empty string" }
  ]
}
```

## Rules
- **Verbatim:** every sentence of body/summary/caption text must survive exactly. Markup may be
  normalized (consistent tags) but never the words.
- **Existing assets only:** every `src` must be a path that already exists in `images/`. Invent nothing.
- **Order preserved:** sections and gallery items keep the order they appear on the page.
- **Empty over guessed:** if a field isn't present on a page, use an empty string — do not fabricate.
