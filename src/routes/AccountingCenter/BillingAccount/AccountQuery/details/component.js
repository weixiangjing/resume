import React from 'react';
import axios from 'axios';
import { Form,Table, Row, Col, Card, Icon, Button,DatePicker, Popconfirm ,Spin} from 'antd';
import '../style.scss';
import {Icon60,Icon32} from "../../../../../components/HomeIcon";
import {handler,getFwStatistics,getDate,closeAccount,openAccount,getFwList,getFwS,getList} from './reducer';
import moment from 'moment';
import {in_array,showTaskModal,toThousands} from '../../../../../util/helper';
import {ACCENTER_BILLING_QUERYA_DETAILS_DOWNLOAD} from '../../../../../config/auth_func';
import {Auth} from '../../../../../components/ActionWithAuth';

const { MonthPicker, RangePicker } = DatePicker;

export default React.createClass({

  getInitialState() {
    return {
      id:this.props.location.query.id,
      paramsFw:""
    };
  },
  componentWillMount(){
    const params={account_no:this.state.id};
    const paramsFw={
      account_no:this.state.id,
      book_trade_time_begin:moment(Date.now()).format('YYYY-MM-01 00:00:00'),
      book_trade_time_end:moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
    };
    getFwList(paramsFw);
    getFwS(paramsFw);
    getList(params);
    this.setState({paramsFw})
  },
  onDateChange(date, dateString){
    const start=date.format('YYYY-MM-01 00:00:00');
    const end=getDate(dateString);
    const params={
      account_no:this.state.id,
      book_trade_time_begin:start,
      book_trade_time_end:end
    }
    getFwList(params);
    getFwS(params);
    this.setState({paramsFw:params})
  },
  disabledDate(current){return current&&current.valueOf()>Date.now();},
  loopD(data,type){
    if(!data||data.length==0){return '0'};
    for(let i=0;i<data.length;i++){
      if(data[i].book_type==type){
        let sum=toThousands('元',data[i].sum);
        if(sum)return sum;
        return "0";
      };
    }
    return '0';
  },
  render(porps,state){
    const columns=[
      {
        title: '流水号',
        dataIndex: 'book_no',
      },
      {
        title: '发生时间',
        dataIndex: 'book_trade_time',
      },
      {
        title: '发生金额（元）',
        render:(text, record, index)=>(<span className={record.book_occur_amount>0?"d-amount":"d-price"}>{record.book_occur_amount?toThousands("元",record.book_occur_amount):"0"}</span>)
      },
      {
        title: '本期余额（元）',
        render:(text, record, index)=>(<span>{record.book_account_current_balance?toThousands("元",record.book_account_current_balance):"0"}</span>)
      },
      {
        title: '操作类型',
        dataIndex: 'book_subject_name',
      },
      {
        title: '外部订单号',
        dataIndex: 'outer_sys_no',
      },
    ];
   const data=state.get('fwq_list').toJS();
   const accountData=state.get('account_query_list').toJS()[0];
    const fwq_statistics=state.get('fwq_statistics').toJS();
    return(
      <Spin spinning={state.get('loading')}>
        {!state.get('loading')?
          <div className="details_querya">
            <Card title="账户属性" extra={accountData.status==1?
            <Popconfirm onConfirm={()=>closeAccount(accountData.id,this.state.id)}
            title={<span>您是否要冻结 <span style={{color:'red'}}>{accountData.account_name}</span> 账户</span>}>
              <Button type="danger">冻结账户</Button>
            </Popconfirm>:
            <Popconfirm onConfirm={()=>openAccount(accountData.id,this.state.id)}
            title={<span>您是否要解冻 <span style={{color:'green'}}>{accountData.account_name}</span> 账户</span>}>
              <Button type="primary">解冻账户</Button>
            </Popconfirm>
            }>
              <Row>
                <Col span="12">
                  <ul>
                    <li><span>账户号：</span>{accountData.account_no}</li>
                    <li><span>客户类型：</span>{accountData.bind_customer_type==1?"商户":"渠道商"}</li>
                    <li><span>开户时间：</span>{accountData.create_time}</li>
                    <li><span>账户状态：</span>{accountData.status==1?"可用":"停用"}</li>
                    <li><span>账户余额：</span><b style={{fontSize:14}}>{accountData.account_balance?toThousands('元',accountData.account_balance):"0"}</b>元</li>
                  </ul>
                </Col>
                <Col span="12">
                  <ul>
                    <li><span>账户名称：</span>{accountData.account_name}</li>
                    <li><span>客户号：</span>{accountData.bind_customer_no}</li>
                    <li><span>开户系统：</span>{accountData.account_no}</li>
                    <li><span>账户描述：</span>{accountData.account_desc}</li>
                  </ul>
                </Col>
              </Row>
              <Row>
                <p className="line_p"></p>
                <Col span="7">
                  <div className="data-item">
                    <div className="data-icon">
                      <i className="fa fa-calendar"/>
                    </div>
                    <div className="data-text">
                      {/*<i className="fa fa-chevron-circle-down text-shade font-md"/>*/}
                      <MonthPicker placeholder=""
                                   defaultValue={moment(new Date(),'YYYY-MM')}
                                   allowClear={false}
                                   onChange={this.onDateChange}
                                   disabledDate={this.disabledDate}
                      />
                    </div>
                  </div>

                </Col>
                <Col span="1"><span className="ant-divider"/></Col>
                <Col span="7">
                  <div className="data-item icon32">
                      <div className="data-icon Icon32_green">
                        <i className="fa fa-download"></i>
                      </div>
                      <div className="data-text">
                        <p className="d-title text">入账金额（元）</p>
                        <p className="d-number d-amount">{this.loopD(fwq_statistics,2)}</p>
                      </div>
                  </div>
                </Col>
                <Col span="1"><span className="ant-divider"/></Col>
                <Col span="7">
                  <div className="data-item icon32">
                    <div className="data-icon Icon32_orange" style={{marginLeft:10}}>
                      <i className="fa fa-external-link"></i>
                    </div>
                    <div className="data-text">
                      <p className="d-title text">支出金额（元）</p>
                      <p className="d-number d-price">{this.loopD(fwq_statistics,1)}</p>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
            <Table
              columns={columns}
              dataSource={data}
              title={()=>(<div><span>账户流水</span>
              <Auth to={ACCENTER_BILLING_QUERYA_DETAILS_DOWNLOAD}><Button style={{float:"right"}}
                onClick={()=>axios.post('serviceAccount/getFw',{...this.state.paramsFw,pageSize:9999,"export":"1"}).then(()=>showTaskModal())}
              >导出数据</Button></Auth></div>)}
              pagination={false}
              rowKey={'book_no'}
            />
          </div>
          :''
        }
      </Spin>
    )
  }

})
