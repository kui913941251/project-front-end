function setStorage(key, payload) {
  let data = JSON.stringify(payload)
  localStorage.setItem(key, data)
}

function getStorage(key) {
  let data = localStorage.getItem(key)
  data = data && JSON.parse(data)
  return data
}

function removeStorage(key) {
  localStorage.removeItem(key)
}


function clearStorage() {
  localStorage.clear()
}

const storageUtil = {
  setStorage,
  getStorage,
  removeStorage,
  clearStorage
}

export default storageUtil