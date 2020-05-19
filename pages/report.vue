<template>
  <div class="content">
    <div class="content-header">
      <button v-show="jobMachines" class="btn-prev" @click="return_jobDetail"><fa :icon="['fas', 'chevron-left']"/></button>
      <h2> 統計頁面</h2>
    </div>
    <div class="report-wrap">
      <div v-show="showSearch" class="search-wrap">
        <div class="row">
          <div class="title">機種篩選</div>
          <select id="" v-model="selectName" name="" >
            <option value="">All</option>
            <option
              v-for="data in projectData"
              :key="data.project"
              :value="data.project"
            >{{ data.projectName }}({{ data.project }})</option
            >
          </select>
        </div>
        <div class="row">
          <div class="title">最後上線時間</div>
          <div class="multi-select">
            <div :value="0" :class="{checked:timeAll}" @click="get_time(0)">全部</div>
            <div :value="365" :class="{checked:timeYear}" @click="get_time(365)">一年內</div>
            <div :value="30" :class="{checked:timeMounth}" @click="get_time(30)">30天內</div>
            <div :value="7" :class="{checked:timeWeek}" @click="get_time(7)">7天內</div>
          </div>
        </div>
        <button @click="get_report">搜尋</button>
      </div>
      <div v-show="showReport" class="common-table">
        <div class="common-th">
          <div>
            機種名稱
            <!-- <span class="icon-sort" ><fa :icon="['fas', 'sort']"/></span> -->
          </div>
          <div>
            當前版本
            <!-- <span class="icon-sort"><fa :icon="['fas', 'sort']"/></span> -->
          </div>
          <div>
            數量
            <!-- <span class="icon-sort"><fa :icon="['fas', 'sort']"/></span> -->
          </div>
        </div>
        <div v-if="machineVersions_Data.length === 0">目前無資料</div>
        <div v-for="(data, index) in machineVersions_Data" v-else :key="index" class="common-tr">
          <div>
            <span class="icon-detail" @click="get_jobMachines(data.project, data.version)"><fa :icon="['fas', 'file-alt']"/></span>
            {{ data.projectName }}
          </div>
          <div>{{ data.version }}</div>
          <div>{{ data.machines }}</div>
        </div>
        <!-- <div class="common-tr process">
          <div>
            <span class="icon-detail"><fa :icon="['fas', 'file-alt']"/></span>
            呱呱大冒險
          </div>
          <div>S105_CN</div>
          <div>24</div>
        </div>
        <div class="common-tr">
          <div>
            <span class="icon-detail"><fa :icon="['fas', 'file-alt']"/></span>
            呱呱大冒險
          </div>
          <div>S100_CN</div>
          <div>24</div>
        </div>
        <div class="common-tr done">
          <div>
            <span class="icon-detail"><fa :icon="['fas', 'file-alt']"/></span>
            淘氣鯊
          </div>
          <div>S105_CN</div>
          <div>24</div>
        </div> -->
      </div>
      <div v-show="jobMachines">  
        <div class="table-headline">
          <div class="reflash-wrap" @click="reload">
            <fa :icon="['fas', 'sync-alt']"/> 重新整理
          </div>
          <div class="info-wrap">
            <div><span class="icon-status noyet"/>未下載</div>
            <div><span class="icon-status ongoing"/>下載中</div>
            <div><span class="icon-status done"/>下載完成</div>
            <div><span class="icon-status update-done"/>更新完成</div>
          </div>
        </div>
        <div class="common-table task-list">
          <div class="common-th">
            <div>
              機種名稱
              <!-- <span class="icon-sort"><fa :icon="['fas', 'sort']"/></span> -->
            </div>
            <div>
              MAC地址
              <!-- <span class="icon-sort"><fa :icon="['fas', 'sort']"/></span> -->
            </div>
            <div>
              系統商
              <!-- <span class="icon-sort"><fa :icon="['fas', 'sort']"/></span> -->
            </div>
            <div>
              店名
              <!-- <span class="icon-sort"><fa :icon="['fas', 'sort']"/></span> -->
            </div>
            <div>
              版本
              <!-- <span class="icon-sort"><fa :icon="['fas', 'sort']"/></span> -->
            </div>
            <div>
              下載中
              <!-- <span class="icon-sort"><fa :icon="['fas', 'sort']"/></span> -->
            </div>
            <div>
              已下載
              <!-- <span class="icon-sort"><fa :icon="['fas', 'sort']"/></span> -->
            </div>
          </div>
          <div v-if="jobMachines_Data.length === 0">目前無資料</div>
          <div v-for="(jobMachines, index) in jobMachines_Data" v-else :key="index" class="common-tr">
            <div>
              <span class="icon-detail" @click="get_machinesInfo(jobMachines.mac)"><fa :icon="['fas', 'info-circle']"/></span>
              {{ jobMachines.projectName }}
            </div>         
            <div>{{ jobMachines.mac }}</div>
            <div>{{ jobMachines.agent }}</div>
            <div>{{ jobMachines.store }}</div>
            <div>{{ jobMachines.version }}</div>
            <div>{{ jobMachines.downloading }}</div>
            <div>{{ jobMachines.downloaded }}</div>
          </div>
        </div>
      </div>
    </div>
    <portal v-if="showInfo" to="portalPopupPlace">
      <popup-msg :open="showInfo" :pop-title="'機台資訊'">
        <div class="report-popup">
          <ul class="list-wrap">
            <li>
              <div class="title">機種名稱</div>
              <div class="detail">{{ machineInfo.projectName }}</div>
            </li>
            <li>
              <div class="title">最後上線時間</div>
              <div class="detail">{{ machineInfo.onlineTime }}</div>
            </li>
            <li>
              <div class="title">錯誤訊息</div>
              <div class="detail">{{ machineInfo.errorLog }}</div>
            </li>
          </ul>
          <div class="btn-wrap">
            <button @click="close_showInfo">確認</button>
          </div>          
        </div>
      </popup-msg>
    </portal>
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
      last_online: '', //最後上線時間
      selectName: '', //下拉選到的機種代碼
      machineVersions_Data: [], //取到的機台數量資訊
      showSearch: true, //是否顯示版本機台數量篩選條件資訊
      showReport: false, //是否顯示版本機台數量資訊
      version: '', //當前版本 =>查看機台資訊用

      /***機台詳細清單***/
      project: '', //選到的機種
      jobMachines: false, //是否顯示機台詳細清單頁面
      jobMachines_Data: [], // 取得機台詳細清單資訊
      mac: '', //機台MAC
      machineInfo: [], //機台詳細資訊
      showInfo: false, //是否顯示機台資訊視窗
      timeAll: false,
      timeYear: false,
      timeMounth: false,
      timeWeek: false,
      apiStatus: 0 //呼叫 api status
    }
  },
  beforeMount() {
    //取登入身分別狀態
    this.LoginStatus()
    //取得localStorage的login_uid和 login_token
    this.getStorage()
    // 取得機種清單資訊
    this.get_projectList()
    //最後上線時間預設為:7天內
    this.timeWeek = true
    this.last_online = 7
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
        let res = await axios.post(
          API.Host + ':' + API.Port + '/project/list',
          {
            uid: this.login_uid,
            token: this.login_token
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

        // console.log(this.projectData)
        // this.projectData = res.data.data
        // console.log(this.projectData)

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
    get_time(value) {
      console.log(value)
      // console.log(typeof value)
      this.last_online = value //最後上線時間
      if (value === 0) {
        this.timeAll = true
        this.timeYear = false
        this.timeMounth = false
        this.timeWeek = false
      } else if (value === 365) {
        this.timeAll = false
        this.timeYear = true
        this.timeMounth = false
        this.timeWeek = false
      } else if (value === 30) {
        this.timeAll = false
        this.timeYear = false
        this.timeMounth = true
        this.timeWeek = false
      } else if (value === 7) {
        this.timeAll = false
        this.timeYear = false
        this.timeMounth = false
        this.timeWeek = true
      }
    },
    async get_report() {
      //呼叫6-1版本機台數量
      if (this.last_online === '') {
        // alert('請選擇最後上線時間 !')
        this.$store.commit('updateState', ['alertMsg', '請選擇最後上線時間 !'])
      }
      await this.machineVersions()
    },
    //取得版本機台數量資訊
    async machineVersions() {
      $nuxt.$loading.loading = true
      try {
        let get_machineVersions = {
          uid: this.login_uid,
          token: this.login_token,
          // project: this.selectName,   //選填
          time: this.last_online
        }

        if (this.selectName !== '') {
          get_machineVersions.project = this.selectName
        }

        let res = await axios.post(API.Host + ':' + API.Port + '/report/machineVersions', get_machineVersions, {
          timeout: 1000 * 60 * 2
        })

        if (res && res.data.status === 0) {
          this.machineVersions_Data = res.data.data
          console.log(this.machineVersions_Data)
          //取到資料後顯示
          this.showReport = true
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
        //資料取得失敗
        this.showReport = false
      }
      $nuxt.$loading.loading = false
    },
    async get_jobMachines(project, version) {
      this.project = project
      this.version = version
      //4-4 呼叫機台查詢(By Version)
      await this.machineSearch(this.project, this.version)
    },
    async machineSearch(project, version) {
      $nuxt.$loading.loading = true
      try {
        let res = await axios.post(
          API.Host + ':' + API.Port + '/machine/searchVersion',
          {
            uid: this.login_uid,
            token: this.login_token,
            project: project,
            version: version
          },
          { timeout: 1000 * 60 * 2 }
        )

        if (res && res.data.status === 0) {
          this.jobMachines_Data = res.data.data
          console.log('*************')
          console.log(this.jobMachines_Data)
          console.log('*************')
          if (this.jobMachines_Data.length === 0) {
            this.jobMachines = false //不顯示機台詳細清單
            // alert('查無機台數量資訊 !')
            this.$store.commit('updateState', ['alertMsg', '查無機台數量資訊 !'])
          } else {
            this.jobMachines = true //顯示機台詳細清單
            this.showSearch = false //不顯示版本機台數量篩選條件資訊
            this.showReport = false //不顯示版本機台數量資訊
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

        // if (this.apiStatus !== 0) {
        //   this.$store.commit('updateState', ['alertMsg', res.data.message])
        // }
        // //token失效有誤時轉跳到登入頁
        // this.apiStatus = res.data.status
        // this.checkToken(this.apiStatus)
        // console.log(222222222222222)
        // console.log(res.data.data)
        // console.log(222222222222222)
        // this.jobMachines_Data = res.data.data
        // console.log('*************')
        // console.log(this.jobMachines_Data)
        // console.log('*************')

        // if (this.jobMachines_Data.length === 0) {
        //   this.jobMachines = false //不顯示機台詳細清單
        //   // alert('查無機台數量資訊 !')
        //   this.$store.commit('updateState', ['alertMsg', '查無機台數量資訊 !'])
        // } else {
        //   this.jobMachines = true //顯示機台詳細清單
        //   this.showSearch = false //不顯示版本機台數量篩選條件資訊
        //   this.showReport = false //不顯示版本機台數量資訊
        // }
      } catch (error) {
        console.log(error)
        this.$store.commit('updateState', ['alertMsg', 'Service request error !'])
        this.jobMachines = false
      }
      $nuxt.$loading.loading = false
    },
    //返回任務明細頁
    return_jobDetail() {
      this.jobMachines = false //機台詳細清單不顯示
      this.showSearch = true //顯示版本機台數量篩選條件資訊
      this.showReport = true //顯示版本機台數量資訊
    },
    reload() {
      //4-4 呼叫機台查詢(By Version)
      this.machineSearch(this.project, this.version)
    },
    //機台資訊視窗頁
    get_machinesInfo(mac) {
      this.mac = mac

      //呼叫 4-5 機台資訊API
      this.machinesInfo()
      // this.showInfo = true
    },
    // 機台資訊API
    async machinesInfo() {
      // console.log("機台資訊API");
      // console.log(this.login_uid);
      // console.log(this.login_token);
      // console.log(this.mac);
      // console.log(typeof this.login_uid);
      // console.log(typeof this.login_token);
      // console.log(typeof this.mac);
      $nuxt.$loading.loading = true
      try {
        let res = await axios.post(
          API.Host + ':' + API.Port + '/machine/info',
          {
            uid: this.login_uid,
            token: this.login_token,
            mac: this.mac
          },
          { timeout: 1000 * 60 * 2 }
        )
        // console.log('+++++++++')
        // console.log(res.data.projectName)
        // console.log(res.data.onlineTime)
        // console.log(res.data.errorLog)
        // console.log('+++++++++')
        this.machineInfo = res.data
        console.log(this.machineInfo.projectName)

        if (this.apiStatus !== 0) {
          this.$store.commit('updateState', ['alertMsg', res.data.message])
        }
        //token失效有誤時轉跳到登入頁
        this.apiStatus = res.data.status
        this.checkToken(this.apiStatus)
        this.showInfo = true
      } catch (error) {
        console.log(error)
        // this.$store.commit('updateState', ['alertMsg', '伺服器連線異常' + error.message])
      }
      $nuxt.$loading.loading = false
    },
    close_showInfo() {
      this.showInfo = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/scss/common/_list.scss';
@import '~/scss/pages/_report.scss';
.row .title {
  text-align: right;
  width: 110px;
}
</style>
