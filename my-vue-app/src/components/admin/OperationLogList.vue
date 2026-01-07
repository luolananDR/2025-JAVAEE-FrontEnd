<template>
  <div class="operation-log-list">
    <!-- 筛选工具栏 -->
    <div class="filter-toolbar">
      <el-row :gutter="20" align="middle">
        <el-col :span="4">
          <el-input
              v-model="localFilters.operator"
              placeholder="操作者"
              clearable
              @clear="handleFilterChange"
              @keyup.enter="handleFilterChange"
          >
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-col>

        <el-col :span="4">
          <el-select
              v-model="localFilters.operationType"
              placeholder="操作类型"
              clearable
              @change="handleFilterChange"
          >
            <el-option label="全部" value="" />
            <el-option v-for="type in store.operationTypes" :key="type.value" :label="type.label" :value="type.value" />
          </el-select>
        </el-col>

        <el-col :span="4">
          <el-input
              v-model="localFilters.keyword"
              placeholder="搜索关键字"
              clearable
              @clear="handleFilterChange"
              @keyup.enter="handleFilterChange"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-col>

        <el-col :span="4">
          <el-button-group>
            <el-button type="primary" @click="handleFilterChange">
              <el-icon><Search /></el-icon>
              搜索
            </el-button>
            <el-button @click="handleReset">
              <el-icon><Refresh /></el-icon>
              重置
            </el-button>
          </el-button-group>
        </el-col>
      </el-row>
    </div>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <el-button
          type="primary"
          :loading="store.exporting"
          @click="handleExport"
      >
        <el-icon><Download /></el-icon>
        导出日志
      </el-button>


      <el-button
          type="info"
          @click="handleRefresh"
      >
        <el-icon><Refresh /></el-icon>
        刷新
      </el-button>
    </div>

    <!-- 日志表格 -->
    <div class="log-table-container" ref="tableContainer">
      <el-table
          ref="logTable"
          :data="store.paginatedLogs"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          v-loading="store.loading"
      >
        <!-- 选择列 -->
        <el-table-column type="selection" width="55" />

        <!-- 操作者列 -->
        <el-table-column prop="username" label="操作者" width="120">
          <template #default="{ row }">
            <div class="operator-cell">
              <span class="operator-name">{{ row.username }}</span>
              <small style="color: #999; margin-left: 5px;">ID: {{ row.userId }}</small>
            </div>
          </template>
        </el-table-column>

        <!-- 模块列 -->
        <el-table-column prop="module" label="模块" width="120">
          <template #default="{ row }">
            <el-tag type="info" size="small">
              {{ row.module }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 操作类型列 -->
        <el-table-column prop="operationType" label="操作类型" width="100">
          <template #default="{ row }">
            <el-tag :type="getOperationTypeColor(row.operationType)" size="small">
              {{ row.operationType }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 描述列 -->
        <el-table-column prop="description" label="操作描述" min-width="180">
          <template #default="{ row }">
            <div class="operation-content">
              <span class="content-text">{{ row.description }}</span>
            </div>
          </template>
        </el-table-column>

        <!-- 请求方法列 -->
        <el-table-column prop="requestMethod" label="方法" width="80">
          <template #default="{ row }">
            <el-tag
                :type="getMethodColor(row.requestMethod)"
                size="small"
                class="method-tag"
            >
              {{ row.requestMethod }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- URL列 -->
        <el-table-column prop="requestUrl" label="请求URL" width="180">
          <template #default="{ row }">
            <span class="url-text">{{ row.requestUrl }}</span>
          </template>
        </el-table-column>

        <!-- IP地址列 -->
        <el-table-column prop="ipAddress" label="IP地址" width="150">
          <template #default="{ row }">
            <span class="ip-address">{{ row.ipAddress }}</span>
          </template>
        </el-table-column>

        <!-- 状态列 -->
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
              {{ row.status === 1 ? '成功' : '失败' }}
            </el-tag>
            <el-tooltip
                v-if="row.status === 0 && row.errorMessage"
                :content="row.errorMessage"
                placement="top"
            >
              <el-icon class="error-icon"><Warning /></el-icon>
            </el-tooltip>
          </template>
        </el-table-column>

        <!-- 耗时列 -->
        <el-table-column prop="duration" label="耗时" width="90">
          <template #default="{ row }">
            <el-tag
                :type="getDurationColor(row.duration)"
                size="small"
            >
              {{ row.duration }}ms
            </el-tag>
          </template>
        </el-table-column>

        <!-- 操作列 -->
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button-group size="small">
              <el-button
                  type="primary"
                  @click.stop="handleViewDetail(row)"
                  :icon="View"
                  title="查看详情"
              />
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
          v-model:current-page="store.pagination.page"
          v-model:page-size="store.pagination.pageSize"
          layout="total,  prev, pager, next, jumper"
          :total="store.filteredLogs.length"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  User,
  Search,
  Refresh,
  Download,
  Delete,
  View,
  Warning
} from '@element-plus/icons-vue'
import { useAdminStore } from '../../stores/adminStore'

const props = defineProps({
  autoRefresh: {
    type: Boolean,
    default: false
  },
  refreshInterval: {
    type: Number,
    default: 30000
  }
})

const emit = defineEmits(['log-click', 'refresh', 'filter-change'])

const router = useRouter()
const store = useAdminStore()
const tableContainer = ref(null)
const logTable = ref(null)
const selectedLogs = ref([])
let refreshTimer = null

// 本地筛选条件（与store中的filters同步）
const localFilters = ref({ ...store.filters })

// 监听本地筛选条件变化，同步到store
watch(localFilters, (newVal) => {
  store.updateFilters(newVal)
}, { deep: true })

// 监听store中的filters变化，同步到本地
watch(() => store.filters, (newVal) => {
  localFilters.value = { ...newVal }
}, { deep: true })

// 处理筛选变化
const handleFilterChange = () => {
  console.log('筛选条件变化:', localFilters.value)
  emit('filter-change', localFilters.value)
}

// 重置筛选
const handleReset = () => {
  store.resetFilters()
  localFilters.value = { ...store.filters }
}

// 处理导出
const handleExport = async () => {
  try {
    await ElMessageBox.confirm('确认导出操作日志吗？', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await store.exportLogs()
    ElMessage.success('导出成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('导出失败')
    }
  }
}

// 处理批量删除
const handleBatchDelete = async () => {
  if (selectedLogs.value.length === 0) return

  try {
    await ElMessageBox.confirm(`确认删除选中的 ${selectedLogs.value.length} 条日志吗？`, '警告', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
      confirmButtonClass: 'el-button--danger'
    })

    const ids = selectedLogs.value.map(log => log.id)
    const result = await store.batchDeleteLogs(ids)

    if (result.success) {
      ElMessage.success('删除成功')
      selectedLogs.value = []
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 处理刷新
const handleRefresh = () => {
  store.fetchOperationLogs()
  emit('refresh')
}

// 处理选择变化
const handleSelectionChange = (selection) => {
  selectedLogs.value = selection
}

// 查看详情
const handleViewDetail = (row) => {
  router.push({
    name: 'OperationLog',
    query: { id: row.id }
  })
}

// 删除单条日志
const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确认删除这条操作日志吗？', '警告', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
      confirmButtonClass: 'el-button--danger'
    })

    const result = await store.deleteLog(id)

    if (result.success) {
      ElMessage.success('删除成功')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 分页大小变化
const handleSizeChange = (size) => {
  store.setPagination(1, size)
}

// 当前页变化
const handleCurrentChange = (page) => {
  store.setPagination(page, store.pagination.pageSize)
}

// 自动刷新
const startAutoRefresh = () => {
  if (props.autoRefresh) {
    refreshTimer = setInterval(() => {
      handleRefresh()
    }, props.refreshInterval)
  }
}

// 停止自动刷新
const stopAutoRefresh = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
}

// 初始化
onMounted(() => {
  store.init()
  startAutoRefresh()
})

onUnmounted(() => {
  stopAutoRefresh()
})

const getOperationTypeColor = (type) => {
  const colors = {
    '创建': 'success',
    '更新': 'primary',
    '删除': 'danger',
    '查询': 'info',
    '登录': 'warning',
    '登出': 'warning'
  }
  return colors[type] || 'default'
}

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

const getDurationColor = (duration) => {
  if (!duration) return 'info'
  if (duration < 100) return 'success'
  if (duration < 500) return 'warning'
  return 'danger'
}
</script>

<style scoped>
/* 样式保持不变 */
.operation-log-list {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.filter-toolbar {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.action-buttons {
  margin-bottom: 16px;
  display: flex;
  gap: 12px;
}

.log-table-container {
  flex: 1;
  overflow: hidden;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

:deep(.el-table) {
  flex: 1;
}

:deep(.el-table__body-wrapper) {
  overflow-y: auto;
  max-height: calc(100vh - 400px);
}

.operator-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.operator-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.operator-name {
  font-weight: 500;
}

.operation-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.content-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail-icon {
  color: #409eff;
  cursor: pointer;
}

.detail-icon:hover {
  color: #337ecc;
}

.ip-address {
  font-family: 'Courier New', monospace;
  color: #666;
}

.user-agent {
  color: #909399;
}

.time-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.absolute-time {
  font-weight: 500;
  color: #303133;
}

.relative-time {
  font-size: 12px;
  color: #909399;
}

.empty-state {
  padding: 40px;
  text-align: center;
  color: #909399;
}

.empty-state p {
  margin-top: 12px;
  font-size: 14px;
}

.load-more {
  padding: 16px;
  text-align: center;
  border-top: 1px solid #ebeef5;
}

.pagination-container {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-top: 16px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

:deep(.warning-row) {
  background-color: #fff2f0;
}

:deep(.warning-row:hover > td) {
  background-color: #ffeae6 !important;
}
</style>