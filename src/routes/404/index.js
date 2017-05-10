/**
 * Created by yaojun on 16/11/7.
 */


import React from "react";
import notFound from "./assets/404-1.jpg";
import plugin from "./assets/plugin.jpg";
import "./404.scss";
export  default {
    path:"*",
    component:()=>{
        return (<div className="no-content">
            
            <div className="space-bar">
                <img className="plugin" height={32} src={plugin} />
            </div>
            <img  width={360} src={notFound}/>
            <p>
                <label className="desc">
                    <i> </i>
                    <span>您输入的地址不正确
                    您可以 <a href="#/" className="btn btn-info">返回首页</a>
                    </span>
                </label>

                
            </p>
           
            <div className="space-bar"></div>
        </div>);
    }
}


