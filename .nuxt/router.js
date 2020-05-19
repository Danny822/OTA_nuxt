import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _c0f2cbc6 = () => interopDefault(import('..\\pages\\account.vue' /* webpackChunkName: "pages_account" */))
const _358dd14e = () => interopDefault(import('..\\pages\\login.vue' /* webpackChunkName: "pages_login" */))
const _4fcb2981 = () => interopDefault(import('..\\pages\\modifypw.vue' /* webpackChunkName: "pages_modifypw" */))
const _33e10509 = () => interopDefault(import('..\\pages\\project.vue' /* webpackChunkName: "pages_project" */))
const _c0599218 = () => interopDefault(import('..\\pages\\report.vue' /* webpackChunkName: "pages_report" */))
const _03ad6803 = () => interopDefault(import('..\\pages\\taskList.vue' /* webpackChunkName: "pages_taskList" */))
const _2f32340a = () => interopDefault(import('..\\pages\\taskSetting.vue' /* webpackChunkName: "pages_taskSetting" */))
const _d60e4170 = () => interopDefault(import('..\\pages\\version.vue' /* webpackChunkName: "pages_version" */))
const _1b917442 = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages_index" */))

// TODO: remove in Nuxt 3
const emptyFn = () => {}
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onComplete = emptyFn, onAbort) {
  return originalPush.call(this, location, onComplete, onAbort)
}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: decodeURI('/'),
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/account",
    component: _c0f2cbc6,
    name: "account___zh_Hant"
  }, {
    path: "/login",
    component: _358dd14e,
    name: "login___zh_Hant"
  }, {
    path: "/modifypw",
    component: _4fcb2981,
    name: "modifypw___zh_Hant"
  }, {
    path: "/project",
    component: _33e10509,
    name: "project___zh_Hant"
  }, {
    path: "/report",
    component: _c0599218,
    name: "report___zh_Hant"
  }, {
    path: "/taskList",
    component: _03ad6803,
    name: "taskList___zh_Hant"
  }, {
    path: "/taskSetting",
    component: _2f32340a,
    name: "taskSetting___zh_Hant"
  }, {
    path: "/version",
    component: _d60e4170,
    name: "version___zh_Hant"
  }, {
    path: "/en/",
    component: _1b917442,
    name: "index___en"
  }, {
    path: "/en/account",
    component: _c0f2cbc6,
    name: "account___en"
  }, {
    path: "/en/login",
    component: _358dd14e,
    name: "login___en"
  }, {
    path: "/en/modifypw",
    component: _4fcb2981,
    name: "modifypw___en"
  }, {
    path: "/en/project",
    component: _33e10509,
    name: "project___en"
  }, {
    path: "/en/report",
    component: _c0599218,
    name: "report___en"
  }, {
    path: "/en/taskList",
    component: _03ad6803,
    name: "taskList___en"
  }, {
    path: "/en/taskSetting",
    component: _2f32340a,
    name: "taskSetting___en"
  }, {
    path: "/en/version",
    component: _d60e4170,
    name: "version___en"
  }, {
    path: "/zh_Hans/",
    component: _1b917442,
    name: "index___zh_Hans"
  }, {
    path: "/zh_Hans/account",
    component: _c0f2cbc6,
    name: "account___zh_Hans"
  }, {
    path: "/zh_Hans/login",
    component: _358dd14e,
    name: "login___zh_Hans"
  }, {
    path: "/zh_Hans/modifypw",
    component: _4fcb2981,
    name: "modifypw___zh_Hans"
  }, {
    path: "/zh_Hans/project",
    component: _33e10509,
    name: "project___zh_Hans"
  }, {
    path: "/zh_Hans/report",
    component: _c0599218,
    name: "report___zh_Hans"
  }, {
    path: "/zh_Hans/taskList",
    component: _03ad6803,
    name: "taskList___zh_Hans"
  }, {
    path: "/zh_Hans/taskSetting",
    component: _2f32340a,
    name: "taskSetting___zh_Hans"
  }, {
    path: "/zh_Hans/version",
    component: _d60e4170,
    name: "version___zh_Hans"
  }, {
    path: "/",
    component: _1b917442,
    name: "index___zh_Hant"
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
