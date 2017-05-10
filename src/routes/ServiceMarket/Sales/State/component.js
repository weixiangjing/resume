/**
 *  created by yaojun on 17/3/3
 *
 */
import React from "react";
import {DatePicker, Row, Col} from "antd";
import {amountFormat} from "../../../../util/helper";
import {Table} from "../../../../common/Table";
import {Icon60} from "../../../../components/HomeIcon";
import {statState, dateFormat} from "./reducer";
import moment from "moment";
const RangePicker        =DatePicker.RangePicker;
const discount_type      =['', '服务产品优惠活动', '订购订单优惠活动'];
const discount_date_arr  =["", "未生效", "可用", "已结束"];
const discount_date_class=["", "text-shade", "text-success", "text-shade"];
const discount_status_arr=["", "未发布", "已发布", "已结束"];
const discount_class     =['', 'text-danger', 'text-success', 'text-shade'];
let table;
export default class Component extends React.Component {
    componentWillMount() {
        statState();
    }

    render() {
        let columns=[{
            title: "活动名称", dataIndex: "discount_name"
        }, {
            title: "优惠形式", render: (a, col)=>discount_type[col.discount_type]
        }, {
            title: "发布状态", className: "corner-mark", render: (a, col)=> {
                return <span className={discount_class[col.discount_status] }>
                            <font className="font-lg">.</font>{discount_status_arr[col.discount_status]}
                        </span>
            }
        }, {
            title: "生效状态", className: "corner-mark", render: (e, col)=> {
                let status;
                if(col.discount_status==2) {
                    let date=table ? table.state.date : new Date;
                    if(moment(col.discount_exp_date)<=date) {
                        col.discount_status=status=3
                    } else if(moment(col.discount_cff_date)>date) {
                        status=1;
                    } else {
                        status=2
                    }
                }
                return <span className={discount_date_class[status] }>
                        {
                            status ? <font className="font-lg">.</font> : "--"
                        }
                    {discount_date_arr[status]}
                        </span>
            }
        }, {
            title: "营销总预算（元）", width: 120, render: (a, col)=>amountFormat(col.discount_budget_amount/100)
        }, {
            title: "活动消耗金额（元）", width: 125, render: (a, col)=>amountFormat(col.discount_budget_used_amount/100)
        }, {
            title: "消耗率（%）", width: 60, render: (a, col)=> {
                return Number((col.discount_budget_used_amount/col.discount_budget_amount*100).toFixed(2))+'%'
            }
        }, {
            title: "活动时间", width: 150, render: (a, col)=>col.discount_cff_date+" ~ "+col.discount_exp_date
        }]
        let store  =this.storeState;
        let stat   =store.get("stat");
        let ratio  =Number(((stat.get("discount_budget_used_amount")/stat.get("discount_budget_amount")*100 )).toFixed(2))||0
        return (<div className="sales-state">
            <div className="margin-bottom-lg">
                <span className="main-title">
                    活动统计
                </span>
                <span className="pull-right">
                    活动生效时间：<RangePicker onChange={(e)=> {
                    let date={
                        valid_time_begin: e[0].format(dateFormat), valid_time_end: e[1].format(dateFormat)
                    }
                    table.update(date)
                    statState(date)
                }}/>
                </span>
            </div>

            <Row className={"text-icon-item"}>
                <Col lg={5} md={10} sm={10}>
                    <div className="data-item ">
                        <Icon60 type={"stat"} className="data-icon"/>
                        <div className="data-text">
                            <p className="d-title text">进行中(个)</p>
                            <p className="d-number">{stat.get("ongoing")}</p>
                        </div>
                    </div>
                </Col>
                <Col lg={4} md={8} sm={8}>
                    <div className="data-item">

                        <div className="data-text">
                            <p className="d-title">已结束(个)</p>
                            <p className="d-number">{stat.get("end")}</p>
                        </div>
                    </div>
                </Col>
                <Col lg={4} md={6} sm={6}>
                    <div className="data-item">

                        <div className="data-text">
                            <p className="d-title">即将开始(个)</p>
                            <p className="d-number">{stat.get("willBegin")}</p>
                        </div>
                    </div>
                </Col>

            </Row>
            <Row className={"text-icon-item"}>
                <Col lg={12} md={24}>
                    <Col span={10}>
                        <div className="data-item ">
                            <Icon60 type={"amount"} className="data-icon"/>
                            <div className="data-text">
                                <p className="d-title text">
                                    营销总预算（元）</p>
                                <p className="d-number">{amountFormat(stat.get("discount_budget_amount")/100)}</p>
                            </div>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div className="data-item">

                            <div className="data-text">
                                <p className="d-title">已消耗金额（元）</p>
                                <p className="d-number">{amountFormat(stat.get("discount_budget_used_amount")/100)}</p>
                            </div>
                        </div>
                    </Col>
                    <Col span={6}>
                        <div className="data-item">

                            <div className="data-text">
                                <p className="d-title">消耗率（%）</p>
                                <p className="d-number">{ratio+'%'}</p>
                            </div>
                        </div>
                    </Col>
                </Col>
                <Col lg={12} md={24}>
                    <Col span={10}>
                        <div className="data-item ">
                            <Icon60 type={"amount"} className="data-icon"/>
                            <div className="data-text">
                                <p className="d-title text">参加活动订单额（元）</p>
                                <p className="d-number">{amountFormat(stat.get("orderAmount")/100)}</p>
                            </div>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div className="data-item">

                            <div className="data-text">
                                <p className="d-title">参加活动订单数（笔）</p>
                                <p className="d-number">{stat.get("orderCount")}</p>
                            </div>
                        </div>
                    </Col>
                    <Col span={6}>
                        <div className="data-item">

                            <div className="data-text">
                                <p className="d-title">参加活动商户（个）</p>
                                <p className="d-number">{stat.get("merchantCount")}</p>
                            </div>
                        </div>
                    </Col>
                </Col>
            </Row>


            <div className="margin-v-lg">
                <span className="main-title">
                    活动列表
                </span>
            </div>

            <Table ref={(e)=>table=e} columns={columns} url={"serviceDiscount/get"} rowKey={"discountId"}/>
        </div>);
    }
}

    
