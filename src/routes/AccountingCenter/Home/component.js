import React from "react";
import {Card, Row, Col, Icon, Button, Table,Tag,Radio,Menu, Dropdown, DatePicker,notification,Spin} from "antd";
import {Icon60} from "../../../components/HomeIcon";
import "./home.scss";
import {Chart} from "g2";
import createG2 from "g2-react";
import moment from "moment";
import ajax from "axios";
import {in_array,unique,toThousands} from '../../../util/helper';

const { MonthPicker, RangePicker } = DatePicker;
const Reducer = require('./reducer');

const CheckableTag = Tag.CheckableTag;
const RadioButton = Radio.Button;
const RadioGroup  = Radio.Group;
let dateStr="";
const G2LineChart = createG2((chart) => {
  chart.col("trade_amount",{
    alias:"交易金额（元）",

  }).col("week_date",{
    alias:dateStr,
    range:[0,1]
  })
  chart.tooltip({crosshairs: true});
  chart.area().position('week_date*trade_amount').color("#D5F0FD").shape('smooth').tooltip(true);
  chart.line().position('week_date*trade_amount').color("#2DB7F5")
    .size(2).shape('smooth');
  chart.render();
  chart.on('tooltipchange',function(ev){
    var item = ev.items[0]; // 获取tooltip要显示的内容
    item.value = toThousands('元',item.point._origin.trade_amount*100);
    //item.title = item.point._origin.trade_date;
  });
});


export default class HomeIndex extends React.Component {
  state = {
    fw_checked: true,
    dg_checked: false,
    list:[],
    purchase_list:[],
    user_purchase_list:[],
    str:'',
    loading:true,
    defaultValue:'',
    width:900
  }
  componentWillMount(){
   const date= Date.now();
    const params={
      time_begin:moment(date).format("YYYY-MM-DD 00:00:00"),
      time_end:moment(date).format("YYYY-MM-DD HH:mm:ss"),
      pageSize:9999
    }
    const Fwparams={
      book_trade_time_begin:moment(date).format("YYYY-MM-DD 00:00:00"),
      book_trade_time_end:moment(date).format("YYYY-MM-DD HH:mm:ss"),
      pageSize:9999
    }
    Reducer.getFwStatistics(Fwparams);
    Reducer.getFwStatistics({pageSize:9999});
    Reducer.getStatistics({pageSize:9999});
    Reducer.getStatistics(params);
    Reducer.getPurchaseServiceRank().then((res)=>{
      res.data.map((item,index)=>{item.key=index;})
      this.setState({list:res.data,purchase_list:res.data,loading:false})
      if(document.getElementById('container')){
        let width=document.getElementById('container').clientWidth-48;
        this.setState({width})
      }
    });
    this.getTradeTendency(7);
  }
  fw_onclick() {
    const fw_checked = this.state.fw_checked ? false : true;
    const {purchase_list}=this.state;
    if(purchase_list.length){
      this.setState({fw_checked,dg_checked:false,list:purchase_list})
    }else {
      Reducer.getPurchaseServiceRank().then((res)=>{
        res.data.map((item,index)=>{item.key=index;})
        this.setState({fw_checked,dg_checked:false,list:res.data});
      });
    }
  }
  dg_onclick() {
    const dg_checked = this.state.dg_checked ? false : true;
    const {user_purchase_list}=this.state;
    if(user_purchase_list.length){
      this.setState({dg_checked,fw_checked:false,list:user_purchase_list});
    }else {
      Reducer.getUserPurchaseServiceRank().then((res)=>{
        res.data.map((item,index)=>{item.key=index;})
        this.setState({dg_checked,fw_checked:false,list:res.data,user_purchase_list:res.data});
      })
    }
  }
  getTradeTendency(day, value) {
    const {defaultValue}=this.state;
    if (date) {
      this.day = day;
    }
    let date = new Date;
    date.setDate(date.getDate() - (day || this.day || defaultValue));
    let send = {
      date_begin: moment(date).format("YYYY-MM-DD"),
      date_end: moment.ago(1).format("YYYY-MM-DD")
    }
    if (value&&value.length) {
      send['date_begin']  = value[0].format("YYYY-MM-DD");
      send['date_end']  = value[1].format("YYYY-MM-DD");

      if(value[1].valueOf()-value[0].valueOf()>30*24*60*60*1000){
        notification.error({
          message: '日期间隔大于30天',
        })
        return false;
      }
      const str=value[0].format("YYYY-MM-DD")+"至"+value[1].format("YYYY-MM-DD");
      this.setState({str});
    }else {this.setState({str:'',defaultValue:day})}
    Reducer.gettendency(send)
  }
  disabledDate(current){return current&&current.valueOf()>Date.now();}
  render(props,state) {
    const columns = [
      {
        title: '排名',
        width:40,
        render:(text, record, index)=>(<span className={`table_span ${"span_"+(index+1)}`}>{index+1}</span>)
      },
      {
        title: '名称',
        width:200,
        render:(text, record, index)=>(<span>{record.service_name||record.account_name}</span>)
      },
      {
        title: '总金额（元）',
        className:'table_right',
        render:(text, record, index)=>(<span>{record.tradeSum?toThousands('元',record.tradeSum):'0'}</span>)
      },
    ];
    const {list,fw_checked,dg_checked,str,loading,width}=this.state;
    const date_list=state.get('tendency').toJS();
    const datebill=state.get('dateBill').toJS();
    const bill=state.get('Bill').toJS();
    const dateFwbill_list=state.get('dateFwBill').toJS();
    const Fwbill_list=state.get('FwBill').toJS();
    const dateArr=[];
    date_list.map((item)=>{
      dateArr.push(moment(item.trade_date).format("YYYY"))
    })
    if(unique(dateArr).length==2){dateStr="交易日期（"+dateArr[0]+"-"+dateArr[1]+"）"}else
    {dateStr="交易日期（"+dateArr[0]+"）"};
    return (
      <Spin spinning={loading}>
        {!loading?
          <div className="cashier-home" id="container">
            <Row gutter={15}>
              <Col span="15">
                <Card title="今日成交">
                  <Row className={"text-icon-item"}>
                    <Col sm={12}>
                      <div className="data-item ">

                          <i className="fa fa-file-text data-icon"/>

                        <div className="data-text">
                          <p className="d-title text">服务订单(笔)</p>
                          <p className="d-number">{datebill.count}</p>
                        </div>
                        <div className="data-text">
                          <p className="d-title text">订购总额(万元)</p>
                          <p className="d-number">
                            {datebill.sum?toThousands('万元',datebill.sum):'0'}
                          </p>
                        </div>
                      </div>
                    </Col>
                    <Col sm={12}>
                      <div className="data-item Icon60">

                          <i className="fa fa-bank data-icon"/>

                        <div className="data-text">
                          <p className="d-title text">账户充值数(笔)</p>
                          <p className="d-number">{dateFwbill_list.count}</p>
                        </div>
                        <div className="data-text">
                          <p className="d-title text">账户充值总额(万元)</p>
                          <p className="d-number">{dateFwbill_list.sum?toThousands('万元',dateFwbill_list.sum):"0"}</p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>
                <Card title="累计成交">
                  <Row className={"text-icon-item"}>
                    <Col sm={12}>
                      <div className="data-item Icon60">

                          <i className="fa fa-file-text data-icon"/>

                        <div className="data-text">
                          <p className="d-title text">服务订单(笔)</p>
                          <p className="d-number">{bill.count}</p>
                        </div>
                        <div className="data-text">
                          <p className="d-title text">订购总额(万元)</p>
                          <p className="d-number">{bill.sum?toThousands('万元',bill.sum):'0'}</p>
                        </div>
                      </div>
                    </Col>
                    <Col sm={12}>
                      <div className="data-item Icon60">

                          <i className="fa fa-bank data-icon"/>

                        <div className="data-text">
                          <p className="d-title text">账户充值数(笔)</p>
                          <p className="d-number">{Fwbill_list.count}</p>
                        </div>
                        <div className="data-text">
                          <p className="d-title text">账户充值总额(万元)</p>
                          <p className="d-number">{Fwbill_list.sum?toThousands('万元',Fwbill_list.sum):"0"}</p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col span="9">
                <Card title="成交量排行（截止昨日）" extra={<div>
          <CheckableTag onChange={this.fw_onclick.bind(this)} checked={fw_checked}>服务</CheckableTag>
          <CheckableTag onChange={this.dg_onclick.bind(this)} checked={dg_checked}>订购者</CheckableTag>
          </div>}>
                  <Table dataSource={list} columns={columns} size="small"
                         rowKey={'key'} pagination={false}
                  />
                </Card>
              </Col>
            </Row>
            {state.get('showG2')?<Row>
              <Col className="g2_div">
                <div className="main-title">成交趋势图（截止昨日）</div>
                <div className="text ant-none-radio">
                  <RadioGroup onChange={({target}) => {
                                this.getTradeTendency(target.value)
                            }} defaultValue={str?"":"7"}>
                    <Radio key="1" value="7">近7日</Radio>
                    <Radio key="2" value="15">15日</Radio>
                    <Radio key="3" value="30">30日</Radio>
                  </RadioGroup>
                  <RangePicker onChange={(e)=>this.getTradeTendency(null,e)}
                               disabledDate={this.disabledDate}
                               //placeholder={["选择时间段"]}
                  />
                  <label>选择时间段：</label>
                </div>
                <G2LineChart
                  width={width}
                  height={400}
                  data={date_list}
                />

              </Col>
            </Row>:""}
          </div>
        :''}
      </Spin>

    )
  }
}
