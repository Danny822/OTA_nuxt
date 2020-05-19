<template>
  <div class="side">
    <a href="#" class="logo-wrap">
      <img src="~static/images/logo-webtool.png" alt="" >
      <p>OTA Backend</p>
    </a>
    <ul class="nav">
      <li :class="{active:activeProject}" @click="toProject">
        <router-link v-show="grade_0 || grade_1 || grade_4" to="/project">
          <span><fa :icon="['fas', 'desktop']" /></span>
          <span>機種管理</span>
          <!-- <p>{{ grade_0 }}</p> -->
        </router-link>
      </li>
      <li :class="{active:activeAccount}" @click="toAccount">
        <router-link v-show="grade_0 || grade_4" to="/account">
          <span><fa :icon="['fas', 'user-cog']"/></span>
          <span>帳號管理</span>
        </router-link>
      </li>
      <li :class="{active:activeTask}" @click="toTaskSetting">
        <router-link v-show="grade_2 || grade_4" to="/taskSetting">
          <span><fa :icon="['fas', 'file-medical']" /></span>
          <span>任務設定</span>
        </router-link>
      </li>
      <li :class="{active:activeList}" @click="toList">
        <router-link v-show="grade_1 || grade_2 || grade_3 || grade_4" to="/taskList">
          <span><fa :icon="['fas', 'list-ul']" /></span>
          <span>任務清單</span>
        </router-link>
      </li>
      <li :class="{active:activeReport}" @click="toReport">
        <router-link v-show="grade_1 || grade_2 || grade_3 || grade_4" to="/report">
          <span><fa :icon="['fas', 'chart-bar']" /></span>
          <span>統計頁面</span>
        </router-link>
      </li>
      <li :class="{active:activeVersion}" @click="toVersion">
        <router-link v-show="grade_1 || grade_2 || grade_3 || grade_4" to="/version">
          <span><fa :icon="['fas', 'history']" /></span>
          <span>版本紀錄</span>
        </router-link>
      </li>
      <li :class="{active:activeModifypw}" @click="toModifypw">
        <router-link v-show="grade_0 || grade_1 || grade_2 || grade_3 || grade_4" to="/modifypw">
          <span><fa :icon="['fas', 'key']" /></span>
          <span>修改密碼</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>
<script>
import UserLogin from '~/plugins/js/userlogin'
export default {
  props: {
    //帳號管理-修改密碼
    gradeMofifyPw: {
      type: Boolean,
      required: true
    },
    //系統管理員身分(user_grade: 0)
    grade_0: {
      type: Boolean,
      required: true
    },
    //專案負責人身分(user_grade: 1)
    grade_1: {
      type: Boolean,
      required: true
    },
    //運營負責人身分(user_grade: 2)
    grade_2: {
      type: Boolean,
      required: true
    },
    //報表統計處理者身分(user_grade: 3)
    grade_3: {
      type: Boolean,
      required: true
    },
    //全部權限身分(user_grade: 4)
    grade_4: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      activeProject: false,
      activeAccount: false,
      activeTask: false,
      activeList: false,
      activeReport: false,
      activeVersion: false,
      activeModifypw: false,
      user_grade: 0 //登入者權限等級
    }
  },
  watch: {
    $route(currentPath) {
      if (currentPath.path === '/taskList') {
        this.activeProject = false
        this.activeAccount = false
        this.activeTask = false
        this.activeList = true
        this.activeReport = false
        this.activeVersion = false
        this.activeModifypw = false
      }
    }
  },
  // mounted() {
  //   this.reloadUrl()
  // },
  beforeMount() {
    this.LoginStatus()
    this.reloadUrl()
  },
  methods: {
    LoginStatus() {
      this.user_grade = parseInt(localStorage.getItem('login_type')) //取得登入身分別 (0:系統管理員 1:專案負責人 2:運營負責人 3:報表統計處理者)
      // 判斷登入身分 登入後 menu的樣式
      if (this.user_grade === 0 || this.user_grade === 1 || this.user_grade === 4) {
        this.activeProject = true
      } else if (this.user_grade === 2) {
        this.activeTask = true
      } else if (this.user_grade === 3) {
        this.activeList = true
      }
    },
    reloadUrl() {
      let routerName = location.href
      routerName = routerName.substr(routerName.lastIndexOf('/') + 1)
      if (routerName === 'project') {
        this.activeProject = true
        this.activeAccount = false
        this.activeTask = false
        this.activeList = false
        this.activeReport = false
        this.activeVersion = false
        this.activeModifypw = false
      } else if (routerName === 'account') {
        this.activeProject = false
        this.activeAccount = true
        this.activeTask = false
        this.activeList = false
        this.activeReport = false
        this.activeVersion = false
        this.activeModifypw = false
      } else if (routerName === 'taskSetting') {
        this.activeProject = false
        this.activeAccount = false
        this.activeTask = true
        this.activeList = false
        this.activeReport = false
        this.activeVersion = false
        this.activeModifypw = false
      } else if (routerName === 'taskList') {
        this.activeProject = false
        this.activeAccount = false
        this.activeTask = false
        this.activeList = true
        this.activeReport = false
        this.activeVersion = false
        this.activeModifypw = false
      } else if (routerName === 'report') {
        this.activeProject = false
        this.activeAccount = false
        this.activeTask = false
        this.activeList = false
        this.activeReport = true
        this.activeVersion = false
        this.activeModifypw = false
      } else if (routerName === 'version') {
        this.activeProject = false
        this.activeAccount = false
        this.activeTask = false
        this.activeList = false
        this.activeReport = false
        this.activeVersion = true
        this.activeModifypw = false
      } else if (routerName === 'modifypw') {
        this.activeProject = false
        this.activeAccount = false
        this.activeTask = false
        this.activeList = false
        this.activeReport = false
        this.activeVersion = false
        this.activeModifypw = true
      }
    },
    toProject() {
      console.log('toProject')
      this.activeProject = true
      this.activeAccount = false
      this.activeTask = false
      this.activeList = false
      this.activeReport = false
      this.activeVersion = false
      this.activeModifypw = false
    },
    toAccount() {
      console.log('toAccount')
      this.activeProject = false
      this.activeAccount = true
      this.activeTask = false
      this.activeList = false
      this.activeReport = false
      this.activeVersion = false
      this.activeModifypw = false
    },
    toTaskSetting() {
      console.log('toTaskSetting')
      this.activeProject = false
      this.activeAccount = false
      this.activeTask = true
      this.activeList = false
      this.activeReport = false
      this.activeVersion = false
      this.activeModifypw = false
    },
    toList() {
      console.log('totaskList')
      this.activeProject = false
      this.activeAccount = false
      this.activeTask = false
      this.activeList = true
      this.activeReport = false
      this.activeVersion = false
      this.activeModifypw = false
    },
    toReport() {
      console.log('toReport')
      this.activeProject = false
      this.activeAccount = false
      this.activeTask = false
      this.activeList = false
      this.activeReport = true
      this.activeVersion = false
      this.activeModifypw = false
    },
    toVersion() {
      console.log('toVersion')
      this.activeProject = false
      this.activeAccount = false
      this.activeTask = false
      this.activeList = false
      this.activeReport = false
      this.activeVersion = true
      this.activeModifypw = false
    },
    toModifypw() {
      console.log('toModifypw')
      this.activeProject = false
      this.activeAccount = false
      this.activeTask = false
      this.activeList = false
      this.activeReport = false
      this.activeVersion = false
      this.activeModifypw = true
    }
  }
}
</script>
