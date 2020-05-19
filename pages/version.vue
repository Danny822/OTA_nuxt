<template>
  <div class="content">
    <div class="content-header">
      <h2>版本紀錄</h2>
    </div>
    <div class="history-wrap">
      <div class="search-wrap">
        <div class="row">
          <div class="title">機種篩選</div>
          <select id="" v-model="selectName" name="" >
            <option value="" disabled>請選擇機種</option>
            <option
              v-for="data in projectData"
              :key="data.project"
              :value="data.project"
            >{{ data.projectName }}({{ data.project }})</option
            >
          </select>
        </div>
        <button @click="get_version">搜尋</button>
      </div>
      <div v-show="show_versionData" class="common-table" >
        <div class="common-th">
          <div>
            機種名稱
            <!-- <span class="icon-sort"><fa :icon="['fas', 'sort']"/></span> -->
          </div>
          <div>
            當前版本
            <!-- <span class="icon-sort"><fa :icon="['fas', 'sort']"/></span> -->
          </div>
          <div>
            容量大小
            <!-- <span class="icon-sort"><fa :icon="['fas', 'sort']"/></span> -->
          </div>
          <div>版本說明</div>
          <div>
            上傳時間
            <!-- <span class="icon-sort"><fa :icon="['fas', 'sort']"/></span> -->
          </div>
        </div>
        <div v-if="projectVersions_Data.length === 0">目前無資料</div>
        <div v-for="(versionData, index) in projectVersions_Data" v-else :key="index" class="common-tr" >
          <div>            
            {{ versionData.projectName }}
          </div>
          <div>{{ versionData.version }}</div>
          <div>{{ versionData.size }} KB</div>
          <div><span class="icon-detail" @click="show_VersionInfo(versionData.log)"><fa :icon="['fas', 'file-alt']"/></span></div>
          <div>{{ uploadTime[index] }}</div>
          <portal v-if="showInfo" to="portalPopupPlace">
            <popup-msg :open="showInfo" :pop-title="'版本說明'">
              <div class="history-popup">
                <p>{{ verInfo }}</p>
                <div class="btn-wrap">
                  <button @click="returnVersion">返回</button>
                </div>
              </div>
            </popup-msg>
          </portal> 
        </div>
        <!-- <div class="common-tr process" >
          <div>            
            呱呱大冒險
          </div>
          <div>S105_CN</div>
          <div>105MB</div>
          <div><span class="icon-detail"><fa :icon="['fas', 'file-alt']"/></span></div>
          <div>2020/02/12 17:30</div>
        </div>
        <div class="common-tr done">
          <div>            
            呱呱大冒險
          </div>
          <div>S105_CN</div>
          <div>105MB</div>
          <div><span class="icon-detail"><fa :icon="['fas', 'file-alt']"/></span></div>
          <div>2020/02/12 17:30</div>
        </div> -->
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
      projectData: [], // 取得機種清單資訊
      login_uid: '', //登入uid
      login_token: '', //登入token
      user_grade: '', //登入身分別
      selectName: '', //下拉選到的機種代碼
      projectVersions_Data: [], //取到的機種版本清單資訊
      show_versionData: false, //是否顯示版本清單資訊
      uploadTime_Data: [], //原始上傳時間
      uploadTime: [], //時間格式轉換後的上傳時間
      showInfo: false,
      apiStatus: 0, //呼叫 api status
      verInfo: ''
    }
  },
  beforeMount() {
    //取登入身分別狀態
    this.LoginStatus()

    //取得localStorage的login_uid和 login_token
    this.getStorage()

    // 取得機種清單資訊
    this.get_projectList()
  },
  methods: {
    LoginStatus() {
      this.user_grade = window.localStorage.getItem('login_type') //取得登入身分別 (0:系統管理員 1:專案負責人 2:運營負責人 3:報表統計處理者)
    },
    getStorage() {
      //取得localStorage的login_uid和 login_token
      this.login_uid = Project.getUid()
      this.login_token = Project.getToken()
    },
    // 檢查token是否過期
    checkToken(apiStatus) {
      if (apiStatus === 4) {
        UserLogin.logout()
        this.$router.push('/login')
      }
    },
    // 取得機種清單資訊
    async get_projectList() {
      $nuxt.$loading.loading = true
      try {
        let res = await axios.post(API.Host + ':' + API.Port + '/project/list', {
          uid: this.login_uid,
          token: this.login_token
        })

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
        // this.projectData = res.data.data
        // if (this.apiStatus !== 0) {
        //   this.$store.commit('updateState', ['alertMsg', res.data.message])
        // }
        // //token失效有誤時轉跳到登入頁
        // this.apiStatus = res.data.status
        // this.checkToken(this.apiStatus)
      } catch (error) {
        console.log(error)
        // this.$store.commit('updateState', ['alertMsg', '伺服器連線異常' + error.message])
        this.$store.commit('updateState', ['alertMsg', 'Service request error !'])
      }
      $nuxt.$loading.loading = false
    },
    async get_version() {
      if (this.selectName === '') {
        // alert('請選擇最後上線時間 !')
        this.$store.commit('updateState', ['alertMsg', '請選擇機種 !'])
      }
      //呼叫6-2 機種版本清單
      await this.projectVersions()
      // this.show_versionData = true
    },
    // 機種版本清單
    async projectVersions() {
      $nuxt.$loading.loading = true
      try {
        let res = await axios.post(API.Host + ':' + API.Port + '/report/projectVersions', {
          uid: this.login_uid,
          token: this.login_token,
          project: this.selectName
        })

        if (res && res.data.status === 0) {
          this.projectVersions_Data = res.data.data
          for (let i = 0; i < this.projectVersions_Data.length; i++) {
            //把原始的ISO 8601上傳時間塞進createTime_Data
            this.uploadTime_Data.push(this.projectVersions_Data[i].uploadTime)
          }
          // console.log(this.uploadTime_Data)

          //時間格式轉換
          for (let i = 0; i < this.uploadTime_Data.length; i++) {
            let ISOtime = this.uploadTime_Data[i]
            let d = new Date(ISOtime) //把原始的ISO 8601時間更改成+8時區
            //轉換成普通的時間格式
            this.uploadTime.push(
              new Date(d.getTime() - d.getTimezoneOffset() * 60000)
                .toISOString()
                .replace('T', ' ')
                .replace(/\..+$/, '')
            )
          }

          if (this.projectVersions_Data.length === 0) {
            // alert('該機種查無版本紀錄資訊 !')
            this.$store.commit('updateState', ['alertMsg', '您所選擇的機種查無版本紀錄資訊'])
            this.show_versionData = false
          } else {
            this.show_versionData = true
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
      } catch (error) {
        console.log(error)
        // this.$store.commit('updateState', ['alertMsg', '伺服器連線異常' + error.message])
        this.$store.commit('updateState', ['alertMsg', 'Service request error !'])
      }
      $nuxt.$loading.loading = false
    },
    show_VersionInfo(log) {
      this.verInfo = log
      this.showInfo = true
    },
    returnVersion() {
      this.showInfo = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/scss/pages/_history.scss';
</style>
