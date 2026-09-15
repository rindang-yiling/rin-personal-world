import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';

const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, permissions: ['clipboard-read', 'clipboard-write'] });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const results = [];
async function test(name, action) {
  try { await action(); results.push({ name, status: 'passed' }); }
  catch (error) { results.push({ name, status: 'failed', error: error.message }); }
}
await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
await page.locator('#studio[data-model="loaded"]').waitFor({ timeout: 30000 });
await test('Chinese content and real 3D model', async () => {
  assert.equal(await page.locator('html').getAttribute('lang'), 'zh-CN');
  assert.equal(await page.locator('[data-project-card]').count(), 4);
  assert.equal(await page.evaluate(() => window.__rinStudio.getState().modelReady), true);
});
await test('Night mode and reset', async () => {
  await page.locator('[data-night]').click();
  assert.equal(await page.locator('[data-night]').getAttribute('aria-pressed'), 'true');
  assert.equal(await page.evaluate(() => window.__rinStudio.getState().night), true);
  await page.locator('[data-night]').click();
  await page.locator('[data-reset]').click();
  assert.match(await page.locator('.toast').innerText(), /初始视角/);
});
await test('Drag rotates actual camera', async () => {
  const before = await page.evaluate(() => window.__rinStudio.getState().camera);
  const bounds = await page.locator('#studio canvas').boundingBox();
  const x = bounds.x + bounds.width * 0.6, y = bounds.y + bounds.height * 0.64;
  await page.mouse.move(x, y); await page.mouse.down(); await page.mouse.move(x + 80, y, { steps: 15 }); await page.mouse.up();
  await page.waitForTimeout(700);
  const after = await page.evaluate(() => window.__rinStudio.getState().camera);
  assert.ok(Math.abs(after[0] - before[0]) > 0.2);
  await page.locator('[data-reset]').click();
});
await test('Greeting interaction', async () => {
  await page.locator('[data-wave]').click();
  assert.ok(await page.locator('.speech-bubble.visible').isVisible());
});
await test('Project filters', async () => {
  await page.locator('[data-filter="营销策略"]').click();
  assert.equal(await page.locator('[data-project-card]:visible').count(), 2);
  await page.locator('[data-filter="产品运营"]').click();
  assert.equal(await page.locator('[data-project-card]:visible').count(), 1);
  await page.locator('[data-filter="用户洞察"]').click();
  assert.equal(await page.locator('[data-project-card]:visible').count(), 1);
  await page.locator('[data-filter="全部"]').click();
  assert.equal(await page.locator('[data-project-card]:visible').count(), 4);
});
await test('Case study modal, next case, Escape', async () => {
  await page.locator('.project-art[data-project="wedding"]').click();
  assert.ok(await page.locator('#detail-dialog').isVisible());
  assert.match(await page.locator('.dialog-metric').innerText(), /40% → 80%/);
  await page.screenshot({ path: '.research/project-dialog.png' });
  await page.locator('[data-next]').click();
  assert.match(await page.locator('.dialog-metric').innerText(), /16/);
  await page.keyboard.press('Escape');
  assert.ok(!await page.locator('#detail-dialog').isVisible());
  assert.ok(!await page.locator('body').evaluate(body => body.classList.contains('dialog-open')));
});
await test('Experience accordion', async () => {
  const item = page.locator('.experience').nth(1);
  await item.locator('summary').click();
  assert.equal(await item.getAttribute('open'), '');
  await item.locator('summary').click();
  assert.equal(await item.getAttribute('open'), null);
});
await test('Skill tabs and keyboard navigation', async () => {
  await page.locator('[data-skill="ai"]').click();
  assert.match(await page.locator('#skill-panel').innerText(), /16/);
  await page.keyboard.press('Home');
  assert.equal(await page.locator('[data-skill="content"]').getAttribute('aria-selected'), 'true');
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('[data-skill="operations"]').getAttribute('aria-selected'), 'true');
});
await test('Resume download and clipboard', async () => {
  await page.locator('[data-resume]').first().click();
  const downloadEvent = page.waitForEvent('download');
  await page.locator('[data-download]').click();
  const download = await downloadEvent;
  assert.equal(download.suggestedFilename(), '党艺灵_Rin_中文履历.txt');
  const path = await download.path();
  const text = await fs.readFile(path, 'utf-8');
  assert.match(text, /亚信科技/);
  assert.match(text, /问卷/);
  await page.locator('[data-copy]').click();
  assert.match(await page.evaluate(() => navigator.clipboard.readText()), /党艺灵/);
  await page.keyboard.press('Escape');
});
await test('Avatar origin and local model information', async () => {
  await page.locator('[data-avatar]').click();
  assert.match(await page.locator('.avatar-model-note').innerText(), /已保存/);
  await page.locator('.dialog-close').click();
});
await test('Ambient sound toggle', async () => {
  await page.locator('[data-sound]').click();
  assert.equal(await page.locator('[data-sound]').getAttribute('aria-pressed'), 'true');
  await page.locator('[data-sound]').click();
  assert.equal(await page.locator('[data-sound]').getAttribute('aria-pressed'), 'false');
});
await test('No horizontal overflow across sizes', async () => {
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Overflow at ${width}px`);
  }
});
await test('Mobile menu and touch-size case study', async () => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.locator('.mobile-menu').click();
  assert.equal(await page.locator('.mobile-menu').getAttribute('aria-expanded'), 'true');
  await page.locator('.desktop-nav a[href="#projects"]').click();
  assert.equal(await page.locator('.mobile-menu').getAttribute('aria-expanded'), 'false');
  await page.locator('.project-art[data-project="wedding"]').click();
  assert.ok(await page.locator('.case-steps').isVisible());
  await page.screenshot({ path: '.research/mobile-dialog.png' });
  await page.keyboard.press('Escape');
});
await test('No runtime errors', async () => assert.deepEqual(errors, []));
await fs.writeFile('.research/test-results.json', JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
await browser.close();
if (results.some(result => result.status === 'failed')) process.exitCode = 1;
