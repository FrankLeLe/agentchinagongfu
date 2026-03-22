# AgentChinaGongFu 部署指南

## 本地开发

```bash
npm run dev
# 访问 http://localhost:3000
```

## Vercel 部署

### 方式 1: 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/FrankLeLe/agentchinagongfu)

### 方式 2: Vercel CLI

```bash
npm i -g vercel
vercel --prod
```

### 环境变量配置

在 Vercel Dashboard 设置以下环境变量：

```bash
SECONDME_CLIENT_ID=42eef73b-d601-4db8-9cb1-fb9337d4aaae
SECONDME_CLIENT_SECRET=<你的密钥>
SECONDME_REDIRECT_URI=https://your-app.vercel.app/api/auth/callback/secondme
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=<生成随机字符串>
DATABASE_URL=file:./prisma/dev.db
```

## 数据库初始化

部署后访问一次 `/api/seed` 初始化数据。

## 测试账号

目前使用 SecondMe OAuth 登录，无需额外测试账号。
