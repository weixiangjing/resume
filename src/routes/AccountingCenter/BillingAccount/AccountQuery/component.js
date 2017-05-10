"use strict";
import React from 'react';
import axios from 'axios';

import {Card, Row,Col,Form,Input, Button,DatePicker, Tag ,AutoComplete, Alert} from "antd";
import {Link} from 'react-router';
import moment from 'moment';
import './style.scss';
import {CardTable} from '../../../../common/Table';
import {in_array,unique,toThousands} from '../../../../util/helper';
import AutoCompleteAsync from "../../../../common/AutoCompleteAsync";
import {Auth} from '../../../../components/ActionWithAuth';
import {ACCENTER_BILLING_QUERYA_DETAILS} from '../../../../config/auth_func';
import User from '../../../../model/User'
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

let cardTable;

export default React.createClass({
  getInitialState:function() {
    return {
      total:0,
    };
  },
  getValue(){
    const fieldsValue=this.form?this.form.getFieldsValue():{};
    if(fieldsValue.custom_date){
      if(fieldsValue.custom_date.length){
        fieldsValue.create_time_begin=fieldsValue.custom_date[0].format('YYYY-MM-DD 00:00:00');
        fieldsValue.create_time_end=fieldsValue.custom_date[1].format('YYYY-MM-DD 23:59:59');
      }else {
        delete fieldsValue.create_time_begin;
        delete fieldsValue.create_time_end;
      }
    }
    if(!fieldsValue.custom_date){
      fieldsValue.create_time_begin=moment(Date.now()).add(-1, 'week').format('YYYY-MM-DD 00:00:00');
      fieldsValue.create_time_end=moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    }
    return fieldsValue;
  },
  render(props, state){
    let {children}=this.props;
    return (
      <div>
          {children}
          <div style={{display:children?"none":"block"}}>
        <SearchForm ref={(form)=>this.form=form} onSubmit={()=>cardTable.reload(this.getValue())}/>
        <CardTable
          url="serviceAccount/get"
          ref={(t)=>cardTable=t}
          params={this.getValue()}
          renderContent={(list)=>
            list.map((item,index)=>{
             return(
                <Row key={index} style={{marginBottom:10}}>
          <Card className="card_list" >
            <Col span="10">
            {User.actionMap[ACCENTER_BILLING_QUERYA_DETAILS.split("?")[0]]?
                          <Auth to={ACCENTER_BILLING_QUERYA_DETAILS}>
                <Link to={`/accenter/billing/querya/details?id=${item.account_no}`}><h4>{item.account_name}</h4></Link>
              </Auth>:<h4>{item.account_name}</h4>}
              <Tag color={item.bind_customer_type=='1'?"#2db7f5":"#f50"}>{item.bind_customer_type==1?"商户":"渠道商"}</Tag>
            </Col>

            <Col span="1"><span className="ant-divider"/></Col>
            <Col span="6">
              <p><span>账户号：</span>{item.account_no}</p>
              <p><span>开户时间：</span>{item.create_time}</p>
            </Col>
            <Col span="1"><span className="ant-divider"/></Col>
            <Col span="6">
              <p>账单余额（元）</p>
              <h5>{item.account_balance?toThousands('元',item.account_balance):"0"}</h5>
            </Col>
          </Card>
        </Row>
              )
            })
          }
        />
          </div>
      </div>
    )
  }
})
const SearchForm=Form.create()(React.createClass({
  getInitialState:function() {
    return {
      pending:false,
      result:[]
    };
  },
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if(err)return;
      this.props.onSubmit();
    });
  },
  handleReset(){this.props.form.resetFields();AutoCompleteAsync.clear()},
  disabledDate(current){return current&&current.valueOf()>Date.now();},
  render() {
    const { getFieldDecorator } = this.props.form;
    const children=this.props.children;
    if(children)return children;
    return (
      <Form horizontal className="myform" onSubmit={this.handleSubmit}>
        <div className="formFields">
          <Row gutter={5}>
            <Col xs={2} sm={4} md={6} lg={8} >
              <FormItem labelCol={{span: 8}} wrapperCol={{span:16}} label="账户名称：">
                {getFieldDecorator('account_no', {

                })(
                  <AutoCompleteAsync
                    url="serviceAccount/getAccountName"
                    requestKey="account_name"
                    labelKey="account_name"
                    valueKey="account_no"
                    placeholder="请输入关键字匹配正确账户"
                  />
                )}
              </FormItem>
            </Col>
            <Col xs={2} sm={4} md={6} lg={8}>
              <FormItem labelCol={{span: 8}} wrapperCol={{span:16}} label="账户创建时间：">
                {getFieldDecorator('custom_date', {
                  initialValue:[moment(Date.now()).add(-1, 'week'),moment(Date.now())]
                })(
                  <RangePicker disabledDate={this.disabledDate}/>
                )}
              </FormItem>
            </Col>
            <Col  xs={2} sm={4} md={6} lg={8} className='text-button'>
              <Button type="primary" htmlType="submit" loading={this.state.pending}>搜索</Button>
              <Button style={{marginLeft:15}} onClick={this.handleReset}>清除</Button>
            </Col>
          </Row>
        </div>
      </Form>
    );
  },
}));
