import re

with open("redesign/build_site.py", "r") as f:
    content = f.read()

# Modify PROJ_STUB
content = re.sub(
    r'(<body data-page="project"[^>]*>)(\n<div id="nav"></div>\n)<main>',
    r'\1\n<a class="skip-link" href="#main">Skip to main content</a>\2<main id="main">',
    content
)

# Modify UPD_STUB
content = re.sub(
    r'(<body data-page="update"[^>]*>)(\n<div id="nav"></div>\n)<main>',
    r'\1\n<a class="skip-link" href="#main">Skip to main content</a>\2<main id="main">',
    content
)

with open("redesign/build_site.py", "w") as f:
    f.write(content)
