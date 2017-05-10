/**
 *  created by yaojun on 2017/3/8
 *
 */





import React from "react";
import {Table} from "../../../../../common/Table"
export default class Component extends React.Component{
    render(){
        let columns=[
            {
                title:"记录时间",
                dataIndex:"create_time"
            },
            {
                title:"计量单位",
                dataIndex:"product_unit"
            },
            {
                title:"使用量",
                dataIndex:"used_log_change_value"
            },
            {
                title:"剩余用量",
                dataIndex:"lused_log_balance"
            },
            {
                title:"备注说明",
                dataIndex:""
            },

        ]
        return (
           <Table params={{license_code:this.props.query.id}} columns={columns}   url={'serviceLicenseUsedLog/get'}/>
        )
    }
}