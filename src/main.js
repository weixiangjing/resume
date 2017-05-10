import React from 'react'
import ReactDOM from 'react-dom'
import {hashHistory} from 'react-router';
import {message,notification,Modal} from "antd";
import createStore from './store/createStore'
import AppContainer from './containers/AppContainer'
import axios from 'axios';
import moment from "moment";
import user from './model/User';
import oldpathname from './model/SavePathName';
import {BASE_URL} from "./config/api";
import { showLoading, hideLoading } from 'react-redux-loading-bar'


moment.locale('zh-cn');
import {__initStore__} from "./store/storeUtil";
moment.ago=function (day=1) {
    let date =new Date;
        date.setDate(date.getDate()-day);
        return moment(date);
}
// ========================================================
// Store Instantiation
// ========================================================
const initialState = window.___INITIAL_STATE__
export const store = createStore(initialState)

// ========================================================
// Render Setup
// ========================================================
const MOUNT_NODE = document.getElementById('root');

__initStore__(store);

let render = () => {
  const routes = require('./routes/index').default(store)

  ReactDOM.render(
    <AppContainer store={store} routes={routes} />,
    MOUNT_NODE
  )
}

// This code is excluded from production bundle
if (__DEV__) {
  window.$store = store;
  if (module.hot) {
    // Development render functions
    const renderApp = render
    const renderError = (error) => {
      const RedBox = require('redbox-react').default

      ReactDOM.render(<RedBox error={error} />, MOUNT_NODE)
    }

    // Wrap render in try/catch
    render = () => {
      try {
        renderApp()
      } catch (error) {
        renderError(error)
      }
    }

    // Setup hot module replacement
    module.hot.accept('./routes/index', () =>
      setImmediate(() => {
        ReactDOM.unmountComponentAtNode(MOUNT_NODE)
        render()
      })
    )
  }
}

// ========================================================
// init ajax axios util!
// ========================================================

axios.defaults.baseURL = BASE_URL
axios.defaults.timeout = 1000*20;

// do long running stuff

let  process =window.p=[];
axios.defaults.transformRequest.unshift(function (data={}) {

    if(typeof data == 'object' && !data.user_id){
        data.user_id = user.userid;
    }

    if(data.hideLoading!==true){
        store.dispatch(showLoading())
        process.push(1);
    }

    return str2Int(data)
});
axios.interceptors.response.use(function (response) {

    let send =response.config.data;


    setTimeout(()=> store.dispatch(hideLoading()),100);
    let data={};
    if(send && typeof  send ==="string"){
             data=  window.JSON.parse(send);

            if(data._msg && response.data && response.data.code=="0"){
                message.success(data._msg==1?"操作成功":data._msg);
            }
    }
    if (response.data) {
        if (response.data.code != '0'){
            let error = new Error(response.data.msg);
            error.code = response.data.code;
            error.status = response.data.status;
            error.psn = response.data.psn;



            if(response.data.code == '19'){
              if(user.token){
                const url_href=location.href;
                let numI=url_href.indexOf("#");
                let pathname=url_href.substr(numI+1);
                if (pathname.indexOf("?") != -1) {
                  let startI=pathname.indexOf("?");
                  let str0 = pathname.split("?");
                  let str=pathname.substr(startI);
                  let str1 = str.substr(1);
                  let strs = str1.split("&");
                  for (let i = 0; i < strs.length; i++) {
                    if(strs[i].split("=")[0]=="origin"){strs.splice(i,1)}
                    if(strs[i].split("=")[0]=="login"){strs.splice(i,1)}
                    if(strs[i].split("=")[0]=="systems"){strs.splice(i,1)}
                    if(strs[i].split("=")[0]=="sys_no"){strs.splice(i,1)}
                  }
                  let herf=[str0[0],...strs];
                  let str_href='';
                  if(herf.length>2){
                    str_href=herf[0]+"?"+herf[1];
                    for(let i=0;i<herf.length;i++){
                      if(i>1){
                        str_href+="&"+herf[i]
                      }
                    }
                  }
                  if(herf.length==2){str_href=herf[0]+"?"+herf[1];}
                  if(herf.length==1){str_href=herf[0];}
                  oldpathname.setValue(str_href)
                }else {
                  oldpathname.setValue(pathname)
                }
                user.logout();
                document.location.href=user.tokenUrl_login+"?url="+encodeURIComponent(user.login_url);
              }else {
                hashHistory.push({pathname:'/account/login'});
                user.logout();
                oldpathname.logout();
              }
            }
            notification.error({
                message:"错误提示",
                description:response.data.msg
            })
            return Promise.reject(error);
        }
    }
    response.data.date= moment(new Date(response.headers.date));
    return response.data;
}, function (error) {
    store.dispatch(hideLoading())
    return Promise.reject(error);
});
// ========================================================
// polyfill!
// ========================================================
window.Promise.prototype.finally = Promise.prototype.finally = function (f) {
    return this.then(function (value) {
        return Promise.resolve(f()).then(function () {
            return value;
        });
    }, function (err) {
        return Promise.resolve(f()).then(function () {
            throw err;
        });
    });
};

// ========================================================
// Go!
// ========================================================
render();
export const appRender=render;
function isArray(obj){
    return Object.prototype.toString.call(obj)==="[object Array]";
}
function str2Int(send){
    for(let field in send){
        if(typeof send[field] ==="number"){
            send[field]+='';
        }
        if(isArray(send[field])){
            for(let i =0;i<send[field].length;i++){
                str2Int(send[field][i]);
            }
        }
    }
    return send;
}
