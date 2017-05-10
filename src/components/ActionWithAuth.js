/**
 *  created by yaojun on 17/1/22
 *
 */




import {Link} from "react-router";
import User from  "../model/User";
import {Button} from "antd";
import React from "react";

export const AuthLink =({to,className})=>{
    let action =User.actionMap[to.split("?")[0]];

    if(action){
        return <Link to={to} className={className}>{action.res_name}</Link>
    }
    return null;

}
export const Auth =({to,children})=>{
    let action =User.actionMap[to.split("?")[0]];
    if(action) return  <span>{children}</span>

    return null;
}

export const AuthAction =({auth,type,loading=false,onClick})=>{
    let action =User.actionMap[auth];
    if(User.actionMap[auth]){
        return <Button onClick={onClick} loading={loading} type={type}>{action.res_name}</Button>
    }
    return null;
}

export const AuthToggle =(props)=>{
    let action =User.actionMap[props.auth];
    if(!action) return null;
    let map =action.res_name.split("-");

    return <a onClick={props.onClick} className={props.classNames}>{map[+props.status]}</a>

}
