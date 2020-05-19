class UserLogin {
  // 判斷是否登入
  static isLogin() {
    // var UserLogin = localStorage.getItem('KEY_OF_GET_LOGIN_TOKEN') ? true : false
    // var UserLogin = localStorage.getItem('KEY_OF_GET_LOGIN_TOKEN')
    let satus = parseInt(localStorage.getItem('KEY_OF_GET_LOGIN_TOKEN'))
    if (satus === 0) {
      var UserLogin = true
    } else {
      var UserLogin = false
    }
    return UserLogin
  }

  //  存取登入狀態進localStorage
  static saveToken(userName, login_status, login_uid, login_token, login_name, login_type) {
    localStorage.setItem('userName', userName)
    localStorage.setItem('KEY_OF_GET_LOGIN_TOKEN', login_status)
    localStorage.setItem('login_uid', login_uid)
    localStorage.setItem('login_token', login_token)
    localStorage.setItem('login_name', login_name)
    localStorage.setItem('login_type', login_type)
  }

  //  登出移除LOGIN_TOKEN
  static logout() {
    localStorage.removeItem('userName')
    localStorage.removeItem('KEY_OF_GET_LOGIN_TOKEN')
    localStorage.removeItem('login_uid')
    localStorage.removeItem('login_token')
    localStorage.removeItem('login_name')
    localStorage.removeItem('login_type')
    localStorage.removeItem('Project')
    localStorage.removeItem('isAddTask')
    localStorage.removeItem('AddTask_project')
    localStorage.removeItem('signingStatus')
  }
}
export default UserLogin
