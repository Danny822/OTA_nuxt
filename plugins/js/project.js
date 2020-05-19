class Project {
  static getUid() {
    var login_uid = localStorage.getItem('login_uid')
    return login_uid
  }

  static getToken() {
    var login_token = localStorage.getItem('login_token')
    return login_token
  }
  // 取登入者帳號
  static getUserName() {
    var userName = localStorage.getItem('userName')
    return userName
  }
  // 取登入者名稱
  static getName() {
    var login_name = localStorage.getItem('login_name')
    return login_name
  }

  //  存取機種代碼進localStorage
  static saveToken(Project) {
    localStorage.setItem('Project', Project)
  }
  // 取機種代碼
  static getProjectToken() {
    var Project_token = localStorage.getItem('Project')
    return Project_token
  }

  // 取使用者序號
  // static getProjectToken() {
  //   var Project_token = localStorage.getItem('Project')
  //   return Project_token
  // }

  // 取登入者身分別
  static getLogin_type() {
    var login_type = localStorage.getItem('login_type')
    return login_type
  }
}
export default Project
