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
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
