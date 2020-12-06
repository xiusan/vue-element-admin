import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/api/getAllUser',
    method: 'get',
    params: { query },
    baseURL: '/api'
  })
}
