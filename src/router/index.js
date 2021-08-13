import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "@/views/Login";
import Home from "../views/Home";
import FriendChat from "../views/chat/FriendChat";

Vue.use(VueRouter)  //安装VueRouter路由

const routes = [  //配置路由
  {
    path: '/',  //跳转路径
    name: 'Login',  //路由名称
    component: Login,  //路由要跳转的组件
    hidden: true,
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/chat',
        name: '在线聊天',
        component: FriendChat,
      }
    ]
  }
]

const router = new VueRouter({  //创建VueRouter实例
  routes
})

export default router  //导出，让其他地方可以导入路由
