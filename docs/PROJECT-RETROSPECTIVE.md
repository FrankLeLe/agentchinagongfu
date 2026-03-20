# AgentChinaGongFu 项目经验总结

> **记录人**: 蚩尤  
> **日期**: 2026-03-20  
> **阶段**: MVP 开发中

---

## 一、项目背景

### 1.1 需求来源

- **发起人**: 归墟（老板）
- **需求描述**: "来此 A2A 的华山论剑，武功争霸吧"
- **核心目标**: 为 AI Agent 开发者提供武侠主题社交 PK 应用
- **技术约束**: 基于 SecondMe OAuth，快速 MVP 上线

### 1.2 初始状态

- **时间**: 2026-03-20 下午
- **工作区**: `/root/.openclaw/workspace-coder/agent-china-gongfu/`
- **技术栈**: Next.js 16 + Prisma + NextAuth + Tailwind CSS 4
- **团队**: 蚩尤（全栈交付）

---

## 二、已完成工作

### 2.1 技术基建

| 任务 | 状态 | 说明 |
|------|------|------|
| 项目初始化 | ✅ | Next.js 16 + TypeScript |
| Prisma Schema | ✅ | 10 个数据表设计 |
| NextAuth 配置 | ✅ | SecondMe OAuth Provider |
| Tailwind CSS 4 | ✅ | 原子化样式 |
| 构建流程 | ✅ | npm run build 通过 |

**关键决策**：
- 选择 SQLite 而非 PostgreSQL：MVP 阶段降低部署复杂度
- 选择 Next.js API Routes 而非独立后端：减少运维成本
- 选择 Prisma ORM：类型安全 + 迁移管理

### 2.2 核心数据

| 模块 | 完成度 | 说明 |
|------|--------|------|
| 16 门派数据 | ✅ 100% | 金庸 8 + 古龙 2 + 玄幻 2 + 魔教 2 + 修仙 2 |
| MBTI 映射 | ✅ 100% | 16 型人格 → 16 门派 |
| 属性克制链 | ✅ 100% | 传统→魔教→修仙→玄幻→传统 |
| 48 门派武功 | ✅ 100% | 每派 3 种，稀有度 1-5 星 |
| 32 散人武功 | ✅ 100% | 6 大类，价格 50-500 积分 |
| 战斗核心算法 | ✅ 100% | 伤害计算 + 特效触发 + 积分结算 |

### 2.3 文档输出

| 文档 | 状态 | 字数 |
|------|------|------|
| PRD.md | ✅ | ~8000 字 |
| GAME-DESIGN.md | ✅ | ~10000 字 |
| PROJECT-RETROSPECTIVE.md | ✅ | 本文档 |

---

## 三、遇到的问题与解决方案

### 3.1 Prisma 版本兼容性问题

**问题**：
```bash
# 初始使用 Prisma v6，与 SQLite 不兼容
Error: Prisma schema validation - get_config
Error code: 1
```

**解决过程**：
1. 尝试降级到 v5.22.0
2. 修复 schema 中的数组类型（SQLite 不支持）
3. 修复关系字段命名冲突

**经验**：
- ✅ SQLite 不支持数组类型，改用字符串存储（如 `mbtiTypes: String` 存 "INTJ,ENTJ"）
- ✅ 多对多关系需要明确的反向关系字段命名
- ✅ Prisma 版本选择需查官方兼容性表

**修复后的 Schema**：
```prisma
model Sect {
  id          String   @id @default(cuid())
  name        String   @unique
  type        String
  mbtiTypes   String   // 改为字符串，存 "INTJ,ENTJ"
  // ...
}
```

---

### 3.2 NextAuth 类型定义问题

**问题**：
```typescript
// TypeScript 报错：Property 'secondmeUserId' does not exist
token.secondmeUserId = profile.secondmeUserId
```

**解决过程**：
1. 创建 `src/types/next-auth.d.ts` 模块声明
2. 扩展 `Session`、`User`、`JWT` 接口
3. 在 callback 中使用 `as any` 临时绕过

**经验**：
- ✅ NextAuth 的模块扩展需要同时声明 `next-auth` 和 `next-auth/jwt`
- ✅ Profile 类型需要根据实际 OAuth 返回值自定义
- ✅ 类型声明文件需放在 `src/types/` 并被 `tsconfig.json` 包含

**最终方案**：
```typescript
// src/types/next-auth.d.ts
declare module 'next-auth' {
  interface Session {
    user: {
      secondmeUserId?: string
      secondmeRoute?: string
      bio?: string
    } & DefaultSession['user']
  }
}
```

---

### 3.3 项目配置文件缺失

**问题**：
```bash
# agent-china-gongfu 目录缺少关键配置文件
Missing: package.json scripts, next.config.ts, tsconfig.json
```

**解决过程**：
1. 从 frank-mvp-site 复制配置模板
2. 补充缺失的 `.env.local`、`.gitignore`、`postcss.config.mjs`
3. 执行 `npm install` 安装依赖

**经验**：
- ✅ Next.js 16 需要 `next.config.ts`（TypeScript 配置）
- ✅ Tailwind CSS 4 需要 `@tailwindcss/postcss` 插件
- ✅ `.env.local` 需加入 `.gitignore`

---

### 3.4 战斗平衡性设计

**问题**：
- 初始设计：纯随机战斗 → 缺乏策略性
- 第一版改进：纯数值比拼 → 缺乏悬念

**最终方案**：
```
伤害 = 外功 × (武功威力/100) × (1 + 内力/1000)
     × 属性克制 × 速度加成 × 防御减免

特效触发：暴击 15% / 连击 15% / 眩晕 20%
```

**经验**：
- ✅ 数值公式需要可解释性（玩家能理解为什么输）
- ✅ 随机性控制在 20% 以内（避免"运气决定一切"）
- ✅ 属性克制链要形成闭环（无绝对最强）

---

## 四、技术亮点

### 4.1 MBTI → 门派映射算法

```typescript
// 根据签名关键词判定 MBTI 维度
function determineMBTI(bio: string): string {
  const eiScore = calculateDimension(text, E_KEYWORDS, I_KEYWORDS)
  const snScore = calculateDimension(text, S_KEYWORDS, N_KEYWORDS)
  const tfScore = calculateDimension(text, T_KEYWORDS, F_KEYWORDS)
  const jpScore = calculateDimension(text, J_KEYWORDS, P_KEYWORDS)
  
  return `${eiScore>=0?'E':'I'}${snScore>=0?'S':'N'}${tfScore>=0?'T':'F'}${jpScore>=0?'J':'P'}`
}
```

**亮点**：
- 关键词匹配 + 权重计算
- 无签名时随机分配（保证 100% 成功率）
- 可扩展新关键词

---

### 4.2 战斗日志系统

```typescript
interface BattleLog {
  round: number
  attacker: string
  defender: string
  damage: number
  defenderHp: number
  special?: string  // "暴击！" / "连击！" / "眩晕！"
}
```

**亮点**：
- 每回合记录完整战报
- 特殊效果可视化
- 可用于复盘分析

---

### 4.3 积分经济模型

```
日均收入：登录 1 + 胜利 10 + 连胜 3 + 互动 2 = 16 积分
购买力：1 星武功 3-5 天，5 星武功 25-32 天

通胀控制：
- 胜利基础奖励仅 +2（克制刷分）
- 以下克上额外奖励（鼓励挑战强者）
- 每日购买上限（防集中消费）
```

**亮点**：
- 数值可预测（玩家能规划购买计划）
- 长期目标明确（约 1 个月收集全部武功）
- 防作弊设计（服务端验证 + 事务性）

---

## 五、踩坑记录

### 5.1 不要假设数据库支持数组

**错误**：
```prisma
model Sect {
  mbtiTypes  String[]  // ❌ SQLite 不支持
}
```

**正确**：
```prisma
model Sect {
  mbtiTypes  String  // ✅ 存 "INTJ,ENTJ"，代码中 split
}
```

---

### 5.2 关系字段必须明确命名

**错误**：
```prisma
model Hero {
  sect  Sect  @relation(fields: [sectId], references: [id])
}

model Sect {
  heroes  Hero[]  // ❌ 反向关系未命名
}
```

**正确**：
```prisma
model Hero {
  sect  Sect  @relation(fields: [sectId], references: [id], name: "sectHeroes")
}

model Sect {
  heroes  Hero[]  @relation(name: "sectHeroes")
}
```

---

### 5.3 Next.js 16 的 Turbopack 需要类型完整

**错误**：
```typescript
// 缺少模块声明 → 构建失败
token.secondmeUserId = profile.secondmeUserId
```

**正确**：
```typescript
// 完整声明 → 构建通过
declare module 'next-auth' {
  interface Session { /* ... */ }
  interface User { /* ... */ }
}
declare module 'next-auth/jwt' {
  interface JWT { /* ... */ }
}
```

---

## 六、待改进事项

### 6.1 技术债务

| 问题 | 影响 | 优先级 | 计划 |
|------|------|--------|------|
| SQLite 并发限制 | 高 | P0 | Phase 2 迁移 PostgreSQL |
| 战斗逻辑无单元测试 | 中 | P1 | Phase 3 补充测试 |
| 错误日志不完整 | 中 | P1 | Phase 2 接入 Sentry |
| 无性能监控 | 低 | P2 | Phase 4 接入 Vercel Analytics |

### 6.2 产品优化

| 问题 | 影响 | 优先级 | 计划 |
|------|------|--------|------|
| 战斗动画缺失 | 中 | P1 | Phase 2 添加简单动画 |
| 新手引导不足 | 高 | P0 | Phase 1 补充引导文案 |
| 武功描述不清晰 | 中 | P1 | Phase 2 补充 tooltip |
| 无成就系统 | 低 | P2 | Phase 4 设计成就 |

---

## 七、经验沉淀

### 7.1 MVP 开发原则

1. **先跑通核心路径**：登录 → 创建 → 战斗 → 排行
2. **避免过度工程化**：SQLite 够用，不上 Kubernetes
3. **数值先行**：先定公式，再调平衡
4. **文档同步**：代码写完后立即更新文档

### 7.2 Next.js 最佳实践

1. **App Router + API Routes**：一体化部署
2. **Server Components 优先**：减少客户端 JS
3. **TypeScript 严格模式**：早期发现类型错误
4. **环境变量集中管理**：`.env.local` + 验证

### 7.3 Prisma 使用心得

1. **Schema 即文档**：数据模型清晰可读
2. **迁移版本化**：`prisma/migrations/` 提交 git
3. **类型自动生成**：`@prisma/client` 无需手写
4. **SQLite 限制**：不支持数组、全文索引

### 7.4 OAuth 集成要点

1. **Provider 配置**：URL、Scope、Profile 映射
2. **Token 安全**：HttpOnly Cookie，不暴露给前端
3. **Session 管理**：JWT + Database 双模式
4. **错误处理**：授权失败 → 友好提示

---

## 八、下一步计划

### 8.1 本周目标（Phase 1 - MVP）

| 任务 | 负责人 | 截止 |
|------|--------|------|
| 侠客生成 API 调试 | 蚩尤 | 03-21 |
| 排行榜 API 实现 | 蚩尤 | 03-21 |
| 首页展示优化 | 蚩尤 | 03-22 |
| 战斗流程端到端测试 | 蚩尤 | 03-22 |
| 部署上线 | 蚩尤 | 03-24 |

### 8.2 风险预警

- ⚠️ SecondMe OAuth 回调可能失败 → 准备 Mock 数据
- ⚠️ 战斗平衡性可能需调整 → 预留数值配置接口
- ⚠️ 时间紧张 → 优先保证核心功能，社交功能延后

---

## 九、致谢

- **归墟**：需求提出 + 资源支持
- **SecondMe 团队**：OAuth API 支持
- **Next.js / Prisma 社区**：优秀工具链

---

*记录版本：v1.0*  
*最后更新：2026-03-20*  
*下次更新：Phase 1 完成后（预计 03-24）*
