class Account {
  // 取登入者身分別
  static get_userName() {
    var userName = localStorage.getItem('userName')
    return userName
  }
}
export default Account
