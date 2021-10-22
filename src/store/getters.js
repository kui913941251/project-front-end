const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.userInfo && state.user.userInfo.token,
  userInfo: state => state.user.userInfo
}
export default getters
