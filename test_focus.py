from playwright.sync_api import sync_playwright

def test():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto("http://localhost:8000/index.html")

        skip_link = page.locator(".skip-link")

        # Manually set focus via evaluate to see if Playwright keyboard action wasn't enough
        skip_link.evaluate("el => el.focus()")

        # Wait for the transition to finish
        page.wait_for_timeout(300)

        box_focused = skip_link.bounding_box()
        print(f"y is {box_focused['y']}")

        browser.close()

if __name__ == "__main__":
    test()
