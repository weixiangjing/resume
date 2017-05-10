/**
 *  created by yaojun on 2017/5/2
 *
 */

import React from "react";
import {Table} from "../../../common/Table"
import {Form,DatePicker,Input,Button} from "antd"
import "./index.scss";


const FormItem =Form.Item;
const DATE_FORMAT="YYYY-MM-DD HH:mm:ss"
class SearchForm extends React.Component{
    handleSubmit(e){
        e.preventDefault();
        let value =this.props.form.getFieldsValue();
        let send={}
        let createTime=value.create_time;
       
        if(createTime && createTime.length>0){
            send.create_time_min=createTime[0].format(DATE_FORMAT)
            send.create_time_max=createTime[1].format(DATE_FORMAT);
        }
        if(value.task_name){
            send.task_name=value.task_name;
        }
        Table.getTableInstance().reload(send);
        
    }
    render(){
        let {getFieldDecorator} =this.props.form;
        return (<Form onSubmit={(e)=>this.handleSubmit(e)} inline>
            <FormItem label={"操作时间"}>
                {getFieldDecorator("create_time")(<DatePicker.RangePicker showTime format={DATE_FORMAT}/>)}
            </FormItem>
            <FormItem label={"任务关键词"}>
                {getFieldDecorator("task_name")(<Input style={{width:200}}/>)}
            </FormItem>
            <FormItem>
                <Button htmlType={'submit'} type={"primary"}>搜索</Button>
            </FormItem>
        </Form>)
    }
}
const BindSearchForm = Form.create()(SearchForm);
const taskStatus=['处理中','处理成功','处理失败']
const taskStatusClass=['text-shade','text-success','text-danger'];
export default class Component extends React.Component {
    render() {
        return (<div>
            <BindSearchForm/>
            <Table url="task/queryList" rowKey="id" columns={[
                {
                    title:"操作时间",
                    dataIndex:"create_time"
                },{
                    title:"类型",
                    render:(a,col)=>col.task_type==1?"导入":"导出"
                },{
                    title:"任务名",
                    dataIndex:"task_name"
                },{
                    title:"任务状态",
                    className:"corner-mark",
                    render:(a,col)=><span className={taskStatusClass[col.status]} ><font className="font-lg">.</font>{taskStatus[col.status]}</span>
                },{
                    title:"操作",
                    render:(a,col)=>col.status==1 &&<a download={col.file_url} href={col.file_url} target="_blank">下载</a>
                }
                
            ]} />
        </div>)
    }
}