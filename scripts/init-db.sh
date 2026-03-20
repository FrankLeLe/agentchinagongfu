#!/bin/bash
# 初始化数据库脚本

cd /root/.openclaw/workspace-coder/agent-china-gongfu

echo "=== 初始化 AgentChinaGongFu 数据库 ==="

# 1. 生成 Prisma Client
echo "1. 生成 Prisma Client..."
npx prisma generate

# 2. 推送 Schema 到数据库
echo "2. 推送 Schema 到数据库..."
npx prisma db push

# 3. 初始化种子数据
echo "3. 调用种子 API..."
curl -X POST http://localhost:3000/api/seed

echo ""
echo "=== 初始化完成！==="
echo "访问 http://localhost:3000 开始使用"
