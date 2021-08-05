<template>
  <div>
    <el-form ref="loginForm"
             v-loading="loading"
             element-loading-text="正在登录..."
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.8)"
             :rules="rules"
             :model="loginForm"
             class="loginContainer">
      <h3 class="loginTitle">系统登录</h3>
      <el-form-item prop="username">
        <el-input type="text" auto-complete="false" v-model="loginForm.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" auto-complete="false" v-model="loginForm.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input size="normal" type="text" auto-complete="false" v-model="loginForm.code" placeholder="点击图片更换验证码" style="width: 250px; margin-right: 5px"></el-input>
        <img :src="captchaUrl" @click="updateCaptcha">
      </el-form-item>
      <el-checkbox v-model="checked" class="loginRemember">记住我</el-checkbox>
      <el-button type="primary" style="width: 100%" @click="submitLogin">登录</el-button>
    </el-form>
  </div>
</template>

<script>
//基本上每一个组件页面上都需要调用接口，每一个组件都需要去导入，比较繁琐，用插件的形式去使用，放到main.js主函数
//import {postRequest} from "@/utils/api";

export default {
  name: "Login",
  data() {
    return {
      //验证码
      captchaUrl: '/captcha?time=' + new Date(),  //最好加上时间，为了正确的刷新，time里面的时间随时都在变化
      //表单
      loginForm: {
        username: 'admin',
        password: '123',
        code: '',  //验证码
      },
      loading:false, //v-loading绑定的loading为布尔值，默认为false
      checked: true,
      //表单校验规则
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
    }
    }
  },
  methods: {
    submitLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.postRequest('/login', this.loginForm).then(resp=>{
            //后台返回值为resp，先判断一些resp存不存在，如果不存在，可能被响应拦截器给拦截掉了
            if (resp) {
              this.loading = false;
              //存储用户token
              const tokenStr = resp.obj.tokenHead+resp.obj.token;
              //将tokenStr存入sessionStorage
              window.sessionStorage.setItem('tokenStr', tokenStr);
              //页面跳转（首页）。先拿到重定向路径，因为有些访问是重定向过来的
              let path = this.$route.query.redirect;
              //replace是替换页面，不能通过浏览器的后退按钮后退页面，push可以
              //路径为'/'或者undefined就跳转到首页，否则跳转到之前输入的页面
              this.$router.replace((path=='/'||path==undefined)?'/home':path);
            }
          })
        } else {
          this.$message.error('请输入所有字段');
          return false;
        }
      });
    },
    updateCaptcha() {
      this.captchaUrl = '/captcha?time=' + new Date();
    }
  }
}
</script>

<style scoped>
.loginContainer {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 15px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}
.loginTitle {
  margin: 0px auto 40px auto;
  text-align: center;
}
.loginRemember {
  text-align: left;
  margin: 0px 0px 15px 0px;
}
.el-form-item__content {
  display: flex;
  align-items: center;
}
</style>