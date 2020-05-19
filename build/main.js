require('source-map-support/register');
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./server/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./i18n/json/en.json":
/*!***************************!*\
  !*** ./i18n/json/en.json ***!
  \***************************/
/*! exports provided: button, login, default */
/***/ (function(module) {

module.exports = JSON.parse("{\"button\":{\"Confirm\":\"Confirm\",\"Cancel\":\"取消\",\"Close\":\"關閉\",\"Setting\":\"前往設定\"},\"login\":{\"Account\":\"遊戲帳號\",\"PassWord\":\"パスワード\",\"InputText\":\"6~12英語、数字\",\"LogIn\":\"LogIn\",\"LogOut\":\"登出\",\"OrUseYours\":\"或一般登入\",\"Facebook_Login\":\"Facebook 登入\"}}");

/***/ }),

/***/ "./i18n/json/zh_Hans.json":
/*!********************************!*\
  !*** ./i18n/json/zh_Hans.json ***!
  \********************************/
/*! exports provided: button, login, default */
/***/ (function(module) {

module.exports = JSON.parse("{\"button\":{\"Confirm\":\"確定\",\"Cancel\":\"取消\",\"Close\":\"關閉\",\"Setting\":\"前往設定\"},\"login\":{\"Account\":\"遊戲帳號\",\"PassWord\":\"パスワード\",\"InputText\":\"6~12英語、数字\",\"LogIn\":\"登入\",\"LogOut\":\"登出\",\"OrUseYours\":\"或一般登入\",\"Facebook_Login\":\"Facebook 登入\"}}");

/***/ }),

/***/ "./i18n/json/zh_Hant.json":
/*!********************************!*\
  !*** ./i18n/json/zh_Hant.json ***!
  \********************************/
/*! exports provided: button, login, default */
/***/ (function(module) {

module.exports = JSON.parse("{\"button\":{\"Confirm\":\"確定\",\"Cancel\":\"取消\",\"Close\":\"關閉\",\"Setting\":\"前往設定\"},\"login\":{\"Account\":\"遊戲帳號\",\"PassWord\":\"パスワード\",\"InputText\":\"6~12英語、数字\",\"LogIn\":\"登入\",\"LogOut\":\"登出\"}}");

/***/ }),

/***/ "./nuxt.config.js":
/*!************************!*\
  !*** ./nuxt.config.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const pkg = __webpack_require__(/*! ./package */ "./package.json");

const settings = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: '',
    meta: [{
      charset: 'utf-8'
    }, {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1'
    }, {
      hid: 'description',
      name: 'description',
      content: pkg.description
    }, {
      hid: 'title',
      name: 'title',
      content: ''
    }, {
      hid: 'Keywords',
      name: 'Keywords',
      content: ''
    }, {
      hid: 'description',
      name: 'description',
      content: ''
    }, {
      property: 'og:title',
      content: ''
    }, {
      property: 'og:image',
      content: ''
    }, {
      property: 'og:url',
      content: ''
    }, {
      property: 'og:description',
      content: ''
    }, {
      property: 'og:site_name',
      content: ''
    }, {
      property: 'og:locale',
      content: 'zh_TW'
    }],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: '~/components/Loading.vue',

  /*
  ** Global CSS
  */
  css: ['animate.css'],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [{
    src: '~/plugins/PopupMsg',
    ssr: false
  }],
  env: {
    test: 123
  },

  /*
  ** Nuxt.js modules
  */
  modules: [// Doc: https://github.com/nuxt-community/axios-module#usage
  '@nuxtjs/axios', '@nuxtjs/style-resources', 'nuxt-fontawesome', 'portal-vue/nuxt', ['nuxt-i18n', {
    locales: [{
      code: 'zh_Hant',
      iso: 'zh_Hant',
      file: 'zh_Hant.js'
    }, {
      code: 'en',
      iso: 'en',
      file: 'en.js'
    }, {
      code: 'zh_Hans',
      iso: 'zh_Hans',
      file: 'zh_Hans.js'
    }],
    vueI18n: {
      messages: {
        zh_Hans: __webpack_require__(/*! ./i18n/json/zh_Hans.json */ "./i18n/json/zh_Hans.json"),
        zh_Hant: __webpack_require__(/*! ./i18n/json/zh_Hant.json */ "./i18n/json/zh_Hant.json"),
        en: __webpack_require__(/*! ./i18n/json/en.json */ "./i18n/json/en.json")
      }
    },
    defaultLocale: 'zh_Hant',
    lazy: true,
    langDir: 'i18n/',
    seo: true,
    vueI18nLoader: true,
    vuex: {
      moduleName: 'i18n',
      syncLocale: true
    }
  }]],

  /*
  ** Axios module configuration
  */
  axios: {// See https://github.com/nuxt-community/axios-module#options
  },
  styleResources: {
    scss: ['./scss/libs/_mixins.scss', './scss/libs/_setting.scss']
  },
  fontawesome: {
    component: 'fa',
    imports: [// 如果要使用更多圖示，請單一個的加入，以達到最小化目標
    // fas 開頭的圖示加這
    {
      set: '@fortawesome/free-solid-svg-icons',
      icons: ['faAngleDown', 'faAngleRight', 'faAngleLeft', 'faChartBar', 'faCheck', 'faChevronLeft', 'faDesktop', 'faEdit', 'faFileAlt', 'faFileMedical', 'faInfoCircle', 'faKey', 'faListUl', 'faHistory', 'faMinusCircle', 'faQuestionCircle', 'faPlus', 'faSearch', 'faSort', 'faSortUp', 'faSortDown', 'faSyncAlt', 'faTimes', 'faUser', 'faUserCog', 'faUserPlus']
    }, // fab 開頭的圖示加這
    {
      set: '@fortawesome/free-brands-svg-icons',
      icons: ['faFacebookSquare', 'faTwitterSquare']
    }, // far 開頭的圖示加這
    {
      set: '@fortawesome/free-regular-svg-icons',
      icons: ['faAngry', 'faImages', 'faImage']
    }]
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      // console.log('webpack config: ', config)
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        });
      }
    },

    terser: {
      terserOptions: {
        compress: {
          drop_console: true
        }
      }
    }
  }
};

if (process.env.DEPLOY === 'preproduction') {
  settings.vue = {
    config: {
      productionTip: true,
      devtools: true
    }
  };
  settings.build.terser = {
    terserOptions: {
      compress: {
        drop_debugger: false
      },
      output: {
        comments: true
      }
    }
  };
  settings.build.filenames = {
    chunk: () => '[name].[chunkhash].js'
  };
}

module.exports = settings;

/***/ }),

/***/ "./package.json":
/*!**********************!*\
  !*** ./package.json ***!
  \**********************/
/*! exports provided: name, version, description, author, private, scripts, dependencies, devDependencies, jest, default */
/***/ (function(module) {

module.exports = JSON.parse("{\"name\":\"test1\",\"version\":\"1.0.0\",\"description\":\"My hunky-dory Nuxt.js project\",\"author\":\"chrislutw\",\"private\":true,\"scripts\":{\"dev\":\"cross-env NODE_ENV=development backpack dev\",\"debug\":\"cross-env NODE_ENV=development HOST=192.168.85.148 nodemon --nolazy --inspect node_modules/.bin/nuxt --watch server\",\"build\":\"nuxt build && backpack build\",\"buildpre\":\"cross-env DEPLOY=preproduction nuxt build\",\"start\":\"cross-env NODE_ENV=production DEPLOY=production node build/main.js\",\"startpre\":\"cross-env NODE_ENV=production DEPLOY=preproduction node build/main.js\",\"generate\":\"nuxt generate\",\"doc\":\"jsdoc -c ./jsdoc-conf.json\",\"lint\":\"eslint --ext .js,.vue --ignore-path .gitignore . --fix\",\"precommit\":\"npm run lint\",\"unit\":\"jest\",\"test\":\"npm run unit\"},\"dependencies\":{\"@fortawesome/free-brands-svg-icons\":\"^5.6.3\",\"@fortawesome/free-regular-svg-icons\":\"^5.6.3\",\"@fortawesome/free-solid-svg-icons\":\"^5.6.3\",\"@nuxtjs/axios\":\"^5.0.0\",\"animate.css\":\"^3.7.0\",\"axios\":\"^0.18.1\",\"backpack-core\":\"^0.8.3\",\"base64url\":\"^3.0.1\",\"consola\":\"^2.3.0\",\"cross-env\":\"^5.2.0\",\"crypto-js\":\"^3.1.9-1\",\"deepmerge\":\"^3.0.0\",\"express\":\"^4.16.3\",\"gsap\":\"^2.0.2\",\"hi-base64\":\"^0.2.1\",\"js-cookie\":\"^2.2.0\",\"jssha\":\"^2.3.1\",\"md5\":\"^2.2.1\",\"moment\":\"^2.23.0\",\"moment-timezone\":\"^0.5.23\",\"nuxt\":\"^2.3.4\",\"nuxt-fontawesome\":\"^0.3.0\",\"nuxt-i18n\":\"^6.3.0\",\"portal-vue\":\"^1.5.1\",\"qrcode\":\"^1.3.2\",\"superagent\":\"^4.1.0\",\"vue-concise-slider\":\"^3.4.1\",\"vue-i18n\":\"^8.5.0\",\"vue2-datepicker\":\"^3.4.1\"},\"devDependencies\":{\"@babel/core\":\"^7.1.2\",\"@nuxtjs/style-resources\":\"^0.1.1\",\"@vue/test-utils\":\"^1.0.0-beta.28\",\"babel-core\":\"^7.0.0-bridge.0\",\"babel-eslint\":\"^8.2.1\",\"babel-jest\":\"^23.6.0\",\"eslint\":\"^5.0.1\",\"eslint-config-prettier\":\"^3.1.0\",\"eslint-loader\":\"^2.0.0\",\"eslint-plugin-prettier\":\"2.6.2\",\"eslint-plugin-vue\":\"^4.0.0\",\"ink-docstrap\":\"^1.3.2\",\"jest\":\"^23.6.0\",\"jest-serializer-vue\":\"^2.0.2\",\"jsdoc\":\"^3.5.5\",\"jsdoc-vuejs\":\"^2.3.4\",\"node-sass\":\"^4.11.0\",\"nodemon\":\"^1.11.0\",\"prettier\":\"1.14.3\",\"sass-loader\":\"^7.1.0\",\"vue-jest\":\"^3.0.2\",\"vue-template-compiler\":\"^2.5.22\"},\"jest\":{\"moduleFileExtensions\":[\"js\",\"json\",\"vue\"],\"watchman\":false,\"moduleNameMapper\":{\"^~/(.*)$\":\"<rootDir>/$1\",\"^~~/(.*)$\":\"<rootDir>/$1\"},\"transform\":{\"^.+\\\\.js$\":\"<rootDir>/node_modules/babel-jest\",\".*\\\\.(vue)$\":\"<rootDir>/node_modules/vue-jest\"},\"snapshotSerializers\":[\"<rootDir>/node_modules/jest-serializer-vue\"],\"collectCoverage\":true,\"collectCoverageFrom\":[\"<rootDir>/components/**/*.vue\",\"<rootDir>/pages/_lang/**/.vue\"],\"coveragePathIgnorePatterns\":[\"/node_modules/\",\"<rootDir>/components/Loading.vue\"]}}");

/***/ }),

/***/ "./server/index.js":
/*!*************************!*\
  !*** ./server/index.js ***!
  \*************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var consola__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! consola */ "consola");
/* harmony import */ var consola__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(consola__WEBPACK_IMPORTED_MODULE_1__);



const {
  Nuxt,
  Builder
} = __webpack_require__(/*! nuxt */ "nuxt");

const app = express__WEBPACK_IMPORTED_MODULE_0___default()();
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;
app.set('port', port); // Import and Set Nuxt.js options

let config = __webpack_require__(/*! ../nuxt.config.js */ "./nuxt.config.js");

config.dev = !("development" === 'production');

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config); // Build only in dev mode

  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  } // Give nuxt middleware to express


  app.use(nuxt.render); // Listen the server

  app.listen(port, host);
  consola__WEBPACK_IMPORTED_MODULE_1___default.a.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  });
}

start();

/***/ }),

/***/ "consola":
/*!**************************!*\
  !*** external "consola" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("consola");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "nuxt":
/*!***********************!*\
  !*** external "nuxt" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("nuxt");

/***/ })

/******/ });
//# sourceMappingURL=main.map