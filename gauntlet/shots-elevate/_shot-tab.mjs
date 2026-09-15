import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';
import { dirname, resolve } from 'path';

const url = process.argv[2];
const out = resolve(process.argv[3]);
const tab = process.argv[4] || '';
const clickRoom = process.argv.includes('--room');
mkdirSync(dirname(out), { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();
page.setDefaultTimeout(10000);
try {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
  for (let i = 0; i < 30; i++) {
    const ready = await page.evaluate(() => !!document.querySelector('.job-strip, .chore-tile, h1')).catch(() => false);
    if (ready) break;
    await page.waitForTimeout(200);
  }
  await page.waitForTimeout(250);
  if (tab) {
    await page.evaluate((label) => {
      const tabs = [...document.querySelectorAll('[role=tab], .t-tab, button')];
      const t = tabs.find((el) => (el.textContent || '').trim().toLowerCase() === label.toLowerCase());
      t?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }, tab);
    await page.waitForTimeout(600);
  }
  if (clickRoom) {
    const n = await page.locator('.room-tile').count();
    if (n > 0) {
      await page.locator('.room-tile').first().click({ force: true });
      await page.waitForTimeout(450);
    } else {
      console.log('NO_ROOM_TILES');
    }
  }
  const state = await page.evaluate(() => ({
    rooms: document.querySelectorAll('.room-tile').length,
    detail: !!document.querySelector('.room-detail-plate'),
    chores: document.querySelectorAll('.chore-tile').length,
    tab: document.querySelector('[aria-selected=true]')?.textContent,
  }));
  console.log('STATE', state);
  await page.screenshot({ path: out, animations: 'disabled', timeout: 10000 });
  console.log('wrote', out);
} catch (e) {
  console.error('FAIL', e.message);
  try { await page.screenshot({ path: out, timeout: 8000 }); } catch {}
  process.exitCode = 1;
} finally {
  await context.close().catch(() => {});
  await browser.close().catch(() => {});
}
