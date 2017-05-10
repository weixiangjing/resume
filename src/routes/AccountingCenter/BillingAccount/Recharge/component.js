"use strict";
import React from 'react';
import axios from 'axios';

import {Card, Row, Col, Icon, Form, Input, Select, Button,DatePicker, notification ,AutoComplete} from "antd";
import {Link} from 'react-router';
import {Table} from '../../../../common/Table';
import {handler,getSuggestions} from './reducer';
import {in_array,unique,toThousands,showTaskModal} from '../../../../util/helper';
import moment from 'moment';
import '../AccountQuery/style.scss';
import AutoCompleteAsync from "../../../../common/AutoCompleteAsync";
import {Auth} from '../../../../components/ActionWithAuth';
import {ACCENTER_BILLING_TOPUP_DETAILS,ACCENTER_BILLING_TOPUP_DOWMLOAD} from '../../../../config/auth_func';
import User from  "../../../../model/User";

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
let setTable;






export default React.createClass({

  retrueAmount(sum,type){
    if(sum){
      if(type==1){
        let amount='-'+toThousands('元',sum);
        return amount;
      }
      return toThousands('元',sum);
    }else {
      return '0'
    }
  },
  getValue(){
    const fieldsValue=this.form?this.form.getFieldsValue():{};
    if(fieldsValue.custom_date){
      if(fieldsValue.custom_date.length){
        fieldsValue.book_trade_time_begin=fieldsValue.custom_date[0].format('YYYY-MM-DD 00:00:00');
        fieldsValue.book_trade_time_end=fieldsValue.custom_date[1].format('YYYY-MM-DD 23:59:59');
      }else {
        delete fieldsValue.book_trade_time_begin;
        delete fieldsValue.book_trade_time_end;
      }
    }
    if(!fieldsValue.custom_date){
      fieldsValue.book_trade_time_begin=moment(Date.now()).add(-1, 'week').format('YYYY-MM-DD 00:00:00');
      fieldsValue.book_trade_time_end=moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    }
    return fieldsValue;
  },
  render(){
    const columns=[
      {
        title: '充值订单号',
        dataIndex: 'charge_order_no',
        render:(text, record, index)=>
          (<span>
            {User.actionMap[ACCENTER_BILLING_TOPUP_DETAILS.split("?")[0]]?<Auth to={ACCENTER_BILLING_TOPUP_DETAILS}>
              <Link to={`/accenter/billing/topup/details?order_no=${record.charge_order_no}`}>{record.charge_order_no}</Link>
            </Auth>:record.charge_order_no}
          </span>
        )
      },
      {
        title: '订单时间',
        dataIndex: 'create_time',
      },
      {
        title: '充值账户',
        dataIndex: 'account_name',
      },
      {
        title: '订单状态',
        render:(text, record, index)=>(<span className={`${record.order_status==1?"color_1":record.order_status==2?"color_2":"color_3"}`}>{record.order_status==1?'待付款':record.order_status==2?'已支付':'已关闭'}</span>)
      },
      {
        title: '订单金额（元）',
        render:(text, record, index)=>(<span>{record.charge_amount?toThousands("元",record.charge_amount):'0'}</span>)
      },
      {
        title: '实付金额（元）',
        render:(text, record, index)=>(<span>{record.order_real_amount?toThousands("元",record.order_real_amount):"0"}</span>)
      },
      {
        title: '流水号',
        render:(text, record, index)=>(<span>{record.pay_sys_no?record.pay_sys_no:"--"}</span>)
      }
    ];
    const children=this.props.children;
    if(children)return children;
    return (
      <div>
        <SearchForm getValue={()=>this.getValue()} ref={form=>this.form=form} onSubmit={()=>setTable.reload(this.getValue())}/>
        <Table
          columns={columns}
          url="serviceAccount/getRechargeOrder"
          rowKey={'charge_order_no'}
          ref={(t)=>setTable=t}
          params={this.getValue()}
          extra={
          <Auth to={ACCENTER_BILLING_TOPUP_DOWMLOAD}>
            <Button onClick={()=>axios.post('serviceAccount/getRechargeOrder',{...this.getValue(),"export":"1"}).then(()=>showTaskModal())}>导出数据</Button>
          </Auth>}
        />
      </div>
    )
  }
})
const SearchForm=Form.create()(React.createClass({
  getInitialState:function() {
    return {
      pending:false,
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
    return (
      <Form horizontal className="myform" onSubmit={this.handleSubmit}>
        <div className="formFields">
          <Row gutter={5}>
            <Col xs={2} sm={4} md={6} lg={8}>
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
              <FormItem labelCol={{span: 8}} wrapperCol={{span:16}} label="订单号：">
                {getFieldDecorator('charge_order_no', {
                })(
                 <Input placeholder="输入准确的充值订单号"/>
                )}
              </FormItem>
            </Col>
            <Col xs={2} sm={4} md={6} lg={8}>
              <FormItem labelCol={{span: 8}} wrapperCol={{span:16}} label="订单时间：">
                {getFieldDecorator('custom_date', {
                  initialValue:[moment(Date.now()).add(-1, 'week'),moment(Date.now())]
                })(
                  <RangePicker disabledDate={this.disabledDate}/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={5} style={{marginTop:10}}>
            <Col xs={2} sm={4} md={6} lg={8} >
              <FormItem labelCol={{span: 8}} wrapperCol={{span:16}} label="订单状态：">
                {getFieldDecorator('order_status', {
                })(
                  <Select placeholder="全部" allowClear>
                    <Option value="1">待付款</Option>
                    <Option value="2">已支付</Option>
                    <Option value="3">已关闭</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col  xs={22} sm={20} md={18} lg={16} className='text-right formBtn'>
              <Button type="primary" htmlType="submit" >搜索</Button>
              <Button onClick={this.handleReset}>清除</Button>
            </Col>
          </Row>
        </div>
      </Form>
    );
  },
}));
