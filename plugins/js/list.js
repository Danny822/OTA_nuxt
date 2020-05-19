class list {
  // 判斷是否從任務設定轉跳過來
  static isAddTask() {
    var isAddTask = localStorage.getItem('isAddTask') ? true : false
    return isAddTask
  }

  //  取從任務設定轉跳過來的新增任務機種
  static get_AddProject() {
    var AddTask_project = localStorage.getItem('AddTask_project')
    return AddTask_project
  }

  //  存取簽核狀態進localStorage
  static signingStatus(num) {
    localStorage.setItem('signingStatus', num)
  }

  //  取簽核狀態
  static get_signingStatus() {
    var signingStatus = localStorage.getItem('signingStatus')
    return signingStatus
  }
}
export default list
