import React from 'react';
import axios from 'axios';

import {Card, Row, Col, Form, Input, Select, Button, AutoComplete,Alert,Switch,Icon,Radio} from "antd";
import {Link} from 'react-router';
import {Table} from '../../../../common/Table';
import {SearchGroupBordered} from '../../../../common/SearchGroup';
import AutoCompleteAsync from "../../../../common/AutoCompleteAsync";
import {setDateTime} from '../../../../util/helper';
import {Auth} from '../../../../components/ActionWithAuth';
import {ACCENTER_BUYED_BEYOND_LINK} from '../../../../config/auth_func';

const FormItem = Form.Item;
let cardTable;


export default React.createClass({
  getInitialState() {
    return {
      date:'',
    };
  },
  onLoading(e){if(e)this.setState({date:e.date})},
  Beyond_proportion(total,used){
    let str=parseInt(used/total*100);
    return str;
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
        title: '计量单位/周期',
        render:(text, record, index)=>(<span>{record.billing_unit}/
          {record.billing_cycle==1?"天":record.billing_cycle==2?"月":record.billing_cycle==3?"年":"--"}
        </span>)
      },
      {
        title: '本期已使用/总量',
        render:(text, record, index)=>(<span>{record.billing_total-record.current_used_balance}/{record.billing_total}</span>)
      },
      {
        title: '超限比例',
        render:(text, record, index)=>(<span style={{color:`${record.beyondproportion>1.5?"red":"#f90"}`}}>{parseInt((record.beyondproportion*100))}%</span>)
      },
      {
        title: '距本期结束',
        render:(text, record, index)=>(<span>{setDateTime(date,record.current_exp_date)}</span>)
      },
      {
        title: '可用天数',
        render:(text, record, index)=>(<span style={{color:"green"}}>{setDateTime(date,record.service_exp_date)}</span>)
      },
      {
        title: '操作',
        render:(text, record, index)=>(<Auth to={ACCENTER_BUYED_BEYOND_LINK}><Link to={`/accenter/license/query/detail?id=${record.license_code}&type=${record.unit_type}&unit=${record.unit_id}`}>查看许可</Link></Auth>)
      }
    ];
    return (
      <div>
        <AntForm ref={(form)=>this.form=form} onSubmit={()=>cardTable.reload(this.form.getFieldsValue())}/>
        <Table
          columns={columns}
          url="purchasedService/getDosagelimitList"
          ref={(t)=>cardTable=t}
          onLoad={this.onLoading}
          rowKey={(text, record, index)=>index}
        />
      </div>
    )
  }
})
const AntForm=Form.create()(React.createClass({
  getInitialState: function () {
    return {

    };
  },

  render(){
    const {getFieldDecorator}=this.props.form;
    return (
      <Form onSubmit={(e) => {
                e.preventDefault()
                this.props.form.validateFields((err, fieldsValue) => {
                  if (err)return;
                  this.props.onSubmit();
                });
            }} className="myform">
        <SearchGroupBordered group={[{
            title:"服务名称",
            content:<div>
                <FormItem>
                   {getFieldDecorator('service_use_id',{
                   })(
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
