<template>
  <div class="content">
    <div class="content-header">
      <h2 v-show="showTaskList">任務清單</h2>
    </div>
    <div class="task-wrap">
      <div v-show="showTaskList" class="search-wrap">
        <div class="row">
          <div class="title">機種篩選</div>
          <select id="" v-model="project" name="">
            <option value="" >All</option>
            <option
              v-for="data in projectData"
              :key="data.project"
              :value="data.project"
            >{{ data.projectName }}({{ data.project }})</option
            >
          </select>
        </div>
        <div class="row">
          <div class="title">篩選狀態</div>
          <div class="multi-select">
            <div :value="0" :class="{checked:filter_All}" @click="get_status(0)">全部</div>
            <div :value="1" :class="{checked:filter_PendingSign}" @click="get_status(1)">等待簽核</div>
            <div :value="2" :class="{checked:filter_PendingDownload}" @click="get_status(2)">待執行下載</div>
            <div :value="3" :class="{checked:filter_PendingUpdate}" @click="get_status(3)">待執行更新</div>
            <div :value="4" :class="{checked:filter_PendingClose}" @click="get_status(4)">待結案</div>
            <div :value="5" :class="{checked:filter_Completed}" @click="get_status(5)">已完成</div>
            <div :value="6" :class="{checked:filter_Cancelled}" @click="get_status(6)">已取消</div>
          </div>
        </div>
        <button @click="jobList">搜尋</button>
      </div>
      <div class="common-table task-list">
        <div v-show="taskList">
          <div class="common-th">
            <div>
              流水編號
              <!-- <span class="icon-sort"><fa :icon="['fas', 'sort']"/></span> -->
            </div>
            <div>
              任務名稱
              <!-- <span class="icon-sort"><fa :icon="['fas', 'sort']"/></span> -->
            </div>
            <div>
              更新機種
              <!-- <span class="icon-sort"><fa :icon="['fas', 'sort']"/></span> -->
            </div>
            <div>強制更新</div>
            <div>
              建立者
              <!-- <span class="icon-sort"><fa :icon="['fas', 'sort']"/></span> -->
            </div>
            <div>
              建立日期
              <!-- <span class="icon-sort"><fa :icon="['fas', 'sort']"/></span> -->
            </div>
            <div>
              表單狀態
              <!-- <span class="icon-sort"><fa :icon="['fas', 'sort']"/></span> -->
            </div>
          </div>
          <div v-if="jobListData.length === 0">目前無資料</div>
          <div v-for="(list, index) in jobListData" v-else :key="index" class="common-tr">
            <div @click="signing(list.project, list.jobID, list.status, 0)"><fa :icon="['fas', 'file-alt']"/>&nbsp;{{ list.jobID }}</div>          
            <div>{{ list.jobName }}</div>
            <div>{{ list.project }}</div>
            <div>{{ forceArray[index] }}</div>
            <div>{{ list.creator }}</div>
            <div>{{ createTime[index] }}</div>
            <div v-if="userGrade == 2">
              <button v-if="list.status == 2 || list.status == 3 || list.status == 4" :class="{pink:list.status === 1, green:list.status === 2, 'orange-light':list.status === 3,gray:list.status === 4, done:list.status === 5, cancel:list.status === 6}" @click="signing(list.project, list.jobID, list.status, 1)">
                {{ showAccType[list.status] }}
              </button>
              <span v-if="list.status == 1 || list.status == 5 || list.status == 6">
                {{ showAccType[list.status] }}
              </span>
            </div>
            <div v-if="userGrade == 1">
              <button v-if="list.status == 1" :class="{pink:list.status === 1, green:list.status === 2, 'orange-light':list.status === 3,gray:list.status === 4, done:list.status === 5, cancel:list.status === 6}" @click="signing(list.project, list.jobID, list.status, 1)">
                {{ showAccType[list.status] }}
              </button>
              <span v-if="list.status == 2 || list.status == 3 || list.status == 4 || list.status == 5 || list.status == 6">
                {{ showAccType[list.status] }}
              </span>
            </div>
            <div v-if="userGrade == 4">
              <button v-if="list.status == 1 || list.status == 2 || list.status == 3 || list.status == 4" :class="{pink:list.status === 1, green:list.status === 2, 'orange-light':list.status === 3,gray:list.status === 4, done:list.status === 5, cancel:list.status === 6}" @click="signing(list.project, list.jobID, list.status, 1)">
                {{ showAccType[list.status] }}
              </button>
              <span v-if="list.status == 5 || list.status == 6">
                {{ showAccType[list.status] }}
              </span>
            </div>
          </div>
          <div v-show="jobListData.length !== 0" id="page" class="pagination">
            <button value="上一頁" @click="prePage"><fa :icon="['fas', 'angle-left']"/></button>
            <button
              v-for="num in now_total_page"
              :key="num"
              class="active" @click="nowindex = num"
            >
              {{ num }}
            </button>
            <!-- {{ nowindex }} -->
            <button value="下一頁" @click="nextPage"><fa :icon="['fas', 'angle-right']"/></button>
          </div>
        </div>
        <button v-show="showDetail" class="btn-prev" @click="return_jobList"><fa :icon="['fas', 'chevron-left']"/></button>
        <div v-show="showDetail">
          <h2>任務明細 - {{ showAccType[signingStatus] }}</h2>
          <div class="task-detail">
            <div class="col-4">
              <ul class="list-wrap">
                <li>
                  <div class="title">任務名稱</div>
                  <div class="detail">{{ job_jobName }}</div>
                </li>
                <li>
                  <div class="title">機種類型</div>
                  <div class="detail">{{ job_projectName }}</div>
                </li>
                <li>
                  <div class="title">更新版本</div>
                  <div class="detail">{{ job_version }}</div>
                </li>
                <li>
                  <div class="title">強制更新</div>
                  <div class="detail">{{ force[job_force] }}</div>
                </li>
              </ul>
            </div>
            <div class="col-4">
              <ul class="list-wrap">
                <li>
                  <div class="title">下載完成數量</div>
                  <div class="detail">{{ job_downloaded }}</div>
                </li>
                <li>
                  <div class="title">下載完成比例</div>
                  <div class="detail">{{ downloaded_Percentage }}%</div>
                </li>
                <li>
                  <div class="title">更新完成數量</div>
                  <div class="detail">{{ job_updated }}</div>
                </li>
                <li>
                  <div class="title">下載完成數量</div>
                  <div class="detail">{{ updated_Percentage }}%</div>
                </li>
                <li class="single"><a @click="get_jobMachines"><fa :icon="['fas', 'search']"/>查看機台詳細清單</a></li>
              </ul>
            </div>
            <div class="col-4">
              <ul class="list-wrap">
                <li>
                  <div class="title">建立資訊</div>
                  <div class="detail">{{ job_createTime }} {{ job_creator }}</div>
                </li>
                <li>
                  <div class="title">簽核資訊</div>
                  <div class="detail">{{ job_approveTime }} {{ job_approver }}</div>
                </li>
                <li>
                  <div class="title">執行下載</div>
                  <div class="detail">{{ job_downloadTime }} {{ job_downloader }}</div>
                </li>
                <li>
                  <div class="title">執行更新</div>
                  <div class="detail">{{ job_updateTime }} {{ job_updator }}</div>
                </li>
                <li>
                  <div class="title">結案資訊</div>
                  <div class="detail">{{ job_closeTime }} {{ job_close }}</div>
                </li>
                <li>
                  <div class="title">取消資訊</div>
                  <div class="detail">{{ job_cancelTime }} {{ job_cancel }}</div>
                </li>
              </ul>
            </div>
          </div>
          <div v-show="detail_btn" class="btn-wrap">
            <button v-show="cancelTask_btn" class="gray" @click="showCheck(0)">取消任務</button>
            <button :class="{pink:signingStatus === 1, green:signingStatus === 2, 'orange-light':signingStatus === 3,gray:signingStatus === 4, done:signingStatus === 5, cancel:signingStatus === 6}" @click="showCheck(1)">{{ signingButton[signingStatus] }}</button>
          </div>
        </div>
        <div v-show="jobMachines">  
          <button class="btn-prev" @click="return_jobDetail"><fa :icon="['fas', 'chevron-left']"/></button>
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
                下載狀態
              </div>
              <div>
                當前裝置版本
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
              <div>{{ jobMachines.projectName }}
                <span class="icon-detail" @click="get_machinesInfo(jobMachines.mac)"><fa :icon="['fas', 'file-alt']"/></span>
              </div>         
              <div>{{ jobMachines.mac }}</div>
              <div>{{ jobMachines.agent }}</div>
              <div>{{ jobMachines.store }}</div>
              <!-- <div><span class="icon-status noyet"/></div> -->
              <div><span :class="{noyet:jobMachines.status === '0', ongoing:jobMachines.status === '1', done:jobMachines.status === '2', 'update-done':jobMachines.status === '3'}" class="icon-status"/></div>
              <div>{{ jobMachines.version }}</div>
              <div>{{ jobMachines.downloading }}</div>
              <div>{{ jobMachines.downloaded }}</div>
            </div>
            <!-- <div class="common-tr">
              <div>呱呱大冒險</div>         
              <div>00-50-56-XX-XX-XX</div>
              <div>大玩家</div>
              <div>石家莊長安-萬達店</div>
              <div><span class="icon-status ongoing"/></div>
              <div>S101_CN</div>
              <div>--</div>
              <div>--</div>
            </div> -->
            <!-- <div class="common-tr">
              <div>呱呱大冒險</div>         
              <div>00-50-56-XX-XX-XX</div>
              <div>大玩家</div>
              <div>石家莊長安-萬達店</div>
              <div><span class="icon-status done"/></div>
              <div>S101_CN</div>
              <div>--</div>
              <div>--</div>
            </div>
            <div class="common-tr">
              <div>呱呱大冒險</div>         
              <div>00-50-56-XX-XX-XX</div>
              <div>大玩家</div>
              <div>石家莊長安-萬達店</div>
              <div><span class="icon-status update-done"/></div>
              <div>S101_CN</div>
              <div>--</div>
              <div>--</div>
            </div>
            <div class="common-tr">
              <div>呱呱大冒險</div>         
              <div>00-50-56-XX-XX-XX</div>
              <div>大玩家</div>
              <div>石家莊長安-萬達店</div>
              <div><span class="icon-status update-done"/></div>
              <div>S101_CN</div>
              <div>--</div>
              <div>--</div>
            </div>
            <div class="common-tr">
              <div>呱呱大冒險</div>         
              <div>00-50-56-XX-XX-XX</div>
              <div>大玩家</div>
              <div>石家莊長安-萬達店</div>
              <div><span class="icon-status update-done"/></div>
              <div>S101_CN</div>
              <div>--</div>
              <div>--</div>
            </div>
            <div class="common-tr">
              <div>呱呱大冒險</div>         
              <div>00-50-56-XX-XX-XX</div>
              <div>大玩家</div>
              <div>石家莊長安-萬達店</div>
              <div><span class="icon-status update-done"/></div>
              <div>S101_CN</div>
              <div>--</div>
              <div>--</div>
            </div> -->
          </div>
        </div>
      </div>             
    </div>
    <portal v-if="isAdd" to="portalPopupPlace">
      <popup-msg :open="isAdd" :pop-title="'請確認是否執行此動作'">
        <div class="account-popup">
          <div class="btn-wrap">
            <button class="gray" @click="not_addTask">否</button>
            <button @click="click_addTask">是</button>
          </div>
        </div>
      </popup-msg>
    </portal>
    <portal v-if="showInfo" to="portalPopupPlace">
      <popup-msg :open="showInfo" :pop-title="'機台資訊'">
        <div class="history-popup">
          <p>機種名稱 : {{ machineInfo.projectName }}</p>
          <p>最後上線時間 : {{ machineInfo.onlineTime }}</p>
          <p>錯誤訊息 : {{ machineInfo.errorLog }}</p>
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
import List from '~/plugins/js/list'
import axios from 'axios'
import { API } from '~/constants/ark_oauth'
export default {
  data() {
    return {
      projectData: [], // 取得機種清單資訊
      loginId: '', //登入uid
      loginToken: '', //登入token
      userGrade: '', //登入身分別
      jobSearch: true, //是否顯示篩選條件區塊
      taskList: false, //是否顯示任務清單列表
      project: '', //下拉選到的機種
      status: '', //篩選狀態
      limit: 10,
      page: 1,
      jobListData: [], //任務清單資訊
      createTime_Data: [], //建立時間
      createTime: [], //時間格式轉換後的建立時間
      //篩選狀態
      showAccType: {
        0: '全部',
        1: '等待簽核',
        2: '待執行下載',
        3: '待執行更新',
        4: '待結案',
        5: '已完成',
        6: '已取消'
      },
      //簽核按鈕
      signingButton: {
        1: '簽核',
        2: '執行下載',
        3: '執行更新',
        4: '結案'
      },
      force_Data: [], //原始的強制更新狀態
      forceArray: [], //轉換後的強制更新狀態
      //強制更新
      force: {
        0: '否',
        1: '是'
      },
      total_num: 0, //任務清單總筆數
      now_total_page: 0, // 當下總頁數
      nowindex: 1, //當前頁面顯示在第幾頁
      signingStatus: null, //簽核狀態
      jobID: '', //流水編號
      job_Data: [], // 取得任務明細資訊
      showDetail: false,

      /***任務明細資訊***/
      job_jobName: '', //任務名稱
      job_projectName: '', //機種名稱
      job_version: '', //更新版本
      job_force: null, // 0-不強制更新 1-強制更新

      job_total: null, //機台總筆數
      job_downloaded: null, //下載完成總筆數
      downloaded_Percentage: 0, //下載完成比例
      job_updated: null, //更新完成總筆數
      updated_Percentage: 0, //更新完成比例

      job_creator: '', //建立者
      job_createTime: '', //建立時間
      job_approver: '', //簽核者
      job_approveTime: '', //簽核時間
      job_downloader: '', //執行下載者
      job_downloadTime: '', //執行下載時間
      job_updator: '', //執行更新者
      job_updateTime: '', //執行更新時間
      job_close: '', //結案者
      job_closeTime: '', //結案時間
      job_cancel: '', //取消者
      job_cancelTime: '', //取消時間
      detail_btn: true, // 顯示明細簽核按鈕
      cancelTask_btn: true, //顯示明細簽核取消任務按鈕
      isAdd: false,
      isapprove: null, //localStorage的當前狀態 (取消任務:0 , 簽核:1)
      approveStatus: null, //簽核狀態

      /***機台詳細清單***/
      jobMachines: false, //是否顯示機台詳細清單頁面
      jobMachines_Data: [], // 取得機台詳細清單資訊
      showInfo: false, //是否顯示機台資訊視窗
      mac: '', //機台MAC
      machineInfo: [], //機台詳細資訊

      /***下載狀態燈號***/
      // showGrey: true,
      // showRed: false,
      // showYellow: false,
      // showGreen: false,
      jobMachines_version: [], //機台詳細資訊的版本(當前版本)
      jobMachines_downloading: [], //機台詳細資訊的下載中版本
      jobMachines_downloaded: [], //機台詳細資訊的已下載版本

      filter_All: false,
      filter_PendingSign: false,
      filter_PendingDownload: false,
      filter_PendingUpdate: false,
      filter_PendingClose: false,
      filter_Completed: false,
      filter_Cancelled: false,

      showTaskList: true,
      apiStatus: 0 //呼叫 api status
    }
  },
  watch: {
    //當前頁數變化時執行取得清單資訊
    nowindex: {
      handler: 'on_page_button',
      deep: true
    }
  },
  beforeMount() {
    //取登入身分別狀態
    this.LoginStatus()
    //取得localStorage的資訊
    this.getStorage()
    // 取得機種清單資訊
    this.get_projectList()
    //篩選狀態預設為:全部
    this.filter_All = true
    this.status = 0
    // this.jobList()

    // 判斷是否從任務設定轉跳過來
    let isAddTask = List.isAddTask()

    if (isAddTask) {
      //  取從任務設定轉跳過來的新增任務機種
      this.project = List.get_AddProject()
      // this.taskList = true
      this.status = 0
      // 取得任務清單資訊
      this.jobList()
    }
  },
  methods: {
    LoginStatus() {
      this.userGrade = window.localStorage.getItem('login_type') //取得登入身分別 (0:系統管理員 1:專案負責人 2:運營負責人 3:報表統計處理者)
    },
    getStorage() {
      //取得localStorage的資訊
      this.loginId = Project.getUid()
      this.loginToken = Project.getToken()
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
      } catch (error) {
        console.log(error)
        this.$store.commit('updateState', ['alertMsg', 'Service request error !'])
      }
      $nuxt.$loading.loading = false
    },
    get_status(status) {
      this.status = status
      if (status === 0) {
        this.filter_All = true
        this.filter_PendingSign = false
        this.filter_PendingDownload = false
        this.filter_PendingUpdate = false
        this.filter_PendingClose = false
        this.filter_Completed = false
        this.filter_Cancelled = false
      } else if (status === 1) {
        this.filter_All = false
        this.filter_PendingSign = true
        this.filter_PendingDownload = false
        this.filter_PendingUpdate = false
        this.filter_PendingClose = false
        this.filter_Completed = false
        this.filter_Cancelled = false
      } else if (status === 2) {
        this.filter_All = false
        this.filter_PendingSign = false
        this.filter_PendingDownload = true
        this.filter_PendingUpdate = false
        this.filter_PendingClose = false
        this.filter_Completed = false
        this.filter_Cancelled = false
      } else if (status === 3) {
        this.filter_All = false
        this.filter_PendingSign = false
        this.filter_PendingDownload = false
        this.filter_PendingUpdate = true
        this.filter_PendingClose = false
        this.filter_Completed = false
        this.filter_Cancelled = false
      } else if (status === 4) {
        this.filter_All = false
        this.filter_PendingSign = false
        this.filter_PendingDownload = false
        this.filter_PendingUpdate = false
        this.filter_PendingClose = true
        this.filter_Completed = false
        this.filter_Cancelled = false
      } else if (status === 5) {
        this.filter_All = false
        this.filter_PendingSign = false
        this.filter_PendingDownload = false
        this.filter_PendingUpdate = false
        this.filter_PendingClose = false
        this.filter_Completed = true
        this.filter_Cancelled = false
      } else if (status === 6) {
        this.filter_All = false
        this.filter_PendingSign = false
        this.filter_PendingDownload = false
        this.filter_PendingUpdate = false
        this.filter_PendingClose = false
        this.filter_Completed = false
        this.filter_Cancelled = true
      }
    },
    // 取得任務清單資訊
    async jobList() {
      $nuxt.$loading.loading = true
      try {
        let get_jobList = {
          uid: this.loginId,
          token: this.loginToken,
          // project: this.project,     //選填
          status: this.status,
          limit: this.limit,
          page: this.nowindex
        }

        if (this.project !== '') {
          get_jobList.project = this.project
        }

        if (this.status === '') {
          this.$store.commit('updateState', ['alertMsg', '請選擇篩選狀態 !'])
        }

        let res = await axios.post(API.Host + ':' + API.Port + '/job/list', get_jobList, { timeout: 1000 * 60 * 2 })
        if (res && res.data.status === 0) {
          this.jobListData = res.data.data
          for (let i = 0; i < this.jobListData.length; i++) {
            //把原始的強制更新狀態塞進force_Data
            this.force_Data.push(this.jobListData[i].force)
            //把原始的ISO 8601時間塞進createTime_Data
            this.createTime_Data.push(this.jobListData[i].createTime)
          }

          //強制更新狀態轉換
          for (let i = 0; i < this.force_Data.length; i++) {
            this.forceArray.push(this.force[this.force_Data[i]])
          }

          //時間格式轉換
          for (let i = 0; i < this.createTime_Data.length; i++) {
            let ISOtime = this.createTime_Data[i]
            let d = new Date(ISOtime) //把原始的ISO 8601時間更改成+8時區
            //轉換成普通的時間格式
            this.createTime.push(
              new Date(d.getTime() - d.getTimezoneOffset() * 60000)
                .toISOString()
                .replace('T', ' ')
                .replace(/\..+$/, '')
            )
          }

          //分頁功能
          this.total_num = res.data.total //任務清單總筆數
          // 計算總頁數
          let total_page = Math.ceil(this.total_num / this.limit)
          // 當下總頁數指給now_total_page
          this.now_total_page = total_page
          this.taskList = true
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
        this.taskList = false
      }
      $nuxt.$loading.loading = false
    },
    async on_page_button(nowindex) {
      this.nowindex = nowindex
      // 取得任務清單資訊
      await this.jobList()
    },
    async prePage() {
      if (this.nowindex <= 1) {
        this.nowindex = 1
      } else {
        this.nowindex = this.nowindex - 1
      }
      // 取得任務清單資訊
      await this.jobList()
    },
    async nextPage() {
      if (this.nowindex >= this.now_total_page) {
        this.nowindex = this.now_total_page
      } else {
        this.nowindex = this.nowindex + 1
      }
      // 取得任務清單資訊
      await this.jobList()
    },
    async signing(project, jobID, status, isCheck) {
      this.project = project
      this.jobID = jobID
      this.signingStatus = status
      await this.jobDetail()

      //任務明細是否顯示簽核鈕
      if (isCheck === 0) {
        //點選任務清單查看按鈕不能做簽核
        this.detail_btn = false
      } else {
        //待執行更新狀態不能取消任務
        if (this.signingStatus === 3 || this.signingStatus === 4) {
          this.cancelTask_btn = false //不顯示取消任務按鈕
        }
        this.detail_btn = true
      }
      //隱藏任務清單標頭
      this.showTaskList = false
    },
    // 取得任務明細資訊
    async jobDetail() {
      $nuxt.$loading.loading = true
      try {
        let res = await axios.post(
          API.Host + ':' + API.Port + '/job/detail',
          {
            uid: this.loginId,
            token: this.loginToken,
            jobID: this.jobID
          },
          { timeout: 1000 * 60 * 2 }
        )

        if (this.apiStatus !== 0) {
          this.$store.commit('updateState', ['alertMsg', res.data.message])
        }
        //token失效有誤時轉跳到登入頁
        this.apiStatus = res.data.status
        this.checkToken(this.apiStatus)

        // console.log("取得任務明細資訊");
        this.job_Data = res.data

        // console.log(this.job_Data.jobName); //任務名稱
        this.job_jobName = this.job_Data.jobName

        // console.log(this.job_Data.projectName); //機種名稱
        this.job_projectName = this.job_Data.projectName

        // console.log(this.job_Data.version); //版本
        this.job_version = this.job_Data.version

        // console.log(this.job_Data.force); // 0-不強制更新 1-強制更新
        this.job_force = this.job_Data.force

        //
        // console.log(this.job_Data.total); //機台總筆數
        this.job_total = this.job_Data.total

        // console.log(this.job_Data.downloaded); //下載完成總筆數
        this.job_downloaded = this.job_Data.downloaded

        //下載完成比例
        this.downloaded_Percentage = Math.round((this.job_downloaded / this.job_total) * 10000) / 100.0 // 小數點後兩位

        // console.log(this.job_Data.updated); //更新完成總筆數
        this.job_updated = this.job_Data.updated

        //更新完成比例
        this.updated_Percentage = Math.round((this.job_updated / this.job_total) * 10000) / 100.0 // 小數點後兩位

        //
        // console.log(this.job_Data.creator); //建立者
        this.job_creator = this.job_Data.creator

        // console.log(this.job_Data.createTime); //建立時間
        // this.job_createTime = this.job_Data.createTime

        // this.job_createTime = this.job_Data.createTime
        /***時間格式轉換***/
        let ISOtime = this.job_Data.createTime
        let d = new Date(ISOtime) //把原始的ISO 8601時間更改成+8時區

        //轉換成普通的時間格式
        this.job_createTime = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
          .toISOString()
          .replace('T', ' ')
          .replace(/\..+$/, '')
        console.log(this.job_createTime)

        // console.log(this.job_Data.approver); //簽核者
        this.job_approver = this.job_Data.approver

        // console.log(this.job_Data.approveTime); //簽核時間
        this.job_approveTime = this.job_Data.approveTime

        // console.log(this.job_Data.downloader); //執行下載者
        this.job_downloader = this.job_Data.downloader

        // console.log(this.job_Data.downloadTime); //執行下載時間
        this.job_downloadTime = this.job_Data.downloadTime

        // console.log(this.job_Data.updator); //執行更新者
        this.job_updator = this.job_Data.updator

        // console.log(this.job_Data.updateTime); //執行更新時間
        this.job_updateTime = this.job_Data.updateTime

        // console.log(this.job_Data.close); //結案者
        this.job_close = this.job_Data.close

        // console.log(this.job_Data.closeTime); //結案時間
        this.job_closeTime = this.job_Data.closeTime

        // console.log(this.job_Data.cancel); //取消者
        this.job_cancel = this.job_Data.cancel

        // console.log(this.job_Data.cancelTime); //取消時間
        this.job_cancelTime = this.job_Data.cancelTime

        //頁面顯示調整
        this.jobSearch = false //篩選區塊不顯示
        this.taskList = false //任務清單不顯示
        this.showDetail = true //顯示明細清單
      } catch (error) {
        console.log(error)
        // this.$store.commit('updateState', ['alertMsg', '伺服器連線異常' + error.message])
        this.showDetail = false
      }
      $nuxt.$loading.loading = false
    },
    //返回任務清單頁
    return_jobList() {
      this.showDetail = false //明細清單不顯示
      this.taskList = true //任務清單顯示
      this.jobSearch = true //篩選區塊顯示
      this.showTaskList = true //篩選區塊顯示
    },
    showCheck(num) {
      this.isAdd = true //是否顯示確認簽核視窗
      //  存簽核狀態進localStorage (0:取消任務 1:執行簽核流程)
      List.signingStatus(num)
    },
    not_addTask() {
      this.isAdd = false
    },
    async click_addTask() {
      //取簽核狀態進Localstorage
      this.isapprove = List.get_signingStatus()

      //判斷確認視窗是取消任務還是要簽核
      if (this.isapprove === 0) {
        //取消任務
        this.approveStatus = 6
      } else {
        //簽核
        this.approveStatus = this.signingStatus + 1
      }
      //呼叫5-6任務簽核API
      await this.approve()

      this.showDetail = false //明細清單不顯示
      // this.detail_btn = false
      this.isAdd = false
      this.showTaskList = true
      await this.jobList()
    },
    // 取得任務簽核資訊
    async approve() {
      $nuxt.$loading.loading = true
      try {
        //取簽核狀態進Localstorage
        this.isapprove = parseInt(List.get_signingStatus())

        console.log(this.isapprove)
        console.log(typeof this.isapprove)
        //判斷確認視窗是取消任務還是要簽核
        if (this.isapprove === 0) {
          //取消任務
          this.approveStatus = 6
        } else {
          //簽核
          this.approveStatus = this.signingStatus + 1
        }

        let res = await axios.post(
          API.Host + ':' + API.Port + '/job/approve',
          {
            uid: this.loginId,
            token: this.loginToken,
            project: this.project,
            jobID: this.jobID,
            status: this.approveStatus
          },
          { timeout: 1000 * 60 * 2 }
        )
        // this.projectData = res.data.data;
        // console.log(res.data)

        if (this.apiStatus !== 0) {
          this.$store.commit('updateState', ['alertMsg', res.data.message])
        }
        //token失效有誤時轉跳到登入頁
        this.apiStatus = res.data.status
        this.checkToken(this.apiStatus)
      } catch (error) {
        console.log(error)
        // this.$store.commit('updateState', ['alertMsg', '伺服器連線異常' + error.message])
      }
      $nuxt.$loading.loading = false
    },
    //查看機台詳細清單
    async get_jobMachines() {
      this.showDetail = false //明細清單不顯示
      this.jobMachines = true //顯示查看機台詳細清單

      //呼叫 5-5 機台詳細清單查詢API
      await this.jobMachines_detail()

      //傳遞jobID參數到datailList頁面
      // this.$router.push({
      //   name: "detailList",
      //   query: { jobID: this.jobID }
      // });
    },
    //返回任務明細頁
    return_jobDetail() {
      this.jobMachines = false //機台詳細清單不顯示
      this.showDetail = true //明細清單顯示
    },
    //機台詳細清單重新整理
    reload() {
      //呼叫 5-5 機台詳細清單查詢API
      this.jobMachines_detail()
    },
    //機台詳細清單查詢API
    async jobMachines_detail() {
      $nuxt.$loading.loading = true
      try {
        let res = await axios.post(
          API.Host + ':' + API.Port + '/job/machines',
          {
            uid: this.loginId,
            token: this.loginToken,
            jobID: this.jobID
          },
          { timeout: 1000 * 60 * 2 }
        )

        // console.log("機台詳細清單查詢API");
        // console.log(res.data);
        this.jobMachines_Data = res.data.data
        console.log('===================================')
        console.log(this.jobMachines_Data)
        console.log('===================================')

        /***下載狀態燈號***/
        //清空
        this.jobMachines_version = []
        this.jobMachines_downloading = []
        this.jobMachines_downloaded = []
        for (let i = 0; i < this.jobMachines_Data.length; i++) {
          // this.jobMachines_Data[i].version
          this.jobMachines_version.push(this.jobMachines_Data[i].version)
          this.jobMachines_downloading.push(this.jobMachines_Data[i].downloading)
          this.jobMachines_downloaded.push(this.jobMachines_Data[i].downloaded)
        }

        if (this.apiStatus !== 0) {
          this.$store.commit('updateState', ['alertMsg', res.data.message])
        }
        //token失效有誤時轉跳到登入頁
        this.apiStatus = res.data.status
        this.checkToken(this.apiStatus)
        // console.log(666666666666666666);
        // console.log(this.jobMachines_version);
        // console.log(this.jobMachines_downloading);
        // console.log(this.jobMachines_downloaded);
        // console.log(666666666666666666);

        // this.jobMachines_version = this.jobMachines_Data, //機台詳細資訊的版本(當前版本)
        // this.jobMachines_downloading : "",  //機台詳細資訊的下載中版本
        // this.jobMachines_downloaded : ""   //機台詳細資訊的已下載版本
      } catch (error) {
        console.log(error)
        // this.$store.commit('updateState', ['alertMsg', '伺服器連線異常' + error.message])
      }
      $nuxt.$loading.loading = false
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
      // console.log(this.loginId);
      // console.log(this.loginToken);
      // console.log(this.mac);
      // console.log(typeof this.loginId);
      // console.log(typeof this.loginToken);
      // console.log(typeof this.mac);
      $nuxt.$loading.loading = true
      try {
        let res = await axios.post(
          API.Host + ':' + API.Port + '/machine/info',
          {
            uid: this.loginId,
            token: this.loginToken,
            mac: this.mac
          },
          { timeout: 1000 * 60 * 2 }
        )
        // this.machineInfo = res.data
        if (res && this.apiStatus === 0) {
          this.machineInfo = res.data
          this.showInfo = true
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
        this.$store.commit('updateState', ['alertMsg', 'Service request error !'])
      }
      $nuxt.$loading.loading = false
    },
    close_showInfo() {
      this.showInfo = false
    }
  }
}
</script>

<style lang="scss">
@import '~/scss/common/_list.scss';
@import '~/scss/pages/_task.scss';
@import '~/scss/pages/_report.scss';
</style>
