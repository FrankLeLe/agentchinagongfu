# ACP 任务最佳实践

**创建时间**: 2026-03-22 18:48 GMT+8  
**目的**: 防止 HTTP 400 输入长度超限错误

---

## ⚠️ 错误信息

```
HTTP 400: InternalError.Algo.InvalidParameter
Range of input length should be [1, 260096]
```

**含义**: LLM 模型输入长度必须在 [1, 260096] 字符范围内

---

## ✅ 预防措施

### 1. 任务描述规范

| 参数 | 推荐长度 | 最大长度 | 示例 |
|------|----------|----------|------|
| **task** | 100-1000 字符 | <200,000 | 简洁明确 |
| **label** | 10-50 字符 | <100 | 简短标签 |
| **attachments** | <10 个文件 | <50 个文件 | 每个<10KB |

### 2. 好的任务描述

```javascript
// ✅ 推荐
task: "修复排行榜 API 错误。数据库有 10 个侠客但 API 返回空列表。检查 Prisma 配置和 DateTime 字段格式。"

// ❌ 避免
task: ""  // 空任务
task: "修复一下"  // 太模糊
task: "请分析这个文件..." + 100KB 文件内容  // 超长
```

### 3. 使用辅助工具

```javascript
const { createSafeTask } = require('./utils/acp-helper')

const task = createSafeTask({
  task: "具体明确的任务描述",
  label: "简短标签",
  runtime: "subagent",
  mode: "run",
  timeoutSeconds: 900
})

sessions_spawn(task)
```

### 4. 分批处理大数据

```javascript
// ❌ 避免：一次性处理大量数据
task: "分析 1000 个用户..." + JSON.stringify(allUsers)

// ✅ 推荐：分批处理
batchProcess(allUsers, (batch, i) => 
  `分析第 ${i} 批用户数据`, 
  100
)
```

---

## 📏 输入长度检查清单

创建 ACP 任务前检查：

- [ ] `task` 不为空
- [ ] `task` 长度 <200,000 字符
- [ ] `label` 长度 <100 字符
- [ ] `attachments` <10 个文件
- [ ] 每个附件 <10KB
- [ ] `contextMessages` <10 条
- [ ] 任务描述简洁明确（100-1000 字符最佳）

---

## 🛠️ 工具函数

### `utils/acp-helper.js`

提供以下函数：

- `sanitizeTask(task)` - 验证并清理任务描述
- `sanitizeLabel(label)` - 验证并清理标签
- `sanitizeAttachments(attachments)` - 验证并清理附件
- `createSafeTask(options)` - 创建安全的任务配置
- `batchProcess(data, taskCreator, batchSize)` - 分批处理大数据

### 使用示例

```javascript
const { createSafeTask, MAX_TASK_LENGTH } = require('./utils/acp-helper')

// 自动验证和清理
const task = createSafeTask({
  task: "任务描述...",
  label: "标签",
  timeoutSeconds: 900
})

// 手动检查长度
console.log(`任务长度：${task.task.length} / ${MAX_TASK_LENGTH}`)
```

---

## 📊 监控和告警

### 日志监控

```javascript
// 在 sessions_spawn 前添加日志
console.log(`📝 创建 ACP 任务: ${task.label}`)
console.log(`📏 任务长度：${task.task.length} 字符`)

if (task.task.length > 100000) {
  console.warn('⚠️  任务描述较长，考虑分批处理')
}
```

### 错误处理

```javascript
try {
  const result = await sessions_spawn(task)
  console.log('✅ 任务完成')
} catch (error) {
  if (error.message.includes('input length')) {
    console.error('❌ 输入长度超限，请缩短任务描述')
    // 自动重试：缩短任务描述
  }
}
```

---

## 🎯 最佳实践总结

1. **简洁明确**: 任务描述 100-1000 字符最佳
2. **避免空任务**: 始终提供有意义的任务描述
3. **分批处理**: 大数据分批次处理
4. **使用工具**: 使用 `acp-helper.js` 自动验证
5. **监控日志**: 记录任务长度，及时发现异常
6. **合理超时**: 设置合适的 `timeoutSeconds`

---

## 📝 任务描述模板

```javascript
// 标准模板
task: [
  "【目标】{具体目标}",
  "【现状】{当前情况}",
  "【步骤】1.{步骤 1} 2.{步骤 2} 3.{步骤 3}",
  "【预期】{期望结果}"
].join('\n')

// 示例
task: `
【目标】修复排行榜 API 错误
【现状】数据库有 10 个侠客，但 API 返回空列表
【步骤】1.检查 Prisma 配置 2.检查数据库连接 3.修复 DateTime 格式
【预期】API 返回 10 个侠客数据
`
// ~150 字符 ✅
```

---

**记住**: 好的任务描述 = 简洁 + 明确 + 可执行
