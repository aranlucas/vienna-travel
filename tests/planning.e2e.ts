import { test } from "@e2e-dev/web";
import { expect } from "e2e";

test("checklist filtering preserves completion across reload and timeline navigation", async ({
  app,
  browser,
  screen,
}) => {
  // The public trip is in the past; exercise its supported archive control.
  // Weather and map tiles are outside this journey and must not require external services.
  await browser.route("**/api/weather", (route) =>
    route.fulfill({ status: 503, json: { error: "Controlled outage" } }),
  );
  await browser.route("**/*.basemaps.cartocdn.com/**", (route) => route.abort());
  await app.open("/");
  await screen.getByRole("button", "Show past days", { exact: true }).tap();
  const checkin = screen.getByRole("checkbox", /^Tonight after/);
  const documents = screen.getByRole("checkbox", /^Entry documents/);
  await expect(checkin).not.toBeChecked();
  await checkin.check();
  await expect(checkin).toBeChecked();
  await documents.check();
  await screen.getByRole("button", "Tonight only", { exact: true }).tap();
  await expect(documents).toHaveCount(0);
  await expect(checkin).toBeChecked();
  await screen.getByRole("button", "Show all", { exact: true }).tap();
  await expect(documents).toBeChecked();

  await browser.reload();
  await screen.getByRole("button", "Show past days", { exact: true }).tap();
  await expect(checkin).toBeChecked();
  await expect(documents).toBeChecked();
  await checkin.uncheck();
  await expect(checkin).not.toBeChecked();
  await expect(documents).toBeChecked();

  await screen.getByRole("link", "Trip Timeline", { exact: true }).tap();
  await expect(screen.getByRole("heading", "Trip Timeline", { exact: true })).toBeVisible();
  // Progress context may persist with client navigation; accept either archive state.
  const showPast = screen.getByRole("button", "Show past days", { exact: true });

  if ((await showPast.count()) > 0) {
    await showPast.tap();
  }

  await expect(screen.getByRole("navigation", "Jump to trip date")).toBeVisible();
  await screen.getByRole("button", "Trains", { exact: true }).tap();
  await expect(screen.getByText("Tuesday, Sep 08", { exact: true })).toBeVisible();
  await screen.getByRole("link", "Trip Overview", { exact: true }).tap();
  await expect(documents).toBeChecked();
  await expect(checkin).not.toBeChecked();
});
