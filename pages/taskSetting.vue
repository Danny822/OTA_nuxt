<template>
  <div class="content">
    <div class="content-header">
      <h2 v-show="machineSet">任務設定</h2>
    </div>
    <div class="task-wrap">
      <div v-show="showTaskSet" class="common-tabs">
        <!-- <a :class="{ active: item == `globalSet`}" @click="setMode('globalSet')">全域設定</a>
        <a :class="{ active: item == `projectSet`}" @click="setMode('projectSet')">機種設定</a> -->
        <a :class="{ active: item == `globalSet`}" @click="item = `globalSet`">全域設定</a>
        <a :class="{ active: item == `projectSet`}" @click="item = `projectSet`">機種設定</a>
      </div>
      <div v-show="showMachineSearch">
        <div v-if="item == `globalSet`" class="search-wrap has-tab">
          <div class="row">
            <div class="title">搜尋條件</div>
            <select id="" v-model="selectName" name="">
              <option value="" disabled>機種名稱</option>
              <option v-for="list_data in projectData"
                      :key="list_data.project"
                      :value="list_data.project">{{ list_data.projectName }}({{ list_data.project }})</option>
            </select>
            <select id="" v-model="selectAgents" name="">
              <option value="" disabled>系統商</option>
              <option
                v-for="agents_data in agents"
                :key="agents_data"
                :value="agents_data"
              >{{ agents_data }}</option
              >
            </select>
          </div>     
          <button @click="get_task">搜尋</button>
        </div>
        <div v-if="item == `projectSet`" class="search-wrap has-tab">
          <div class="row">
            <div class="title">搜尋條件</div>
            <select id="" v-model="selectName" name="">
              <option value="">機種名稱</option>
              <option
                v-for="list_data in projectData"
                :key="list_data.project"
                :value="list_data.project"
              >{{ list_data.projectName }}({{ list_data.project }})</option
              >
            </select>
            <select id="" v-model="selectAgents" name="">
              <option value="">系統商</option>
              <option
                v-for="(agents_data, index) in agents"
                :key="index"
                :value="agents_data"
              >{{ agents_data }}</option
              >
            </select>
            <select id="" v-model="selectStores" name="">
              <option value="" >店家名稱</option>
              <option
                v-for="(stores_data, index) in stores"
                :key="index"
                :value="stores_data"
              >{{ stores_data }}</option
              >
            </select>
          </div>
          <div class="row">
            <div class="title">篩選版本</div>
            <select id="" v-model="selectVer" name="">
              <!-- <option value="">All</option> -->
              <option value="">篩選版本</option>
              <option v-for="(data, index) in version" :key="index">{{
                data
              }}</option>
            </select>
          <!-- {{ selectName }}
          {{ selectAgents }}
          {{ selectStores }}
          {{ selectVer }} -->
          </div>
          <div class="row">
            <div class="title">篩選MAC</div>
            <input v-model="mac" type="text" placeholder="請輸入MAC地址">
          <!-- {{ mac }} -->
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
          <button @click="get_machine">搜尋</button>
        </div>
      </div>
      <!-- 全域設定 -->
      <div v-show="createTask" class="build-task">
        <h3>建立任務</h3>
        <ul class="list-wrap">
          <li>
            <div class="title">任務名稱</div>
            <div class="detail"><input v-model="taskName" type="text" placeholder="請輸入任務名稱"></div>
          </li>
          <li>
            <div class="title">機種名稱</div>
            <div class="detail">{{ selectName }}</div>
          </li>
          <li>
            <div class="title">系統商</div>
            <div class="detail">{{ selectAgents }}</div>
          </li>
          <li>
            <div class="title">機台總筆數</div>
            <div class="detail">{{ totalMachine }}</div>
          </li>
          <li>
            <div class="title">更新版本</div>
            <div class="detail">
              <select id="" v-model="selectVer" name="">
                <option value="">請選擇版本</option>
                <option v-for="(data, index) in updateVersion" :key="index">{{
                  data
                }}</option>
              </select>
            </div>
          </li>
          <li>
            <div class="title">強制更新</div>
            <div class="detail">
              <select id="" v-model="isUpdate" name="">
                <option :value="0">否</option>
                <option :value="1">是</option>
              </select>
            </div>
          </li>
        </ul>
      </div>
      <div v-show="createTask" class="btn-wrap">
        <button class="orange" @click="addTask"><fa :icon="['fas', 'plus']"/> 加到任務清單</button>
      </div> 
      <portal v-if="isAdd" to="portalPopupPlace">
        <div class="alert-mask">
          <div class="alert-wrap">
            <div class="alert-body">
              <p>請確認是否執行此動作</p>
              <div class="btn-wrap">
                <button class="gray" @click="not_addTask">否</button>
                <button @click="click_addTask">是</button>
              </div>
            </div>
          </div>
        </div>
      </portal>
      <portal v-if="success" to="portalPopupPlace">
        <div class="alert-mask">
          <div class="alert-wrap">
            <div class="alert-body">
              <p>您已成功建立任務 !</p>
              <div class="btn-wrap">
                <button @click="confirm">確認</button>
              </div>
            </div>
          </div>
        </div>
      </portal>

      <!-- 機種任務設定 -->
      <div v-show="showMachineData" class="common-table task-choice">
        <div class="common-th">
          <div>
            <input v-model="checked" type="checkbox" @change="changeAllChecked()">
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
            備註
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
        <div v-if="machineSearch.length === 0">目前無資料</div>
        <div v-for="(machineData, index) in machineSearch" v-else :key="index" class="common-tr">
          <div>
            <!-- <span class="icon-delete"><fa :icon="['fas', 'minus-circle']"/></span> -->
            <!-- {{ checkedNames }} -->
            <input :value="machineData" v-model="checkedNames" type="checkbox">
            {{ machineData.projectName }}
          </div>          
          <div>{{ machineData.mac }}</div>
          <div>{{ machineData.agent }}</div>
          <div>{{ machineData.store }}</div>
          <div>{{ machineData.note }}</div>
          <div>{{ machineData.version }}</div>
          <div>{{ machineData.downloading }}</div>
          <div>{{ machineData.downloaded }}</div>
        </div>
      </div> 
      
      
      <div v-show="machineSearch.length !== 0">
        <div v-show="showMachineData" id="page" class="pagination">
          <button value="上一頁" @click="prePage"><fa :icon="['fas', 'angle-left']"/></button>
          <button
            v-for="num in nowTotalPage"
            :key="num"
            class="active" @click="nowindex = num"
          >
            {{ num }}
          </button>
          <!-- {{ nowindex }} -->
          <button value="下一頁" @click="nextPage"><fa :icon="['fas', 'angle-right']"/></button>
        </div>
      </div>
      <div v-show="machineSearch.length !== 0">
        <div v-show="showMachineData" class="btn-wrap table-footer">
          <button class="orange-light" @click="get_check">選取<div v-show="showMachineNum" class="kiosk-amount">{{ checkedNamesNum }}</div></button>
          <button class="orange" @click="create_machineSet">建立任務</button>
        </div>
      </div> 
      
      
      
      <button v-show="showMachineSet" @click="returnProjectSet">返回</button>
      <div v-show="showMachineSet" class="build-task">
        <h3>建立任務</h3>
        <ul class="list-wrap">
          <li>
            <div class="title">任務名稱</div>
            <div class="detail"><input v-model="machineSetName" type="text" placeholder="請輸入任務名稱"></div>
          </li>
          <li>
            <div class="title">機種名稱</div>
            <div class="detail">{{ selectName }}</div>
          </li>
          <li>
            <div class="title">更新版本</div>
            <div class="detail">
              <select id="" v-model="machineSetVer" name="">
                <option value="">請選擇版本</option>
                <option v-for="(data, index) in machineSetVersion" :key="index">{{
                  data
                }}</option>
              </select>
            </div>
          </li>
          <li>
            <div class="title">強制更新</div>
            <div class="detail">
              <select id="" v-model="isUpdate" name="">
                <option :value="0">否</option>
                <option :value="1">是</option>
              </select>
            </div>
          </li>
        </ul>
      </div>
      <div v-show="showMachineSet" class="btn-wrap">
        <button class="orange" @click="machineAddTask"><fa :icon="['fas', 'plus']"/> 加到任務清單</button>
      </div> 

      <div v-show="isShowCheckData" class="common-table task-choice">
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
            備註
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
        <div v-if="checkeList.length === 0">目前無資料</div>
        <div v-for="(checkData, index) in checkeList" v-else :key="index" class="common-tr">
          <div>
            <span class="icon-delete" @click="del_task(checkData.mac)"><fa :icon="['fas', 'minus-circle']"/></span>
            <!-- <input :value="machineData" v-model="checkedNames" type="checkbox"> -->
          </div>          
          <div>{{ checkData.mac }}</div>
          <div>{{ checkData.agent }}</div>
          <div>{{ checkData.store }}</div>
          <div>{{ checkData.note }}</div>
          <div>{{ checkData.version }}</div>
          <div>{{ checkData.downloading }}</div>
          <div>{{ checkData.downloaded }}</div>
        </div>
      </div>
      <portal v-if="machineSetAdd" to="portalPopupPlace">
        <div class="alert-mask">
          <div class="alert-wrap">
            <div class="alert-body">
              <p>請確認是否執行此動作</p>
              <div class="btn-wrap">
                <button class="gray" @click="machine_notAdd">否</button>
                <button @click="machineSet_addTask">是</button>
              </div>
            </div>
          </div>
        </div>
      </portal>
      <portal v-if="success" to="portalPopupPlace">
        <div class="alert-mask">
          <div class="alert-wrap">
            <div class="alert-body">
              <p>您已成功建立任務 !</p>
              <div class="btn-wrap">
                <button @click="confirm">確認</button>
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
import Task from '~/plugins/js/task'
import axios from 'axios'
import { API } from '~/constants/ark_oauth'
export default {
  data() {
    return {
      showTaskSet: true, // 任務設定頁顯示全域設定、機種設定
      // 全域設定
      item: 'globalSet',
      projectData: [], // 取得機種清單資訊
      loginId: '', //登入uid
      loginToken: '', //登入token
      selectName: '', //下拉選到的機種代碼
      agents: [], // 取得機種系統商資訊
      selectAgents: '', //下拉選到的系統商
      updateVersion: [], // 取得可更新版本號資訊
      totalMachine: 0, //機台總筆數
      selectVer: '', //下拉選到的更新版本
      isUpdate: 0, //下拉選是否強制更新,預設為否
      taskName: '', //任務名稱
      createTask: false, //是否顯示建立任務視窗
      isAdd: false, //顯示是否執行新增任務視窗
      success: false, //是否顯示成功建立任務視窗

      // 機種設定
      mac: '', //輸入篩選 MAC值
      stores: [], // 取得機種店家名稱資訊
      selectStores: '', //下拉選到的店家名稱
      version: [], // 取得機種版本資訊
      lastOnline: '', //最後上線時間
      limit: 10,
      page: 1,
      machineSearch: [], // 取得機種機台查詢資訊
      showMachineSearch: true, //是否顯示篩選資訊
      showMachineData: false, //是否顯示篩選清單列表
      nowindex: 1, //當前頁面顯示在第幾頁
      nowTotalPage: 1, //當前總共會有幾頁
      checked: false, //checkbox是否被選
      checkedNames: [], //checkbox選到後儲存data
      checkeList: [], // checkbox選取按建立任務後儲存data
      checkedNamesNum: null, //checkbox選到的機台數量
      checkedNamesMac: [],
      showMachineNum: false, //機台數量顯示
      showMachineSet: false, //機種設定任務顯示
      machineSetData: [], //機種設定勾選後建立任務查詢到的機台資訊
      machineSetVersion: [], //機種設定勾選後建立任務查詢到的機台版本資訊
      machineSetName: '', //機種設定的任務名稱
      machineSetVer: '', //機種設定下拉選到的更新版本
      isShowCheckData: false, //是否顯示勾選的機台欲加入任務資訊
      machineSetAdd: false, //顯示是否執行新增任務視窗

      timeAll: false,
      timeYear: false,
      timeMounth: false,
      timeWeek: false,

      /***全域建立任務欄位驗證***/
      taskNameError: false, //建立任務名稱欄位錯誤訊息顯示
      taskVersionError: false, //建立任務更新版本欄位錯誤訊息顯示

      /***機種設定建立任務欄位驗證***/
      selectNameError: false,
      lastOnlineError: false, //最後上線錯誤訊息顯示
      machineSet: true,
      apiStatus: 0 //呼叫 api status
    }
  },
  watch: {
    selectName: function(newVal, oldVal) {
      this.get_projectAgents()
      this.get_stores()
      this.get_version()
      // this.get_version()
      // console.log("+++++++++++++++")
      // console.log(newVal,oldVal)
      // console.log("++++++++++++++++++")
    },

    selectAgents: function(newVal, oldVal) {
      this.get_stores()
      this.get_version()
    },
    selectStores: function(newVal, oldVal) {
      this.get_version()
    },
    item: function(newVal, oldVal) {
      this.setMode()
    },
    checkedNames: {
      handler: 'changeChecked',
      deep: true
    }
    // ,
    // checked: {
    //   handler: 'showNum',
    //   deep: true
    // }
  },
  beforeMount() {
    //設定模式
    // this.setMode()
    // 取得localstorage資訊
    this.getStorage()
    // 取得機種清單資訊
    this.get_projectList()
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
    setMode() {
      //清空資訊
      this.selectName = ''
      this.selectAgents = ''
      this.selectStores = ''
      this.selectVer = ''
      this.mac = ''
      this.lastOnline = ''
      this.timeAll = ''
      this.timeYear = ''
      this.timeMounth = ''
      this.timeWeek = ''
      this.createTask = false //不顯示建立任務視窗
      this.showMachineData = false
      //清空全選
      this.checked = false
      this.checkedNames = []
      //不顯示選取數字並清空
      this.showMachineNum = false
      this.checkedNamesNum = ''
    },
    changeChecked() {
      if (this.machineSearch.length === 0) {
        this.checked = false
      } else {
        if (this.checkedNames.length === this.machineSearch.length) {
          this.checked = true
        } else {
          this.checked = false
          // this.showMachineNum = false
        }
        // this.checkedNamesNum = this.checkedNames.length
      }
    },
    //全選
    changeAllChecked() {
      if (this.checked) {
        this.checkedNames = []
        for (let i = 0; i < this.machineSearch.length; i++) {
          this.checkedNames.push(this.machineSearch[i])
        }
        // console.log(this.checkedNames);
        // this.checkedNames = this.show_data;
      } else {
        this.checkedNames = []
      }
    },
    getStorage() {
      //取得localStorage的資訊
      this.loginId = Project.getUid()
      this.loginToken = Project.getToken()
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
        this.projectData = res.data.data

        // console.log(this.projectData)
        if (this.apiStatus !== 0) {
          console.log(this.apiStatus)
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
    //取得機種系統商清單資訊
    async get_projectAgents() {
      // console.log("機種系統商API");
      $nuxt.$loading.loading = true
      try {
        let res = await axios.post(
          API.Host + ':' + API.Port + '/project/agents',
          {
            uid: this.loginId,
            token: this.loginToken,
            project: this.selectName
          },
          { timeout: 1000 * 60 * 2 }
        )
        console.log(res.data)
        this.agents = res.data.data
        console.log(this.agents)

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
    async get_task() {
      //篩選機種名稱必選，沒有選擇不可點搜尋
      if (this.selectName === '') {
        this.$store.commit('updateState', ['alertMsg', '請選擇機種名稱 !'])
        this.createTask = false
      } else {
        this.searchRange()
        this.createTask = true
      }
    },
    //全域設定-機台查詢
    async searchRange() {
      $nuxt.$loading.loading = true
      try {
        let get_searchRange = {
          uid: this.loginId,
          token: this.loginToken,
          project: this.selectName
          // agent: this.selectAgents     //選填
        }

        if (this.selectAgents !== '') {
          get_searchRange.agent = this.selectAgents
        }
        let res = await axios.post(API.Host + ':' + API.Port + '/machine/searchRange', get_searchRange, {
          timeout: 1000 * 60 * 2
        })
        this.totalMachine = res.data.total
        this.updateVersion = res.data.data
        console.log(this.updateVersion)

        if (this.apiStatus !== 0) {
          this.$store.commit('updateState', ['alertMsg', res.data.message])
        }
        //token失效有誤時轉跳到登入頁
        this.apiStatus = res.data.status
        this.checkToken(this.apiStatus)
      } catch (error) {
        console.log(error)
        console.log(error.response.data)
        // this.$store.commit('updateState', ['alertMsg', '伺服器連線異常' + error.message])
      }
      $nuxt.$loading.loading = false
    },
    //呼叫是否執行新增任務視窗
    addTask() {
      console.log(this.taskName)
      if (this.taskName === '') {
        // this.taskNameError = true
        // this.isAdd = false
        this.$store.commit('updateState', ['alertMsg', '請輸入任務名稱 !'])
      } else if (this.selectVer === '') {
        // this.taskNameError = false
        this.$store.commit('updateState', ['alertMsg', '請選擇更新版本 !'])
      }

      // if (this.selectVer === '') {
      //   this.taskVersionError = true
      //   this.taskVersion_errorMsg = '請選擇更新版本'
      //   this.isAdd = false
      // } else {
      //   this.taskVersionError = false
      //   this.taskVersion_errorMsg = ''
      // }
      if (this.taskName !== '' && this.selectVer !== '') {
        this.isAdd = true
      }
      // this.isAdd = true
      // this.addRange()
    },
    //呼叫新增全域任務API
    async click_addTask() {
      await this.addRange()
    },
    not_addTask() {
      this.isAdd = false
    },
    //新增全域任務
    async addRange() {
      $nuxt.$loading.loading = true
      try {
        let get_addRange = {
          uid: this.loginId,
          token: this.loginToken,
          jobName: this.taskName,
          project: this.selectName,
          // agent: this.selectAgents,   //選填
          version: this.selectVer,
          force: this.isUpdate
        }
        // console.log(7777777777)
        // console.log(this.isUpdate)
        // console.log(77777777777777)
        if (this.selectAgents !== '') {
          get_addRange.agent = this.selectAgents
        }
        let res = await axios.post(API.Host + ':' + API.Port + '/job/addRange', get_addRange, {
          timeout: 1000 * 60 * 2
        })
        console.log(res.data)
        if (res.data.status === 0) {
          //成功建立任務視窗
          this.success = true
          Task.addTask(res.data.status)
          Task.addProject(this.selectName)
        } else {
          this.success = false
        }

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
    //成功建立任務視窗確認鈕送出
    confirm() {
      //轉跳到任務清單頁
      this.$router.push('/taskList')
    },

    /******機台設定方法開始******/

    //取得機種店家名稱資訊
    async get_stores() {
      $nuxt.$loading.loading = true
      try {
        //機種店家名稱資訊 request
        let get_stores_Data = {
          uid: this.loginId,
          token: this.loginToken,
          project: this.selectName
          // agent: this.selectAgents  //選填
        }
        if (this.selectAgents !== '') {
          get_stores_Data.agent = this.selectAgents
        }
        let res = await axios.post(API.Host + ':' + API.Port + '/project/stores', get_stores_Data, {
          timeout: 1000 * 60 * 2
        })
        // console.log("取得機種店家名稱資訊");
        // console.log(res.data.data)

        if (this.apiStatus !== 0) {
          this.$store.commit('updateState', ['alertMsg', res.data.message])
        }
        //token失效有誤時轉跳到登入頁
        this.apiStatus = res.data.status
        this.checkToken(this.apiStatus)
        this.stores = res.data.data
      } catch (error) {
        console.log(error)
        // this.$store.commit('updateState', ['alertMsg', '伺服器連線異常' + error.message])
      }
      $nuxt.$loading.loading = false
    },
    //取得機種版本資訊
    async get_version() {
      $nuxt.$loading.loading = true
      try {
        //取得機種版本資訊 request
        let get_version_Data = {
          uid: this.loginId,
          token: this.loginToken,
          project: this.selectName
          // agent: this.selectAgents  //選填
          // store: this.selectStores  //選填
        }
        if (this.selectAgents !== '' || this.selectStores !== '') {
          get_version_Data.agent = this.selectAgents
          get_version_Data.store = this.selectStores
        }

        let res = await axios.post(API.Host + ':' + API.Port + '/project/versions', get_version_Data, {
          timeout: 1000 * 60 * 2
        })
        console.log('取得機種版本資訊')
        console.log(res)
        this.version = res.data.data

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
    get_time(value) {
      // console.log('/***********/')
      // console.log(value)
      // console.log('/***********/')
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
      this.lastOnline = value //最後上線時間
    },
    //呼叫機種機台查詢
    async get_machine() {
      console.log('******************************')
      console.log(this.selectName)
      console.log(this.selectAgents)
      console.log(this.selectStores)
      console.log(this.selectVer)
      console.log(this.mac)
      console.log(this.lastOnline)
      console.log(this.nowindex)
      console.log('******************************')
      if (this.selectName === '') {
        this.$store.commit('updateState', ['alertMsg', '請選擇機種名稱 !'])
      } else if (this.lastOnline === '') {
        this.$store.commit('updateState', ['alertMsg', '請選擇最後上線時間 !'])
      } else {
        await this.machine_search()
      }

      // if (this.selectName !== '' && this.lastOnline !== '') {
      //   await this.machine_search()
      // }

      // await this.machine_search()
      // this.showMachineData = true;
    },
    //4-2機種機台查詢
    async machine_search() {
      $nuxt.$loading.loading = true
      try {
        //機種機台查詢資訊 request
        let machine_search_Data = {
          uid: this.loginId,
          token: this.loginToken,
          project: this.selectName,
          // agent: this.selectAgents,   //選填
          // store: this.selectStores,   //選填
          // version: this.selectVer,    //選填
          // mac: this.mac,              //選填
          time: this.lastOnline,
          limit: this.limit,
          page: this.nowindex
        }

        if (this.selectAgents !== '' || this.selectStores !== '' || this.selectVer !== '' || this.mac !== '') {
          machine_search_Data.agent = this.selectAgents
          machine_search_Data.selectStores = this.selectStores
          machine_search_Data.selectVer = this.selectVer
          machine_search_Data.mac = this.mac
        }

        let res = await axios.post(API.Host + ':' + API.Port + '/machine/search', machine_search_Data, {
          timeout: 1000 * 60 * 2
        })
        // console.log('取得機種機台查詢資訊')
        // console.log(res)
        if (res && res.data.status === 0) {
          this.machineSearch = res.data.data
          console.log('取得機種機台查詢資訊')
          console.log(this.machineSearch)
          //分頁功能
          this.totalMachine = res.data.total //機台總筆數

          // 計算總頁數
          let total_page = Math.ceil(this.totalMachine / this.limit)
          // 當下總頁數指給nowTotalPage
          this.nowTotalPage = total_page

          this.showMachineData = true
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
        // this.$store.commit('updateState', ['alertMsg', '您所篩選條件查無資訊 !'])
        // this.$store.commit('updateState', ['alertMsg', '伺服器連線異常' + error.message])
        this.$store.commit('updateState', ['alertMsg', 'Service request error !'])
        // this.showMachineData = false
      }
      $nuxt.$loading.loading = false
    },
    async prePage() {
      if (this.nowindex <= 1) {
        this.nowindex = 1
      } else {
        this.nowindex = this.nowindex - 1
      }
      // 取得機種機台查詢資訊
      await this.machine_search()
    },
    async nextPage() {
      if (this.nowindex >= this.nowTotalPage) {
        this.nowindex = this.nowTotalPage
      } else {
        this.nowindex = this.nowindex + 1
      }
      // 取得機種機台查詢資訊
      await this.machine_search()
    },
    //取得選取數量
    get_check() {
      this.checkedNamesNum = this.checkedNames.length
      if (this.checkedNamesNum === 0) {
        this.showMachineNum = false
      } else {
        this.showMachineNum = true
      }
    },
    async create_machineSet() {
      this.machineSet = false //機種設定篩選頁顯示
      this.showTaskSet = false //不顯示任務設定頁顯示全域設定、機種設定
      this.showMachineSearch = false //不顯示篩選資訊
      this.showMachineData = false //不顯示篩選清單列表
      this.showMachineSet = true //機種設定任務顯示
      // this.checkedNames
      // console.log(this.checkedNames)
      this.checkeList = this.checkedNames
      for (let i = 0; i < this.checkedNames.length; i++) {
        this.checkedNamesMac.push(this.checkedNames[i].mac)
      }
      console.log('MAC清單')
      console.log(this.checkedNamesMac)

      //呼叫4-3機台查詢API(By MAC)
      // this.searchMacs();

      //4-6 機台可更新版本清單(建立機台任務用)
      await this.updatableVersions()
      this.isShowCheckData = true
    },
    returnProjectSet() {
      this.showTaskSet = true //顯示任務設定頁顯示全域設定、機種設定
      this.showMachineSearch = true //顯示篩選資訊
      this.showMachineData = true //顯示篩選清單列表
      this.showMachineSet = false //不顯示機種設定任務
      this.isShowCheckData = false //不顯示勾選的機台欲加入任務資訊
      this.checkedNamesMac = []
      this.machineSetVersion = []
    },
    //4-6 機台可更新版本清單(建立機台任務用)
    async updatableVersions() {
      $nuxt.$loading.loading = true
      try {
        let res = await axios.post(
          API.Host + ':' + API.Port + '/machine/updatableVersions',
          {
            uid: this.loginId,
            token: this.loginToken,
            project: this.selectName,
            macs: this.checkedNamesMac
          },
          { timeout: 1000 * 60 * 2 }
        )
        console.log('4-6 機台可更新版本清單(建立機台任務用)')
        this.machineSetData = res.data.data
        console.log(this.machineSetData)
        for (let i = 0; i < this.machineSetData.length; i++) {
          this.machineSetVersion.push(this.machineSetData[i])
        }

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
    machineAddTask() {
      if (this.machineSetName === '') {
        // this.taskNameError = true
        // this.isAdd = false
        this.$store.commit('updateState', ['alertMsg', '請輸入任務名稱 !'])
      } else if (this.machineSetVer === '') {
        // this.taskNameError = false
        this.$store.commit('updateState', ['alertMsg', '請選擇更新版本 !'])
      }

      if (this.machineSetName !== '' && this.machineSetVer !== '') {
        this.machineSetAdd = true //確認是否執行視窗顯示
      }
      //確認是否執行視窗顯示
      // this.machineSetAdd = true
    },
    machine_notAdd() {
      //確認是否執行視窗不顯示
      this.machineSetAdd = false
    },
    //移除欲建立的任務清單
    del_task(mac) {
      //存放checkbox選取資訊的 mac
      let del_checkeList = []
      for (let i = 0; i < this.checkeList.length; i++) {
        // this.checkeList.splice(this.checkeList[i].indexOf(mac), 1)
        // console.log(this.checkeList[i])
        del_checkeList.push(this.checkeList[i].mac)
        // console.log(del_checkeList.indexOf(mac))
      }
      this.checkeList.splice(del_checkeList.indexOf(mac), 1)
      // if (this.checkeList.length === 0) {
      //   this.showMachineSet = false
      // }
    },
    //呼叫 5-2 新增機台任務API
    machineSet_addTask() {
      //勾選欲建立任務清單顯示
      this.isShowCheckData = true
      this.addMachines()
    },
    // 5-2 新增機台任務API
    async addMachines() {
      $nuxt.$loading.loading = true
      try {
        let res = await axios.post(
          API.Host + ':' + API.Port + '/job/addMachines',
          {
            uid: this.loginId,
            token: this.loginToken,
            jobName: this.machineSetName,
            project: this.selectName,
            macs: this.checkedNamesMac,
            version: this.machineSetVer,
            force: this.isUpdate
          },
          { timeout: 1000 * 60 * 2 }
        )
        console.log('5-2 新增機台任務API')
        console.log(res)
        if (res.data.status === 0) {
          //成功建立任務視窗
          this.success = true
          Task.addTask(res.data.status)
          Task.addProject(this.selectName)
        } else {
          this.success = false
        }

        // this.agents = res.data.data;
        // console.log(this.agents);
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/scss/common/_list.scss';
@import '~/scss/pages/_task.scss';
.row .title {
  text-align: right;
  width: 110px;
}
</style>
