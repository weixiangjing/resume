/**
 *  created by yaojun on 2017/3/8
 *
 */





import React from "react";
import {Timeline,Alert} from "antd";
import {getLicenseLog} from "../../../../../model/Lisence";


export default class Component extends React.Component{
    state={logs:[]};
    componentWillMount(){
        let query =this.props.query;
        getLicenseLog({license_code:query.id}).then(res=>this.setState({logs:res.data}));
    }
    render(){
        let logs =this.state.logs;
        if(logs.length===0){
            return <Alert  message="暂无日志" showIcon type="info"/>
        }
        return (
            <Timeline>
                {
                    logs.map((item,index)=>(  <Timeline.Item key={item.create_time+item.log_desc}>
                        <p className="timeline-title error">{item.create_time}【{item.operator_name}】{item.log_title}</p>
                        <p className="timeline-desc">{item.log_desc}</p>
                    </Timeline.Item>))
                }
              
                


            </Timeline>
        )
    }
}