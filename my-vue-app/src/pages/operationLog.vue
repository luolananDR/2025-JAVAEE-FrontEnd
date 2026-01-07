<template>
  <Header style="z-index: 100" ></Header>
  <div class="operation-log-detail">
    <!-- 返回按钮 -->
    <div class="back-button">
      <el-button type="text" :icon="ArrowLeft" @click="goBack">
        返回操作日志
      </el-button>
    </div>

    <!-- 详情卡片 -->
    <el-card shadow="always" class="detail-card" v-if="logDetail">
      <template #header>
        <div class="card-header">
          <div class="header-title">
            <h2>操作日志详情</h2>
            <el-tag :type="getOperationTypeColor(logDetail.operationType)" size="large">
              {{ getOperationTypeLabel(logDetail.operationType) }}
            </el-tag>
          </div>
          <div class="header-actions">
            <el-button type="primary" :icon="Printer" @click="printDetail" plain>
              打印
            </el-button>
            <el-button type="danger" :icon="Delete" @click="handleDelete" plain>
              删除
            </el-button>
          </div>
        </div>
      </template>

      <el-descriptions :column="2" border>
        <el-descriptions-item label="操作ID">{{ logDetail.id }}</el-descriptions-item>
        <el-descriptions-item label="操作状态">
          <el-tag :type="logDetail.status === 1 ? 'success' : 'danger'">
            {{ logDetail.status === 1 ? '成功' : '失败' }}
          </el-tag>
          <el-tooltip
              v-if="logDetail.status === 0 && logDetail.errorMessage"
              :content="logDetail.errorMessage"
              placement="top"
          >
            <el-icon style="margin-left: 8px; color: #f56c6c;"><Warning /></el-icon>
          </el-tooltip>
        </el-descriptions-item>

        <el-descriptions-item label="操作者">
          <div class="operator-info">
            <el-avatar :size="32" :src="logDetail.username" class="operator-avatar">
              {{ logDetail.username?.charAt(0) || 'U' }}
            </el-avatar>
            <div class="operator-detail">
              <div class="operator-name">{{ logDetail.username || '匿名用户' }}</div>
              <div class="operator-id">用户ID: {{ logDetail.userId }}</div>
            </div>
          </div>
        </el-descriptions-item>

        <el-descriptions-item label="模块">
          <el-tag type="info" size="small">{{ logDetail.module || '--' }}</el-tag>
        </el-descriptions-item>

        <el-descriptions-item label="操作时间">{{ formatDateTime(logDetail.createTime) }}</el-descriptions-item>
        <el-descriptions-item label="操作耗时">
          <el-tag :type="getDurationColor(logDetail.duration)" size="small">
            {{ logDetail.duration ? `${logDetail.duration}ms` : '--' }}
          </el-tag>
        </el-descriptions-item>

        <el-descriptions-item label="IP地址">{{ logDetail.ipAddress || '--' }}</el-descriptions-item>
        <el-descriptions-item label="请求方法">
          <el-tag :type="getMethodColor(logDetail.requestMethod)" size="small">
            {{ logDetail.requestMethod || '--' }}
          </el-tag>
        </el-descriptions-item>

        <el-descriptions-item label="设备信息" :span="2">
          {{ logDetail.userAgent || '--' }}
        </el-descriptions-item>

        <el-descriptions-item label="操作描述" :span="2">
          <div class="operation-content">
            {{ logDetail.description }}
          </div>
        </el-descriptions-item>

        <el-descriptions-item label="请求URL" :span="2">
          <div class="url-info">
            <code>{{ logDetail.requestUrl || '--' }}</code>
          </div>
        </el-descriptions-item>

        <el-descriptions-item label="请求参数" :span="2">
          <div class="detail-params">
            <pre v-if="logDetail.requestParams">{{ formatJSONString(logDetail.requestParams) }}</pre>
            <span v-else class="empty-text">无</span>
          </div>
        </el-descriptions-item>

        <el-descriptions-item label="响应结果" :span="2">
          <div class="detail-params">
            <pre v-if="logDetail.responseResult">{{ formatJSONString(logDetail.responseResult) }}</pre>
            <span v-else class="empty-text">无</span>
          </div>
        </el-descriptions-item>

        <el-descriptions-item label="更新时间" :span="2">
          {{ formatDateTime(logDetail.updateTime) }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 加载状态 -->
    <div v-else-if="loading" class="loading-container">
      <el-skeleton :rows="10" animated />
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-container">
      <el-result icon="error" title="加载失败" :sub-title="error">
        <template #extra>
          <el-button type="primary" @click="retry">重试</el-button>
          <el-button @click="goBack">返回列表</el-button>
        </template>
      </el-result>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, computed} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowLeft,
  Printer,
  Delete,
  Warning
} from '@element-plus/icons-vue'
import { useAdminStore } from '../stores/adminStore'
import Header from "../components/Layout/Header.vue";

const route = useRoute()
const router = useRouter()
const store = useAdminStore()

const loading = ref(false)
const error = ref('')

// 计算属性：从store获取当前日志详情
const logDetail = computed(() => {
  const logId = route.query.id
  if (!logId) return null

  // 先从已加载的数据中查找
  const existingLog = store.allLogs.find(log => log.id === parseInt(logId))
  if (existingLog) {
    return existingLog
  }

  // 如果没有找到，可能是通过store.getLogDetail加载的详情
  // 这里需要根据你的实际实现来调整
  return null
})

// 格式化日期时间
const formatDateTime = (time) => {
  if (!time) return '--'
  try {
    return new Date(time).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
  } catch {
    return time
  }
}

// 格式化JSON字符串（如果已经是JSON字符串）
const formatJSONString = (jsonStr) => {
  if (!jsonStr) return '无'
  try {
    // 尝试解析为JSON对象
    const obj = typeof jsonStr === 'string' ? JSON.parse(jsonStr) : jsonStr
    return JSON.stringify(obj, null, 2)
  } catch {
    // 如果不是JSON，直接返回原始字符串
    return jsonStr
  }
}

// 获取操作类型颜色
const getOperationTypeColor = (type) => {
  const colorMap = {
    '创建': 'success',
    '删除': 'danger',
    '查询': 'info',
    '配置': 'warning',
    '登录': 'success',
    '登出': 'info',
    '导出': 'info'
  }
  return colorMap[type] || 'info'
}

// 获取操作类型标签
const getOperationTypeLabel = (type) => {
  const labelMap = {
    '创建': '创建',
    '更新': '更新',
    '删除': '删除',
    '查询': '查询',
    '配置': '配置',
    'login': '用户登录',
    'logout': '用户登出',
    'create_exam': '创建考试',
    'update_exam': '更新考试',
    'delete_exam': '删除考试',
    'submit_practice': '提交练习',
    'view_exam': '查看试卷'
  }
  return labelMap[type] || type || '--'
}

// 获取方法颜色
const getMethodColor = (method) => {
  const colors = {
    'GET': 'success',
    'POST': 'primary',
    'PUT': 'warning',
    'DELETE': 'danger',
    'PATCH': 'info'
  }
  return colors[method] || 'default'
}

// 获取耗时颜色
const getDurationColor = (duration) => {
  if (!duration) return 'info'
  if (duration < 100) return 'success'
  if (duration < 500) return 'warning'
  return 'danger'
}

// 加载日志详情
const loadLogDetail = async () => {
  const logId = route.query.id
  if (!logId) {
    error.value = '日志ID不存在'
    return
  }

  try {
    loading.value = true
    error.value = ''

    console.log('📄 加载日志详情，ID:', logId)

    // 使用store的方法获取详情
    const result = await store.getLogDetail(logId)

    console.log('📄 加载结果:', result)

    if (result.success) {
      // 数据已经在store的getLogDetail中处理
      // 现在logDetail计算属性会从store中获取数据
    } else {
      error.value = result.message || '加载失败'
      console.error('加载失败:', result)
    }
  } catch (err) {
    console.error('加载日志详情失败:', err)
    error.value = '加载失败，请重试'
  } finally {
    loading.value = false
  }
}

// 返回上一页
const goBack = () => {
  router.push({
    path: "/admin",
  })
}

// 打印详情
const printDetail = () => {
  window.print()
}

// 删除日志
const handleDelete = async () => {
  if (!logDetail.value) return

  try {
    await ElMessageBox.confirm('确认删除这条操作日志吗？此操作不可恢复。', '警告', {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      type: 'warning',
      confirmButtonClass: 'el-button--danger'
    })

    const result = await store.deleteLog(logDetail.value.id)

    if (result.success) {
      ElMessage.success(result.message || '删除成功')
      goBack()
    } else {
      ElMessage.error(result.message || '删除失败')
    }
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 重试加载
const retry = () => {
  loadLogDetail()
}

onMounted(async () => {
  await loadLogDetail()

  console.log("详情页面加载完成:", {
    routeQuery: route.query,
    logDetail: logDetail.value,
    allLogsLength: store.allLogs.length
  })
})
</script>

<style scoped>
.operation-log-detail {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
  position: fixed;
  width: 100%;
  top: 75px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
}

.back-button {
  margin-bottom: 20px;
}

.detail-card {
  border-radius: 12px;
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-title h2 {
  margin: 0;
  font-size: 20px;
  color: #303133;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.operator-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.operator-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: bold;
}

.operator-detail {
  display: flex;
  flex-direction: column;
}

.operator-name {
  font-weight: 500;
  color: #303133;
}

.operator-id {
  font-size: 12px;
  color: #909399;
}

.operation-content {
  padding: 12px;
  background: #fafafa;
  border-radius: 4px;
  border-left: 4px solid #409eff;
  white-space: pre-wrap;
  word-break: break-word;
}

.url-info {
  padding: 8px 12px;
  background: #f6f8fa;
  border-radius: 4px;
  border: 1px solid #e1e4e8;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  word-break: break-all;
}

.url-info code {
  color: #0366d6;
}

.detail-params {
  padding: 12px;
  background: #f6f8fa;
  border-radius: 4px;
  border: 1px solid #e1e4e8;
  overflow-x: auto;
  max-height: 300px;
  overflow-y: auto;
}

.detail-params pre {
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  line-height: 1.5;
  color: #24292e;
}

.empty-text {
  color: #909399;
  font-style: italic;
}

.loading-container {
  background: #fff;
  padding: 24px;
  border-radius: 12px;
}

.error-container {
  background: #fff;
  padding: 40px;
  border-radius: 12px;
  text-align: center;
  max-width: 500px;
  margin: 0 auto;
}

/* 打印样式 */
@media print {
  .back-button,
  .header-actions {
    display: none;
  }

  .detail-card {
    border: none;
    box-shadow: none;
  }

  .el-descriptions {
    break-inside: avoid;
  }

  .operation-log-detail {
    position: static;
    top: 0;
  }
}
</style>