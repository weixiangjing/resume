"use strict";
import React from 'react';
import axios from 'axios';

import {Card, Row, Col, Form, Input, Select, Button, DatePicker, AutoComplete,Tag} from "antd";
import {Link} from 'react-router';
import './style.scss';
import {CardTable} from '../../../common/Table';
import AutoCompleteAsync from "../../../common/AutoCompleteAsync";
import moment from 'moment';
import {in_array, unique, toThousands,showTaskModal} from '../../../util/helper';
import {ACCENTER_BILLTMS_DETAILS,ACCENTER_BILLTMS_DOWNLOAD} from '../../../config/auth_func'
import {Auth} from '../../../components/ActionWithAuth';
import User from  "../../../model/User";
let cardtable;
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
export default React.createClass({

  getInitialState() {
    return {
      visible: false,
    };
  },

  getFieldsValue(){
    const fieldsValue = this.form?this.form.getFieldsValue():{};
    if(!fieldsValue._date){
      fieldsValue.time_type = "2";
      fieldsValue.create_time_begin = moment(Date.now()).add(-1, 'week').format('YYYY-MM-DD 00:00:00');
      fieldsValue.create_time_end = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    }
    if(fieldsValue._date){
      if(fieldsValue._date.length){
        if(fieldsValue.time_type == "1"){
          delete fieldsValue.create_time_begin;
          delete fieldsValue.create_time_end;
          fieldsValue.pay_time_begin = fieldsValue._date[0].format('YYYY-MM-DD 00:00:00');
          fieldsValue.pay_time_end = fieldsValue._date[1].format('YYYY-MM-DD 23:59:59');
        };
        if(fieldsValue.time_type == "2"){
          delete fieldsValue.pay_time_begin;
          delete fieldsValue.pay_time_end;
          fieldsValue.create_time_begin = fieldsValue._date[0].format('YYYY-MM-DD 00:00:00');
          fieldsValue.create_time_end = fieldsValue._date[1].format('YYYY-MM-DD 23:59:59');
        };
      }else {
        delete fieldsValue.create_time_begin;
        delete fieldsValue.create_time_end;
        delete fieldsValue.pay_time_begin;
        delete fieldsValue.pay_time_end;
      }
    }
    return fieldsValue;
  },
  getTime(item){
    const value=this.getFieldsValue();
    if(value.time_type==1){return item.pay_time;}
    if(value.time_type==2){return item.create_time;}
  },
  render(props, state){
    const children=this.props.children;
    if(children) return children;
    return (<div style={{overflow:"hidden"}}>
          <SearchForm getValue={()=>this.getFieldsValue()} ref={(form)=>this.form=form} onSubmit={()=>cardtable.reload(this.getFieldsValue())}/>
          <CardTable
            params={this.getFieldsValue()}
            url="serviceBill/getList"
            ref={(t)=>cardtable=t}
            extra={
            <Auth to={ACCENTER_BILLTMS_DOWNLOAD}>
              <Button onClick={()=>axios.post('serviceBill/getList',{...this.getFieldsValue(),"export":"1"}).then(()=>showTaskModal())}>导出数据</Button>
            </Auth>
            }
            renderContent={
          (data)=>data.map((item,index)=>{
            return(
              <Row style={{marginBottom:10}} key={index}>
                <Card className="card_list">
                  <Col span="10">
                    <div>
                    {User.actionMap[ACCENTER_BILLTMS_DETAILS.split("?")[0]]?<Auth to={ACCENTER_BILLTMS_DETAILS}>
                      <Link to={{pathname:"/accenter/list/billtms/details",query:{id:item.order_no,type:this.getFieldsValue().time_type,time:this.getTime(item),status:item.order_status}}}><h5>账单号：{item.order_no}</h5></Link>
                    </Auth>:<h5>账单号：{item.order_no}</h5>}
                      <Tag color={`${item.product_type=='2'?"#2db7f5":"#f50"}`}>{item.product_type==1?"服务产品":"服务套餐"}</Tag><span className="type">{item.order_type==1?"标准":"续订"}</span>
                    </div>
                    <div>
                      <p style={{float:"left"}}>订单号：{item.outer_no}</p>
                      <p style={{float:"right"}}>{this.getTime(item)}</p>
                    </div>
                  </Col>
                  <Col span="1"><span className="ant-divider"/></Col>
                  <Col span="6">
                    <div>
                      <p>订购总金额（元）</p>
                      <h5>{item.order_pay_amount?toThousands("元",item.order_pay_amount):"0"}</h5>
                    </div>
                    <div>
                      <p>优惠金额（元）</p>
                      <h5>{item.order_discount_amount?toThousands("元",item.order_discount_amount):"0"}</h5>
                    </div>
                  </Col>
                  <Col span="1"><span className="ant-divider"/></Col>
                  <Col span="3">
                    <p>账单总金额（元）</p>
                    <h5>{item.order_real_amount?toThousands("元",item.order_real_amount):"0"}</h5>
                  </Col>
                  <Col span="1"><span className="ant-divider"/></Col>
                  <Col span="2">
                    <span className={`${item.order_status==1?"color_1":item.order_status==2?"color_2":"color_3"}`}>{item.order_status==1?"待付款":item.order_status==2?"已付款":"已关闭"}</span>
                  </Col>
                </Card>
              </Row>
             )
           })
          }
          />
      </div>
    )
  }
})
const SearchForm = Form.create()(React.createClass({
  getInitialState: function () {
    return {
      pending: false,
    };
  },
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err)return;
      this.props.onSubmit();
    });
  },
  handleReset(){
    this.props.form.resetFields(["buyerAccount","order_status","unit_id","product_name","outer_no"]);
    AutoCompleteAsync.clear()
  },
  disabledDate(current){return current&&current.valueOf()>Date.now();},
  render() {
    const {getFieldDecorator,getFieldsValue} = this.props.form;
    const prefixSelector = getFieldDecorator('unit_type')(
      <Select placeholder="全部" allowClear>
        <Select.Option value="1">商户</Select.Option>
        <Select.Option value="2">门店Mcode</Select.Option>
        <Select.Option value="3">设备EN</Select.Option>
        <Select.Option value="4">应用内账号</Select.Option>
      </Select>
    );
    return (
      <Form horizontal className="myform" onSubmit={this.handleSubmit}>
        <div className="formFields">
          <Row gutter={5}>
            <Col span={8}>
              <FormItem labelCol={{span: 8}} wrapperCol={{span:16}} label="付款账户：">
                {getFieldDecorator('buyerAccount')(
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
            <Col span={8}>
              <Row>
                <div className="inline-input-group inline input-group-width-select ">
                  <Col span={8} className="ant-form-item-label"><label><span style={{color:"red"}}>* </span>时间段</label></Col>
                  <Col className="input-select-group" span={16}>
                    {
                      getFieldDecorator('time_type',{
                          initialValue:"2"
                      })(
                        <Select style={{width:55}}>
                          <Select.Option value="1">支付</Select.Option>
                          <Select.Option value="2">创建</Select.Option>
                        </Select>
                      )
                    }
                    <div id="_time">
                      {getFieldDecorator('_date', {
                        rules: [{required: true, message: '请选择时间段'}],
                          initialValue:[moment(Date.now()).add(-1, 'week'),
                              moment(Date.now())]
                      })(
                        <RangePicker disabledDate={this.disabledDate}/>
                      )}
                    </div>
                  </Col>
                </div>
              </Row>

            </Col>
            <Col span={8}>
              <FormItem labelCol={{span: 8}} wrapperCol={{span:16}} label="账单状态：">
                {getFieldDecorator('order_status')(
                  <Select placeholder="全部" allowClear>
                      <Select.Option value="">全部</Select.Option>
                    <Select.Option value="1">未支付</Select.Option>
                    <Select.Option value="2">已支付</Select.Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={5}>
            <Col span={8}>
              <FormItem labelCol={{span: 8}} wrapperCol={{span:16}} label="账单号：">
                {getFieldDecorator('order_no')(
                  <Input placeholder="输入准确的账单号"/>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem labelCol={{span: 8}} wrapperCol={{span:16}} label="服务：">
                {getFieldDecorator('service_code')(
                  <AutoCompleteAsync
                    url="service/get"
                    requestKey="keywords"
                    labelKey="service_name"
                    valueKey="service_code"
                    placeholder="请输入关键字匹配正确账户"
                  />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem labelCol={{span: 8}} wrapperCol={{span:16}} label="外部订单号：">
                {getFieldDecorator('outer_no')(
                  <Input placeholder="输入准确的订单号"/>
                )}
              </FormItem>
            </Col>
          </Row>
        </div>
        <Row gutter={5} className='form-action' style={{marginTop:15}}>
          <Col span={8}>
            <FormItem labelCol={{span: 8}} wrapperCol={{span:16}} label="计费单元：">
              {getFieldDecorator('unit_id')(
                <Input addonBefore={prefixSelector} placeholder="输入计费单元标识号"/>
              )}
            </FormItem>
          </Col>
          <Col span={12} className='text-right' style={{float:'right'}}>
            <Button type="primary" htmlType="submit" loading={this.state.pending}>搜索</Button>
            <Button onClick={this.handleReset}>清除</Button>
          </Col>
        </Row>
      </Form>
    );
  },
}));
