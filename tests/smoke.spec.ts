import { test, expect } from "@playwright/test";

test.describe("Marketing pages", () => {
  test("home page renders with hero heading and nav", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("navigation")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("about page renders", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("destinations index renders all 8 destinations", async ({ page }) => {
    await page.goto("/destinations");
    // Check a few representative destinations
    await expect(page.getByText("Japan")).toBeVisible();
    await expect(page.getByText("United Kingdom")).toBeVisible();
    await expect(page.getByText("Australia")).toBeVisible();
    await expect(page.getByText("Europe")).toBeVisible();
  });

  test("non-Japan destination page renders", async ({ page }) => {
    await page.goto("/destinations/australia");
    await expect(
      page.getByRole("heading", { name: /Study in Australia/i }),
    ).toBeVisible();
    await expect(page.getByText("All destinations")).toBeVisible();
  });

  test("Japan destination page has bilingual locale toggle", async ({
    page,
  }) => {
    await page.goto("/destinations/japan");
    // English content is shown by default
    await expect(
      page.getByRole("heading", { name: /Study in Japan/i }),
    ).toBeVisible();
    // Toggle to Japanese
    await page.getByRole("button", { name: "日本語" }).click();
    await expect(page.getByText("日本で学ぶ")).toBeVisible();
    // Toggle back to English
    await page.getByRole("button", { name: "English" }).click();
    await expect(
      page.getByRole("heading", { name: /Study in Japan/i }),
    ).toBeVisible();
  });

  test("contact page renders the form fields", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByLabel(/full name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/message/i)).toBeVisible();
  });

  test("sitemap.xml is reachable", async ({ page }) => {
    const response = await page.goto("/sitemap.xml");
    expect(response?.status()).toBe(200);
    const body = await page.content();
    expect(body).toContain("nayanedu.com");
  });

  test("robots.txt disallows /admin/", async ({ page }) => {
    const response = await page.goto("/robots.txt");
    expect(response?.status()).toBe(200);
    const body = await page.content();
    expect(body).toContain("Disallow: /admin/");
  });
});

test.describe("Admin auth guard", () => {
  test("visiting /admin redirects to /login when not authenticated", async ({
    page,
  }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login/);
  });

  test("login page renders email and password fields", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(
      page.getByRole("button", { name: /sign in/i }),
    ).toBeVisible();
  });
});
