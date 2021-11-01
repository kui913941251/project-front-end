import request from '@/utils/request'

export function apiInfo(data) {
  return request({
    url: '/personal/userInfo',
    method: 'post',
    data
  })
}

export function apiImport(data) {
  return request({
    url: '/personal/import',
    method: 'post',
    data
  })
}
