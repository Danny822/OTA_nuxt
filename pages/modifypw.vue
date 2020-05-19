<template>
  <div class="content">
    <div class="content-header">
      <h2>修改密碼</h2>
    </div>
    <div class="modify-pw-wrap">
      <ul class="list-wrap">
        <li>
          <div class="title">帳號</div>
          <div class="detail">{{ userName }}</div>
        </li>
        <li>
          <div class="title">名稱</div>
          <div class="detail">{{ loginName }}</div>
        </li>
        <li>
          <div class="title">目前密碼</div>
          <div class="detail"><input v-model="pass" type="password" placeholder="請輸入您的目前密碼"></div>
        </li>
        <li>
          <div class="title">新密碼</div>
          <div class="detail"><input v-model="new_pass" type="password" placeholder="請輸入您的新密碼"></div>
        </li>
        <li>
          <div class="title">確認密碼</div>
          <div class="detail"><input v-model="re_pass" type="password" placeholder="再次輸入您的新密碼"></div>
        </li>
        <li>
          <div class="title">設定角色</div>
          <div class="detail">{{ accountType[loginType] }}</div>
        </li>
      </ul>
      <p v-if="modify_pass_Error" class="txt-error">
        <fa :icon="['fas', 'times']" class="fa-sm" />
        密碼請輸入8~12個英數字元 !
      </p>
      <p v-if="modify_repass_Error" class="txt-error">
        <fa :icon="['fas', 'times']" class="fa-sm" />
        確認密碼與新密碼不相同，請再次確認 !
      </p>
      <div class="btn-wrap">
        <button class="gray" @click="modifyCancel">清除設定</button>
        <button @click="modifyPass">確認</button>
      </div>
    </div>    
  </div>
</template>
<script>
import UserLogin from '~/plugins/js/userlogin'
import Project from '~/plugins/js/project'
// import Account from '~/plugins/js/account'
import axios from 'axios'
import { API } from '~/constants/ark_oauth'
export default {
  data() {
    return {
      /***修改密碼***/
      loginId: '', //登入uid
      loginToken: '', //登入token
      loginType: '', //角色(0:系統管理員 1:專案負責人 2:運營負責人 3:報表統計處理者)
      accountType: {
        0: '系統管理員',
        1: '專案負責人',
        2: '運營',
        3: '一般使用者',
        4: '開發者'
      },
      userName: '', //登入帳號
      loginName: '', //登入名稱
      pass: '', //目前密碼
      new_pass: '', //新密碼
      re_pass: '', //再次密碼

      /***修改密碼欄位驗證***/
      modify_pass_Error: false, //修改密碼錯誤訊息顯示
      // modify_newpass_Error: false, //修改新密碼錯誤訊息顯示
      modify_repass_Error: false //修改新再次密碼錯誤訊息顯示
      // apiStatus: 0 //呼叫 api status
    }
  },
  watch: {},
  beforeMount() {
    this.getStorage()
  },
  methods: {
    // 檢查token是否過期
    // checkToken(apiStatus) {
    //   // let apiStatus = parseInt(localStorage.getItem('apiStatus'))
    //   // return apiStatus
    //   if (apiStatus === 4) {
    //     UserLogin.logout()
    //     this.$router.push('/login')
    //   }
    // },
    getStorage() {
      //取得localStorage的資訊
      this.loginId = Project.getUid()
      this.loginToken = Project.getToken()
      this.loginName = Project.getName()
      this.userName = Project.getUserName()
      this.loginType = Project.getLogin_type()
    },

    // 密碼規則驗證
    async modifyPass() {
      //帳號密碼規則
      let modifyreg = /^[a-zA-Z0-9]{8,12}$/
      if (!modifyreg.test(this.pass)) {
        this.modify_pass_Error = true
        // this.modify_pass_errorMsg = '請輸入8~12碼英數組成的密碼'
      }
      if (!modifyreg.test(this.new_pass)) {
        this.modify_pass_Error = true
        // this.modify_newpass_errorMsg = '請輸入8~12碼英數組成的密碼'
      }
      if (this.new_pass !== this.re_pass) {
        this.modify_repass_Error = true
        // this.modify_repass_errorMsg = '與新密碼不相同，請再次確認 !'
      }
      if (modifyreg.test(this.pass) && modifyreg.test(this.new_pass) && this.new_pass === this.re_pass) {
        await this.modifyPw()
        // 清空
        this.clear()
      }
    },
    // 清空
    clear() {
      this.pass = ''
      this.new_pass = ''
      this.re_pass = ''
      this.modify_pass_Error = ''
      this.modify_repass_Error = ''
    },
    // 取消修改密碼
    modifyCancel() {
      // 清空
      this.clear()
    },
    // 修改密碼API
    async modifyPw() {
      $nuxt.$loading.loading = true
      try {
        let res = await axios.post(
          API.Host + ':' + API.Port + '/auth/password',
          {
            uid: this.loginId,
            token: this.loginToken,
            pass: this.pass,
            newPassword: this.new_pass
          },
          { timeout: 1000 * 60 * 2 }
        )
        console.log(res.data.status)

        if (res && res.data.status === 0) {
          this.$store.commit('updateState', ['alertMsg', '修改密碼成功!!'])
        } else {
          this.$store.commit('updateState', ['alertMsg', '您輸入的目前密碼有誤，請再次確認!!'])
          if (res.data.status === 4) {
            UserLogin.logout()
            this.$router.push('/login')
          } else {
            this.$store.commit('updateState', ['alertMsg', res.data.message])
          }
        }

        // if (this.apiStatus !== 0) {
        //   this.$store.commit('updateState', ['alertMsg', res.data.message])
        // }
        // //token失效有誤時轉跳到登入頁
        // this.apiStatus = res.data.status
        // this.checkToken(this.apiStatus)

        // if (res.data.status === 0) {
        //   // alert('修改密碼成功!!')
        //   this.$store.commit('updateState', ['alertMsg', '修改密碼成功!!'])
        // } else {
        //   // alert('您輸入的目前密碼有誤，請再次確認!!')
        //   this.$store.commit('updateState', ['alertMsg', '您輸入的目前密碼有誤，請再次確認!!'])
        // }
        // this.search_data = res.data.data;
        // console.log(this.search_data);
      } catch (error) {
        this.$store.commit('updateState', ['alertMsg', 'Service request error !'])
      }
      $nuxt.$loading.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/scss/common/_list.scss';
@import '~/scss/pages/_modify-password.scss';
</style>
