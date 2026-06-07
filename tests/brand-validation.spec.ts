import { test, expect } from '@playwright/test';

test('Aleph homepage — light editorial redesign (zh)', async ({ page }) => {
  test.setTimeout(60000);

  const response = await page.goto('http://localhost:3000/zh');
  expect(response?.status()).toBe(200);

  // 1. 纸色底（亮色设计，非 #050508）
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  // #f0ead9 -> rgb(240, 234, 217)
  expect(bg).toBe('rgb(240, 234, 217)');

  // 2. Hero 巨型标题
  await expect(page.locator('h1.display-xl')).toHaveText('Aleph');

  // 3. 关键中文板块标题可见（来自 zh messages）
  await expect(page.locator('text=能力 — 02')).toBeVisible(); // Capabilities eyebrow
  await expect(page.locator('text=工作方式 — 04')).toBeVisible(); // Process eyebrow

  // 4. 能力 tab 切换：点击第二个卡片，预览标签更新
  const cards = page.locator('.cap-card');
  await expect(cards.first()).toHaveClass(/active/);
  await cards.nth(1).click();
  await expect(cards.nth(1)).toHaveClass(/active/);

  // 5. FAQ 手风琴：默认第 0 项展开，点击第 1 项展开它
  const accItems = page.locator('.acc-item');
  await accItems.nth(1).locator('.acc-q').click();
  await expect(accItems.nth(1)).toHaveClass(/open/);

  // 6. 语言切换器存在且当前为中文
  await expect(page.locator('.lang-btn')).toContainText('中文');
});

test('Docs render in light theme (zh)', async ({ page }) => {
  const response = await page.goto('http://localhost:3000/zh/docs');
  expect(response?.status()).toBe(200);
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bg).toBe('rgb(240, 234, 217)');
});
