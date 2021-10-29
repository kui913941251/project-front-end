/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}


export function passwordValidate(value) {
  let reg = /^[A-Za-z0-9]{6,16}$/
  return reg.test(value)
}