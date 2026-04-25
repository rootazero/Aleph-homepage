import { test, expect } from '@playwright/test';

test('Aleph Product Homepage Validation', async ({ page }) => {
  test.setTimeout(60000);
  
  // 1. 访问主页
  const response = await page.goto('http://localhost:3000/zh');
  expect(response?.status()).toBe(200);

  // 2. 验证 Hero 板块
  await expect(page.locator('text=包含所有点的那个点')).toBeVisible();
  await expect(page.locator('svg text:has-text("ALEPH")')).toBeVisible();

  // 3. 验证五层架构 (Philosophy Section)
  await expect(page.locator('text=EVOLUTIONARY LOGIC')).toBeVisible();
  await expect(page.locator('text=L5: 多态智能体')).toBeVisible();

  // 4. 验证技术架构 (1-2-3-4 Model)
  await expect(page.locator('text=架构驱动的智能形态')).toBeVisible();
  await expect(page.locator('text=01').first()).toBeVisible();
  await expect(page.locator('text=04').first()).toBeVisible();

  // 5. 验证核心能力矩阵 (Features)
  await expect(page.locator('text=核心能力矩阵')).toBeVisible();
  // 检查是否通过物理容器分成了两行渲染
  const featureGrids = page.locator('section:has-text("核心能力矩阵") .grid');
  await expect(featureGrids).toHaveCount(2);

  // 6. 验证即刻部署 (Quick Start)
  await expect(page.locator('text=即刻部署')).toBeVisible();
  const copyButton = page.locator('button:has-text("Copy")');
  await expect(copyButton).toBeVisible();
  
  // 验证对齐：Copy 按钮应该在 Header 的右侧
  const copyButtonBox = await copyButton.boundingBox();
  const terminalHeader = page.locator('.bg-gray-900\\/40');
  const headerBox = await terminalHeader.boundingBox();
  if (copyButtonBox && headerBox) {
    // 允许一定的 margin，但应该靠近右侧
    expect(copyButtonBox.x + copyButtonBox.width).toBeGreaterThan(headerBox.x + headerBox.width * 0.8);
  }
});
