import React from 'react';
import axios from 'axios';

import {Card, Row, Col, Form, Input, Select, Button, AutoComplete,Alert,Switch,Icon,Radio} from "antd";
import {Link} from 'react-router';
import {Table} from '../../../../common/Table';
import {SearchGroupBordered} from '../../../../common/SearchGroup';
import AutoCompleteAsync from "../../../../common/AutoCompleteAsync";

import {Auth} from '../../../../components/ActionWithAuth';
import {ACCENTER_BUYED_OVERDUE_LINK} from '../../../../config/auth_func';
const FormItem = Form.Item;
let cardTable;


export default React.createClass({
  getInitialState() {
    return {
      date:'',
    };
  },
  onLoading(e){if(e)this.setState({date:e.date})},
  overTime(now,exp_date){
    const date=new Date(now)-new Date(exp_date);
    const hours=date/(1000*60*60);
    if(hours<1){return "<1小时"}
    if(hours>=1){return (parseInt(hours)+"小时")}
  },
  getValue(){
    const values=this.form?this.form.getFieldsValue():{};
    if(!values.time_frame){
      values.time_frame="1"
    }
    return values;
  },
  render(props,state){
    const {date}=this.state;
    const columns=[
      {
        title: '订购服务及产品',
        render:(text, record, index)=>(<span>【{record.service_name}】{record.product_name}</span>)
      },
      {
        title: '计费单元',
        render:(text, record, index)=>(<span><i className={`fa ${record.unit_type==1?"fa-user":record.unit_type==2?"fa-home":record.unit_type==3?"fa-mobile":"fa-odnoklassniki-square"}`}></i>{record.unit_id}</span>)
      },
      {
        title: '计费模式/周期',
        render:(text, record, index)=>(<span>{record.billing_mode==1?"按用量":record.billing_mode==2?"按周期":"一次性"}/
          {record.billing_cycle==1?"天":record.billing_cycle==2?"月":record.billing_cycle==3?"年":"--"}
        </span>)
      },
      {
        title: '服务到期时间',
        dataIndex: 'service_exp_date',
        render:(text, record, index)=>(<span style={{color:"#999"}}>{record.service_exp_date}</span>)
      },
      {
        title: '过期时长',
        render:(text, record, index)=>(<span style={{color:"red"}}>{this.overTime(date,record.service_exp_date)}</span>)
      },
      {
        title: '操作',
        render:(text, record, index)=>(<Auth to={ACCENTER_BUYED_OVERDUE_LINK}><Link to={`accenter/license/query?unit_type=${record.unit_type}&unit_id=${record.unit_id}&product_code=${record.product_code}&service_code=${record.service_code}`}>最近许可</Link></Auth>)
      }
    ];
    return (
      <div>
        <AntForm ref={(form)=>this.form=form} onSubmit={()=>cardTable.reload(this.getValue())}/>
        <Table
          columns={columns}
          params={this.getValue()}
          url="purchasedService/getOverdueList"
          ref={(t)=>cardTable=t}
          onLoad={this.onLoading}
          rowKey={(text, record, index)=>index}
        />
      </div>
    )
  }
})

let _form ;
const AntForm=Form.create(
  {
    onFieldsChange:(a,fields)=>{
      if(fields.time_frame){
        cardTable.update( _form.getFieldsValue());
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
    return (
      <Form onSubmit={(e) => {
                e.preventDefault()
                this.props.form.validateFields((err, fieldsValue) => {
                  if (err)return;
                  this.props.onSubmit();
                });
            }} className="myform" style={{marginBottom:15}}>
        <SearchGroupBordered group={[{
            title:"时间范围",
            content:<FormItem>
                {
                    getFieldDecorator("time_frame",{
                      initialValue:"1"
                    })(
                        <Radio.Group>
                            <Radio.Button value="1">1天内</Radio.Button>
                            <Radio.Button value="7">7天内</Radio.Button>
                            <Radio.Button value="15">15天内</Radio.Button>
                            <Radio.Button value="30">1月内</Radio.Button>
                        </Radio.Group>
                    )
                }
            </FormItem>
        },{
            title:"服务名称",
            content:<div>
                <FormItem>
                   {getFieldDecorator('service_use_id')(
                  <AutoCompleteAsync
                    url="service/get"
                    requestKey="keywords"
                    labelKey="service_name"
                    valueKey="service_code"
                    placeholder="请输入关键字匹配正确服务名称"
                  />
                )}
                </FormItem>
                <FormItem><Button type="primary" htmlType="submit">查询</Button></FormItem>
            </div>
        }]}/>






      </Form>
    )
  }
}));
