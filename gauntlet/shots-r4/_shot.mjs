import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';
import { dirname, resolve } from 'path';

const url = process.argv[2];
const out = resolve(process.argv[3]);
const w = Number(process.argv[4] || 1280);
const h = Number(process.argv[5] || 900);
mkdirSync(dirname(out), { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: w, height: h } });
page.setDefaultTimeout(20000);
try {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
} catch (e) {
  console.error('goto', e.message);
}
for (let i = 0; i < 16; i++) {
  const ready = await page.evaluate(() =>
    !!document.querySelector('.job-strip, .chore-tile, .section-title, h1')
  ).catch(() => false);
  if (ready) break;
  await page.waitForTimeout(400);
}
await page.waitForTimeout(350);
const state = await page.evaluate(() => ({
  job: !!document.querySelector('.job-strip'),
  due: document.body.innerText.includes('Due today'),
  loading: document.body.innerText.includes('Loading the fridge'),
  tiles: document.querySelectorAll('.chore-tile').length,
})).catch(() => ({}));
console.log('STATE', state);
await page.screenshot({ path: out, timeout: 15000, animations: 'disabled' }).catch(async (e) => {
  console.error('shot retry', e.message);
  await page.screenshot({ path: out, timeout: 20000, caret: 'hide' });
});
await browser.close();
console.log('wrote', out);
