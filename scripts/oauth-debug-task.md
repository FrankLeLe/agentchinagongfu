# OAuth 登录调试任务

## 任务目标
完成 AgentChinaGongFu OAuth 登录的自动化测试和调试

## 当前状态
- ✅ 服务器运行中 (http://localhost:3001)
- ✅ API 端点测试通过
- ❌ OAuth 跳转错误 (error=secondme)

## 待排查问题

### 问题 1: OAuth 跳转错误
**现象**: 访问 `/api/auth/signin/secondme` 返回 302 到 `/auth/signin?error=secondme`

**排查步骤**:
1. 检查 .env.local 配置
2. 验证 Client Secret 是否有效
3. 检查 SecondMe 后台回调地址配置
4. 测试 OAuth Token 交换 API

### 问题 2: 登录按钮验证
**现象**: curl 无法获取动态内容

**解决方案**:
- 使用 Playwright 浏览器自动化测试
- 或检查 Next.js 构建输出

## 执行计划

### Phase 1: 配置验证 (10 分钟)
```bash
# 1. 检查环境变量
cat .env.local | grep SECONDME

# 2. 检查 auth.ts 配置
cat src/lib/auth.ts | head -40

# 3. 检查服务器日志
tmux capture-pane -t agentchina -p | grep -i "error\|oauth" | tail -20
```

### Phase 2: API 测试 (10 分钟)
```bash
# 1. 测试 OAuth Token 交换
curl -X POST https://api.mindverse.com/gate/lab/api/oauth/token/code \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code" \
  -d "client_id=42eef73b-d601-4db8-9cb1-fb9337d4aaae" \
  -d "client_secret=2e90b517287813e168840568b0fd48e11341cfac78237f71650c27504243c3fb" \
  -d "redirect_uri=https://pond-sleeps-align-submitted.trycloudflare.com/api/auth/callback/secondme" \
  -d "code=test_code"

# 2. 检查返回
# 成功：{"code":0,"data":{"accessToken":"..."}}
# 失败：{"code":400,"message":"Invalid client"}
```

### Phase 3: Playwright 测试 (20 分钟)
```bash
# 1. 安装 Playwright
npm install -D @playwright/test

# 2. 运行测试
npx playwright test tests/login.test.js --reporter=list

# 3. 查看结果
```

### Phase 4: 修复和验证 (20 分钟)
根据测试结果修复配置，重新测试

## 成功标准
- [ ] OAuth 跳转成功（无 error 参数）
- [ ] SecondMe 授权成功
- [ ] 回调成功，创建侠客
- [ ] 首页显示侠客信息

## 失败处理
如果 3 轮定时（30 分钟）无法解决：
1. 记录详细错误日志
2. 搜索 SecondMe OAuth 文档
3. 检查知识库历史经验
4. 汇报异常工作情况
