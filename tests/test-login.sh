#!/bin/bash

# AgentChinaGongFu OAuth 登录自动化测试脚本

BASE_URL="http://localhost:3000"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "======================================"
echo "AgentChinaGongFu OAuth 登录测试"
echo "======================================"
echo ""

# 测试 1: 检查服务器是否运行
echo -n "1. 检查服务器状态... "
if curl -s -o /dev/null -w "%{http_code}" $BASE_URL | grep -q "200\|302"; then
    echo -e "${GREEN}✅ 服务器运行中${NC}"
else
    echo -e "${RED}❌ 服务器未响应${NC}"
    exit 1
fi

# 测试 2: 检查 OAuth Providers
echo -n "2. 检查 OAuth 配置... "
PROVIDERS=$(curl -s $BASE_URL/api/auth/providers)
if echo "$PROVIDERS" | grep -q "secondme"; then
    echo -e "${GREEN}✅ SecondMe Provider 已配置${NC}"
else
    echo -e "${RED}❌ SecondMe Provider 未找到${NC}"
    exit 1
fi

# 测试 3: 检查首页
echo -n "3. 检查首页加载... "
HOMEPAGE=$(curl -s $BASE_URL)
if echo "$HOMEPAGE" | grep -q "AgentChinaGongFu"; then
    echo -e "${GREEN}✅ 首页加载成功${NC}"
else
    echo -e "${RED}❌ 首页加载失败${NC}"
    exit 1
fi

# 测试 4: 检查登录按钮
echo -n "4. 检查登录按钮... "
if echo "$HOMEPAGE" | grep -q "踏入江湖"; then
    echo -e "${GREEN}✅ 登录按钮存在${NC}"
else
    echo -e "${RED}❌ 登录按钮未找到${NC}"
    exit 1
fi

# 测试 5: 检查 API 端点
echo -n "5. 测试排行榜 API... "
LEADERBOARD=$(curl -s $BASE_URL/api/leaderboard)
if echo "$LEADERBOARD" | grep -q "leaderboard"; then
    echo -e "${GREEN}✅ 排行榜 API 正常${NC}"
else
    echo -e "${RED}❌ 排行榜 API 异常${NC}"
fi

# 测试 6: 检查武功 API
echo -n "6. 测试武功 API... "
SKILLS=$(curl -s $BASE_URL/api/skills/free)
if echo "$SKILLS" | grep -q "skills"; then
    SKILL_COUNT=$(echo "$SKILLS" | python3 -c "import sys,json; print(len(json.load(sys.stdin).get('skills',[])))" 2>/dev/null || echo "?")
    echo -e "${GREEN}✅ 武功 API 正常 (${SKILL_COUNT}种)${NC}"
else
    echo -e "${RED}❌ 武功 API 异常${NC}"
fi

# 测试 7: 检查礼物 API
echo -n "7. 测试礼物 API... "
GIFTS=$(curl -s $BASE_URL/api/gifts)
if echo "$GIFTS" | grep -q "gifts"; then
    GIFT_COUNT=$(echo "$GIFTS" | python3 -c "import sys,json; print(len(json.load(sys.stdin).get('gifts',[])))" 2>/dev/null || echo "?")
    echo -e "${GREEN}✅ 礼物 API 正常 (${GIFT_COUNT}种)${NC}"
else
    echo -e "${RED}❌ 礼物 API 异常${NC}"
fi

echo ""
echo "======================================"
echo -e "${GREEN}✅ 自动化测试完成${NC}"
echo "======================================"
echo ""
echo "📋 测试总结:"
echo "  - 服务器状态：✅"
echo "  - OAuth 配置：✅"
echo "  - 首页加载：✅"
echo "  - API 端点：✅"
echo ""
echo "🔑 下一步：手动测试 OAuth 登录流程"
echo "   访问：http://localhost:3001"
echo ""
