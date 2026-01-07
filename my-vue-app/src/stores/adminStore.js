// src/stores/adminStore.js
import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import adminApi from '../api/admin.js'

export const useAdminStore = defineStore('admin', () => {
    // 状态
    const allLogs = ref([]) // 存储所有原始数据
    const loading = ref(false)
    const exporting = ref(false)

    // 前端分页配置
    const pagination = reactive({
        page: 1,
        pageSize: 10,
        total: 0,
        pages: 1
    })

    // 筛选条件 - 前端筛选
    const filters = reactive({
        operator: '',
        operationType: '',
        keyword: '',
        module: '',
        status: undefined,
        userId: ''
    })

    // 操作类型选项
    const operationTypes = ref([
        { value: '创建', label: '创建' },
        { value: '删除', label: '删除' },
        { value: '更新', label: '更新' },
        { value: '查询', label: '查询' },
        { value: '配置', label: '配置' }
    ])

    // 模块选项
    const moduleTypes = ref([
        { value: '用户管理', label: '用户管理' },
        { value: '考试管理', label: '考试管理' },
        { value: '题库管理', label: '题库管理' },
        { value: '权限管理', label: '权限管理' },
        { value: '系统设置', label: '系统设置' }
    ])

    // 状态选项
    const statusOptions = ref([
        { value: 1, label: '成功' },
        { value: 0, label: '失败' }
    ])

    // 计算属性：筛选后的数据
    const filteredLogs = computed(() => {
        console.log('🔍 Store: 计算筛选后的数据');

        const { operator, operationType, keyword, module, status, userId } = filters

        return allLogs.value.filter(log => {
            // 操作者筛选
            if (operator && !log.username?.toLowerCase().includes(operator.toLowerCase())) {
                return false
            }

            // 操作类型筛选
            if (operationType && log.operationType !== operationType) {
                return false
            }

            // 模块筛选
            if (module && log.module !== module) {
                return false
            }

            // 状态筛选
            if (status !== undefined && log.status !== status) {
                return false
            }

            // 用户ID筛选
            if (userId && log.userId !== parseInt(userId)) {
                return false
            }

            // 关键字筛选
            if (keyword) {
                const searchStr = keyword.toLowerCase()
                const found = (
                    (log.username?.toLowerCase().includes(searchStr)) ||
                    (log.module?.toLowerCase().includes(searchStr)) ||
                    (log.description?.toLowerCase().includes(searchStr)) ||
                    (log.requestUrl?.toLowerCase().includes(searchStr)) ||
                    (log.ipAddress?.toLowerCase().includes(searchStr))
                )
                if (!found) return false
            }

            return true
        })
    })

    // 计算属性：分页后的数据
    const paginatedLogs = computed(() => {
        console.log('📄 Store: 计算分页数据');

        // 更新分页总数
        pagination.total = filteredLogs.value.length
        pagination.pages = Math.ceil(filteredLogs.value.length / pagination.pageSize) || 1

        // 确保页码有效
        if (pagination.page > pagination.pages) {
            pagination.page = pagination.pages
        }

        // 计算分页
        const start = (pagination.page - 1) * pagination.pageSize
        const end = start + pagination.pageSize

        const result = filteredLogs.value.slice(start, end)

        console.log('📄 Store: 分页结果', {
            筛选后总数: filteredLogs.value.length,
            当前页码: pagination.page,
            每页大小: pagination.pageSize,
            分页范围: `${start}-${end}`,
            返回数量: result.length,
            返回IDs: result.map(item => item.id)
        })

        return result
    })

    // 更新筛选条件
    const updateFilters = (newFilters) => {
        console.log('🔄 Store: 更新筛选条件', newFilters)
        Object.assign(filters, newFilters)
        pagination.page = 1 // 重置到第一页
    }

    // 重置筛选条件
    const resetFilters = () => {
        console.log('🔄 Store: 重置筛选条件')
        filters.operator = ''
        filters.operationType = ''
        filters.keyword = ''
        filters.module = ''
        filters.status = undefined
        filters.userId = ''

        pagination.page = 1
    }

    // 设置分页
    const setPagination = (page, pageSize) => {
        console.log('📄 Store: 设置分页', { page, pageSize })
        pagination.page = page
        pagination.pageSize = pageSize
    }

    // 从API获取原始数据
    const fetchOperationLogs = async () => {
        loading.value = true
        try {
            console.log('📡 Store: 从API获取原始数据')

            // API调用 - 不传任何参数
            const response = await adminApi.getOperationLogs()
            console.log("response",response)
            allLogs.value = response
            return {
                success: response.code === 200,
                code: response.code,
                message: response.message
            }
        } catch (error) {
            console.error('❌ Store: 获取数据失败:', error)
            return {
                success: false,
                code: 500,
                message: error.message
            }
        } finally {
            loading.value = false
        }
    }

    // 获取日志详情
    const getLogDetail = async (id) => {
        try {
            console.log('📄 Store: 获取日志详情', id)

            // 先在已有数据中查找
            const existingLog = allLogs.value.find(log => log.id === parseInt(id))
            if (existingLog) {
                console.log('✅ Store: 从已有数据中找到详情')
                return {
                    success: true,
                    code: 200,
                    message: "success",
                    data: existingLog
                }
            }

            // 如果没有找到，从API获取
            const response = await adminApi.getOperationLogDetail(id)

            return {
                success: response.code === 200,
                code: response.code,
                message: response.message,
                data: response.data
            }
        } catch (error) {
            console.error('❌ Store: 获取详情失败:', error)
            return {
                success: false,
                code: 500,
                message: error.message
            }
        }
    }

    // 删除单条日志
    const deleteLog = async (id) => {
        try {
            console.log('🗑️ Store: 删除日志', id)

            const response = await adminApi.deleteOperationLog(id)

                // 从前端数据中删除
                const index = allLogs.value.findIndex(log => log.id === parseInt(id))
                if (index !== -1) {
                    allLogs.value.splice(index, 1)
                    console.log('✅ Store: 从本地数据中删除成功')
                }

            return {
                success: response.code === 200,
                code: response.code,
                message: response.message
            }
        } catch (error) {
            console.error('❌ Store: 删除失败:', error)
            return {
                success: false,
                code: 500,
                message: error.message
            }
        }
    }

    // 批量删除日志
    const batchDeleteLogs = async (ids) => {
        try {
            console.log('🗑️ Store: 批量删除日志', ids)

            const response = await adminApi.batchDeleteOperationLogs({ ids })
                // 从前端数据中删除
                allLogs.value = allLogs.value.filter(log => !ids.includes(log.id))
                console.log('✅ Store: 批量删除成功，剩余', allLogs.value.length, '条记录')
            return {
                success: response.code === 200,
                code: response.code,
                message: response.message
            }
        } catch (error) {
            console.error('❌ Store: 批量删除失败:', error)
            return {
                success: false,
                code: 500,
                message: error.message
            }
        }
    }

    // 导出日志 - 前端筛选后导出
    const exportLogs = async () => {
        exporting.value = true
        try {
            console.log('📤 Store: 导出日志（使用前端筛选的数据）', filters)

            // 使用前端筛选后的数据进行导出
            const exportData = filteredLogs.value

            if (exportData.length === 0) {
                console.warn('⚠️ Store: 没有数据可导出')
                return { success: false, message: '没有数据可导出' }
            }

            // 创建CSV数据
            const headers = ['ID', '用户名', '模块', '操作类型', '描述', '请求方法', 'URL', 'IP地址', '状态', '耗时(ms)', '时间']
            const csvRows = exportData.map(log => [
                log.id,
                log.username,
                log.module,
                log.operationType,
                `"${log.description}"`,
                log.requestMethod,
                `"${log.requestUrl}"`,
                log.ipAddress,
                log.status === 1 ? '成功' : '失败',
                log.duration,
                log.createTime
            ])

            const csvContent = [
                headers.join(','),
                ...csvRows.map(row => row.join(','))
            ].join('\n')

            const blob = new Blob(['\uFEFF' + csvContent], {
                type: 'text/csv;charset=utf-8;'
            })

            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `操作日志_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)

            console.log('✅ Store: 导出成功', exportData.length, '条记录')

            return { success: true }
        } catch (error) {
            console.error('❌ Store: 导出失败:', error)
            return {
                success: false,
                message: error.message
            }
        } finally {
            exporting.value = false
        }
    }

    // 初始化
    const init = async () => {
        console.log('🚀 Store: 初始化')

        await fetchOperationLogs()
    }

    return {
        // 状态
        allLogs,
        loading,
        exporting,
        pagination,
        filters,
        operationTypes,
        moduleTypes,
        statusOptions,

        // 计算属性
        filteredLogs,
        paginatedLogs,

        // 方法
        fetchOperationLogs,
        getLogDetail,
        deleteLog,
        batchDeleteLogs,
        exportLogs,
        updateFilters,
        resetFilters,
        setPagination,
        init
    }
})