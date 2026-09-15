import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';
import { dirname, resolve } from 'path';

const url = process.argv[2] || 'http://127.0.0.1:3000/';
const out = resolve(process.argv[3] || 'gauntlet/shots-beat/out.png');
const w = Number(process.argv[4] || 1280);
const h = Number(process.argv[5] || 900);
const clickTab = process.argv[6] || ''; // e.g. Rooms | History
mkdirSync(dirname(out), { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: w, height: h } });
const page = await context.newPage();
page.setDefaultTimeout(20000);
try {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 }).catch(() =>
    page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
  );
  // Wait past IndexedDB hydrate — not skeleton
  for (let i = 0; i < 40; i++) {
    const ready = await page.evaluate(() => {
      const skel = document.body?.innerText?.includes('Opening the list');
      const job = !!document.querySelector('.job-strip, .chore-tile, .billboard-ledger h1');
      return job && !skel;
    }).catch(() => false);
    if (ready) break;
    await page.waitForTimeout(250);
  }
  await page.waitForTimeout(400);
  if (clickTab) {
    const tab = page.locator('.t-tab', { hasText: clickTab }).first();
    if (await tab.count()) {
      await tab.click();
      await page.waitForTimeout(450);
    }
  }
  const state = await page.evaluate(() => ({
    job: !!document.querySelector('.job-strip'),
    tiles: document.querySelectorAll('.chore-tile').length,
    h1: document.querySelector('.billboard-ledger h1')?.textContent?.trim() || '',
    text: document.body?.innerText?.slice(0, 80),
  })).catch(() => ({}));
  console.log('STATE', JSON.stringify(state));
  await page.screenshot({ path: out, timeout: 15000, animations: 'disabled' });
  console.log('wrote', out);
} catch (e) {
  console.error('FAIL', e.message);
  try { await page.screenshot({ path: out, timeout: 8000 }); console.log('wrote-fallback', out); } catch {}
  process.exitCode = 1;
} finally {
  await context.close().catch(() => {});
  await browser.close().catch(() => {});
}
