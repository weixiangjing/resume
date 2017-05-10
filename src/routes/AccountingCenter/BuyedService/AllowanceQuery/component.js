"use strict";
import React from 'react';
import axios from 'axios';

import {notification, Row, Col, Form, Input, Select, Button, Icon, AutoComplete, Progress, Alert, Collapse} from "antd";
import {Link} from 'react-router';
import './style.scss';
import moment from 'moment';
import {CardTable} from '../../../../common/Table';
import {in_array, unique, toThousands, downloadWithForm, setDateTime} from '../../../../util/helper';
import AutoCompleteAsync from "../../../../common/AutoCompleteAsync";

const FormItem = Form.Item;
const Panel = Collapse.Panel;
let cardTable;

export default React.createClass({
  getInitialState() {
    return {
      total: 0,
      date: ''
    };
  },
  onLoading(e){
    if (e)this.setState({total: e.total, date: e.date})
  },
  setProgress_balance(_balance, _total,cycle){
    let Progress =_balance>0?parseInt(_balance / _total * 100):0;
    if(cycle==0){return 100};
    return Progress;
  },
  setProgress_date(now, cycle, exp_date){
    let date1;
    if(cycle==1){date1=1000*60*60*24};
    if(cycle==2){date1=1000*60*60*24*30};
    if(cycle==3){date1=1000*60*60*24*365};
    if(cycle==0){return 100};
    let date2 = new Date(exp_date) - new Date(now);
    let Progress = parseInt(date2 / date1 * 100)>100?100:parseInt(date2 / date1 * 100)
    return Progress;
  },
  setHandlerValue(){
    const values = this.form?this.form.getFieldsValue():{};
    if(!values.service_use_id&&!values.unit_type&&!values.unit_id){
      notification.info({
        message:"服务使用者或计费单元，需任填一项",
      })
    }
    return values;
  },
  render(props, state){
    const {total, date}=this.state;
    return (
      <div>
        <AutoForm ref={(form)=>this.form=form} onSubmit={()=>cardTable.reload(this.form.getFieldsValue())}/>
        <CardTable
          ref={(t)=>cardTable=t}
          url="purchasedService/getSurplusList"
          requireOneOfProps={['service_use_id','unit_id','unit_type']}
          onLoad={this.onLoading}
          renderContent={(list)=>{
             return(
             <Collapse accordion className="allowance_menu" defaultActiveKey='sub0'>
             {list.map((item,index)=>{
                return(
                <Panel header={<span><i className={`fa ${item.unit_type==1?"fa-user":item.unit_type==2?"fa-home":item.unit_type==3?"fa-mobile":"fa-odnoklassniki-square"}`}></i><span>{item.unit_id}</span></span>} key={`sub${index}`}>
                  {item.services.map((text,i)=>{
                    return(
                      <Row key={i} className={`${i>0?"borderBottom":""}`}>
                        <Col span={4} className="d-text-table">
                           <div className="d-title d-text-left">{text.service_name}</div>
                            <div className="d-tbody d-text-left">{text.product_name}</div>
                        </Col>
                        <Col span={4} className="d-text-table">
                            <div className="d-title">服务到期时间</div>
                            <div className="d-tbody">{text.service_exp_date}</div>
                        </Col>
                        <Col span={2} className="d-text-table">
                            <div className="d-title">可用天数</div>
                            <div className={`d-tbody ${setDateTime(date,text.service_exp_date)=='已到期'?'colorD':parseInt(setDateTime(date,text.service_exp_date))<5 ||setDateTime(date,text.service_exp_date)=="即将结束"?'color_1':'color_2'}`}>{setDateTime(date,text.service_exp_date)}</div>
                        </Col>
                        <Col span={2} className="d-text-table">
                            <div className="d-title">计量总量</div>
                            <div className="d-tbody">{text.billing_total}{text.billing_unit}</div>
                        </Col>
                        <Col span={3} className="d-text-table">
                            <div className="d-title d-text-right">本期剩余用量</div>
                            <div className="d-tbody d-text-right">{text.current_used_balance}{text.billing_unit}</div>
                        </Col>
                        <Col span={3} className="d-text-table">
                            <Progress type="circle" percent={this.setProgress_balance(text.current_used_balance,text.billing_total,text.billing_cycle)}
                                                      width={40} format={percent => `${percent}%`}/>
                        </Col>
                        <Col span={3} className="d-text-table">
                            <div className="d-title d-text-right">距离本期结束</div>
                            <div className="d-tbody d-text-right">{setDateTime(date,text.current_exp_date)}</div>
                        </Col>
                        <Col span={3} className="d-text-table">
                            <Progress type="circle" percent={this.setProgress_date(date,text.billing_cycle,text.current_exp_date)} width={40} format={percent => `${percent}%`}/>
                        </Col>
                      </Row>
                    )
                  })}
                </Panel>
                )
             })}
             </Collapse>
             )
          }}

        />
      </div>
    )
  }
})
const AutoForm = Form.create()(React.createClass({
  getInitialState: function () {
    return {

    };
  },

  render(){
    const {getFieldDecorator}=this.props.form;
    const prefixSelector = getFieldDecorator('unit_type')(
      <Select placeholder="全部" allowClear>
        <Select.Option value="1">商户</Select.Option>
        <Select.Option value="2">门店Mcode</Select.Option>
        <Select.Option value="3">设备EN</Select.Option>
        <Select.Option value="4">应用内账号</Select.Option>
      </Select>
    );

    return (
      <Form onSubmit={(e) => {
                e.preventDefault()
                this.props.form.validateFields((err, fieldsValue) => {
                  if (err)return;
                  this.props.onSubmit();
                });
            }}  style={{marginBottom:15}}>
        <Row className="form-inline inputRowAll">
          <Col span={10}>
            <FormItem label="服务使用者：" labelCol={{span: 8}} wrapperCol={{span:16}}>
              {
                getFieldDecorator('service_use_id')(
                  <AutoCompleteAsync
                    url="serviceAccount/getAccountName"
                    requestKey="account_name"
                    labelKey="account_name"
                    valueKey="bind_customer_no"
                    params={{bind_customer_type: "1"}}
                    placeholder="请输入关键字匹配正确账户"
                  />
                )
              }
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="计费单元：" className="unitid" labelCol={{span: 8}} wrapperCol={{span:16}}>
              {getFieldDecorator('unit_id')(
                <Input addonBefore={prefixSelector} placeholder="输入计费单元标识号"/>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem><Button type="primary" htmlType="submit">查询</Button></FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}));
