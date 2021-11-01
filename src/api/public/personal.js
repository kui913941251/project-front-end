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
    url: '/personal/importAvatar',
    method: 'post',
    data
  })
}

export function apiChangeAvatar(data) {
  return request({
    url: '/personal/changeAvatar',
    method: 'post',
    data
  })
}
