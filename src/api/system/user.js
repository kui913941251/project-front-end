import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/system/user/login',
    method: 'post',
    data
  })
}

export function apiUserList(data) {
  return request({
    url: '/system/user/list',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/system/user/logout',
    method: 'post'
  })
}
 