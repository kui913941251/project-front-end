import request from '@/utils/request'

export function apiRegister(data) {
  return request({
    url: '/system/user/register',
    method: 'post',
    data
  })
}

export function login(data) {
  return request({
    url: '/system/user/login',
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

export function apiUserList(data) {
  return request({
    url: '/system/user/list',
    method: 'post',
    data
  })
}

export function apiAdd(data) {
  return request({
    url: '/system/user/add',
    method: 'post',
    data
  })
}

export function apiUpdate(data) {
  return request({
    url: '/system/user/update',
    method: 'post',
    data
  })
}

export function apiDelete(data) {
  return request({
    url: '/system/user/delete',
    method: 'post',
    data
  })
}

 