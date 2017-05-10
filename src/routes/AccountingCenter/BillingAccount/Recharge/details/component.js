import React from 'react';
import axios from 'axios';
import { Row, Col, Card, Spin, Button,DatePicker, notification ,Icon} from 'antd';
import {handler,getList} from './reducer';
import {in_array,unique,toThousands} from '../../../../../util/helper';
import '../../AccountQuery/style.scss';
export default React.createClass({
  componentWillMount(){
    getList(this.props.location.query.order_no);
  },
  render(props,state){
    const objItem=state.get('list').toJS()[0];
    return(
      <Spin spinning={!state.get('loading')}>
        {state.get('loading')?(
          <div className="details_querya">
            <Card title={<span><b className="title_span">订单号：{this.props.location.query.order_no}</b><span className={`${objItem.order_status==1?"color_1":objItem.order_status==2?"color_2":"color_3"}`}>{objItem.order_status==1?"待付款":objItem.order_status==2?"已付款":"已关闭"}</span></span>} className="card_1">
              <Row>
                <Col sm={16}>
                  <div className="data-item icon32">
                      <div className="data-icon Icon32_blue">
                        <i className="fa fa-database"></i>
                      </div>
                      <div className="data-text" style={{width:150}}>
                        <p className="d-title text">订单金额（元）</p>
                        <p className="d-number d-price">{objItem.charge_amount?toThousands("元",objItem.charge_amount):"0"}</p>
                      </div>
                      <div className="data-icon Icon32_blue">
                        <i className="fa fa-database"></i>
                      </div>
                      <div className="data-text" style={{width:150}}>
                        <p className="d-title text">实付金额（元）</p>
                        <p className="d-number d-price">{objItem.order_real_amount?toThousands("元",objItem.order_real_amount):"0"}</p>
                      </div>
                  </div>
                </Col>
              </Row>
            </Card>
            <Card title={<b>基本属性</b>} style={{marginTop:15}}>
              <Row>
                <Col span={12}>
                  <div className="data-item">
                    <ul>
                      <li><span>充值账户号：</span><b>{objItem.account_no}</b></li>
                      <li><span>创建时间：</span>{objItem.create_time}</li>
                      <li><span>来源系统：</span>{objItem.charge_ordery_sys_src==1?"商户平台":objItem.charge_ordery_sys_src==2?"服务商平台":"其他"}</li>
                    </ul>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="data-item">
                    <ul>
                      <li><span>充值账户名称：</span>{objItem.account_name}</li>
                      <li><span>完成支付时间：</span>{objItem.charge_pay_datetime||'--'}</li>
                      <li><span>支付平台流水号：</span>{objItem.pay_sys_no||'--'}</li>
                    </ul>
                  </div>
                </Col>
              </Row>
            </Card>
          </div>
        ):""}
      </Spin>
    )
  }

})
