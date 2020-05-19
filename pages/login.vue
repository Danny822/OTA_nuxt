<template>
  <div class="login-wrap">
    <div class="login-content">
      <div class="login-box">
        <div class="logo-webtool">
          <img src="~/static/images/logo-webtool.png" alt="" >
        </div>
        <h2>OTA Backend</h2>
        <div class="input-wrap">
          <div class="input-item">
            <fa :icon="['fas', 'user']" class="fa-sm" />
            <input v-model="userName" class="input-receiver" type="text" placeholder="請輸入使用者帳號" >
          </div>
          <div class="input-item">
            <!-- <i class="fas fa-key"/> -->
            <fa :icon="['fas', 'key']" class="fa-sm" />
            <input v-model="password" type="password" placeholder="請輸入密碼" @keyup.enter="clickLogin">
          </div>
          <div v-show="isError" class="txt-error">
            <fa :icon="['fas', 'times']" class="fa-sm" />
            請輸入正確的帳號及密碼!
          </div>
        </div>
        <!-- end input-wrap -->
        <div class="btn-wrap">
          <a @click="clickLogin">{{ $t('login.LogIn') }}</a>
        </div>
        <!-- end btn-wrap -->
      </div>
      <!-- end login-box -->
    </div>
    <!-- end login-content -->
    <div class="login-footer">
      <p>© 2020 IGS. All Rights Reserved | Design by ACD_RD3</p>
    </div>
  </div>
  <!-- end login-wrap -->
</template>

<script>
import UserLogin from '~/plugins/js/userlogin'
import axios from 'axios'
import { API } from '~/constants/ark_oauth'
export default {
  layout: 'loginLayout',
  data() {
    return {
      userName: '', //帳號
      password: '', //密碼
      login_data: [], //登入資訊
      isError: false,

      /**登入驗證**/
      userNameError: false,
      userName_errorMsg: '',
      passwordError: false,
      password_errorMsg: '',
      login_status: false
    }
  },
  watch: {
    userName: {
      handler: 'clearInfo',
      deep: true
    },
    password: {
      handler: 'clearInfo',
      deep: true
    }
  },
  methods: {
    // 檢查token是否過期
    checkToken(api_status) {
      // let api_status = parseInt(localStorage.getItem('api_status'))
      // return api_status
      if (api_status === 4) {
        UserLogin.logout()
        this.$router.push('/login')
      }
    },
    async clickLogin() {
      //帳號密碼規則
      let login_reg = /^[a-zA-Z0-9]{8,12}$/

      if (!login_reg.test(this.userName)) {
        this.isError = true
        // this.userName_errorMsg = '請輸入8~12碼英數組成的密碼'
      }
      if (!login_reg.test(this.password)) {
        this.isError = true
        // this.password_errorMsg = '請輸入8~12碼英數組成的密碼'
      }
      if (login_reg.test(this.userName) && login_reg.test(this.password)) {
        await this.get_login(this.userName, this.password)
      }
    },
    // 取得login資訊
    async get_login(userName, password) {
      $nuxt.$loading.loading = true
      try {
        let res = await axios.post(
          API.Host + ':' + API.Port + '/auth/login',
          {
            user: userName,
            pass: password
          },
          { timeout: 1000 * 60 * 2 }
        )
        this.login_data = res.data
        let login_status = this.login_data.status
        let login_uid = this.login_data.uid
        let login_token = this.login_data.token
        let login_name = this.login_data.name
        let login_type = this.login_data.type
        console.log(login_status)
        console.log(typeof login_status)

        if (this.apiStatus !== 0) {
          this.$store.commit('updateState', ['alertMsg', res.data.message])
        }
        //token失效有誤時轉跳到登入頁
        this.apiStatus = res.data.status
        this.checkToken(this.apiStatus)

        //判斷登入帳密是否正確才存取登入狀態資訊到localstorage
        if (login_status !== 0) {
          this.isError = true
        } else {
          //存取登入狀態資訊
          this.saveLogin(userName, login_status, login_uid, login_token, login_name, login_type)
        }

        // 判斷是否登入,登入token為true
        let token = UserLogin.isLogin()
        // 如果已登入
        if (token && login_type === 0) {
          // 系統管理員身分轉跳到機種管理頁
          this.$router.push('/project')
        } else if (token && login_type === 1) {
          // 專案負責人身分轉跳到機種管理頁
          this.$router.push('/project')
        } else if (token && login_type === 2) {
          // 運營負責人身分轉跳到任務設定頁
          this.$router.push('/taskSetting')
        } else if (token && login_type === 3) {
          // 報表統計處理者身分轉跳到任務清單頁
          this.$router.push('/taskList')
        } else if (token && login_type === 4) {
          // 全部權限轉跳到機種管理頁
          this.$router.push('/project')
        }
        console.log(res.data.message)
      } catch (error) {
        // 登入有誤轉跳到登入頁
        // this.$router.push('/')
        this.$store.commit('updateState', ['alertMsg', '伺服器連線異常'])
        this.isError = true
      }
      $nuxt.$loading.loading = false
    },
    saveLogin(userName, login_status, login_uid, login_token, login_name, login_type) {
      UserLogin.saveToken(userName, login_status, login_uid, login_token, login_name, login_type)
    },
    clearInfo() {
      if (this.userName === '' || this.password === '') {
        this.isError = false
      }
    }
  }
}
</script>

<style lang="scss">
@import '~/scss/pages/_login.scss';
</style>
