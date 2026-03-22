// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('AgentChinaGongFu OAuth 登录测试', () => {
  
  test('首页加载测试', async ({ page }) => {
    // 访问首页
    await page.goto('http://localhost:3001');
    
    // 检查标题
    await expect(page).toHaveTitle(/AgentChinaGongFu/);
    
    // 检查"踏入江湖"按钮
    const loginButton = page.locator('button:has-text("踏入江湖")');
    await expect(loginButton).toBeVisible();
    
    console.log('✅ 首页加载成功');
  });

  test('OAuth 流程测试（需要 SecondMe 账号）', async ({ page }) => {
    // 访问首页
    await page.goto('http://localhost:3001');
    
    // 点击登录按钮
    await page.locator('button:has-text("踏入江湖")').click();
    
    // 等待跳转到 SecondMe OAuth
    await page.waitForURL(/go\.second\.me/);
    
    console.log('✅ OAuth 跳转成功');
    
    // 注意：这里需要手动输入 SecondMe 账号密码
    // 自动化测试需要配置 SecondMe 测试账号
    
    // 示例代码（需要配置测试账号）：
    /*
    await page.fill('input[type="email"]', process.env.SECONDME_TEST_EMAIL);
    await page.fill('input[type="password"]', process.env.SECONDME_TEST_PASSWORD);
    await page.click('button:has-text("登录")');
    
    // 等待回调
    await page.waitForURL(/localhost:3001/);
    
    // 检查是否成功登录
    const heroInfo = page.locator('text=侠客信息');
    await expect(heroInfo).toBeVisible();
    */
    
    console.log('⏳ 等待用户手动完成 OAuth 授权...');
  });

  test('API 端点测试', async ({ request }) => {
    // 测试排行榜 API
    const leaderboardResponse = await request.get('http://localhost:3001/api/leaderboard');
    expect(leaderboardResponse.ok()).toBeTruthy();
    const leaderboard = await leaderboardResponse.json();
    console.log('✅ 排行榜 API:', leaderboard);

    // 测试武功 API
    const skillsResponse = await request.get('http://localhost:3001/api/skills/free');
    expect(skillsResponse.ok()).toBeTruthy();
    const skills = await skillsResponse.json();
    console.log('✅ 武功 API:', skills.skills?.length || 0, '种武功');

    // 测试礼物 API
    const giftsResponse = await request.get('http://localhost:3001/api/gifts');
    expect(giftsResponse.ok()).toBeTruthy();
    const gifts = await giftsResponse.json();
    console.log('✅ 礼物 API:', gifts.gifts?.length || 0, '种礼物');
  });
});
