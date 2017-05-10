"use strict";
import axios from "axios";
import immutable from "immutable";
class User {
    constructor() {
        this.logined    = false;
        this.username   = null;
        this.userid     = null;
        this.real_name  = null;
        this.menus      = [];
      //token登录--保存信息
        this.token      = false;
        this.tokenUrl_login      = null;
        this.tokenUrl_systems      = null;
        this.sys_no      = null;
        this.login_url      = null;

        // test data
        this.userMenus  = [];
        this.authMap    = {}
        this.actionMap  = {};
        //
        window.user     = this;
        const cacheUser = getUserFromStore();
        if (cacheUser) this.setValue(cacheUser);
    }

    login(param) {
        param.password = User.signPassword(param.username, param.password);
        return axios.post('/user/UserLogin', param).then(res => {
          let data     = res.data[0];
            data.logined = true;
          data.token = false;
          storeUserInfo(data);
            this.setValue(data);
            return data;
        })
    }
    tokenLogin(query,loginUrl){
      return axios.post('/user/userAuthLogin').then(res => {
        let data     = res.data[0];
        data.logined = true;
        data.token = true;
        data.sys_no= query.sys_no;
        data.tokenUrl_login= query.origin+query.login;
        data.tokenUrl_systems= query.origin+query.systems;
        data.loginUrl= loginUrl;
        storeUserInfo(data);
        this.setValue(data);
        return data;
      })
    }
    cleanEmptyMenu(data = []) {
        data.forEach(item => {
            if (item.children && item.children.length == 0) {
                delete  item.children;
            } else {
                this.cleanEmptyMenu(item.children);
            }
        })
    }

    getBreadcrumbWithPath(paths) {
        if(!this.originMenus) return [];
        let parent = findParent(this.originMenus,paths.shift());
        if(!parent) return []

        function findParent(menus,path) {
            return menus.filter((item) =>item.res_url === path)[0];
        }

        let breadConf = [];
        breadConf.push({route: parent.route, label: parent.name});
        while (paths.length > 0) {
            parent = findParent(parent.res_childs,paths.shift());
            if(!parent) break;
            breadConf.push({route: parent.route, label: parent.name});
        }
        return breadConf;
    }

    convertActionMap(menus, parent) {
        for (let i = 0; i < menus.length; i++) {
            let menu = menus[i];
            if (menu.status !== undefined && menu.status != 1)continue;
            let key = menu.res_url;
            key     = key[0] === "/" ? key.slice(1) : key;
            if (menu.res_type == "Menu") {
                if (parent) {
                    key          = parent.res_url + "/" + menu.res_url;
                    key          = key[0] === "/" ? key.slice(1) : key;
                    menu.res_url = key;
                }
                this.authMap[key] = 1;
            } else {
                if(parent){
                    key          = parent.res_url + "/" + menu.res_url;
                    key          = key[0] === "/" ? key.slice(1) : key;
                    menu.res_url=key;
                }
                this.actionMap[key] = {
                    res_url :key,
                    res_name: menu.res_name
                };
            }
            if (menu.res_childs.length > 0) {
                this.convertActionMap(menu.res_childs, menu);
            }
        }
    }

    convertMenuKey(menus, parent) {
        for (let i = 0; i < menus.length; i++) {
            let menu = menus[i];
            if (menu.status !== undefined && menu.status != 1)continue;
            if (menu.res_type == "Action") {
                menus.splice(i, 1);
                i--;
                continue;
            }
            menu.name  = menu.res_name;
            menu.route = menu.res_url;
            if (parent) {
                menu.route = parent.route + "/" + menu.res_url;
            }
            menu.id = menu.res_id;
            if (menu.res_childs && menu.res_childs.length > 0) {
                menu.children = menu.res_childs;
                this.convertMenuKey(menu.children, menu);
            }
        }
    }
    // 暂时这样做
    convertOrigin(menus,parent){
        for (let i = 0; i < menus.length; i++) {
            let menu = menus[i];
            if (menu.status !== undefined && menu.status != 1)continue;

            menu.name  = menu.res_name;
            menu.route = menu.res_url;
            if (parent) {
                menu.route = parent.route + "/" + menu.res_url;
            }
            menu.id = menu.res_id;
            if (menu.res_childs && menu.res_childs.length > 0) {
                menu.children = menu.res_childs;
                this.convertOrigin(menu.children, menu);
            }
        }
    }

    getFirstRouteByRoot(route) {
        if (!route)return null;
        route = route.replace(/^\//, '');
        for (let i = 0; i < this.userMenus.length; i++) {
            let menu = this.userMenus[i];
            if (menu.route == route) {
                return findChild(menu);
            }
        }
        function findChild(r) {
            if (!r.children || !r.children.length)return null;
            const first = r.children[0];
            if (first.children)return findChild(first);
            return first.route;
        }
    }

    setValue(data) {
        let userMap    = data.userMap;
        this.originMenus=getUserFromStore().userMenus;
        let menus      = immutable.fromJS(data.userMenus);
        this.menus     = userMap;
        this.userMenus = data.userMenus;
        this.userid    = userMap.user_id;
        this.real_name = userMap.real_name;
        this.username  = userMap.username;
        this.logined   = data.logined;
      this.token      = data.token;
      this.tokenUrl_login      = data.tokenUrl_login;
      this.tokenUrl_systems      = data.tokenUrl_systems;
      this.sys_no      = data.sys_no;
      this.login_url      = data.loginUrl;
      this.convertMenuKey(this.userMenus);
        this.cleanEmptyMenu(this.userMenus);
        this.convertOrigin(this.originMenus);
        this.convertActionMap(menus.toJS());
    }

    static signPassword(username, password) {
        let hash = require("crypto").createHash("md5");
        hash.update(username + '/' + password);
        return hash.digest("hex");
    }

    getSecondMenus() {
        let secKey = location.hash.split("/")[1];
        for (let i = 0; i < this.userMenus.length; i++) {
            let menu = this.userMenus[i];
            if (menu.route == secKey) {
                return menu.children;
            }
        }
    }

    logout() {
        this.logined   = false;
        this.username  = null;
        this.userid    = null;
        this.real_name = null;
        this.menus     = [];
        this.userMenus = null;
        this.authMap   = {};
        this.originMenus=[];
        this.actionMap={}
        storeUserInfo(null);
    }
}
User.STORE_KEY = 'cashier_user';
function storeUserInfo(user) {
    if (user) {
        sessionStorage.setItem(User.STORE_KEY, window.JSON.stringify(user));
    } else {
        sessionStorage.removeItem(User.STORE_KEY);
    }
}
function getUserFromStore() {
    let user = sessionStorage.getItem(User.STORE_KEY);
    if (!user)return null;
    return window.JSON.parse(user);
}
const singleInstance    = new User();
singleInstance.getClass = () => {
    return User
};
export default singleInstance;
