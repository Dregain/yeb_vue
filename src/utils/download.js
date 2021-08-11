import axios from "axios";
import de from "element-ui/src/locale/lang/de";

const service = axios.create({
    responseType: 'arraybuffer'  //默认类型：数组缓存，流的话肯定是二进制数组
})

//请求拦截器
service.interceptors.request.use(config => {
    config.headers['Authorization'] = window.sessionStorage.getItem('tokenStr');
    return config;
}, error => {
    console.log(error);
})

//响应拦截器
service.interceptors.response.use(resp => {
    const headers = resp.headers;  //先拿出响应的头部信息
    //定义一个正则表达式，虽然是以流的形式返回，但也有可能是以JSON字符串的形式，因为我们前后端分离，后端大部分的数据都是JSON字符串，只有这种下载文件特殊的接口才会返回流的形式
    let reg = RegExp(/application\/json/);
    if (headers['content-type'].match(reg)) { //判断一下headers里面的['content-type']是否与reg匹配，如果匹配，说明是一个普通的请求
        resp.data = unitToString(resp.data);  //转成string类型，返回正常的JSON string类型
    } else {
        let fileDownload = require('js-file-download');
        let fileName = headers['content-disposition'].split(';')[1].split('filename=')[1];
        let contentType = headers['content-type'];
        fileName = decodeURIComponent(fileName);
        fileDownload(resp.data, fileName, contentType);
    }
}, error => {
    console.log(error);
})

function unitToString(unitArray) {
    let encodedString = String.fromCharCode.apply(null, new Uint8Array(unitArray)); //编码
    let decodedString = decodeURIComponent(escape(encodedString)); //解码
    return JSON.parse(decodedString);
}

let base = '';
export const downloadRequest = (url, params) => {
    return service({
        method: 'get',
        url: '${base}${url}',
        data: params,
    })
}

export default service;
