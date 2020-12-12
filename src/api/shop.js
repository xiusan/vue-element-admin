import request from '@/utils/request'
// 查询
export function fetchList(query) {
  return request({
    url: '/api/getAllItem',
    method: 'get',
    params: query,
    baseURL: process.env.VUE_APP_BASE_API_V2 // '/api--'
  })

}
// 添加 这里会出现问题  java.io.EOFException: Unexpected EOF read on the socket  是因为
// mock数据消费的body数据引起的  注释掉mock-server.js -->app.use(bodyParser.json()) 即可
export function addUser(data) {
  return request({
    url: '/api/addUser',
    method: 'post',
    data,
    baseURL: process.env.VUE_APP_BASE_API_V2 // '/api'
  })
}
// 更新用户
export function updateUser(data) {
  return request({
    url: '/api/addUser',
    method: 'post',
    data,
    baseURL: process.env.VUE_APP_BASE_API_V2 // '/api'
  })
}
// 删除用户
export function deleteUser(userId) {
  return request({
    url: '/api/delete/' + userId,
    method: 'get',
    baseURL: process.env.VUE_APP_BASE_API_V2 // '/api'
  })
}
