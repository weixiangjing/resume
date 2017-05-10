/**
 *  created by yaojun on 2017/3/7
 *
 */

import React from "react";
import {Select} from "antd"

export default class  Component extends  React.Component{
    componentWillMount(){
        //fetch remote
    }
    render(){
        let data=[1,2,3];
        let {onChange} =this.props;
        return (
            <Select style={{width:200}} onChange={onChange}>
                {
                    data.map(item=> <Select.Option key={item} value={item}>{item}</Select.Option>)
                }
            </Select>
        )
    }
}