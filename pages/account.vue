<template>
  <div class="content">
    <div class="content-header">
      <h2>帳號管理</h2>
      <button class="btn-add-member" @click="createUser"><fa :icon="['fas', 'user-plus']" class="fa-sm" />&nbsp;新增使用者</button>
    </div>
    <div class="account-wrap">      
      <div class="search-wrap">
        <div class="row">
          <div class="title">搜尋帳號</div>
          <input v-model="userName" type="text" placeholder="請輸入帳號">
          <div class="title">角色篩選</div>
          <select id="" v-model="accountType" name="" >
            <option value="">All</option>
            <option :value="0">系統管理員</option>
            <option :value="1">專案負責人</option>
            <option :value="2">營運</option>
            <option :value="3">一般使用者</option>
          </select>
        </div>
        <button @click="search">搜尋</button>
      </div>
      <div v-if="showSearch" class="common-table">
        <div class="common-th">
          <div>
            帳號
            <!-- <span class="icon-sort" @click="sortId"><fa :icon="['fas', 'sort']"/></span> -->
          </div>
          <div>
            名稱
            <!-- <span class="icon-sort"><fa :icon="['fas', 'sort']"/></span> -->
          </div>
          <div>
            角色
            <!-- <span class="icon-sort"><fa :icon="['fas', 'sort']"/></span> -->
          </div>
          <div>
            操作
          </div>
          <div>
            創建者
            <!-- <span class="icon-sort"><fa :icon="['fas', 'sort']"/></span> -->
          </div>
          <div>
            建立時間
            <!-- <span class="icon-sort"><fa :icon="['fas', 'sort']"/></span> -->
          </div>
        </div>
        
        <div v-if="searchData.length === 0">目前無資料</div>
        <div v-for="(data, index) in searchData" v-else :key="index" class="common-tr">
          <div>{{ data.userName }}</div>
          <div>{{ data.displayName }}</div>
          <div>{{ showAccountType[data.accountType] }}</div>
          <div>
            <a :value="data._id" @click="updatePw(data.userName,data.displayName,data.accountType,data._id)">變更密碼</a>
            <a @click="delAccount(data.userName, data._id)">刪除</a>
          </div>
          <div>{{ data.creator }}</div>
          <div>{{ createTime[index] }}</div> 
        </div>
        <div v-show="searchData.length !== 0">
          <div id="page" class="pagination">
            <button value="上一頁" @click="prePage"><fa :icon="['fas', 'angle-left']"/></button>
            <button
              v-for="num in nowTotalPage"
              :key="num"
              class="active" @click="nowindex = num"
            >
              {{ num }}
            </button>
            <button value="下一頁" @click="nextPage"><fa :icon="['fas', 'angle-right']"/></button>
          </div>
        </div>
        
        <portal v-if="showInsert" to="portalPopupPlace">
          <popup-msg :open="showInsert" :pop-title="'新增使用者'">
            <div class="account-popup">
              <ul class="list-wrap">
                <li>
                  <div class="title">帳號</div>
                  <div class="detail"><input v-model="insertData.id" type="text" placeholder="請輸入您的帳號"></div>
                </li>
                <li>
                  <div class="title">名稱</div>
                  <div class="detail"><input v-model="insertData.name" type="text" placeholder="請輸入您的名稱"></div>
                </li>
                <li>
                  <div class="title">密碼</div>
                  <div class="detail"><input v-model="insertData.pw" type="password" placeholder="請輸入您的密碼"></div>
                </li>
                <li>
                  <div class="title">確認密碼</div>
                  <div class="detail"><input v-model="insertData.repw" type="password" placeholder="再次輸入您的密碼"></div>
                </li>
                <li>
                  <div class="title">設定角色</div>
                  <div class="detail">
                    <select id="" v-model="optionValue" name="character">
                      <option value="">請選擇角色</option>
                      <option :value="0">系統管理員</option>
                      <option :value="1">專案負責人</option>
                      <option :value="2">運營</option>
                      <option :value="3">一般使用者</option>
                    </select>
                  </div>
                </li>
              </ul>
              <p v-if="idError" class="txt-error">
                <fa :icon="['fas', 'times']" class="fa-sm" />
                帳號密碼請輸入8~12個英數字元!
              </p>
              <p v-if="nameError" class="txt-error">
                <fa :icon="['fas', 'times']" class="fa-sm" />
                名稱請輸入2~12碼非特殊符號文字!
              </p>
              <p v-if="repwError" class="txt-error">
                <fa :icon="['fas', 'times']" class="fa-sm" />
                確認密碼與密碼不相同，請再次確認!
              </p>
              <p v-if="accountTypeError" class="txt-error">
                <fa :icon="['fas', 'times']" class="fa-sm" />
                請設定角色!
              </p>              
            </div>
            <div class="btn-wrap">
              <button class="gray" @click="cancel">取消</button>
              <button @click="insert">確認</button>
            </div>
          </popup-msg>
        </portal>
        <portal v-if="showUpdate" to="portalPopupPlace">
          <popup-msg :open="showUpdate" :pop-title="'變更密碼'">
            <div class="account-popup">
              <ul class="list-wrap">
                <li>
                  <div class="title">帳號</div>
                  <div class="detail">{{ updateUserName }}</div>
                </li>
                <li>
                  <div class="title">名稱</div>
                  <div class="detail">{{ displayName }}</div>
                </li>
                <li>
                  <div class="title">密碼</div>
                  <div class="detail"><input v-model="updateData.pw" type="password"></div>
                </li>
                <li>
                  <div class="title">確認密碼</div>
                  <div class="detail"><input v-model="updateData.repw" type="password"></div>
                </li>
                <li>
                  <div class="title">設定角色</div>
                  <div class="detail">{{ updateAccountType }}</div>
                </li>
              </ul>
              <p v-if="updatePwError" class="txt-error">
                <fa :icon="['fas', 'times']" class="fa-sm" />
                請輸入8~12碼英數組成的密碼!
              </p>
              <p v-if="updateRepwError" class="txt-error">
                <fa :icon="['fas', 'times']" class="fa-sm" />
                與新密碼不相同，請再次確認!
              </p>
              <div class="btn-wrap">
                <button class="gray" @click="updateCancel">取消</button>
                <button @click="updateModify">確認</button>
              </div>
            </div>
          </popup-msg>
        </portal>
        <portal v-if="checkDelete" to="portalPopupPlace">
          <div class="alert-mask">
            <div class="alert-wrap">
              <div class="alert-body">
                <p>是否刪除此帳號: <br>{{ delUserName }}</p>
                <div class="btn-wrap">
                  <button class="gray" @click="deleteCancel">取消</button>
                  <button @click="deleteSucess">確認</button>
                </div>
              </div>
            </div>
          </div>
        </portal>
      </div>
    </div>
  </div>
</template>

<script>
import UserLogin from '~/plugins/js/userlogin'
import Project from '~/plugins/js/project'
import axios from 'axios'
import { API } from '~/constants/ark_oauth'
export default {
  data() {
    return {
      sort: true,
      loginId: '', //登入uid
      loginToken: '', //登入token
      insertData: {
        id: '', //新增帳號
        name: '', //新增名稱
        pw: '', //新增密碼
        repw: '' //再次密碼
      },
      createTimeData: [], //建立時間
      createTime: [], //時間格式轉換後的建立時間
      optionValue: '', //新增使用者下拉選單選到的設定角色
      showInsert: false,
      insertAccount: [], //新增帳號資訊
      userName: '', //搜尋條件-登入帳號
      accountType: '', //搜尋條件-角色篩選
      limit: 10, //每頁幾筆
      page: 1, //第幾頁
      searchData: [], //帳號查詢資訊
      showSearch: false, //是否顯示帳號查詢資訊
      updateData: {
        pw: '', //變更密碼
        repw: '' //確認再次變更密碼
      },
      updateUserName: '', //變更密碼視窗上的帳號
      displayName: '', //變更密碼視窗上的名稱
      updateAccountType: '', //變更密碼視窗上的設定角色
      updateId: '', //欲修改的使用者序號
      showUpdate: false,
      delUserName: '', //欲刪除的帳號
      delId: '', //刪除帳號的使用者序號
      nowTotalPage: 1, //總共會有幾頁
      nowindex: 1, //當前頁面顯示在第幾頁
      showAccountType: {
        0: '系統管理員',
        1: '專案負責人',
        2: '運營',
        3: '一般使用者',
        4: '開發者'
      }, //編輯機台視窗上角色

      /***新增使用者欄位驗證***/
      idError: false, //新增使用者帳號錯誤訊息顯示
      nameError: false, //新增使用者名稱錯誤訊息顯示
      pwError: false, //新增使用者密碼錯誤訊息顯示
      repwError: false, //新增使用者再次密碼錯誤訊息顯示
      accountTypeError: false, //新增使用者設定角色

      /***變更密碼欄位驗證***/
      updatePwError: false, //變更密碼錯誤訊息顯示
      updateRepwError: false, //變更再次密碼錯誤訊息顯示

      checkDelete: false
      // apiStatus: 0 //呼叫 api status
    }
  },
  watch: {
    database: {
      handler: 'saveData',
      deep: true
    },
    optionValue: {
      handler: 'getType',
      deep: true
    },
    accountType: {
      handler: 'getAccType',
      deep: true
    },
    nowindex: {
      handler: 'onPageButton',
      deep: true
    },
    //表單驗證新增使用者資訊
    insertData: {
      handler: 'clearInsertErrorMsg',
      deep: true
    },
    //表單驗證變更使用者資訊
    updateData: {
      handler: 'clearUpdateErrorMsg',
      deep: true
    }
  },
  beforeMount() {
    this.getStorage()
    this.allAccount()
  },
  methods: {
    // 檢查token是否過期
    // checkToken(api_status) {
    //   if (api_status === 4) {
    //     UserLogin.logout()
    //     this.$router.push('/login')
    //   }
    // },
    getStorage() {
      //取得localStorage的資訊
      this.loginId = Project.getUid()
      this.loginToken = Project.getToken()
      this.login_name = Project.getName()
    },
    //新增使用者設定角色
    getType(optionValue) {
      //optionValue從字串型態轉數字
      if (optionValue === '') {
        this.optionValue = optionValue
      } else {
        this.optionValue = parseInt(optionValue)
      }
    },
    //搜尋條件-角色篩選
    getAccType(value) {
      //optionValue從字串型態轉數字
      if (value === '') {
        this.accountType = value
      } else {
        this.accountType = parseInt(value)
      }
    },
    createUser() {
      //跳出新增使用者視窗
      this.showInsert = true

      //清除先前輸入資訊
      this.insertData.id = ''
      this.insertData.name = ''
      this.insertData.pw = ''
      this.insertData.repw = ''
      this.optionValue = ''
    },
    // 新增帳號
    async getCreatAccount() {
      $nuxt.$loading.loading = true
      try {
        let res = await axios.post(
          API.Host + ':' + API.Port + '/account/create',
          {
            uid: this.loginId,
            token: this.loginToken,
            user: this.insertData.id,
            pass: this.insertData.pw,
            name: this.insertData.name,
            type: this.optionValue
          },
          { timeout: 1000 * 60 * 2 }
        )
        if (res && res.data.status === 0) {
          //新增帳號成功後不顯示新增視窗
          this.showInsert = false
          // 帳號查詢
          await this.search()
          this.$store.commit('updateState', ['alertMsg', '新增成功 !'])
        } else {
          this.$store.commit('updateState', ['alertMsg', res.data.message])
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
        // //新增帳號成功後不顯示新增視窗
        // this.showInsert = false
      } catch (error) {
        // this.$store.commit('updateState', ['alertMsg', '伺服器連線異常'])
        this.$store.commit('updateState', ['alertMsg', 'Service request error !'])
      }
      $nuxt.$loading.loading = false
    },
    //新增使用者視窗確認鈕
    async insert() {
      //帳號密碼規則
      let reg = /^[a-zA-Z0-9]{8,12}$/

      //名稱規則
      let nameReg = /^[a-zA-Z0-9\u4e00-\u9fa5]{2,12}$/

      if (!reg.test(this.insertData.id)) {
        this.idError = true
      }
      if (!nameReg.test(this.insertData.name)) {
        this.nameError = true
      }
      if (!reg.test(this.insertData.pw)) {
        this.idError = true
      }
      if (this.insertData.pw !== this.insertData.repw) {
        this.repwError = true
      }
      if (this.optionValue === '') {
        this.accountTypeError = true
      }
      if (
        reg.test(this.insertData.id) &&
        nameReg.test(this.insertData.name) &&
        reg.test(this.insertData.pw) &&
        this.insertData.pw === this.insertData.repw &&
        this.optionValue !== ''
      ) {
        // 呼叫新增帳號API
        await this.getCreatAccount()
        // 新增完作查詢動作
        // await this.search()
      }
    },
    async clearInsertErrorMsg() {
      if (this.insertData.id === '') {
        this.idError = false
      }
      if (this.insertData.name === '') {
        this.nameError = false
      }
      if (this.insertData.pw === '') {
        this.idError = false
      }
      if (this.insertData.repw === '') {
        this.repwError = false
      }
      if (this.optionValue === '') {
        this.accountTypeError = false
      }
    },
    //新增使用者視窗取消鈕
    cancel() {
      this.showInsert = false
      this.idError = false
      this.nameError = false
      this.repwError = false
      this.accountTypeError = false
    },
    async allAccount() {
      await this.getListAccount()
      this.showSearch = true
    },
    // 查詢帳號
    async getListAccount() {
      $nuxt.$loading.loading = true
      try {
        let get_listAccount = {
          uid: this.loginId,
          token: this.loginToken,
          // userName: this.userName,               //選填
          // accountType: this.accountType,         //選填
          limit: this.limit,
          page: this.nowindex
        }

        if (this.userName !== '') {
          get_listAccount.userName = this.userName
        }
        if (this.accountType !== '') {
          get_listAccount.accountType = this.accountType
        }
        let res = await axios.post(API.Host + ':' + API.Port + '/account/list', get_listAccount, {
          timeout: 1000 * 60 * 2
        })

        if (res && res.data.status === 0) {
          this.searchData = res.data.data
          for (let i = 0; i < this.searchData.length; i++) {
            this.createTimeData.push(this.searchData[i].createTime)
          }
          for (let i = 0; i < this.createTimeData.length; i++) {
            let ISOtime = this.createTimeData[i]
            let d = new Date(ISOtime) //把原始的ISO 8601時間更改成+8時區
            //轉換成普通的時間格式
            this.createTime.push(
              new Date(d.getTime() - d.getTimezoneOffset() * 60000)
                .toISOString()
                .replace('T', ' ')
                .replace(/\..+$/, '')
            )
          }
          // 資料總筆數0不顯示搜尋列表
          if (res.data.total === 0) {
            console.log('資料總筆數0')
            this.showSearch = false
            // alert('搜尋條件有誤，請再次確認 !')
            this.$store.commit('updateState', ['alertMsg', '搜尋條件有誤，請再次確認 !'])
          }

          // 資料總筆數
          let total_num = res.data.total

          // 計算總頁數
          let total_page = Math.ceil(total_num / this.limit)
          // console.log(total_page);
          // 當下總頁數指給nowTotalPage
          this.nowTotalPage = total_page
        } else {
          this.$store.commit('updateState', ['alertMsg', res.data.message])
          if (res.data.status === 4) {
            UserLogin.logout()
            this.$router.push('/login')
          } else {
            this.$store.commit('updateState', ['alertMsg', res.data.message])
          }
        }
      } catch (error) {
        console.log(error.message)
        // this.$store.commit('updateState', ['alertMsg', '伺服器連線異常'])
        this.$store.commit('updateState', ['alertMsg', 'Service request error !'])
      }
      $nuxt.$loading.loading = false
    },
    async search() {
      // 帳號查詢
      await this.getListAccount()
      this.showSearch = true

      //搜尋完清除資訊
      this.userName = ''
      // this.accountType = ''
    },
    // 變更密碼鈕
    updatePw(userName, displayName, accountType, id) {
      this.updateUserName = userName
      this.displayName = displayName
      this.updateId = id

      switch (accountType) {
        case 0:
          this.updateAccountType = '系統管理員'
          break
        case 1:
          this.updateAccountType = '專案負責人'
          break
        case 2:
          this.updateAccountType = '運營'
          break
        case 3:
          this.updateAccountType = '一般使用者'
          break
        case 4:
          this.updateAccountType = '開發者'
          break
        default:
          this.updateAccountType = ''
      }
      this.showUpdate = true
    },
    // 呼叫修改帳號API
    async updateModify() {
      //帳號密碼規則
      let update_reg = /^[a-zA-Z0-9]{8,12}$/

      if (!update_reg.test(this.updateData.pw)) {
        this.updatePwError = true
      }

      if (this.updateData.pw !== this.updateData.repw) {
        this.updateRepwError = true
      }
      if (update_reg.test(this.updateData.pw) && this.updateData.pw === this.updateData.repw) {
        await this.getModifyAccount(this.updateId, this.displayName)
      }
    },
    clearUpdateErrorMsg() {
      if (this.updateData.pw === '') {
        this.updatePwError = false
      }
      if (this.updateData.repw === '') {
        this.updateRepwError = false
      }
    },
    //帳號管理-變更密碼
    updateCancel() {
      this.updateData.pw = ''
      this.updateData.repw = ''
      this.showUpdate = false
      this.updatePwError = false
      this.updateRepwError = false
    },
    // 修改密碼
    async getModifyAccount(id, displayName) {
      $nuxt.$loading.loading = true
      try {
        let res = await axios.post(
          API.Host + ':' + API.Port + '/account/modify',
          {
            uid: this.loginId,
            token: this.loginToken,
            userID: id,
            // userID: 'noinonn',
            pass: this.updateData.pw,
            name: displayName
          },
          { timeout: 1000 * 60 * 2 }
        )
        if (res && res.data.status === 0) {
          this.$store.commit('updateState', ['alertMsg', '變更密碼成功'])
          //清空欄位
          this.updateData.pw = ''
          this.updateData.repw = ''
          this.showUpdate = false
        } else {
          this.$store.commit('updateState', ['alertMsg', res.data.message])
          this.showUpdate = true
          if (res.data.status === 4) {
            UserLogin.logout()
            this.$router.push('/login')
          } else {
            this.$store.commit('updateState', ['alertMsg', res.data.message])
            this.showUpdate = true
          }
        }
      } catch (error) {
        this.$store.commit('updateState', ['alertMsg', 'Service request error !'])
      }
      $nuxt.$loading.loading = false
    },
    // 呼叫刪除帳號API
    async delAccount(userName, id) {
      this.delUserName = userName
      this.delId = id
      this.checkDelete = true
    },
    //取消刪除
    deleteCancel() {
      this.checkDelete = false
    },
    //確認刪除
    async deleteSucess() {
      await this.getDeleteAccount(this.delId)
      this.checkDelete = false
      //刪完帳號進行查詢
      // await this.search()
    },
    // 刪除帳號
    async getDeleteAccount(id) {
      $nuxt.$loading.loading = true
      try {
        let res = await axios.post(
          API.Host + ':' + API.Port + '/account/delete',
          {
            uid: this.loginId,
            token: this.loginToken,
            userID: id
          },
          { timeout: 1000 * 60 * 2 }
        )

        if (res && res.data.status === 0) {
          // 帳號查詢
          await this.search()
          this.$store.commit('updateState', ['alertMsg', '刪除成功 !'])
        } else {
          this.$store.commit('updateState', ['alertMsg', res.data.message])
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
        //token失效有誤時轉跳到登入頁
        // this.apiStatus = res.data.status
        // this.checkToken(this.apiStatus)
      } catch (error) {
        console.log(error)
        // this.$store.commit('updateState', ['alertMsg', '伺服器連線異常'])
        this.$store.commit('updateState', ['alertMsg', 'Service request error !'])
      }
      $nuxt.$loading.loading = false
    },
    onPageButton(nowindex) {
      this.nowindex = nowindex
      // 取得帳號查詢資訊
      this.search()
    },
    prePage() {
      if (this.nowindex <= 1) {
        this.nowindex = 1
      } else {
        this.nowindex = this.nowindex - 1
      }
      // 取得帳號查詢資訊
      this.search()
    },
    nextPage() {
      if (this.nowindex >= this.nowTotalPage) {
        this.nowindex = this.nowTotalPage
      } else {
        this.nowindex = this.nowindex + 1
      }
      // 取得帳號查詢資訊
      this.search()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/scss/pages/_account.scss';
@import '~/scss/common/_list.scss';
</style>
