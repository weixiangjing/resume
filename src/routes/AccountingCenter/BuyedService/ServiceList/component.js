"use strict";
import React from 'react';
import axios from 'axios';

import {Card, Row, Col, Form, Input, Select, Button, Table, Tag,Alert,Switch,Icon,Radio} from "antd";
import {Link} from 'react-router';
import './style.scss';
import {CardTable} from '../../../../common/Table';
import {SearchGroupBordered} from '../../../../common/SearchGroup';
import AutoCompleteAsync from "../../../../common/AutoCompleteAsync";
import {Auth} from '../../../../components/ActionWithAuth';
import {ACCENTER_BUYED_SERVICELIST_LINK,ACCENTER_BUYED_SERVICELIST_RENEW} from '../../../../config/auth_func';

import {setDateTime,toThousands} from '../../../../util/helper';
let cardTable;
const FormItem = Form.Item;

export default React.createClass({
  getInitialState() {
    return {
      date:'',
    };
  },
  onLoading(e){if(e)this.setState({date:e.date})},
  setHandlerValue(){
    let values={};
    if(this.form){
      values={...values,...this.form.getFieldsValue()}
    }
    return values;
  },
  onSwitch(checked,id){
    let params={
      unitServiceId:id,
      is_renew:checked?'1':"2"
    };
    axios.post('purchasedService/updatePurchasedService',params).then(()=>{
      cardTable.update(this.setHandlerValue())
    })
  },
  retrueColumns(item){
    const {date}=this.state;
    const columns=[
      {
        title: '计费单元',
        width:100,
        className:'table_center',
        render:(text, record, index)=>(<span className={`${setDateTime(date,record.current_service_exp_date)=="已到期"?"colorD":''}`}><i className={`fa ${record.unit_type==1?"fa-user":record.unit_type==2?"fa-home":record.unit_type==3?"fa-mobile":"fa-odnoklassniki-square"}`}></i>{record.unit_id}</span>)
      },
      {
        title: '服务生效时间',
        render:(text, record, index)=>(<span className={`${setDateTime(date,record.current_service_exp_date)=="已到期"?"colorD":''}`}>{record.current_service_eff_date}</span>)
      },
      {
        title: '服务到期时间',
        render:(text, record, index)=>(<span className={`${setDateTime(date,record.current_service_exp_date)=="已到期"?"colorD":""}`}>{record.current_service_exp_date}</span>)
      },
      {
        title: '可用天数',
        render:(text, record, index)=>(<span className={`${setDateTime(date,record.current_service_exp_date)=="已到期"?"colorD":parseInt((new Date(record.current_service_exp_date)-new Date(date))/(1000*60*60*24))<5 ||setDateTime(date,record.current_service_exp_date)=="即将结束"?"color_1":"color_2"}`}>{item.billing_cycle==0||item.billing_mode==3?"永久":setDateTime(date,record.current_service_exp_date)}</span>)
      },
      {
        title: '自动续订',
        render:(text, record, index)=>((item.product_is_support_auto_renew!=1&&setDateTime(date,record.current_service_exp_date)!="已到期"&&item.billing_cycle!=0&&item.billing_mode!=3&&item.product_status!=2)&&
        <Auth to={ACCENTER_BUYED_SERVICELIST_RENEW}><Switch onChange={(e)=>this.onSwitch(e,record.unitServiceId)} checked={record.is_renew==1?true:false}/></Auth>)
      },
      {
        title: '操作',
        render:(text, record, index)=>(setDateTime(date,record.current_service_exp_date)!="已到期"&&
        <Auth to={ACCENTER_BUYED_SERVICELIST_LINK}><Link to={`accenter/license/query?unit_type=${record.unit_type}&unit_id=${record.unit_id}&product_code=${item.product_code}&service_code=${item.service_code}`}>许可</Link></Auth>)
      }
    ];
    return columns;
  },
  render(props,state){
    return (
      <div className="hide-page">
        <AntForm ref={(form)=>this.form=form} onSubmit={()=>cardTable.reload(this.setHandlerValue())}/>
        <CardTable
          url="purchasedService/getList"
          ref={(t)=>cardTable=t}
          requiredProps={['service_use_id']}
          onLoad={this.onLoading}
          pageSize={10}
          renderContent={(list)=>{
            return list.map((item,index)=>{
              return (
                  <Card key={index} style={{marginBottom:15}}>
                    <Row gutter={5}>
                      <Col span={8}>
                        <h4>{item.service_name}{item.product_status==2&&<Tag color="#999" className="margin-h">{item.product_status==2&&"已下架"}</Tag>}  </h4>
                        <h6>{item.product_name}</h6>
                        <h6><span className="d-price">{item.product_market_price?toThousands("元",item.product_market_price):"0"}</span>{item.billing_cycle==1?"元/天":item.billing_cycle==2?"元/月":item.billing_cycle==3?"元/年":'元'}</h6>
                        {item.billing_mode==1&&<h6>用量：{item.billing_total}{item.billing_unit}{item.billing_cycle==1?"/天":item.billing_cycle==2?"/月":item.billing_cycle==3?"/年":''}</h6>}
                      </Col>
                      <Col span={16}>
                        <Table dataSource={item.unit_services||[]} columns={this.retrueColumns(item)} size="small"
                         rowKey={'unit_id'} pagination={false}/>
                      </Col>
                    </Row>
                  </Card>
              )
            })
          }}
        />
      </div>
    )
  }
})
let _form ;
const AntForm=Form.create({
  onFieldsChange:(a,fields)=>{
    if(fields.service_status){
      cardTable.update({..._form.getFieldsValue(),pageSize:10});
    }
  }}
)(React.createClass({
  getInitialState: function () {
    return {

    };
  },

  render(){
    const {getFieldDecorator}=this.props.form;
    _form=this.props.form;
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
            }} className="myform">
        <SearchGroupBordered group={[{
            title:"服务期限",
            content:<FormItem>
                {
                    getFieldDecorator("service_status",{
                      initialValue:"1"
                    })(
                        <Radio.Group>
                            <Radio.Button value="1">不限</Radio.Button>
                            <Radio.Button value="2">生效中</Radio.Button>
                            <Radio.Button value="3">已过期</Radio.Button>
                        </Radio.Group>
                    )
                }
            </FormItem>
        },{
            title:"服务使用者",
            required:true,
            content:<div>
                <FormItem>
                    {
                        getFieldDecorator("service_use_id", {
                            rules: [{required: true,message: "请提供一个有效的商户"}],
                        })(
                            <AutoCompleteAsync
                            placeholder="请输入商户名称"
                            url="serviceAccount/getAccountName"
                            requestKey="account_name"
                            labelKey="account_name"
                            valueKey="bind_customer_no"
                            params={{bind_customer_type:"1"}}
                            />
                        )
                    }
                </FormItem>
                <FormItem labelCol={{span:6}} wrapperCol={{span:18}} label="计费单元：" className="unitid"  >
                    {getFieldDecorator('unit_id')(
                        <Input addonBefore={prefixSelector} placeholder="输入计费单元标识号"/>
                    )}
                </FormItem>
                <FormItem><Button type="primary" htmlType="submit">查询</Button></FormItem>
            </div>
        }]}/>






      </Form>
    )
  }
}));
