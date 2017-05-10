/**
 *  created by yaojun on 17/3/3
 *
 */
import React from "react";
import {Form, Row, Col, Button, DatePicker, Select, Popconfirm} from "antd";
import {Link} from "react-router";
import moment from "moment";
import {ControlItem} from "../../../../common/FormControl";
import UnitTypeIdGroup from "../../../../common/FormItemTypeId";
import {Table} from "../../../../common/Table";
import {ServiceProduct} from "../../../../components/Select/ServiceType";
import {cleanEmpty,showTaskModal} from "../../../../util/helper";
import {license_class, license_state} from "./conf";
import {handler, toggleStatus} from "./reducer";
import axios from 'axios';
import className from "classnames";
import "./index.scss";

import {Auth} from '../../../../components/ActionWithAuth';
import {ACCENTER_LICENSE_QUERY_DOWMLOAD,ACCENTER_LICENSE_QUERY_DETAIL,ACCENTER_LICENSE_QUERY_STATUS} from '../../../../config/auth_func';

const RangePicker=DatePicker.RangePicker;
//1：商户, 2：门店Mcode, 3：设备EN,4: 应用内账号

let unit_type    ='1'
export default class Component extends React.Component {
    render() {
        let columns =[{
            title: "许可编号", dataIndex: "license_code", render: (a, col)=>
            <Auth to={ACCENTER_LICENSE_QUERY_DETAIL}><Link
              to={`/accenter/license/query/detail?id=${col.license_code}&type=${col.unit_type}&unit=${col.unit_id}`}>{col.license_code}</Link></Auth>
        }, {
            title: "生效时间", sorter: true, dataIndex: "license_eff_date"
        }, {
            title: "失效时间", sorter: true, render: (a, col)=> {

                let date = col._date;
                let diff=moment(col.license_exp_date).diff(date)/1000/3600/24;
                return <span className={className([{'text-warning': (diff>0&&diff<7)}])}>{col.license_exp_date}</span>
            }
        }, {
            title: "订购记录编号", dataIndex: "order_id"
        }, {
            title    : "状态",
            className: "corner-mark",
            render   : (a, col)=><span className={license_class[col.license_status]}><i
                className="font-lg">.</i>{license_state[col.license_status]}</span>
        }, {
            title: "计量单位", dataIndex: "billing_unit"
        }, {
            title: "计量总量", dataIndex: "billing_total"
        }, {
            title: "剩余可使用量", dataIndex: "license_current_used_balance"
        }, {
            title: "操作", render: (a, col)=> {
                // 已过期的和增值类服务不能解冻和冻结
                if(col.service_type==2) {
                    return null;
                }
                if(col.license_status==3) return null;
                let status=(col.license_status==2||col.license_status==1) ? "冻结" : "解冻";
                return <span>
                  <Auth to={ACCENTER_LICENSE_QUERY_STATUS}><Popconfirm title={`确认${status}该许可？`}
                                                                       onConfirm={()=>toggleStatus(col).then(()=>Table.getTableInstance().update())}>
                        <a >{status}</a>
                    </Popconfirm></Auth>
                    </span>
            }
        },]
        let children=this.props.children;
        if(children) return children;
        let query=this.props.location.query;


        let _query =Object.assign({},query);
            delete _query.service_code;
        return (<div className="license-query">
            <SearchForm ref={form=>this.form=form} query={this.props.location.query}/>
            <Row/>
            <Table params={_query} requiredProps={['unit_type', 'unit_id']}
                   extra={
                   <Auth to={ACCENTER_LICENSE_QUERY_DOWMLOAD}><Button
                            onClick={()=>axios.post("serviceLicense/get",cleanEmpty( Object.assign({"export":"1"},getRequestParams(this.form)))).then(()=>showTaskModal())}>导出数据</Button></Auth>}
                   className={"margin-top-lg"} url="serviceLicense/get" rowKey="license_code" columns={columns}/>
        </div>);
    }
}
class SearchFormImp extends React.Component {

    componentDidMount(){
        let query=this.props.query;
        if(query.product_code){
            query.product_code=[query.service_code, query.product_code];
        }
        this.props.form.setFieldsValue(query);

    }

    render() {
        let {getFieldDecorator, validateFields, getFieldValue,resetFields} = this.props.form;
        let unit_id                                            =getFieldValue("unit_id");
        let product_code                                       =getFieldValue("product_code");
        return (
            <Form className="license-form" onSubmit={(e)=> {
                e.preventDefault();
                validateFields((error, value)=> {
                    if(error) return;
                    Table.getTableInstance().reload(getRequestParams(this.props.form));
                })
            }}>
                <Row >
                    <Col md={12} lg={8}>
                        <UnitTypeIdGroup getFieldDecorator={getFieldDecorator}/>
                    </Col>
                    <Col md={12} lg={8}>
                        <ControlItem required name={"product_code"} label={"服务产品"} decorator={getFieldDecorator}>
                            <ServiceProduct/>
                        </ControlItem>
                    </Col>
                    <Col md={12} lg={8}>
                        <ControlItem name={"license_eff_date"} label={"有效期"} decorator={getFieldDecorator}>
                            <RangePicker format={"YYYY-MM-DD"}/>
                        </ControlItem>
                    </Col>
                    <Col md={12} lg={8}>
                        <Form.Item label={"许可状态"} >
                            {
                                getFieldDecorator("license_status",{
                                    initialValue:""
                                })(<Select>
                                    <Select.Option   value={""}>全部</Select.Option>
                                    <Select.Option   value={"1"}>未激活</Select.Option>
                                    <Select.Option   value={"2"}>已生效</Select.Option>
                                    <Select.Option   value={"3"}>已过期</Select.Option>
                                    <Select.Option   value={"4"}>已冻结</Select.Option>
                                </Select>)
                            }
                        </Form.Item>
                    </Col>
                    <Col md={12} lg={8}/>
                    <Col md={12} lg={8}>
                        <Button style={{marginLeft: 168}} type={"primary"} htmlType={"submit"}>搜索</Button>
                        <Button onClick={()=>resetFields()} className={"margin-left-lg"}>清除</Button>
                    </Col>
                </Row>
            </Form>
        )
    }
}
const SearchForm=Form.create()(SearchFormImp);
function getRequestParams(form) {

    let values= form.getFieldsValue();
    let send ={}
    if(values.license_eff_date) {
        send.valid_date_begin=values.license_eff_date[0].format('YYYY-MM-DD HH:mm:ss');
        send.valid_date_end  =values.license_eff_date[1].format('YYYY-MM-DD HH:mm:ss');
    }
    if(values.product_code) {
        if(Array.isArray(values.product_code)){
            if(values.product_code.length==2) {
                send.product_code=values.product_code[1];
            } else {
                send.service_code=values.product_code[0];
            }
        }

    }
    send.unit_type=values.unit_type;
    send.unit_id=values.unit_id;
    send.license_status=values.license_status;
    return send;
}

window.handler=handler;
