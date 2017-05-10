/**
 *  created by yaojun on 2017/3/7
 *
 */
import React from "react";
import {changeStep, postData, echoActivity, dateFormat, deleteActivity, cleanForm2Data} from "./reducer";
import {Production} from "../../../../../components/Select/ServiceType";
import {SaleRulesSelect} from "../../../../../components/Select/SaleRule";
import {hashHistory} from "react-router";
import {Modal, Tabs, Input, Form, Radio, Button, DatePicker, Row, Col, Alert} from "antd";
import {ControlItem} from "../../../../../common/FormControl";
const layout ={
    labelCol: {span: 4}, wrapperCol: {span: 11}
}
const sLayout={
    labelCol: {span: 8}, wrapperCol: {span: 16}
}
const xLayout={
    labelCol: {span: 4}, wrapperCol: {span: 8}
}
export default class Component extends React.Component {
    componentDidMount() {
        let query=this.props.location.query;
        let id   =query.discountId;
        this.id  =id;
        if(id) { //alter
            echoActivity(query, this.form1, this.form2);
        }
    }


    render() {
        let store  =this.storeState;
        let step   =store.get("step");
        let isAlter=store.get("isAlter");
        let isDelete =store.get("isDelete");
        let id     =this.props.location.query.discountId;
        return (
            <div>
                <Tabs onTabClick={(index)=>changeStep(this.form1, this.form2, index, (data)=> {
                    this.form2.setFieldsValue(data)
                })} activeKey={step}>
                    <Tabs.TabPane tab="基本属性" key={"1"}>
                        <BindStepForm1 isAlter={isAlter} ref={(step1)=>this.form1=step1}/>
                    </Tabs.TabPane>
                    {/* Tab 2 */}
                    <Tabs.TabPane tab="活动规则" key={"2"}>
                        <BindStepForm2 isClean={id} isAlter={isAlter} ref={(step2)=>this.form2=step2}
                                       step1={this.form1}/>
                    </Tabs.TabPane>
                </Tabs>
                {/* Action Bar */}
                <Row>
                    <Col span={4}/>
                    <Col span={12}>
                        <Button onClick={()=> {
                            if(step==1) {
                                changeStep(this.form1, this.form2, '2', (data)=> {
                                    this.form2.setFieldsValue(data);

                                    setTimeout(()=> this.form2.setFieldsValue({
                                        copy_of_input_param: data.copy_of_input_param
                                    }))
                                });
                            } else {
                                postData(this.form1, this.form2)
                            }
                        }} className={"margin-right-lg"}>{
                            step==1 ? "下一步" : "保存"
                        }</Button>
                        {/**/}
                        <Button onClick={()=>hashHistory.goBack()}>取消</Button>
                        {
                            isDelete&&<Button onClick={()=>Modal.confirm({
                                title: '操作提示', content: "确认要删除该活动吗？", onOk: ()=> {
                                    deleteActivity(this.props.location.query.discountId)
                                }
                            })} className={"pull-right margin-right-lg"} type={"danger"}>删除</Button>
                        }


                    </Col>
                </Row>
            </div>


        )
    }
}
class Step1 extends React.Component {
    render() {
        let {getFieldDecorator, getFieldValue} =this.props.form;
        let isAlter                            =this.props.isAlter;
        return (
            <Form >
                {/* alter only */}
                <div className="form-hide">
                    <ControlItem name={'discountId'} decorator={getFieldDecorator}>
                        <Input />
                    </ControlItem>
                </div>


                <ControlItem formItemLayout={layout} name={'discount_name'} decorator={getFieldDecorator} label={"活动名称"}
                             required>
                    <Input placeholder="用于展示优惠活动的显示名称"/>
                </ControlItem>

                <ControlItem formItemLayout={layout} name={'discount_desc'} decorator={getFieldDecorator} label={"活动描述"}
                             required>
                    <Input rows={5} type={"textarea"} placeholder="输入优惠活动的内容及细则"/>
                </ControlItem>
                <Row gutter={24}>
                    <Col span={12}>
                        <ControlItem formItemLayout={sLayout} name={'dicount_range'} decorator={getFieldDecorator}
                                     label={"订购范围"} required>
                            <Radio.Group disabled={isAlter}>
                                <Radio value={1}>不限</Radio>
                                <Radio value={2}>商户</Radio>
                                <Radio value={3}>渠道商</Radio>
                            </Radio.Group>
                        </ControlItem>
                    </Col>

                </Row>

                <Row gutter={24}>
                    <Col span={8}>
                        <ControlItem opts={{
                            rules: [{
                                validator: (rule, value, cb)=> {
                                    let end=getFieldValue("discount_exp_date");
                                    console.log(end)
                                    if(value&&value>end) {
                                        cb("生效时间不能小于失效时间")
                                    } else {
                                        cb()
                                    }
                                }
                            }]
                        }} formItemLayout={{labelCol: {span: 12}, wrapperCol: {span: 12}}} name={'discount_cff_date'}
                                     decorator={getFieldDecorator}
                                     label={"生效时间"} required>
                            <DatePicker format={dateFormat} showTime/>
                        </ControlItem>
                    </Col>
                    <Col span={8}>
                        <ControlItem opts={{
                            rules: [{
                                validator: (rule, value, cb)=> {
                                    let begin=getFieldValue("discount_cff_date");
                                    if(value&&value<begin) {
                                        cb("失效时间不能小于生效时间")
                                    } else {
                                        cb()
                                    }
                                }
                            }]
                        }} formItemLayout={sLayout} name={'discount_exp_date'} decorator={getFieldDecorator}
                                     label={"失效时间"} required>
                            <DatePicker format={dateFormat} showTime/>
                        </ControlItem>
                    </Col>
                </Row>
                <ControlItem formItemLayout={layout} name={'discount_type'} decorator={getFieldDecorator} label={"优惠形式"}
                             required>
                    <Radio.Group disabled={isAlter}>
                        <Radio value={1}>服务产品优惠活动</Radio>
                        <Radio value={2}>订购订单优惠活动</Radio>
                    </Radio.Group>
                </ControlItem>

            </Form>
        )
    }
}

class Step2 extends React.Component {
    state={
        disableCountControl: false
    }


    componentDidMount() {
        if(!this.props.isClean) {
            this.props.form.resetFields();
        }
    }

    getRulePlaceholder(rule){
        if(!rule) return;

        if(!rule ||!rule.trim()) return;
        let params = JSON.parse(rule);
        if(Array.isArray(params))
            return params.map(item=>item.param_desc).join(",");
        else return params.param_desc;

    }
    render() {
        let {getFieldDecorator, setFieldsValue,getFieldValue} =this.props.form;
        let form1                               =this.props.step1;
        if(!form1) return <Alert showIcon description="请先填写基本属性" type="warning"/>
        let discount_type=form1.getFieldValue("discount_type");
        if(!discount_type)  return <Alert showIcon message="必须填写优惠形式" type="warning"/>
        let productOnly=discount_type==1;
        let isAlter    =this.props.isAlter;

        let rulePlaceholder=this.getRulePlaceholder(getFieldValue("origin_rule_params"));
        return (
            <Form>
                {/*  订单优惠模式   */}

                {
                    productOnly&&<ControlItem onChange={(e)=> {
                        Production.findProduct(e).then(result=> {
                            let disabled=result.billing_mode==1
                            this.setState({disableCountControl: disabled});
                            if(disabled) setFieldsValue({discount_adjust_use_total: 0})
                        });
                        return e;
                    }} formItemLayout={xLayout} name={'product_code'} decorator={getFieldDecorator} label={"所属服务"}
                                              required>

                        <Production/>

                    </ControlItem>
                }

                <div className="form-hide">
                    {
                        getFieldDecorator("origin_rule_params")(<Input/>)
                    }
                </div>

                <ControlItem extra={"单位 ：元"} formItemLayout={xLayout} name={'discount_budget_amount'}
                             decorator={getFieldDecorator} label={"营销预算总额度"} required>

                    <Input style={{width: 100}} type={"number"}/>

                </ControlItem>

                <ControlItem formItemLayout={xLayout} name={'rule_id'} decorator={getFieldDecorator}
                             label={"规则限定条件"} required>
                    <SaleRulesSelect onChange={(e,item)=>{

                        setFieldsValue({
                            "origin_rule_params":item.rule_input_param
                        });
                    }} status={discount_type} />
                </ControlItem>
                {
                    ( rulePlaceholder)&&<ControlItem opts={{
                        rules: [{required:true,message:"条件参数值必填"}]
                    }} extra={"参数值："+rulePlaceholder} formItemLayout={xLayout} name={'copy_of_input_param'}
                                                                   decorator={getFieldDecorator}
                                                                   label={"条件参数值"}>
                        <Input placeholder={rulePlaceholder}  style={{width: 200}}/>
                    </ControlItem>
                }

                <ControlItem required extra={"金额为正值表示上涨，负值表示优惠，单位 ：元"} formItemLayout={xLayout}
                             name={'discount_adjust_amount'}
                             decorator={getFieldDecorator} label={"活动调整金额"}>
                    <Input style={{width: 100}} type={"number"}/>
                </ControlItem>




            </Form>
        )
    }
}
const BindStepForm1=Form.create()(Step1);
const BindStepForm2=Form.create()(Step2);
