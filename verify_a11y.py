from playwright.sync_api import sync_playwright

def verify():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto("http://localhost:8000/index.html")

        # Verify skip link is present
        skip_link = page.locator(".skip-link")
        assert skip_link.count() == 1, "Skip link not found"

        # Verify it's initially hidden off-screen (top: -40px)
        box = skip_link.bounding_box()
        assert box['y'] < 0, f"Skip link should be off-screen initially, but y is {box['y']}"

        # Simulate Tab key press to focus the first element
        page.keyboard.press("Tab")

        # Wait for the transition to finish
        page.wait_for_timeout(300)

        # Verify skip link is now focused
        is_focused = skip_link.evaluate("el => el === document.activeElement")
        assert is_focused, "Skip link did not receive focus after Tab"

        # Verify it's now visible (top: 0)
        box_focused = skip_link.bounding_box()
        assert box_focused['y'] == 0, f"Skip link should be at y=0 when focused, but y is {box_focused['y']}"

        # Verify it points to #main
        href = skip_link.get_attribute("href")
        assert href == "#main", f"Skip link points to {href}, expected #main"

        # Verify main has id="main"
        main_count = page.locator("main#main").count()
        assert main_count == 1, "main element with id='main' not found"

        print("Accessibility verification passed: Skip link works perfectly!")
        browser.close()

if __name__ == "__main__":
    verify()
