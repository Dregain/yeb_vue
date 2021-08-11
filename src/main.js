import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import router from './router'
import store from './store'
import 'font-awesome/css/font-awesome.css'

import {postRequest} from "@/utils/api";
import {putRequest} from "@/utils/api";
import {getRequest} from "@/utils/api";
import {deleteRequest} from "@/utils/api";
import {initMenu} from "@/utils/menus";
import {downloadRequest} from "./utils/download";

Vue.use(ElementUI, {size:'small'}); //全局样式size:'small'
Vue.config.productionTip = false

//插件形式使用请求
Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.downloadRequest = downloadRequest;

//路由前置守卫
router.beforeEach((to,from,next)=>{
  //判断用户是否登录
  if (window.sessionStorage.getItem('tokenStr')) {
    initMenu(router,store);
    //判断用户信息是否存在，如果不存在，先获取对应的用户信息
    if (!window.sessionStorage.getItem('user')) {
      return getRequest('/admin/info').then(resp=>{
        //如果能拿到response，存入到sessionStorage里面
        if (resp) {
          //sessionStorage只能存字符串，所以要通过JSON.stringify()转换一下
          window.sessionStorage.setItem('user',JSON.stringify(resp));
          next();
        }
      })
    }
    next();
  } else {
    //如果没有登录，先让用户登录，再回到用户输入的网址
    //如果访问的就是登录页，直接next()
    if (to.path == '/') {
      next();
    } else {
      //redirect重定向,?是传参
      next('/?redirect=' + to.path);
    }

  }
})

new Vue({  //实例化vue
  router,  //使用router的组件
  store,
  render: h => h(App)  //es6写法，渲染app组件，app组件通过import导入进来的
}).$mount('#app')  //手动挂载app
