let proxyObj = {}

proxyObj['/']={  //所有'/'都要去代理
    //websocket
    ws:false,
    //目标地址
    target:'http://localhost:8081',
    //发送请求头host会被设置成上面的target
    changeOrigin: true,
    //不重写请求地址
    pathReWrite: {
        '^/':'/'
    }
}

module.exports={
    devServer:{
        host:'localhost',
        port:8080,
        proxy:proxyObj,
    }
}