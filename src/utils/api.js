import axios from "axios";
import {Message} from "element-ui";
import router from '../router'

//请求拦截器
axios.interceptors.request.use(config=>{
    //获取tokenStr，判断是否存在，如果存在token，请求携带这个token
    if (window.sessionStorage.getItem('tokenStr')) {
        config.headers['Authorization'] = window.sessionStorage.getItem('tokenStr');
    }
    return config;
}, error => {
    console.log(error);
})

//响应的拦截器，方便如果碰到请求失败或者响应失败时，进行一个同一的处理，而不是需要到我们每一个调后端接口的地方去处理，将会非常麻烦
//success并不是表示接口成功的返回了成功的内容，而是说成功的调到了后端的接口
//response如果调成功了接口，就会给响应码200，但是后端处理的时候它也会给你一个响应码，比如说你要删某一个部门，但部门不允许你删，它会给你报一个错误的响应码，并且给你一个错误的信息提示。
//这时，你是成功的访问到了接口了，你的response code是200，但是后端返回的数据他会提示你你的业务逻辑是错的，不允许删这个部门，因为可能有子部门，他会给你一个错误的业务逻辑的代码，所以咱们要去做对应的判断
axios.interceptors.response.use(success=>{ //判断响应码是否存在并等于200，http协议调到接口就是返回200
    //学习阶段，响应码没有判断那么多，可以理解为业务逻辑错误都处理完了，剩下所有的都是成功的
    if (success.status && success.status == 200) {
        if (success.data.code==500||success.data.code==401||success.data.code==403) {
            Message.error({message:success.data.message});
            return;
        }
        //成功的里面有些也有提示信息，比如添加成功，操作成功，更新成功，也可以去提示一下
        if (success.data.message) {
            Message.success({message:success.data.message});
        }
    }
    return success.data; //把JSON对象拿到后去做相应的处理，这个是只拦截器，拿不到对象无法做后续处理
},error=>{   //error就是后端接口都没访问失败
    if (error.response.code==504||error.response.code==404) {  //没访问到后端接口，拿不到JSON对象，只有用error.response.code响应码
        Message.error({message:'服务器被吃了o(╯□╰)o'});
    } else if (error.response.code == 403) {
        Message.error({message:'权限不足，请联系管理员！'});
    } else if (error.response.code == 401) {
        Message.error({message:'尚未登录，请登录'});
        router.replace('/');
    } else {
        //如果所有的状态码都判断完了都不在里面，再判断一下这个相应里面有没有信息，如果有信息，就把信息打印出来
        if (error.response.data.message) {
            Message.error({message: error.response.data.message});
        } else {
            Message.error({message: '未知错误！'});
        }
    }
    //如果是error了，就不需要返回相应的数据了，返回一个空
    return;
});

//预先加上前置路径，防止后面要加上
let base = '';

//传送json格式的post请求
export const postRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params
    })
}

//传送json的put请求
export const putRequest = (url, params) => {
    return axios({
        method: 'put',
        url: `${base}${url}`,
        data: params
    })
}

//传送json的get请求
export const getRequest = (url, params) => {
    return axios({
        method: 'get',
        url: `${base}${url}`,
        data: params
    })
}

//传送json的delete请求
export const deleteRequest = (url, params) => {
    return axios({
        method: 'delete',
        url: `${base}${url}`,
        data: params
    })
}
