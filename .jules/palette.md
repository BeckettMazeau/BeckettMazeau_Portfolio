
## 2024-06-03 - Skip Link Accessibility & Keyboard Navigation
**Learning:** Pure vanilla JS SPAs with dynamic templating often lack basic keyboard navigation aids like "Skip to main content" links and global `:focus-visible` styling out of the box, as focus management isn't built-in like in some frameworks. Inserting elements dynamically isn't sufficient for screen readers which rely on the initial HTML shell.
**Action:** Always inject keyboard navigation aids (skip links, focus styling) into the static HTML shells *before* runtime JS boots, ensuring they are the very first focusable elements in the DOM hierarchy, and verify them programmatically by simulating actual `Tab` keypresses with wait states for CSS transitions.
