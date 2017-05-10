/**
 *  created by yaojun on 2017/3/8
 *
 */
import React from "react";
import LicenseInfo from "./LicenseInfo";
import Log from "./Log";
import Record from "./Record";
import {Tabs} from "antd";

import "./index.scss";
export default class Component extends React.Component {
    render() {
        let query =this.props.location.query
        return (
            <Tabs>
                <Tabs.TabPane key="1" tab="许可信息">
                    <LicenseInfo query={query}/>
                </Tabs.TabPane>
                <Tabs.TabPane key="2" tab="操作日志">
                    <Log query={query}/>
                </Tabs.TabPane>
                <Tabs.TabPane key="3" tab="使用记录">
                    <Record query={query}/>
                </Tabs.TabPane>
            
            </Tabs>
        )
    }
}