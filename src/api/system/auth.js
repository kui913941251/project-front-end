import request from '@/utils/request'

export function apiAuthTree(data) {
  return request({
    url: '/system/auth/tree',
    method: 'post',
    data
  })
}