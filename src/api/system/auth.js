import request from '@/utils/request'

export function apiAuthTree(data) {
  return request({
    url: '/system/auth/tree',
    method: 'post',
    data
  })
}

export function apiAdd(data) {
  return request({
    url: '/system/auth/add',
    method: 'post',
    data
  })
}

export function apiUpdate(data) {
  return request({
    url: '/system/auth/update',
    method: 'post',
    data
  })
}

export function apiDelete(data) {
  return request({
    url: '/system/auth/delete',
    method: 'post',
    data
  })
}