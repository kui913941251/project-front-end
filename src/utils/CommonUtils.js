import cryptojs from 'crypto-js'
import lodash from 'lodash'

export function toSha256(value) {
  return cryptojs.SHA256(value).toString()
}

export function cloneDeep(value) {
  return lodash.cloneDeep(value)
}

export default {
  toSha256,
  cloneDeep,
}
