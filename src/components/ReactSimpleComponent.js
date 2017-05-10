/**
 *  created by yaojun on 16/12/29
 *
 */
  


    
import React from "react";
import {Radio,Icon,Alert} from "antd";
import className from "classnames";
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
export const Display = (props)=>{
    
    if(!props.show){
        return null;
    }
    
    let attr ={}
        attr.className=props.className;
    
    return (<div {...attr} >{props.children}</div>)
}
export const AlertWithEmptyData=({isEmpty,message})=>{
    return isEmpty?<Alert className="margin-top" showIcon  message={message||"暂无数据"} type="info"/>:null
}



