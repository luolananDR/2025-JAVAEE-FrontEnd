import request from '../util/request.js'

export const questionApi = {

    // 获取每日一题
    getDailyQuestion() {
        return request.get('/wrong-question/answer/random')
    },
}

// 模拟题目数据

// 模拟每日一题数export const mockDailyQuestion = {
//     code: 200,
//     message: "success",
//     data: {
//         id: 5,
//         questionType: 1,
//         content: "今天是每日一题：光的速度是多少？",
//         difficulty: 2,
//         subjectId: 3,
//         chapterId: 5,
//         options: [
//             { key: "A", text: "3×10⁸ m/s" },
//             { key: "B", text: "3×10⁵ m/s" },
//             { key: "C", text: "3×10¹⁰ m/s" },
//             { key: "D", text: "3×10³ m/s" }
//         ],
//         correctAnswer: "A",
//         explanation: "光在真空中的速度是3×10⁸米/秒。",
//         createTime: "2024-01-15 00:00:00",
//         isAnswered: false
//     }
// };
//
//
// // 模拟接口响应函数
// export const questionApi = {
//     // 获取每日一题
//     getDailyQuestion() {
//         return new Promise((resolve) => {
//             setTimeout(() => {
//                 resolve(mockDailyQuestion.data);
//             }, 200);
//         });
//     },
// };据

