import request from '@/utils/request'

export function apiGoodsList(data) {
  return request({
    url: '/mall/goods/list',
    method: 'post',
    data
  })
}

export function apiAdd(data) {
  return request({
    url: '/mall/goods/add',
    method: 'post',
    data
  })
}

export function apiDetail(data) {
  return request({
    url: '/mall/goods/detail',
    method: 'post',
    data
  })
}

export function apiUpdate(data) {
  return request({
    url: '/mall/goods/update',
    method: 'post',
    data
  })
}

export function apiDelete(data) {
  return request({
    url: '/mall/goods/delete',
    method: 'post',
    data
  })
}