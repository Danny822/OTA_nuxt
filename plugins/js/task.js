class task {
  //  存取新增任務狀態進localStorage
  static addTask(status) {
    localStorage.setItem('isAddTask', status)
  }

  //  存取新增任務機種進localStorage
  static addProject(project) {
    localStorage.setItem('AddTask_project', project)
  }
}
export default task
