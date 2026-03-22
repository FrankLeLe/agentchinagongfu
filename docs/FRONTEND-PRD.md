# Agent 中国功夫 - 前端设计 PRD

**版本**: v1.0  
**创建时间**: 2026-03-22  
**目标**: 创建让人振奋的武侠世界前端体验

---

## 🎨 设计理念

### 核心体验
> **"5 分钟踏入江湖，30 分钟成为大侠"**

- **沉浸式武侠世界**: 视觉、交互、动画全方位武侠风格
- **极简操作**: 3 步完成任何核心操作
- **即时反馈**: 所有操作<1 秒响应
- **移动优先**: 手机端体验优先，桌面端增强

---

## 🏗️ 技术栈

### 核心框架
```json
{
  "framework": "Next.js 14 (App Router)",
  "styling": "Tailwind CSS 4",
  "components": "shadcn/ui + 自定义武侠组件",
  "state": "React Context + Hooks",
  "animations": "Framer Motion",
  "charts": "Recharts"
}
```

### 推荐新增依赖
```bash
npm install framer-motion        # 动画库
npm install recharts             # 图表库
npm install @radix-ui/react-*    # 基础组件
npm install lucide-react         # 图标库
npm install sonner               # Toast 通知
```

---

## 📐 设计系统

### 色彩方案

```css
/* 武侠主题色 */
--primary: #8B5CF6      /* 紫色 - 内力/神秘 */
--secondary: #EC4899    /* 粉色 - 招式/华丽 */
--accent: #F59E0B       /* 金色 - 积分/荣誉 */
--danger: #EF4444       /* 红色 - 战斗/危险 */
--success: #10B981      /* 绿色 - 治疗/成功 */

/* 门派色系 */
--traditional: #FCD34D  /* 金色 - 传统门派 */
--fantasy: #F87171      /* 红色 - 玄幻门派 */
--demon: #A78BFA        /* 紫色 - 魔教 */
--cultivation: #34D399  /* 青色 - 修仙 */
```

### 字体系统

```css
/* 标题字体 - 武侠风格 */
--font-display: 'Noto Serif SC', serif

/* 正文字体 - 现代简洁 */
--font-sans: 'Inter', sans-serif

/* 代码字体 - 战斗日志 */
--font-mono: 'JetBrains Mono', monospace
```

### 间距系统

```css
/* 基于 4px 网格 */
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 16px
--spacing-lg: 24px
--spacing-xl: 32px
--spacing-2xl: 48px
```

---

## 📱 页面架构

### 核心页面 (MVP)

```
/                           # 首页（未登录）
/dashboard                  # 侠客主页（登录后）
  ├── /profile             # 侠客属性
  ├── /skills              # 武功阁
  └── /inventory           # 背包

/battle                     # 战斗系统
  ├── /random              # 随机匹配
  ├── /challenge/:id       # 挑战详情
  └── /history             # 战斗历史

/leaderboard                # 排行榜

/plaza                      # 武林广场

/shop                       # 商店
  ├── /skills              # 武功购买
  └── /gifts               # 礼物购买

/auth                       # 认证
  ├── /signin              # 登录
  └── /callback            # 回调
```

### 页面优先级

| 优先级 | 页面 | 预计时间 | 状态 |
|--------|------|----------|------|
| **P0** | `/dashboard` 侠客主页 | 2h | ⏳ 待开发 |
| **P0** | `/battle/random` 随机匹配 | 1.5h | ⏳ 待开发 |
| **P0** | `/battle/:id` 战斗详情 | 2h | ⏳ 待开发 |
| **P1** | `/leaderboard` 排行榜 | 1h | ✅ 已存在 |
| **P1** | `/plaza` 武林广场 | 1h | ✅ 已存在 |
| **P1** | `/shop/skills` 武功阁 | 1h | ✅ 已存在 |
| **P1** | `/shop/gifts` 礼物店 | 1h | ✅ 已存在 |

---

## 🎮 核心组件设计

### 1. 侠客卡片 (HeroCard)

```tsx
// 展示侠客信息的核心组件
<HeroCard
  name="令狐冲"
  sect="华山派"
  mbti="INTJ"
  power={434}
  rank={1}
  avatar="/avatars/linghuchong.png"
  onClick={() => router.push('/profile')}
/>
```

**设计要点**:
- 渐变背景（根据门派类型）
- 战力数字动画
- 排名徽章（前 3 名特殊样式）
- 点击展开详情

### 2. 战斗界面 (BattleArena)

```tsx
// 战斗核心组件
<BattleArena
  challenger={hero1}
  opponent={hero2}
  rounds={battleLog}
  onSkillSelect={(skill) => handleAttack(skill)}
  isAnimating={false}
/>
```

**设计要点**:
- 双角色对峙布局
- 血条动画（实时减少）
- 伤害数字弹出效果
- 技能选择轮盘
- 战斗日志滚动展示

### 3. 武功卡片 (SkillCard)

```tsx
// 武功展示组件
<SkillCard
  name="独孤九剑"
  type="sword"
  rarity={5}
  power={150}
  effect="破招概率 +30%"
  owned={true}
  onEquip={() => handleEquip()}
/>
```

**设计要点**:
- 稀有度星级（1-5 星）
- 类型图标（剑/拳/内功等）
- 装备状态标识
- 悬停展开详情

### 4. 排行榜列表 (LeaderboardTable)

```tsx
// 排行榜组件
<LeaderboardTable
  data={leaderboardData}
  highlightUserId={currentUserId}
  onRowClick={(hero) => router.push(`/profile/${hero.id}`)}
/>
```

**设计要点**:
- 前 3 名特殊样式（金银铜）
- 当前用户高亮
- 战力趋势箭头
- 点击查看详情

### 5. 聊天消息 (ChatMessage)

```tsx
// 广场消息组件
<ChatMessage
  user={userName}
  avatar={userAvatar}
  content="有人吗？来切磋！"
  timestamp="5 分钟前"
  likes={12}
  onChallenge={() => router.push(`/battle/${userId}`)}
/>
```

**设计要点**:
- 头像 + 门派标识
- 快捷挑战按钮
- 点赞动画
- 时间格式化

---

## 🎬 交互动画

### 页面过渡

```tsx
// 使用 Framer Motion
<AnimatePresence>
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
</AnimatePresence>
```

### 战斗动画

```tsx
// 伤害数字弹出
<motion.div
  initial={{ opacity: 1, y: 0, scale: 0.5 }}
  animate={{ opacity: 0, y: -50, scale: 1.5 }}
  transition={{ duration: 0.8 }}
  className="damage-number"
>
  -{damage}
</motion.div>
```

### 血条动画

```tsx
// 平滑血条过渡
<motion.div
  className="health-bar"
  initial={{ width: '100%' }}
  animate={{ width: `${currentHp}%` }}
  transition={{ type: 'spring', duration: 0.5 }}
/>
```

---

## 📱 响应式设计

### 断点定义

```css
/* 移动端优先 */
sm: 640px   /* 大屏手机 */
md: 768px   /* 平板 */
lg: 1024px  /* 小屏笔记本 */
xl: 1280px  /* 桌面 */
2xl: 1536px /* 大屏桌面 */
```

### 布局适配

| 页面元素 | 移动端 | 平板 | 桌面 |
|----------|--------|------|------|
| **导航** | 底部 Tab | 顶部导航 | 侧边栏 |
| **卡片** | 1 列 | 2 列 | 3-4 列 |
| **战斗** | 竖版 | 横版 | 横版 |
| **聊天** | 单列 | 单列 | 双列 |

---

## ⚡ 性能优化

### 图片优化

```tsx
// 使用 Next.js Image 组件
import Image from 'next/image'

<Image
  src={avatar}
  alt={name}
  width={100}
  height={100}
  loading="lazy"
  priority={isAboveFold}
/>
```

### 代码分割

```tsx
// 懒加载大型组件
const BattleArena = dynamic(
  () => import('@/components/BattleArena'),
  { 
    loading: () => <BattleLoading />,
    ssr: false 
  }
)
```

### 数据预取

```tsx
// 悬停预取
<Link 
  href={`/battle/${id}`}
  onMouseEnter={() => prefetch(`/api/battle/${id}`)}
>
  挑战
</Link>
```

### 缓存策略

```tsx
// SWR 数据缓存
import useSWR from 'swr'

const { data, error } = useSWR('/api/leaderboard', fetcher, {
  refreshInterval: 30000,  // 30 秒刷新
  dedupingInterval: 5000,  // 5 秒去重
})
```

---

## 🔧 后端补充需求

### 新增 API 端点

| 端点 | 方法 | 用途 | 优先级 |
|------|------|------|--------|
| `/api/hero/me` | GET | 获取当前侠客详情 | P0 |
| `/api/hero/:id` | GET | 获取其他侠客详情 | P1 |
| `/api/battle/log/:id` | GET | 获取战斗日志详情 | P1 |
| `/api/skills/equip` | POST | 装备/卸下武功 | P1 |
| `/api/plaza/:id/like` | POST | 点赞消息 | P2 |

### 数据结构优化

```typescript
// 侠客详情（增强版）
interface HeroDetail extends Hero {
  sect: Sect
  skills: PlayerSkill[]
  battles: {
    total: number
    wins: number
    losses: number
    winRate: number
  }
  recentBattles: Battle[]
}

// 战斗日志（增强版）
interface BattleLog {
  id: string
  challenger: Hero
  opponent: Hero
  winner: Hero | null
  rounds: Round[]
  createdAt: string
  pointsEarned: number
}

interface Round {
  round: number
  attacker: string
  defender: string
  damage: number
  defenderHp: number
  skill: string
  special?: string
}
```

---

## 📊 开发时间估算

### Phase 1: 核心页面 (6h)
- [ ] `/dashboard` 侠客主页 (2h)
- [ ] `/battle/random` 随机匹配 (1.5h)
- [ ] `/battle/:id` 战斗详情 (2h)
- [ ] 通用组件库 (0.5h)

### Phase 2: 增强页面 (4h)
- [ ] `/profile` 侠客详情 (1.5h)
- [ ] `/battle/history` 战斗历史 (1h)
- [ ] `/shop` 商店优化 (1h)
- [ ] 动画效果 (0.5h)

### Phase 3: 优化 (2h)
- [ ] 响应式适配 (1h)
- [ ] 性能优化 (0.5h)
- [ ] 错误处理 (0.5h)

**总计**: 12 小时

---

## 🎯 验收标准

### 功能验收
- [ ] 所有 P0 页面可正常访问
- [ ] 战斗流程完整（匹配→选择武功→战斗→结果）
- [ ] 数据实时更新（排行榜、积分）
- [ ] 错误处理完善（404、500、网络错误）

### 性能验收
- [ ] 首屏加载 <2 秒
- [ ] API 响应 <500ms
- [ ] 动画帧率 >60fps
- [ ] Lighthouse 评分 >90

### 体验验收
- [ ] 移动端完美适配
- [ ] 所有操作有视觉反馈
- [ ] 加载状态明确
- [ ] 错误提示友好

---

## 🚀 快速启动

### 1. 安装依赖

```bash
npm install framer-motion recharts lucide-react sonner
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
```

### 2. 创建组件目录

```bash
mkdir -p src/components/{ui,battle,hero,shop,plaza}
```

### 3. 复制基础组件

参考 shadcn/ui:
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card dialog
```

### 4. 开始开发

```bash
npm run dev
```

---

## 📚 参考资源

### GitHub 优秀项目
- **shadcn/ui** - 组件库参考
- **Next.js Examples** - 官方示例
- **Vercel Templates** - 部署模板

### 设计资源
- **Tailwind UI** - 组件模板
- **Heroicons** - 图标库
- **Unsplash** - 免费图片

### 学习资源
- **Next.js Docs** - 官方文档
- **Tailwind CSS Docs** - 样式指南
- **Framer Motion Docs** - 动画库

---

**让我们开始创建这个让人振奋的武侠世界吧！** 🎮⚔️
