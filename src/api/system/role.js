import request from '@/utils/request'

export function apiRoleList(data) {
  return request({
    url: '/system/role/list',
    method: 'post',
    data
  })
}

export function apiAdd(data) {
  return request({
    url: '/system/role/add',
    method: 'post',
    data
  })
}

export function apiDetail(data) {
  return request({
    url: '/system/role/detail',
    method: 'post',
    data
  })
}

export function apiUpdate(data) {
  return request({
    url: '/system/role/update',
    method: 'post',
    data
  })
}

export function apiDelete(data) {
  return request({
    url: '/system/role/delete',
    method: 'post',
    data
  })
}
