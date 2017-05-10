/**
 *  created by yaojun on 17/3/3
 *
 */
import React from "react";
import {Steps, Form, Input, Radio, Button, Alert, Select} from "antd";
import {Table} from "../../../../common/Table";
import {ControlItem} from "../../../../common/FormControl";
import {hashHistory} from "react-router";
import {license_state, unit_type as unit_types, update_types,license_class} from "../Query/conf";
import "./index.scss";
import {setValue, handler,submit} from "./reducer";
const Step    = Steps.Step
let unit_type = 1;
let license_table;
const success_update_types=['','更换计费单元','解冻','冻结']
class AlterForm extends React.Component {
    render() {
        let {getFieldDecorator,getFieldValue, getFieldsValue, validateFields} = this.props.form;
        let formItemLayout                                      = {
            labelCol  : {span: 4},
            wrapperCol: {span: 10}
        }
        let {step}                                              =this.props;
        
        let store                                               = handler.$state();
       let count = store.get("count");
        let values                                              = getFieldsValue();
        let billing_mode                                        = values.update_type;
        let license_codes =getFieldValue("license_codes");
        console.log(values);
        return (
            <Form >
                {/* Step 1 */}
                
                <div style={{display: step === 0 ? 'block' : 'none'}}>
                    <ControlItem formItemLayout={formItemLayout} required name={"unit_id"} label={"计费单元"}
                                 decorator={getFieldDecorator}>
                        <Input addonBefore={<Select onChange={(e) => {
                            unit_type = e
                        }} defaultValue={'1'} style={{width: 120}}>
                            <Select.Option value={'1'}>商户</Select.Option>
                            <Select.Option value={'2'}>门店Mcode</Select.Option>
                            <Select.Option value={'3'}>设备EN</Select.Option>
                            <Select.Option value={'4'}>应用内账号</Select.Option>
                        
                        </Select>} placeholder="输入计费单元标识号"/>
                    </ControlItem>
                    <ControlItem formItemLayout={formItemLayout} required name={"update_type"} label={"操作类型"}
                                 decorator={getFieldDecorator}>
                        <Radio.Group>
                            <Radio value={1}>更换计费单元</Radio>
                            <Radio value={2}>冻结许可</Radio>
                            <Radio value={3}>解冻许可</Radio>
                        </Radio.Group>
                    </ControlItem>
                    {
                        billing_mode === 1 &&
                        <ControlItem required formItemLayout={formItemLayout} name={"new_unit_id"} label={"新计费单元"}
                                     decorator={getFieldDecorator}>
                            <Input placeholder="输入新的计费单元标识号"/>
                        </ControlItem>
                    }
                    
                    <ControlItem formItemLayout={formItemLayout} required name={"update_desc"} label={"操作原因"}
                                 decorator={getFieldDecorator}>
                        <Input type={"textarea"} rows={5} placeholder="请输入本次操作的详细原因"/>
                    </ControlItem>
                </div>
                
                <div className="step-2" style={{display: step === 1 ? 'block' : 'none'}}>
                    <Alert showIcon type="warning" description="注意：冻结或解冻操作，会影响当前的许可，及晚于当前许可生效的所有同序列许可"/>
                    <div className="desc-group">
                        <p><label>生效对象：</label> {unit_types[unit_type]}</p>
                        <p><label>操作类型：</label> {update_types[values.update_type]}</p>
                        <p><label>操作原因：</label> {values.update_desc}</p>
                    </div>
                    <div className="margin-v-lg">选择待处理的许可：</div>
                    {getFieldDecorator('license_codes')(
                        <SelectionTableFormItem type={values.update_type}/>
                    )}
                  
                </div>
                
                
                <div className="margin-top-lg" style={{display: step === 2 ? 'block' : 'none'}}>
                    <Alert showIcon type="info" description={`已成功将${count}个服务产品的许可 ${success_update_types[values.update_type]}`}/>
                </div>
                
                
                {/* Action Bar */}
                <div className="margin-top">
                    {step === 0 && <Button onClick={() => {
                        validateFields((error, value) => {
                            if (error) return;
                            let searchParams = {
                                unit_type,
                                unit_id: value.unit_id
                            };
                            setValue("step", 1);
                            license_table.update(searchParams);
                        })
                    }} className={"margin-left"} type={"primary"}>下一步</Button>}
                    {step === 1 && <span>
                             <Button onClick={() => setValue('step', 0)} type={"primary"}>上一步</Button>
                        <Button disabled={!Boolean(license_codes)} onClick={()=>submit(this.props.form,unit_type)} className={"margin-left"} type={"primary"}>下一步</Button>
                        
                        </span>}
                    
                    {step === 2 && <Button onClick={()=>{
                        handler.$update("step",0)
                        hashHistory.replace("accenter/license/query")
                    }} type={"primary"}>完成</Button>}
                </div>
            </Form>
        )
    }
}
const BindAlterForm = Form.create()(AlterForm);
export default class Component extends React.Component {
    render() {
        let store = this.storeState;
        let step  = store.get("step");
        return (
            <div className="license-alter">
                <Steps current={step}>
                    <Step title="选择操作类型及计费单元"/>
                    <Step title="确认操作的许可"/>
                    <Step title="完成"/>
                </Steps>
                <div className="margin-v-lg">
                    <BindAlterForm step={step}/>
                </div>
            </div>
        );
    }
}

class SelectionTableFormItem extends React.Component {
    render() {
        let {onChange,type} = this.props;
        let columns                                             = [
            {
                title    : "产品分组",
                dataIndex: "product_group_name"
            },
            {
                title : "服务产品",
                render: (a, col) => <span>{`【${col.service_name}】${col.product_name}`}</span>
            },
            {
                title    : "最后失效时间",
                dataIndex: "license_exp_date"
            },
            {
                title : "状态",
                className:"corner-mark",
                render: (a, col) => <span className={license_class[col.license_status]}><i className="font-lg">.</i>{license_state[col.license_status]}</span>
            },
            {
                title: "有效许可序列"
            },
            {
                title : "计量总量",
                render: (a, col) => <span>{col.billing_total}{col.billing_unit}</span>
            },
            {
                title    : "本期余量",
                dataIndex: "license_current_used_balance"
            }
        ]
     
        return (
            <div>
                <Table
                    
                    requiredProps={['unit_type','unit_id']}
                    rowSelection={{
                    onSelect   : (record, selected, selectedRows) => {
                        onChange(selectedRows.map(item=>item.license_code).join(","))
                    },
                    onSelectAll: (selected, selectedRows, changeRows) => {
                       onChange(selectedRows.map(item=>item.license_code).join(","));
                    },getCheckboxProps:(records)=>{
                        let props= {disabled:true}
                        if(type==2 && (records.service_type==2||records.license_status===3||records.license_status==4)){
                           return  props
                        }
                        if(type==3 && (records.service_type==2||records.license_status===3||records.license_status==2)){
                            return  props
    
                    }
                    return {disabled:false}
                
                    }
                        
                }} ref={(t) => {
                    license_table = t;
                }} rowKey={"license_code"} url={'serviceLicense/get'} columns={columns} />
            </div>
        )
    }
}