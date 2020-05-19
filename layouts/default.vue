<template>
  <div v-show="login_status" :class="{'nav-close':menuClose,'nav-open':menuOpen }" class="wrap" >
    <alertify/>
    <portal-target name="portalPopupPlace" slim/>
    <portal-target name="portalAlertPlace" slim/>
    <SideMenu :grade-mofify-pw="grade_mofifyPw" :grade_0 = "grade_0" :grade_1 = "grade_1" :grade_2= "grade_2" :grade_3 = "grade_3" :grade_4 = "grade_4"/>
    <div class="main">
      <div class="header">
        <div class="btn-switch" @click="changeMenu">
          <div class="icon-menu"/>
        </div>
        <div class="user-top-info">
          <div class="system-version">開發機</div>
          <fa :icon="['fas', 'user']"/>
          <div class="user-info">
            <h4>{{ login_name }}</h4>
            <p>({{ accountType[login_type] }})</p>
          </div>
        </div>
        <!-- <a @click="$store.commit('updateState', ['alertMsg', 'testttt'])">alert test</a>
        <a @click="isPopupOpen=true">PopupUse</a>
        <portal v-if="isPopupOpen" to="portalPopupPlace">
          <popup-msg :open="isPopupOpen" :pop-title="'Pop Title'">
            <div class="sms-popup">
              <p class="txt-left txt-orange">test test</p>
              <div>test</div>
              <div class="btn-wrap">
                <button class="green" @click="isPopupOpen=false">{{ $t('button.Confirm') }}</button>
              </div>
            </div>
          </popup-msg>
        </portal> -->
        <div class="top-function">
          <div class="btn-lang" @click="islangMenuOpen = !islangMenuOpen">
            <!-- <a href="#">繁中</a> -->
            <a>{{ lang }}</a>
            <ul :class="{show:islangMenuOpen}" class="lang-list" >
              <li v-for="(item, index) in langList" :key="index">
                <a
                  :class="{active:lang === item.code}"
                  @click="changeLang(item.code)"
                >{{ item.title }}</a>
              </li>
              <!-- <li><a href="#">繁體中文</a></li>
              <li><a href="#">简体中文</a></li>
              <li><a href="#">English</a></li> -->
            </ul>
          </div>
          <button class="btn-logout purple" @click="logout">
            登出
            <!-- {{ grade_0 }} -->
          </button>
        </div>
        <!-- end top-funciton -->
      </div>
      <nuxt />
    </div>
  </div>
</template>
<script>
import alertify from '~/components/alert/Alertify'
import SideMenu from '~/components/SideMenu.vue'
import UserLogin from '~/plugins/js/userlogin'
import Project from '~/plugins/js/project'
export default {
  components: {
    SideMenu,
    alertify
  },
  data() {
    return {
      isPopupOpen: false,
      login_status: false,
      login_name: '', //暱稱
      login_type: '', //角色(0:系統管理員 1:專案負責人 2:運營負責人 3:報表統計處理者)
      accountType: {
        0: '系統管理員',
        1: '專案負責人',
        2: '運營',
        3: '一般使用者',
        4: '開發者'
      },
      lang: '繁中',
      langList: [
        { code: 'zh_Hant', title: '繁體中文' },
        { code: 'zh_Hans', title: '简体中文' },
        { code: 'en', title: 'English' }
      ], //語系
      islangMenuOpen: false,
      menuClose: false,
      menuOpen: false,

      user_grade: 0, //登入者權限等級
      grade_mofifyPw: false, //帳號管理-修改密碼
      grade_0: false, //系統管理員身分(user_grade: 0)
      grade_1: false, //專案負責人身分(user_grade: 1)
      grade_2: false, //運營負責人身分(user_grade: 2)
      grade_3: false, //報表統計處理者身分(user_grade: 3)
      grade_4: false //全部權限身分(user_grade: 4)

      //sideMenu active class
      // activeProject: false,
      // activeAccount: false,
      // activeTask: false,
      // activeList: false
      // activeReport: false,
      // activeVersion: false
    }
  },
  async beforeMount() {
    await this.LoginStatus()
    await this.isToken()
  },
  methods: {
    changeMenu() {
      if (document.body.scrollWidth > 768) {
        this.menuClose = !this.menuClose
        this.menuOpen = false
      }
      if (document.body.scrollWidth < 768) {
        this.menuOpen = !this.menuOpen
        this.menuClose = false
      }
    },
    async LoginStatus() {
      // 判斷是否登入
      // let satus = parseInt(localStorage.getItem('KEY_OF_GET_LOGIN_TOKEN'))
      // if (satus !== 0) {
      //   this.login_status = false
      //   // 轉跳到登入頁
      //   this.$router.push('/login')
      // } else {
      //   this.login_status = true
      // }
      if (process.client) {
        this.login_status = UserLogin.isLogin()
        this.user_grade = parseInt(window.localStorage.getItem('login_type'))
      }
      // this.isLogin = window.localStorage.getItem('KEY_OF_GET_LOGIN_TOKEN') ? true : false
      this.login_name = Project.getName()
      this.login_type = Project.getLogin_type()
    },
    async isToken() {
      let routerName = location.href
      routerName = routerName.substr(routerName.lastIndexOf('/') + 1)

      if (!this.login_status) {
        // this.$router.push('/')
        if (
          routerName === 'project' ||
          routerName === 'taskSetting' ||
          routerName === 'taskList' ||
          routerName === 'report' ||
          routerName === 'version'
        ) {
          // alert('您尚未登入 !')
          this.$store.commit('updateState', ['alertMsg', '您尚未登入 !'])
          // this.$router.push('/login')
        }
      } else if (this.user_grade === 0) {
        console.log(this.user_grade)
        //系統管理員身分(user_grade: 0)
        this.grade_mofifyPw = true
        this.grade_0 = true

        // this.activeProject = true
        // this.activeAccount = false
        // this.activeTask = false
        // this.activeList = false
        // this.activeReport = false
        // this.activeVersion = false

        if (
          routerName === 'taskSetting' ||
          routerName === 'taskList' ||
          routerName === 'report' ||
          routerName === 'version'
        ) {
          // alert('您的身分別沒有權限連結到此頁面 !')
          this.$store.commit('updateState', ['alertMsg', '您的身分別沒有權限連結到此頁面 !'])
          this.$router.push('/project')
        }
      } else if (this.user_grade === 1) {
        //專案負責人身分(user_grade: 1)
        this.grade_mofifyPw = true
        this.grade_1 = true

        // this.activeProject = true
        // this.activeClass = true
        if (routerName === 'taskSetting') {
          // alert('您的身分別沒有權限連結到此頁面 !')
          this.$store.commit('updateState', ['alertMsg', '您的身分別沒有權限連結到此頁面 !'])
          this.$router.push('/project')
        }
      } else if (this.user_grade === 2) {
        //運營負責人身分(user_grade: 2)
        this.grade_mofifyPw = true
        this.grade_2 = true
        // this.activeClass = true
        // this.activeTask = true

        if (routerName === 'project') {
          // alert('您的身分別沒有權限連結到此頁面 !')
          this.$store.commit('updateState', ['alertMsg', '您的身分別沒有權限連結到此頁面 !'])
          this.$router.push('/taskSetting')
        }
      } else if (this.user_grade === 3) {
        //報表統計處理者身分(user_grade: 3)
        this.grade_mofifyPw = true
        this.grade_3 = true

        // this.activeList = true
        // this.activeClass = true
        if (routerName === 'project' || routerName === 'taskSetting') {
          // alert('您的身分別沒有權限連結到此頁面 !')
          this.$store.commit('updateState', ['alertMsg', '您的身分別沒有權限連結到此頁面 !'])
          this.$router.push('/taskList')
        }
      } else if (this.user_grade === 4) {
        //全部權限身分(user_grade: 4)
        this.grade_mofifyPw = true
        this.grade_4 = true

        // this.activeProject = true
      }
    },
    logout() {
      UserLogin.logout()
      this.$router.push('/login')
    },
    changeLang(code) {
      this.$i18n.locale = code
      // console.log('i18n.locale')
      console.log(this.$i18n.locale)
      // console.log('i18n.locale')
      // console.log(code)
      // console.log(typeof code)
      if (code === 'zh_Hant') {
        this.lang = '繁中'
      } else if (code === 'zh_Hans') {
        this.lang = '简中'
      } else if (code === 'en') {
        this.lang = 'EN'
      }
    }
  }
}
</script>

<style lang="scss">
@import '~/scss/libs/_setting.scss';
@import '~/scss/libs/_mixins.scss';
@import '~/scss/libs/_font.scss';
@import '~/scss/libs/_normalize.scss';

@import '~/scss/common/_global.scss';
@import '~/scss/common/_loading.scss';
@import '~/scss/common/_button.scss';
@import '~/scss/common/_alert.scss';

@import '~/scss/layout/_layout.scss';
@import '~/scss/layout/_header.scss';
@import '~/scss/layout/_nav.scss';

@import '~/scss/common/_search.scss';
@import '~/scss/common/_table.scss';
@import '~/scss/common/_pagination.scss';
#__nuxt,
#__layout,
.wrap {
  height: 100%;
}
</style>
