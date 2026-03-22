/**
 * ACP 任务辅助工具
 * 防止输入长度超限
 */

const MAX_TASK_LENGTH = 200000
const MAX_LABEL_LENGTH = 100
const MAX_ATTACHMENTS = 10

/**
 * 验证并清理任务描述
 * @param {string} task - 任务描述
 * @returns {string} - 清理后的任务描述
 */
function sanitizeTask(task) {
  if (!task || typeof task !== 'string') {
    throw new Error('任务描述不能为空')
  }
  
  // 移除多余空白
  task = task.trim()
  
  // 检查长度
  if (task.length === 0) {
    throw new Error('任务描述不能为空字符串')
  }
  
  if (task.length > MAX_TASK_LENGTH) {
    console.warn(`⚠️  任务描述超长 (${task.length} 字符)，已截断`)
    task = task.substring(0, MAX_TASK_LENGTH) + '...'
  }
  
  return task
}

/**
 * 验证标签
 * @param {string} label - 标签
 * @returns {string} - 清理后的标签
 */
function sanitizeLabel(label) {
  if (!label) return undefined
  
  label = label.trim()
  
  if (label.length > MAX_LABEL_LENGTH) {
    console.warn(`⚠️  标签超长，已截断`)
    label = label.substring(0, MAX_LABEL_LENGTH)
  }
  
  return label || undefined
}

/**
 * 验证附件列表
 * @param {Array} attachments - 附件列表
 * @returns {Array} - 清理后的附件列表
 */
function sanitizeAttachments(attachments) {
  if (!attachments || !Array.isArray(attachments)) {
    return []
  }
  
  if (attachments.length > MAX_ATTACHMENTS) {
    console.warn(`⚠️  附件数量超限 (${attachments.length})，只保留前 ${MAX_ATTACHMENTS} 个`)
    attachments = attachments.slice(0, MAX_ATTACHMENTS)
  }
  
  return attachments.map((att, i) => ({
    name: att.name || `attachment-${i}`,
    content: att.content || '',
    encoding: att.encoding || 'utf8',
    mimeType: att.mimeType || 'text/plain'
  }))
}

/**
 * 创建安全的 ACP 任务配置
 * @param {Object} options - 任务选项
 * @returns {Object} - 安全的任务配置
 */
function createSafeTask(options) {
  const {
    task,
    label,
    attachments = [],
    runtime = 'subagent',
    mode = 'run',
    timeoutSeconds = 900,
    ...rest
  } = options
  
  return {
    task: sanitizeTask(task),
    label: sanitizeLabel(label),
    attachments: sanitizeAttachments(attachments),
    runtime,
    mode,
    timeoutSeconds,
    ...rest
  }
}

/**
 * 分批处理大数据
 * @param {Array} data - 数据数组
 * @param {Function} taskCreator - 任务创建函数
 * @param {number} batchSize - 每批数量
 */
async function batchProcess(data, taskCreator, batchSize = 100) {
  const results = []
  
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, Math.min(i + batchSize, data.length))
    const task = taskCreator(batch, i)
    
    console.log(`📦 处理批次 ${i}-${Math.min(i + batchSize, data.length)}/${data.length}`)
    
    // 这里调用 sessions_spawn
    // const result = await sessions_spawn(task)
    // results.push(result)
  }
  
  return results
}

module.exports = {
  sanitizeTask,
  sanitizeLabel,
  sanitizeAttachments,
  createSafeTask,
  batchProcess,
  MAX_TASK_LENGTH,
  MAX_LABEL_LENGTH,
  MAX_ATTACHMENTS
}
