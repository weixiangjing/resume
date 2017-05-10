/**
 *  created by yaojun on 2017/3/8
 *
 */
import React from "react";
import {getLicense} from "../../../../../model/Lisence";
import {Row, Col,Icon} from "antd";
import {license_state,billing_mode} from "../conf"
export default class Component extends React.Component {
    state = {echo: {}}
    
    componentWillMount() {
        let query = this.props.query;
        if (query && query.id && query.type && query.unit)
            getLicense({license_code:query.id,unit_type:query.type,unit_id:query.unit}).then((res) => this.setState({
                echo:res.data[0]}))
    }
    render() {
        let echo = this.state.echo;
        
        return (
            <div className="license-query-detail">
                <Row>
                    <Col span={12}>
                        <div className={"main-title margin-v"}>
                            许可编号：{echo.license_code} <label
                            className="bg-warning padding margin-lef-lg">{license_state[echo.license_status]}</label>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div className={"main-title margin-v"}>
                            许可服务产品：{"百望电子发票/基础月包（300次）"}
                        </div>
                    </Col>
                </Row>
                <Row className="text-icon-item bordered">
                    <Col lg={8} md={12}>
                        <div className="data-item">
                           <i className="fa fa-calendar data-icon"/>
                            <div className="data-text">
                                <p className="main-title">{echo.license_eff_date}</p>
                                <p className="main-title">至{echo.license_exp_date}</p>
                            </div>
                        </div>
                    </Col>
                    <Col lg={6} md={12}>
                        <div className="data-item">
                            <i className="fa fa-home data-icon"/>
                            <div className="data-text">
                                <p className="des-text ">计费单元标识</p>
                                <p className="main-title d-number">{echo.unit_id}</p>
                            </div>
                        </div>
                    </Col>
                    <Col lg={4} md={8}>
                        <div className="data-item">
                            <div className="data-text">
                                <p className="des-text">计费模式</p>
                                <p className="main-title d-number">{billing_mode[echo.billing_mode]}</p>
                            </div>
                        </div>
                    </Col>
                    <Col lg={3} md={8}>
                        <div className="data-item">
                            <div className="data-text">
                                <p className="des-text">剩余用量{echo.billing_mode==1?`(${echo.billing_unit})`:''}</p>
                                <p className="main-title d-number">{echo.license_current_used_balance}</p>
                            </div>
                        </div>
                    </Col>
                    <Col lg={3} md={8}>
                        <div className="data-item">
                            <div className="data-text">
                                <p className="des-text">计量总量{echo.billing_mode==1?`(${echo.billing_unit})`:''}</p>
                                <p className="main-title d-number">{echo.billing_total}</p>
                            </div>
                        </div>
                    </Col>
                </Row>
                <div className="margin-v-lg title-label">基本属性</div>
                <Row className={"license-props"}>
                    <Col span={12}>
                        <label>服务账单号</label>：{echo.outer_no}
                    </Col>
                    <Col span={12}>
                        <label>订购记录编号</label>：{echo.order_id}
                    </Col>
                    <Col span={12}>
                        <label>服务使用方</label>：{echo.service_use_name}
                    </Col>
                    <Col span={12}>
                        <label>服务订购方</label>：{echo.service_use_name}
                    </Col>
                    <Col span={12}>
                        <label>许可创建时间</label>：{echo.create_time}
                    </Col>
                    <Col span={12}>
                        <label>最近更新时间</label>：{echo.update_time}
                    </Col>
                
                </Row>
            </div>
        )
    }
}