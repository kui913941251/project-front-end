const cryptojs = require('crypto-js')

function toSha256(value) {
  return cryptojs.SHA256(value).toString()
}

module.exports = {
  toSha256,
}