<template>
  <nuxt />
</template>

<script>
import UserLogin from '~/plugins/js/userlogin'
export default {
  // components: {
  //   Header
  // },
  data() {
    return {
      login_status: false
    }
  },
  beforeMount() {
    this.LoginStatus()
    this.isToken()
  },
  methods: {
    LoginStatus() {
      // 判斷是否登入
      this.login_status = UserLogin.isLogin()
      // console.log('******************')
      // console.log(this.login_status)
      // console.log('******************')
    },
    isToken() {
      if (!this.login_status) {
        this.$router.push('/login')
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
#__nuxt,
#__layout,
.wrap {
  height: 100%;
}
</style>
