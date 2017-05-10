/**
 *  created by yaojun on 17/3/3
 *
 */
import React from "react";
import {Form, Input, Button, Popconfirm,Icon} from "antd";
import moment from "moment";
import {Table} from "../../../../common/Table";
import {Link, hashHistory} from "react-router";
import {Production} from "../../../../components/Select/ServiceType";
import {handler, toggleStatus} from "./reducer";
import {downloadWithForm,showTaskModal} from "../../../../util/helper";
import axios from 'axios';
import {Auth} from "../../../../components/ActionWithAuth";
const AuthConf = require("../../../../config/auth_func");
const FormItem            = Form.Item;
const discount_status_arr = ["", "未发布", "已发布"];
const discount_date_arr=["","未生效","可用","已结束"];
const discount_date_class =["","text-shade","text-success","text-shade"];
const discount_class      = ['', 'text-danger', 'text-success', 'text-shade','text-shade']
const discount_range      = ['', '不限', '商户', '渠道商'];

export default class Component extends React.Component {
    componentWillUpdate(){
        if(handler._reload){
            Table.getTableInstance().reload();
            handler._reload=false;
        }else{
            Table.getTableInstance().update();
        }

    }
    render() {
        let children = this.props.children;

        let columns = [
            {
                title    : "活动名称",
                dataIndex: "discount_name"
            }, {
                title    : "优惠形式",
                dataIndex: "discount_type",
                render   : (a, col) => col.discount_type == 1 ? "服务产品优惠活动" : "订购订单优惠活动"
            }, {
                title    : "所属服务产品",
                render:(a,col)=><span>{col.service_name?`【${col.service_name}】`:'--'}{col.product_name}</span>
            }, {
                title : "订购范围",
                render: (a, col) => discount_range[col.dicount_range]
            }, {
                title : "发布状态",
                className:"corner-mark",
                render: (a, col) => {
                   
                 return <span className={discount_class[col.discount_status] }>
                            <font className="font-lg">.</font>{discount_status_arr[col.discount_status]}
                        </span>
                }
            },{
                title : "生效状态",
                className:"corner-mark",
                render:(e,col)=>{
                    let status;
                    let date= col._date;
                    if(col.discount_status==2){
                        if(moment(col.discount_exp_date)<=date){
                            status=3
                        }else if(moment(col.discount_cff_date)>date){
                            status=1;
                        }else{
                            status=2
                        }
                    }
                    return <span className={discount_date_class[status] }>
                        {
                            status ? <font className="font-lg">.</font>:"--"
                        }
                            {discount_date_arr[status]}
                        </span>
                }
            }, {
                title: '创建时间', dataIndex: "create_time"
            }, {
                title: "操作", render: (a, col) => {
                    let status =(col.discount_status == 1 )? "发布" : (col.discount_status == 2) ? "取消发布" : "";
                    return <span>
                        <Auth to={AuthConf.SERVICE_SALE_ACTIVITY_UPDATE}>
                            <Link
                                to={`/secenter/sales/activity/alter?discountId=${col.discountId}`}>编辑</Link>
                        </Auth>
                        <Auth to={AuthConf.SERVICE_SALE_ACTIVITY_SWITCH}>
                        <Popconfirm onConfirm={() => toggleStatus(col).then(()=>Table.getTableInstance().update())} title={`确认要${status} 该活动？`}>
                            <a className="margin-left-lg">{status}</a>
                        </Popconfirm>
                        </Auth>
                    </span>
                }
            }
        ]

        return (
            <div className="sales-activity">
                {children}
                <div style={{display:children?"none":"block"}}>
                <BindSearchForm ref={(form)=>this.form=form}/>
               
                <Table extra={ <div className="over-hide margin-v-lg">
                    <Auth to={AuthConf.SERVICE_SALE_ACTIVITY_ADD}>
                        <Button onClick={() => hashHistory.push("/secenter/sales/activity/update")}
                                className={"pull-right margin-left-lg"}><Icon type="plus"/>新建活动</Button>
                    </Auth>
                    <Auth to={AuthConf.SERVICE_SALE_ACTIVITY_EXPORT}>
                        <Button onClick={()=>{
                            axios.post('serviceDiscount/get',Object.assign({"export":"1"},this.form.getFieldsValue())).then(()=>showTaskModal(1))
                        }} className={"pull-right"}><Icon type="export"/>导出数据</Button>
                    </Auth>
                </div>}   url="serviceDiscount/get" rowKey="discountId" columns={columns}/>
                </div>
            </div>);
    }
}
class SearchForm extends React.Component {

    render() {
        let {getFieldDecorator,getFieldsValue} =this.props.form;
        return (
            <Form className="over-hide" inline onSubmit={(e) => {
                e.preventDefault();
                let value = getFieldsValue();
                Table.getTableInstance().reload({...value});
            }}>
                <FormItem label="所属服务产品">
                    {getFieldDecorator('product_code')(<Production />)}
                </FormItem>
                <FormItem label="活动名称">
                    {getFieldDecorator("keywords")(<Input/>)}
                </FormItem>
                
                <Button onClick={() => this.props.form.resetFields()}
                        className={"margin-left-lg "}>清除</Button>
                <Button className={"margin-left"} type={"primary"} htmlType={"submit"}>搜索</Button>
            </Form>
        )
    }
}
const BindSearchForm = Form.create()(SearchForm);
