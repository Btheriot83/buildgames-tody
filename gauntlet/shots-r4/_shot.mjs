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
page.on('pageerror', e => console.log('PAGEERROR', e.message));
page.on('console', m => { if (m.type()==='error') console.log('ERR', m.text().slice(0,200)); });
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
// give client hydrate time
for (let i = 0; i < 20; i++) {
  const ready = await page.evaluate(() => !!document.querySelector('.job-strip, .chore-tile, .section-title'));
  if (ready) break;
  await page.waitForTimeout(500);
}
await page.waitForTimeout(400);
const state = await page.evaluate(() => ({
  job: !!document.querySelector('.job-strip'),
  due: document.body.innerText.includes('Due today'),
  loading: document.body.innerText.includes('Loading the fridge'),
  tiles: document.querySelectorAll('.chore-tile').length,
}));
console.log('STATE', state);
await page.screenshot({ path: out });
await browser.close();
console.log('wrote', out);
