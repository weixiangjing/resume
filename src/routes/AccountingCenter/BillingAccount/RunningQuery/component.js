"use strict";
import React from 'react';
import axios from 'axios';
import {Card, Row, Col, Icon, Form, Input, Select, Button,DatePicker, notification ,AutoComplete} from "antd";
import {Link} from 'react-router';
import {Table} from '../../../../common/Table';
import {in_array,unique,toThousands,showTaskModal} from '../../../../util/helper';
import moment from 'moment';
import AutoCompleteAsync from "../../../../common/AutoCompleteAsync";
import {Auth} from '../../../../components/ActionWithAuth';
import {ACCENTER_BILLING_QUERYR_DETAILS,ACCENTER_BILLING_QUERYR_DOWNLOAD} from '../../../../config/auth_func';

import './style.scss';
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
let setTable;

export default React.createClass({
  getInitialState() {
    return {
      no:'',
    };
  },
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
    if(!fieldsValue.account_no&&!fieldsValue.outer_sys_no){
      notification.info({
        message:"账户名称或外部订单号，需任填一项",
      })
    }
    return fieldsValue;
  },
  onloading(e){if(e.data.length)this.setState({no:e.data[0].account_no})},
  render(){
    const columns=[
      {
        title: '流水号',
        dataIndex: 'book_no',
      },
      {
        title: '创建时间',
        dataIndex: 'book_trade_time',
      },
      {
        title: '操作类型',
        dataIndex: 'book_subject_name',
      },
      {
        title: '发生金额（元）',
        render:(text, record, index)=>(<span className={`${record.book_type==2?"d-amount":"d-price"}`}>{this.retrueAmount(record.book_occur_amount,record.book_type)}</span>)
      },
      {
        title: '当前余额（元）',
        render:(text, record, index)=>(<span>{record.book_account_current_balance?toThousands("元",record.book_account_current_balance):"0"}</span>)
      },
      {
        title: '外部订单号',
        dataIndex: 'outer_sys_no',
      }
    ];
    return (
      <div>
        <SearchForm ref={(form)=>this.form=form} getValue={()=>this.getValue()} onSubmit={()=>setTable.reload(this.getValue())}/>
        <Auth to={ACCENTER_BILLING_QUERYR_DETAILS}>
          {this.state.no?<h5>账户号：<Link to={`/accenter/billing/querya/details?id=${this.state.no}`}>{this.state.no}</Link></h5>:''}
        </Auth>
        <Table
          columns={columns}
          url="serviceAccount/getFw"
          rowKey={'book_no'}
          ref={(t)=>setTable=t}
          requireOneOfProps={['account_no','outer_sys_no']}
          onLoad={this.onloading}
          extra={<Auth to={ACCENTER_BILLING_QUERYR_DOWNLOAD}><Button onClick={()=>axios.post('serviceAccount/getFw',{...this.getValue(),"export":"1"}).then(()=>showTaskModal())}>导出数据</Button></Auth>}
          autoInit={false}
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
              <FormItem labelCol={{span: 8}} wrapperCol={{span:16}} label="交易类型：">
                {getFieldDecorator('book_subject_name', {
                })(
                  <Select placeholder="全部" allowClear>
                      <Option value="">全部</Option>
                    <Option value="账户充值">账户充值</Option>
                    <Option value="服务订购">服务订购</Option>
                    <Option value="服务续订">服务续订</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col xs={2} sm={4} md={6} lg={8}>
              <FormItem labelCol={{span: 8}} wrapperCol={{span:16}} label="创建时间：">
                {getFieldDecorator('custom_date', {
                  //initialValue:[moment(Date.now()).add(-1, 'week'),moment(Date.now())]
                })(
                  <RangePicker disabledDate={this.disabledDate}/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={5}>
            <Col xs={2} sm={4} md={6} lg={8} >
              <FormItem labelCol={{span: 8}} wrapperCol={{span:16}} label="外部订单号：">
                {getFieldDecorator('outer_sys_no', {
                })(
                  <Input placeholder="输入准确的充值订单号"/>
                )}
              </FormItem>
            </Col>
            <Col  xs={22} sm={20} md={18} lg={16} className='text-right formBtn'>
              <Button type="primary" htmlType="submit" loading={this.state.pending}>搜索</Button>
              <Button onClick={this.handleReset}>清除</Button>
            </Col>
          </Row>
        </div>
      </Form>
    );
  },
}));
