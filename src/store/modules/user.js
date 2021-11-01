import { apiInfo } from '@/api/system/user'
import storageUtil from '@/utils/storageUtil'

const getDefaultState = () => {
  return {
    userInfo: null,
  }
}

const state = getDefaultState()

const mutations = {
  SET_USER: (state, userInfo) => {
    state.userInfo = userInfo
  },
}

const actions = {
  logout({ commit }) {
    commit('SET_USER', null)
  },
  async updateInfo({ commit }) {
    let res = await apiInfo()
    commit('SET_USER', res.data)
    storageUtil.setStorage("userInfo", res.data)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
