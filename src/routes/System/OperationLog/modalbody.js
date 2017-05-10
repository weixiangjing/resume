import React from 'react';
import {Modal, Form, Input, Select,Switch,Row,Col,Tree,Radio} from 'antd';

const ModalBody = React.createClass({
  render(props,state) {
    const gList=this.props.mBody
    return (
      <div className="detail_modal">
        <Row>
          <Col span="12">
            <ul>
              <li>日志时间：{gList.create_time}</li>
              <li>日志标签：{gList.log_tag}</li>
              <li>日志描述：{gList.description}</li>
            </ul>
          </Col>
          <Col span="12">
            <ul>
              <li>日志类型：{gList.logType==1?'账号安全':'服务市场管理'}</li>
              <li>计费标识：{gList.log_tag}</li>
            </ul>
          </Col>
        </Row>
        <Row>
          <ul>
            <li><span>数据包：</span><Input type="textarea" value={gList.log_data} rows={8}/></li>
          </ul>
        </Row>
      </div>
    );
  },
});

export default ModalBody;
