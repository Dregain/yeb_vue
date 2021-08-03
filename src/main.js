import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import router from './router'

Vue.use(ElementUI);
Vue.config.productionTip = false

new Vue({  //实例化vue
  router,  //使用router的组件
  render: h => h(App)  //es6写法，渲染app组件，app组件通过import导入进来的
}).$mount('#app')  //手动挂载app
