import re

with open("Portfoio Rework/index.html", "r") as f:
    content = f.read()

# Add skip link
content = re.sub(
    r'(<body[^>]*>)',
    r'\1\n<a class="skip-link" href="#main">Skip to main content</a>',
    content
)

# Add id to main
content = re.sub(
    r'<main>',
    r'<main id="main">',
    content
)

with open("Portfoio Rework/index.html", "w") as f:
    f.write(content)
