// src/api/adminApi.js
import request from "../util/request.js";

// 直接使用你的模拟数据
// const mockOperationLogs = {
//     code: 200,
//     message: "success",
//     data: {
//         records: [
//             {
//                 id: 1,
//                 userId: 1,
//                 username: "admin",
//                 module: "用户管理",
//                 operationType: "创建",
//                 description: "创建了新用户：张三",
//                 requestMethod: "POST",
//                 requestUrl: "/api/users",
//                 requestParams: '{"username":"zhangsan","role":"user"}',
//                 responseResult: '{"code":200,"message":"创建成功"}',
//                 ipAddress: "192.168.1.100",
//                 status: 1,
//                 errorMessage: null,
//                 duration: 150,
//                 createTime: "2024-01-15 10:30:00",
//                 updateTime: "2024-01-15 10:30:00"
//             },
//             {
//                 id: 2,
//                 userId: 1,
//                 username: "admin",
//                 module: "考试管理",
//                 operationType: "删除",
//                 description: "删除了考试：期末考试",
//                 requestMethod: "DELETE",
//                 requestUrl: "/api/exams/5",
//                 requestParams: null,
//                 responseResult: '{"code":200,"message":"删除成功"}',
//                 ipAddress: "192.168.1.100",
//                 status: 1,
//                 errorMessage: null,
//                 duration: 80,
//                 createTime: "2024-01-15 14:20:00",
//                 updateTime: "2024-01-15 14:20:00"
//             },
//             {
//                 id: 3,
//                 userId: 2,
//                 username: "teacher",
//                 module: "题库管理",
//                 operationType: "更新",
//                 description: "更新了题目内容",
//                 requestMethod: "PUT",
//                 requestUrl: "/api/questions/10",
//                 requestParams: '{"content":"更新后的题目"}',
//                 responseResult: '{"code":200,"message":"更新成功"}',
//                 ipAddress: "192.168.1.101",
//                 status: 1,
//                 errorMessage: null,
//                 duration: 120,
//                 createTime: "2024-01-15 16:45:00",
//                 updateTime: "2024-01-15 16:45:00"
//             },
//             {
//                 id: 4,
//                 userId: 3,
//                 username: "user",
//                 module: "权限管理",
//                 operationType: "查询",
//                 description: "查询用户权限列表",
//                 requestMethod: "GET",
//                 requestUrl: "/api/permissions",
//                 requestParams: null,
//                 responseResult: '{"code":200,"data":[...]}',
//                 ipAddress: "192.168.1.102",
//                 status: 0,
//                 errorMessage: "权限不足",
//                 duration: 50,
//                 createTime: "2024-01-14 09:15:00",
//                 updateTime: "2024-01-14 09:15:00"
//             },
//             {
//                 id: 5,
//                 userId: 1,
//                 username: "admin",
//                 module: "系统设置",
//                 operationType: "配置",
//                 description: "修改系统参数",
//                 requestMethod: "POST",
//                 requestUrl: "/api/system/config",
//                 requestParams: '{"theme":"dark","timeout":30}',
//                 responseResult: '{"code":200,"message":"配置成功"}',
//                 ipAddress: "192.168.1.100",
//                 status: 1,
//                 errorMessage: null,
//                 duration: 200,
//                 createTime: "2024-01-13 11:00:00",
//                 updateTime: "2024-01-13 11:00:00"
//             },
//             {
//                 id: 6,
//                 userId: 1,
//                 username: "admin",
//                 module: "用户管理",
//                 operationType: "创建",
//                 description: "创建了新用户：张三",
//                 requestMethod: "POST",
//                 requestUrl: "/api/users",
//                 requestParams: '{"username":"zhangsan","role":"user"}',
//                 responseResult: '{"code":200,"message":"创建成功"}',
//                 ipAddress: "192.168.1.100",
//                 status: 1,
//                 errorMessage: null,
//                 duration: 150,
//                 createTime: "2024-01-15 10:30:00",
//                 updateTime: "2024-01-15 10:30:00"
//             },
//             {
//                 id: 7,
//                 userId: 1,
//                 username: "admin",
//                 module: "用户管理",
//                 operationType: "创建",
//                 description: "创建了新用户：张三",
//                 requestMethod: "POST",
//                 requestUrl: "/api/users",
//                 requestParams: '{"username":"zhangsan","role":"user"}',
//                 responseResult: '{"code":200,"message":"创建成功"}',
//                 ipAddress: "192.168.1.100",
//                 status: 1,
//                 errorMessage: null,
//                 duration: 150,
//                 createTime: "2024-01-15 10:30:00",
//                 updateTime: "2024-01-15 10:30:00"
//             },
//             {
//                 id: 8,
//                 userId: 1,
//                 username: "admin",
//                 module: "用户管理",
//                 operationType: "创建",
//                 description: "创建了新用户：张三",
//                 requestMethod: "POST",
//                 requestUrl: "/api/users",
//                 requestParams: '{"username":"zhangsan","role":"user"}',
//                 responseResult: '{"code":200,"message":"创建成功"}',
//                 ipAddress: "192.168.1.100",
//                 status: 1,
//                 errorMessage: null,
//                 duration: 150,
//                 createTime: "2024-01-15 10:30:00",
//                 updateTime: "2024-01-15 10:30:00"
//             },
//             {
//                 id: 9,
//                 userId: 1,
//                 username: "admin",
//                 module: "用户管理",
//                 operationType: "创建",
//                 description: "创建了新用户：张三",
//                 requestMethod: "POST",
//                 requestUrl: "/api/users",
//                 requestParams: '{"username":"zhangsan","role":"user"}',
//                 responseResult: '{"code":200,"message":"创建成功"}',
//                 ipAddress: "192.168.1.100",
//                 status: 1,
//                 errorMessage: null,
//                 duration: 150,
//                 createTime: "2024-01-15 10:30:00",
//                 updateTime: "2024-01-15 10:30:00"
//             },
//             {
//                 id: 10,
//                 userId: 1,
//                 username: "admin",
//                 module: "用户管理",
//                 operationType: "创建",
//                 description: "创建了新用户：张三",
//                 requestMethod: "POST",
//                 requestUrl: "/api/users",
//                 requestParams: '{"username":"zhangsan","role":"user"}',
//                 responseResult: '{"code":200,"message":"创建成功"}',
//                 ipAddress: "192.168.1.100",
//                 status: 1,
//                 errorMessage: null,
//                 duration: 150,
//                 createTime: "2024-01-15 10:30:00",
//                 updateTime: "2024-01-15 10:30:00"
//             },
//             {
//                 id: 11,
//                 userId: 1,
//                 username: "admin",
//                 module: "用户管理",
//                 operationType: "创建",
//                 description: "创建了新用户：张三",
//                 requestMethod: "POST",
//                 requestUrl: "/api/users",
//                 requestParams: '{"username":"zhangsan","role":"user"}',
//                 responseResult: '{"code":200,"message":"创建成功"}',
//                 ipAddress: "192.168.1.100",
//                 status: 1,
//                 errorMessage: null,
//                 duration: 150,
//                 createTime: "2024-01-15 10:30:00",
//                 updateTime: "2024-01-15 10:30:00"
//             },
//             {
//                 id: 12,
//                 userId: 1,
//                 username: "admin",
//                 module: "用户管理",
//                 operationType: "创建",
//                 description: "创建了新用户：张三",
//                 requestMethod: "POST",
//                 requestUrl: "/api/users",
//                 requestParams: '{"username":"zhangsan","role":"user"}',
//                 responseResult: '{"code":200,"message":"创建成功"}',
//                 ipAddress: "192.168.1.100",
//                 status: 1,
//                 errorMessage: null,
//                 duration: 150,
//                 createTime: "2024-01-15 10:30:00",
//                 updateTime: "2024-01-15 10:30:00"
//             },
//             {
//                 id: 13,
//                 userId: 1,
//                 username: "admin",
//                 module: "用户管理",
//                 operationType: "创建",
//                 description: "创建了新用户：张三",
//                 requestMethod: "POST",
//                 requestUrl: "/api/users",
//                 requestParams: '{"username":"zhangsan","role":"user"}',
//                 responseResult: '{"code":200,"message":"创建成功"}',
//                 ipAddress: "192.168.1.100",
//                 status: 1,
//                 errorMessage: null,
//                 duration: 150,
//                 createTime: "2024-01-15 10:30:00",
//                 updateTime: "2024-01-15 10:30:00"
//             },
//             {
//                 id: 14,
//                 userId: 1,
//                 username: "admin",
//                 module: "用户管理",
//                 operationType: "创建",
//                 description: "创建了新用户：张三",
//                 requestMethod: "POST",
//                 requestUrl: "/api/users",
//                 requestParams: '{"username":"zhangsan","role":"user"}',
//                 responseResult: '{"code":200,"message":"创建成功"}',
//                 ipAddress: "192.168.1.100",
//                 status: 1,
//                 errorMessage: null,
//                 duration: 150,
//                 createTime: "2024-01-15 10:30:00",
//                 updateTime: "2024-01-15 10:30:00"
//             },
//         ],
//     }
// };
//
// const mockOperationLogDetail = {
//     code: 200,
//     message: "success",
//     data: {
//         id: 1,
//         userId: 1,
//         username: "admin",
//         module: "用户管理",
//         operationType: "创建",
//         description: "创建了新用户：张三",
//         requestMethod: "POST",
//         requestUrl: "/api/users",
//         requestParams: '{"username":"zhangsan","password":"123456","role":"user","email":"zhangsan@example.com","phone":"13800138000","status":1}',
//         responseResult: '{"code":200,"message":"创建成功","data":{"id":100,"username":"zhangsan"}}',
//         ipAddress: "192.168.1.100",
//         userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
//         status: 1,
//         errorMessage: null,
//         duration: 150,
//         createTime: "2024-01-15 10:30:00",
//         updateTime: "2024-01-15 10:30:00"
//     }
// };
//
// const mockDeleteResponse = {
//     code: 200,
//     message: "删除成功",
//     data: null
// };
//
// const mockBatchDeleteResponse = {
//     code: 200,
//     message: "批量删除成功",
//     data: {
//         deletedCount: 3,
//         failedIds: []
//     }
// };
//
// const mockSearchResponse = {
//     code: 200,
//     message: "success",
//     data: {
//         records: [
//             {
//                 id: 1,
//                 userId: 1,
//                 username: "admin",
//                 module: "用户管理",
//                 operationType: "创建",
//                 description: "创建了新用户：张三",
//                 status: 1,
//                 createTime: "2024-01-15 10:30:00"
//             },
//             {
//                 id: 6,
//                 userId: 1,
//                 username: "admin",
//                 module: "用户管理",
//                 operationType: "创建",
//                 description: "创建了新用户：李四",
//                 status: 1,
//                 createTime: "2024-01-14 09:20:00"
//             }
//         ],
//     }
// };
//
// const mockExportData = `
// id,username,module,operationType,description,status,createTime
// 1,admin,用户管理,创建,创建了新用户：张三,1,2024-01-15 10:30:00
// 2,admin,考试管理,删除,删除了考试：期末考试,1,2024-01-15 14:20:00
// 3,teacher,题库管理,更新,更新了题目内容,1,2024-01-15 16:45:00
// 4,user,权限管理,查询,查询用户权限列表,0,2024-01-14 09:15:00
// 5,admin,系统设置,配置,修改系统参数,1,2024-01-13 11:00:00
// `;
// // src/api/adminApi.js
// // 测试数据
//
// const adminApi = {
//     /**
//      * 获取操作日志列表 - 只返回原始数据，不做任何筛选和分页
//      */
//     getOperationLogs() {
//         return new Promise((resolve) => {
//             setTimeout(() => {
//                 console.log('📡 API: 获取操作日志（原始数据）');
//
//                 // 直接返回所有数据
//                 const response = {
//                     ...mockOperationLogs,
//                     data: {
//                         records: [...mockOperationLogs.data.records] // 返回完整数据
//                     }
//                 };
//
//                 console.log('📡 返回原始数据:', response.data.records.length, '条记录');
//                 resolve(response);
//             }, 300);
//         });
//     },
//
//     /**
//      * 获取操作日志详情 - 只返回详情数据
//      */
//     getOperationLogDetail(id) {
//         return new Promise((resolve) => {
//             setTimeout(() => {
//                 console.log('📡 API: 获取日志详情，ID:', id);
//
//                 // 从数据中查找
//                 const foundLog = mockOperationLogs.data.records.find(log => log.id === parseInt(id));
//
//                 const response = {
//                     code: 200,
//                     message: "success",
//                     data: foundLog || null
//                 };
//
//                 console.log('📡 返回详情数据:', response.data);
//                 resolve(response);
//             }, 200);
//         });
//     },
//
//     /**
//      * 导出操作日志 - 返回所有数据的CSV
//      */
//     exportOperationLogs() {
//         return new Promise((resolve) => {
//             setTimeout(() => {
//                 console.log('📡 API: 导出操作日志');
//
//                 // 创建CSV数据（导出所有数据）
//                 const headers = ['ID', '用户名', '模块', '操作类型', '描述', '请求方法', 'URL', 'IP地址', '状态', '耗时(ms)', '时间'];
//                 const data = mockOperationLogs.data.records.map(log => [
//                     log.id,
//                     log.username,
//                     log.module,
//                     log.operationType,
//                     `"${log.description}"`,
//                     log.requestMethod,
//                     `"${log.requestUrl}"`,
//                     log.ipAddress,
//                     log.status === 1 ? '成功' : '失败',
//                     log.duration,
//                     log.createTime
//                 ]);
//
//                 const csvContent = [
//                     headers.join(','),
//                     ...data.map(row => row.join(','))
//                 ].join('\n');
//
//                 const blob = new Blob(['\uFEFF' + csvContent], {
//                     type: 'text/csv;charset=utf-8;'
//                 });
//
//                 console.log('📡 导出所有数据:', mockOperationLogs.data.records.length, '条记录');
//                 resolve(blob);
//             }, 400);
//         });
//     },
//
//     /**
//      * 删除操作日志
//      */
//     deleteOperationLog(id) {
//         return new Promise((resolve) => {
//             setTimeout(() => {
//                 console.log('📡 API: 删除操作日志，ID:', id);
//
//                 const response = {
//                     code: 200,
//                     message: `成功删除操作日志 ${id}`,
//                     data: null
//                 };
//
//                 console.log('📡 删除响应:', response);
//                 resolve(response);
//             }, 200);
//         });
//     },
//
//     /**
//      * 批量删除操作日志
//      */
//     batchDeleteOperationLogs(data) {
//         return new Promise((resolve) => {
//             setTimeout(() => {
//                 console.log('📡 API: 批量删除操作日志，IDs:', data.ids);
//
//                 const response = {
//                     code: 200,
//                     message: `成功删除 ${data.ids.length} 条操作日志`,
//                     data: {
//                         deletedCount: data.ids.length,
//                         failedIds: []
//                     }
//                 };
//
//                 console.log('📡 批量删除响应:', response);
//                 resolve(response);
//             }, 300);
//         });
//     }
// }
//

const adminApi = {
    // 获取操作日志列表
    getOperationLogs(params) {
        // console("get",request.get('/admin/operation-logs', { params }))
        return request.get('/admin/operation-logs', { params })
    },

    // 获取操作日志详情
    getOperationLogDetail(id) {
        return request.get(`/admin/operation-logs/${id}`)
    },

    // 搜索操作日志
    searchOperationLogs(params) {
        return request.get('/admin/operation-logs/search', { params })
    },

    // 导出操作日志
    exportOperationLogs(params) {
        return request.get('/admin/operation-logs/export', {
            params,
            responseType: 'blob'
        })
    },

    // 删除操作日志
    deleteOperationLog(id) {
        return request.delete(`/admin/operation-logs/${id}`)
    },

    // 批量删除操作日志
    batchDeleteOperationLogs(ids) {
        return request.post('/admin/operation-logs/batch-delete', { ids })
    }
}

export default adminApi
