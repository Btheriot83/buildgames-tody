import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';
import { dirname, resolve } from 'path';

const url = process.argv[2];
const out = resolve(process.argv[3]);
const w = Number(process.argv[4] || 1280);
const h = Number(process.argv[5] || 900);
mkdirSync(dirname(out), { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: w, height: h } });
const page = await context.newPage();
page.setDefaultTimeout(12000);
try {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
  for (let i = 0; i < 10; i++) {
    const ready = await page.evaluate(() =>
      !!document.querySelector('.job-strip, .chore-tile, h1')
    ).catch(() => false);
    if (ready) break;
    await page.waitForTimeout(300);
  }
  await page.waitForTimeout(250);
  const state = await page.evaluate(() => ({
    job: !!document.querySelector('.job-strip'),
    tiles: document.querySelectorAll('.chore-tile').length,
  })).catch(() => ({}));
  console.log('STATE', state);
  await page.screenshot({ path: out, timeout: 10000, animations: 'disabled' });
  console.log('wrote', out);
} catch (e) {
  console.error('FAIL', e.message);
  try { await page.screenshot({ path: out, timeout: 8000 }); console.log('wrote-fallback', out); } catch {}
  process.exitCode = 1;
} finally {
  await context.close().catch(() => {});
  await browser.close().catch(() => {});
}
