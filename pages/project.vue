<template>
  <div class="content">
    <div class="content-header">
      <h2>機種管理</h2>
    </div>
    <div class="project-wrap">      
      <div class="search-wrap">
        <div class="row">
          <div class="title">篩選機種</div>
          <select id="" v-model="selectName" name="">
            <option value="" disabled>請選擇機種</option>
            <option
              v-for="data in projectData"
              :key="data.project"
              :value="data.project"
              name="option_sort"
            >{{ data.projectName }}({{ data.project }})</option
            >
          </select>
        </div>
        <button @click="get_project">搜尋</button>
      </div> 
      <div v-show="showListInfo" class="common-table">
        <div class="common-th">
          <div>
            機種名稱
            <!-- <span class="icon-sort"><fa :icon="['fas', 'sort']"/></span>
            <span class="icon-sort"><fa :icon="['fas', 'sort-up']"/></span>
            <span class="icon-sort"><fa :icon="['fas', 'sort-down']"/></span> -->
          </div>
          <div>管理者
            <!-- <span class="icon-sort"><fa :icon="['fas', 'sort']"/></span> -->
          </div>
        </div>
        <div v-if="listData.length === 0">目前無資料</div>
        <div v-for="list in listData" v-else :key="list.project" class="common-tr">
          <div>{{ list.projectName }}</div>
          <div>{{ list.accounts }}<span :value="list.project" class="icon-edit" @click="edit_project(list.projectName, list.project)"><fa :icon="['fas', 'edit']"/></span></div>
        </div>
        <div v-show="listData.length !== 0" id="page" class="pagination">
          <button value="上一頁" @click="prePage"><fa :icon="['fas', 'angle-left']"/></button>
          <button
            v-for="num in nowTotalpage"
            :key="num"
            class="active" @click="onPageButton(num)"
          >
            {{ num }}
          </button>
          <!-- {{ nowindex }} -->
          <button value="下一頁" @click="nextPage"><fa :icon="['fas', 'angle-right']"/></button>
        </div>
      </div>
      <portal v-if="showInsert" to="portalPopupPlace">
        <popup-msg :open="showInsert" :pop-title="'機種管理編輯'">
          <div class="project-popup">
            <div class="project-manager-add">
              <div class="add-input">
                <input v-model="userName" type="text" placeholder="請輸入帳號/名稱" @keyup="fastQuery">              
                <button class="purple" @click="insert">新增</button>                        
              </div>
              <div :class="{show :isQuery}" class="add-list hide" >
                <div v-for="(list, index) in searchData" :key="index" @click="insert_input(list.userName, list._id)">{{ list.userName }}/{{ list.displayName }}({{ editAccountType[list.accountType] }})</div>
              </div> 
            </div>
            <h5>{{ projectName }} 管理人員</h5>         
            <div class="common-table">
              <div class="common-th">
                <div>帳號
                  <!-- <span class="icon-sort"><fa :icon="['fas', 'sort']"/></span> -->
                </div>
                <div>名稱
                  <!-- <span class="icon-sort"><fa :icon="['fas', 'sort']"/></span> -->
                </div>
                <div>角色
                  <!-- <span class="icon-sort"><fa :icon="['fas', 'sort']"/></span> -->
                </div>
                <div>操作</div>
              </div>
              <div v-if="projectAccData.length === 0">目前無資料</div>
              <div v-for="(data, index) in projectAccData" v-else :key="index" class="common-tr">
                <div>{{ data.userName }}</div>
                <div>{{ data.displayName }}</div>
                <div>{{ editAccountType[data.accountType] }}</div>
                <div><a :value="data._id" @click="del(data.userName,data._id)">刪除</a></div>
              </div>
            </div>
            <div class="btn-wrap">
              <button @click="return_project">返回</button>
            </div>
          </div>          
        </popup-msg>
      </portal> 
      <portal v-if="checkDelete" to="portalAlertPlace">
        <div class="alert-mask">
          <div class="alert-wrap">
            <div class="alert-body">
              <p>是否刪除帳號: <br>{{ delUserName }}</p>
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
</template>

<script>
import UserLogin from '~/plugins/js/userlogin'
import Project from '~/plugins/js/project'
import axios from 'axios'
import { API } from '~/constants/ark_oauth'
export default {
  data() {
    return {
      projectData: [],
      loginId: '', //登入uid
      loginToken: '', //登入token
      selectName: '', //下拉選到的機種代碼
      projectName: '', //機種名稱
      listData: [], //機種查詢資訊
      accounts: 0, //機種管理者人數
      limit: 10, //每頁顯示幾筆資料
      page: 1,
      nowindex: 1, //當前頁面顯示在第幾頁
      nowTotalpage: 1, //當前總共會有幾頁
      showListInfo: false, //是否顯示機種清單資訊視窗
      showInsert: false, //是否顯示新增機台視窗

      projectToken: '', //使用者選澤到機種代碼
      insertId: '', //預計新增使用者序號
      delUserName: '', //預計刪除帳號
      delId: '', //預計刪除使用者序號
      userName: '', //機台管理輸入的帳號
      searchData: [], //帳號快速查詢資訊
      projectAccData: [], // 取得機種管理者清單資訊
      editAccountType: {
        0: '系統管理員',
        1: '專案負責人',
        2: '運營',
        3: '一般使用者',
        4: '開發者'
      }, //編輯機台視窗上角色
      isQuery: false, //是否快速查詢顯示
      managerList: false, //是否顯示機種管理者清單
      loginType: '', //身分別
      // apiStatus: 0, //呼叫 api status
      checkDelete: false,
      insertUser: false //是否顯示下拉新增管理者選單
    }
  },
  // watch: {
  //   // nowindex: {
  //   //   handler: 'onPageButton',
  //   //   deep: true
  //   // },
  //   // userName: {
  //   //   handler: 'fastQuery',
  //   //   deep: true
  //   // }
  // },
  async beforeMount() {
    //驗證進來此頁身分別
    this.loginType = parseInt(Project.getLogin_type())

    //取得localStorage的資訊
    await this.getStorage()

    // 取得機種清單資訊
    await this.getProjectList()

    // 取得全部機種查詢資訊
    await this.get_project()
  },
  methods: {
    getStorage() {
      //取得localStorage的資訊
      this.loginId = Project.getUid()
      this.loginToken = Project.getToken()
    },
    // 檢查token是否過期
    // checkToken(apiStatus) {
    //   if (apiStatus === 4) {
    //     UserLogin.logout()
    //     this.$router.push('/login')
    //   }
    // },
    // 取得機種清單資訊
    async getProjectList() {
      $nuxt.$loading.loading = true
      try {
        let res = await axios.post(
          API.Host + ':' + API.Port + '/project/list',
          {
            uid: this.loginId,
            token: this.loginToken
          },
          { timeout: 1000 * 60 * 2 }
        )

        if (res && res.data.status === 0) {
          this.projectData = res.data.data
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
      } catch (error) {
        console.log(error)
        // this.$store.commit('updateState', ['alertMsg', '伺服器連線異常'])
        this.$store.commit('updateState', ['alertMsg', 'Service request error !'])
      }
      $nuxt.$loading.loading = false
    },
    // 取得全部機種查詢資訊
    async get_project() {
      $nuxt.$loading.loading = true
      try {
        let getProjectData = {
          uid: this.loginId,
          token: this.loginToken,
          limit: this.limit,
          page: this.nowindex
          // project: this.selectName  //選填
        }

        if (this.selectName !== '') {
          getProjectData.project = this.selectName
        }

        let res = await axios.post(API.Host + ':' + API.Port + '/project/search', getProjectData, {
          timeout: 1000 * 60 * 2
        })

        // 資料總筆數
        let total_num = res.data.total
        // console.log(total_num);
        //  計算總頁數
        let total_page = Math.ceil(total_num / this.limit)
        // console.log(total_page);

        // 當下總頁數指給nowTotalpage
        this.nowTotalpage = total_page

        if (res && res.data.status === 0) {
          this.listData = res.data.data
          this.showListInfo = true
        } else {
          this.$store.commit('updateState', ['alertMsg', res.data.message])
          if (res.data.status === 4) {
            UserLogin.logout()
            this.$router.push('/login')
          } else {
            this.$store.commit('updateState', ['alertMsg', res.data.message])
          }
        }

        // this.listData = res.data.data

        // this.showListInfo = true

        // if (this.apiStatus !== 0) {
        //   this.$store.commit('updateState', ['alertMsg', res.data.message])
        // }
        // //token失效有誤時轉跳到登入頁
        // this.apiStatus = res.data.status
        // this.checkToken(this.apiStatus)
      } catch (error) {
        // this.$store.commit('updateState', ['alertMsg', '伺服器連線異常'])
        this.$store.commit('updateState', ['alertMsg', 'Service request error !'])
        this.showListInfo = false
      }
      $nuxt.$loading.loading = false
    },
    async prePage() {
      if (this.nowindex <= 1) {
        this.nowindex = 1
      } else {
        this.nowindex = this.nowindex - 1
      }
      // 取得全部機種查詢資訊
      await this.get_project()
    },
    async nextPage() {
      if (this.nowindex >= this.nowTotalpage) {
        this.nowindex = this.nowTotalpage
      } else {
        this.nowindex = this.nowindex + 1
      }
      // 取得全部機種查詢資訊
      await this.get_project()
    },
    async onPageButton(num) {
      this.nowindex = num

      // 取得全部機種查詢資訊
      await this.get_project()
    },
    async edit_project(projectName, list_project) {
      // 取得機種管理者清單
      await this.getProjectAccount(list_project)
      this.projectName = projectName
      this.projectToken = list_project
      this.showInsert = true
    },
    // 取得機種管理者清單
    async getProjectAccount(list_project) {
      $nuxt.$loading.loading = true
      try {
        let res = await axios.post(
          API.Host + ':' + API.Port + '/project/accounts',
          {
            uid: this.loginId,
            token: this.loginToken,
            project: list_project //機種代碼
          },
          { timeout: 1000 * 60 * 2 }
        )
        if (res && res.data.status === 0) {
          this.projectAccData = res.data.data
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
        console.log(error)
        // this.$store.commit('updateState', ['alertMsg', '伺服器連線異常'])
        this.$store.commit('updateState', ['alertMsg', 'Service request error !'])
      }
      $nuxt.$loading.loading = false
    },
    //呼叫新增機種管理者API
    async insert() {
      // 新增機種管理者API
      await this.getInsertManager()
      //新增、刪除後重新顯示機種代碼的清單
      // await this.getProjectAccount(this.projectToken)

      this.showInsert = true
      //新增機種管理者完後 清除欄位
      this.userName = ''
    },
    async getInsertManager() {
      $nuxt.$loading.loading = true
      try {
        let res = await axios.post(
          API.Host + ':' + API.Port + '/project/addAccount',
          {
            uid: this.loginId,
            token: this.loginToken,
            userID: this.insertId,
            project: this.projectToken
          },
          { timeout: 1000 * 60 * 2 }
        )

        if (res && res.data.status === 0) {
          //新增、刪除後重新顯示機種代碼的清單
          await this.getProjectAccount(this.projectToken)
          //新增完清空
          this.insertId = ''
        } else {
          this.$store.commit('updateState', ['alertMsg', res.data.message])
          if (res.data.status === 4) {
            UserLogin.logout()
            this.$router.push('/login')
          } else {
            this.$store.commit('updateState', ['alertMsg', res.data.message])
          }
        }

        // if (res && res.data.status !== 0) {
        //   this.$store.commit('updateState', ['alertMsg', res.data.message])
        //   if (res.data.status === 4) {
        //     UserLogin.logout()
        //     this.$router.push('/login')
        //   } else {
        //     this.$store.commit('updateState', ['alertMsg', res.data.message])
        //   }
        // }
      } catch (error) {
        console.log(error)
        console.log(error.response.data)
        if (this.userName === '') {
          this.$store.commit('updateState', ['alertMsg', '請輸入並選擇帳號'])
        } else if (this.userName !== '') {
          // this.$store.commit('updateState', ['alertMsg', '伺服器連線異常'])
          this.$store.commit('updateState', ['alertMsg', 'Service request error !'])
        }
      }
      $nuxt.$loading.loading = false
    },
    //快速查詢帳號
    async getSearchAccount() {
      $nuxt.$loading.loading = true
      try {
        let res = await axios.post(
          API.Host + ':' + API.Port + '/account/search',
          {
            uid: this.loginId,
            token: this.loginToken,
            searchName: this.userName
          },
          { timeout: 1000 * 60 * 2 }
        )

        if (res && res.data.status === 0) {
          this.searchData = res.data.data
          if (this.searchData.length === 0) {
            this.isQuery = false
          } else {
            this.isQuery = true
          }
        } else {
          this.$store.commit('updateState', ['alertMsg', res.data.message])
          if (res.data.status === 4) {
            UserLogin.logout()
            this.$router.push('/login')
          } else {
            this.$store.commit('updateState', ['alertMsg', res.data.message])
          }
        }

        // console.log(res.data.data);
        // this.searchData = res.data.data
        // console.log(47474747)
        // console.log(this.searchData.length)
        // console.log(47474747)
        // if (this.searchData.length === 0) {
        //   this.isQuery = false
        // } else {
        //   this.isQuery = true
        // }

        // if (this.apiStatus !== 0) {
        //   this.$store.commit('updateState', ['alertMsg', res.data.message])
        // }
        // //token失效有誤時轉跳到登入頁
        // this.apiStatus = res.data.status
        // this.checkToken(this.apiStatus)
      } catch (error) {
        console.log(error)
        // this.$store.commit('updateState', ['alertMsg', '伺服器連線異常'])
        this.$store.commit('updateState', ['alertMsg', 'Service request error !'])
        // this.isQuery = false
      }
      $nuxt.$loading.loading = false
    },
    async fastQuery() {
      if (this.userName === '') {
        this.isQuery = false
      } else if (this.userName !== '') {
        // setTimeout(await this.getSearchAccount(), 2000)
        await this.getSearchAccount()
      }
    },
    async del(userName, userID) {
      this.delUserName = userName //欲刪除的帳號
      this.delId = userID //欲刪除的序號
      this.checkDelete = true //確認是否刪除視窗
      // this.showInsert = true
    },
    //取消刪除
    deleteCancel() {
      this.checkDelete = false
    },
    //確認刪除鈕
    async deleteSucess() {
      // 刪除管理者
      await this.getDelManager()
      this.checkDelete = false
      //新增、刪除後重新顯示機種代碼的清單
      await this.getProjectAccount(this.projectToken)
      this.showInsert = true
    },
    // 刪除管理者API
    async getDelManager() {
      $nuxt.$loading.loading = true
      try {
        // console.log(this.projectToken);
        let res = await axios.post(
          API.Host + ':' + API.Port + '/project/removeAccount',
          {
            uid: this.loginId,
            token: this.loginToken,
            userID: this.delId,
            project: this.projectToken
          },
          { timeout: 1000 * 60 * 2 }
        )
        if (res && res.data.status !== 0) {
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
      } catch (error) {
        console.log(error)
        // this.$store.commit('updateState', ['alertMsg', '伺服器連線異常'])
        this.$store.commit('updateState', ['alertMsg', 'Service request error !'])
      }
      $nuxt.$loading.loading = false
    },
    //返回
    async return_project() {
      this.showInsert = false
      // 取得全部機種查詢資訊
      await this.get_project()
    },
    async insert_input(userName, id) {
      this.userName = userName
      this.insertId = id
      this.isQuery = false
    }
  }
}
</script>

<style lang="scss">
</style>

<style lang="scss" scoped>
@import '~/scss/pages/_project.scss';
</style>
