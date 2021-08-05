import {getRequest} from "./api";


//初始化菜单之后是放到路由的配置里面，所以router要拿过来；菜单是放在vuex统一管理的，所以要store
export const initMenu = (router,store) => {
    //先判断state里面的routes里面有没有对象，没有的话就不用初始化
    if (store.state.routes.length > 0) {
        return;
    }
    //'/system/config/menu'该接口不需要参数，返回参数后传入data进一步处理
    getRequest('/system/config/menu').then(data=>{
        if (data) {
            //格式化Router
            let fmtRoutes = formatRoutes(data);
            //添加到router
            router.addRoutes(fmtRoutes);
            //将数据存入Vuex
            store.commit('initRoutes',fmtRoutes);
        }
    })
}

export const formatRoutes = (routes) => {
    let fmtRoutes = [];
    routes.forEach(router=>{
        let {
            path,
            component,
            name,
            iconCls,
            children,
        } = router;
        //如果children存在并且属于一个数组
        if (children && children instanceof Array) {
            //递归
            children = formatRoutes(children);
        }
        let fmtRouter = {
            path:path,
            name:name,
            iconCls:iconCls,
            children:children,
            component(resolve) {
                //因为对应的组件在不同的目录下面，所以要逐个判断
                if (component.startsWith('Home')) {
                    require(['../views/' + component + '.vue'], resolve);
                } else if (component.startsWith('Emp')) {
                    require(['../views/emp/'+component+'.vue'],resolve);
                } else if (component.startsWith('Per')) {
                    require(['../views/per/'+component+'.vue'],resolve);
                } else if (component.startsWith('Sal')) {
                    require(['../views/sal/'+component+'.vue'],resolve);
                } else if (component.startsWith('Sta')) {
                    require(['../views/sta/'+component+'.vue'],resolve);
                } else if (component.startsWith('Sys')) {
                    require(['../views/sys/'+component+'.vue'],resolve);
                }

            }
        }
        fmtRoutes.push(fmtRouter);
    });
    return fmtRoutes;
}