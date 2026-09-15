import { chromium } from '@playwright/test';

const out = process.argv[2] || 'gauntlet/shots-craft/shot.png';
const tab = process.argv[3] || 'today';
const url = process.argv[4] || 'http://127.0.0.1:3000';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.addInitScript(() => {
  localStorage.setItem('tileboard.onboarded.v1', '1');
});
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(700);
if (tab === 'rooms') {
  const btn = page.locator('button, [role="tab"]').filter({ hasText: /^Rooms$/ });
  if (await btn.count()) await btn.first().click();
  await page.waitForTimeout(450);
}
await page.screenshot({ path: out, fullPage: false });
console.log('wrote', out);
await browser.close();
