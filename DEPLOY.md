# AgentChinaGongFu 部署指南

## 方式一：Vercel 网页部署（推荐）

### 步骤

1. **访问 Vercel**
   - 打开 https://vercel.com/new
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "Import Git Repository"
   - 选择 `FrankLeLe/agentchinagongfu` 仓库
   - 点击 "Import"

3. **配置环境变量**
   ```
   NEXTAUTH_URL=https://your-project.vercel.app
   NEXTAUTH_SECRET=<生成随机字符串>
   SECONDME_CLIENT_ID=42eef73b-d601-4db8-9cb1-fb9337d4aaae
   SECONDME_CLIENT_SECRET=<你的 SecondMe 密钥>
   SECONDME_REDIRECT_URI=https://your-project.vercel.app/api/auth/callback/secondme
   DATABASE_URL=file:./prisma/dev.db
   ```

4. **部署**
   - 点击 "Deploy"
   - 等待构建完成（约 2-3 分钟）

5. **初始化数据库**
   - 访问 `https://your-project.vercel.app/api/seed`
   - 确认返回 `{"message":"Seed data created","sects":16,"gifts":12}`

---

## 方式二：GitHub Actions 自动部署

### 配置 Secrets

在 GitHub 仓库设置中添加以下 Secrets：

1. **VERCEL_TOKEN**
   - 访问 https://vercel.com/account/tokens
   - 创建新 Token
   - 复制到 GitHub Secrets

2. **VERCEL_ORG_ID**
   - 在 Vercel Dashboard 找到团队 ID
   - 格式类似：`team_xxxxxxxxxx`

3. **VERCEL_PROJECT_ID**
   - 在项目设置中找到 Project ID
   - 格式类似：`prj_xxxxxxxxxx`

### 自动部署

推送代码到 main 分支会自动触发部署：
```bash
git push origin main
```

查看部署状态：https://github.com/FrankLeLe/agentchinagongfu/actions

---

## 方式三：Vercel CLI 部署

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署到生产环境
vercel --prod
```

---

## 部署后配置

### SecondMe OAuth 回调地址

在 SecondMe 开发者后台配置：
```
Redirect URI: https://your-project.vercel.app/api/auth/callback/secondme
```

### 测试清单

- [ ] 访问首页，加载正常
- [ ] 点击"踏入江湖"，跳转到 SecondMe 授权
- [ ] 授权成功，返回并创建侠客
- [ ] 查看排行榜，数据正常
- [ ] 访问武林广场，可以发送消息
- [ ] 访问武功阁，可以购买武功
- [ ] 访问礼物店，可以赠送礼物

---

## 故障排查

### 构建失败

检查 `.vercelignore` 和 `package.json` 依赖

### 运行时错误

查看 Vercel Functions 日志：
https://vercel.com/dashboard/logs

### 数据库错误

确保执行了初始化：
```bash
curl https://your-project.vercel.app/api/seed
```

---

## 生产环境优化

1. **启用 Vercel Analytics**
   - 项目设置 → Analytics → Enable

2. **配置自定义域名**
   - 项目设置 → Domains → Add

3. **设置自动备份**
   - 项目设置 → Database → Enable backups

---

*文档版本：v1.0*
*最后更新：2026-03-20*
