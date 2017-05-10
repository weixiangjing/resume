import React, {Component, PropTypes} from "react";
import {hashHistory, Router} from "react-router";
import {Provider} from "react-redux";
import ReactDOM from "react-dom";
import {MOUNT_NODE} from "../common/AutoCompleteAsync";

import user from "../model/User";
class AppContainer extends Component {
    static propTypes = {
        routes: PropTypes.object.isRequired,
        store : PropTypes.object.isRequired
    }
    
    shouldComponentUpdate() {
        return false
    }
    
    render() {
        const {routes, store} = this.props
        return (
            <Provider store={store}>
                <div onClick={(e)=>{
                    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
                }} style={{height: '100%'}}>

                 
                    <Router history={hashHistory} children={routes}/>
                </div>
            </Provider>
        )
    }
}
checkUserLogin(hashHistory.getCurrentLocation());
hashHistory.listen((nextLocation) => {
        if(nextLocation.action =="PUSH"){
            checkUserLogin(nextLocation);
        }
});
function checkUserLogin(location) {
    const LoginPath = '/account/login';
    if (user.logined || location.pathname == LoginPath) {
        checkUserAuth(location);
    } else {
        console.log('not login');
        hashHistory.replace({pathname: LoginPath});
    }
}
function checkUserAuth(location) {
    let path    = location.pathname;
    let isMatch = false;
    if (path.indexOf("/account") != 0) {
        path = path[0] === "/" ? path.slice(1) : path;
        path = path.slice(-1)==="/"?path.slice(0,-1):path;
        for (let authKey in user.authMap) {
            if (new RegExp(`^${authKey}$`).test(path)) {
                isMatch = true;
                break;
            }
        }
        
        for (let actionKey in user.actionMap){
            if (new RegExp(actionKey).test(path)) {
                isMatch = true
                break;
            }
        }
        if (!isMatch) hashHistory.replace({pathname: "/404"});
    }
}
export default AppContainer

