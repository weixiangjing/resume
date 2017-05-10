/**
 *  created by yaojun on 2017/3/7
 *
 */
import React from "react";
import {Form, Col, Row, Input, Radio, DatePicker, InputNumber, Alert, Button,Popconfirm,message} from "antd";
import AutoComplete from "../../../../../common/AutoComplete";
import ServiceProductFormItem from "./serviceProduct";
import {hashHistory} from "react-router";
import {amountFormat} from '../../../../../util/helper'
import {ControlItem} from "../../../../../common/FormControl";
import {echoPackage, postPackage,deletePackage} from "./reducer";
import {Auth} from "../../../../../components/ActionWithAuth";
const AuthConf = require("../../../../../config/auth_func");
let hideMessage;
const formItemLayout = {
    labelCol  : {span: 7},
    wrapperCol: {span: 17}
}
var selectProduct    = null;
class AlterForm extends React.Component {
    componentWillMount() {
        if (this.props.id)
            echoPackage({combo_code: this.props.id}, this.props.form);
    }
    componentWillUnmount(){
        selectProduct=null;
    }
    render() {
        let {getFieldDecorator, getFieldValue, resetFields} =this.props.form;
        let values                                          = getFieldValue("serviceProduct");
        let size                                            = values ?values.filter(item=>item.get("product_quantity")!==0) .size : 0;
        let total                                           = values ? values.map(item => item.get("product_quantity") * item.get("product_market_price")).reduce((a, b) => a + b) : 0;
        let isAlter                                         = !!this.props.id;
        return (
            <Form onSubmit={(e) => {
                e.preventDefault();
                postPackage(this.props.form);
            }}>
                <Row className={"sale-package-alter"} gutter={48}>
                    <Col className={"split-line"} span={12}>
                        
                        {
                            isAlter && <ControlItem formItemLayout={formItemLayout} name="combo_code" label="套餐编码"
                                                    decorator={getFieldDecorator}><Input disabled/></ControlItem>
                        }
                        
                        <ControlItem formItemLayout={formItemLayout} required name="combo_name" label="套餐名称"
                                     decorator={getFieldDecorator}><Input
                            placeholder="输入套餐的名称，用于展示"/></ControlItem>
                        <ControlItem formItemLayout={formItemLayout} required name="combo_desc" label="套餐说明"
                                     decorator={getFieldDecorator}>
                            <Input placeholder="输入套餐的内容，约定套餐使用的范围、规则等" type={"textarea"}/></ControlItem>
                        <ControlItem formItemLayout={formItemLayout} required name="combo_range" label="使用范围"
                                     decorator={getFieldDecorator}>
                            <Radio.Group>
                                <Radio value={1}>不限</Radio>
                                <Radio value={2}>商户</Radio>
                                <Radio value={3}>渠道商</Radio>
                            </Radio.Group>
                        </ControlItem>
                        {/* 生效时间*/}
                        <ControlItem opts={{rules:[{
                            validator:(rule,value,cb)=>{
                               let end= getFieldValue("combo_exp_date");
                               if(end && value>end){
                                   cb("套餐生效时间不能大于失效时间")
                               }else{
                                   cb()
                               }
                            }
                        }]}} formItemLayout={formItemLayout} required name="combo_eff_date" label="套餐生效时间"
                                     decorator={getFieldDecorator}>
                            <DatePicker showTime style={{width:200}} format="YYYY-MM-DD HH:mm:ss"/>
                        </ControlItem>
                        {/* 失效时间 */}
                        <ControlItem opts={{rules:[{
                            validator:(rule,value,cb)=>{
                                let begin= getFieldValue("combo_eff_date");
                                if(begin && value<begin){
                                    cb("套餐失效时间不能小于生效时间")
                                }else{
                                    cb()
                                }
                            }
                        }]}}  formItemLayout={formItemLayout} required name="combo_exp_date" label="套餐失效时间"
                                     decorator={getFieldDecorator}>
                            <DatePicker showTime style={{width:200}} format="YYYY-MM-DD HH:mm:ss"/>
                        </ControlItem>
                  
                        <ControlItem formItemLayout={formItemLayout} required name="combo_discount_price" label="套餐折扣价"
                                     decorator={getFieldDecorator}>
                            <Input type={"number"} style={{width:100}}/>
                        </ControlItem>
                    </Col>
                    <Col span={12}>
                        
                        <div className="over-hide margin-bottom padding-v">
                            <AutoComplete onChange={(e,obj)=>selectProduct=obj}/>
                            <Button onClick={() => {
                                if(selectProduct)
                                this.products.push(selectProduct);
                                else{
                                    if(hideMessage){
                                        hideMessage();
                                    }
                                hideMessage=    message.warn("请选择一个产品");
                               
                                }
                               
                            }} className="margin-left">添加服务产品</Button>
                        </div>
                        
                        <Alert type="info" description={`当前套餐已选定 ${size} 项服务，总价值 ${amountFormat(total / 100)} 元。`} showIcon/>
                        {
                            getFieldDecorator("serviceProduct")(
                                <ServiceProductFormItem mode={isAlter} ref={(products)=>this.products=products} />
                            )
                        }
                    </Col>
                </Row>
                <Row className={"margin-top-lg"}>
                    <Col span={3}/>
                    <Col span={21}>
                        <Button htmlType={"submit"} type="primary">保存</Button>
                        <Button onClick={()=>hashHistory.replace("/secenter/sales/package")} className={"margin-left-lg"}>取消</Button>
                        <Auth to={AuthConf.SERVICE_SALE_PACK_DELETE}>
                        {
                            isAlter &&
                            <Popconfirm title="确认删除该套餐" onConfirm={() => deletePackage(this.props.id, resetFields)}>
                            <Button type="danger"
                                               className={"pull-right margin-right-lg"}>删除</Button>
                            </Popconfirm>
                        }
                        </Auth>
                    
                    </Col>
                </Row>
            </Form>
        
        )
    }
}
const BindAlterForm = Form.create()(AlterForm);
export default class Component extends React.Component {
    render() {
        return (<BindAlterForm id={this.props.location.query.id}/>)
    }
}

