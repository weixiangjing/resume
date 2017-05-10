/**
 *  created by yaojun on 16/12/13
 *
 */
import React from "react";
import {Card, Row, Col} from "antd";
import {Icon60} from "../../../components/HomeIcon";
import classNames from "classnames";
import moment from "moment";
import axios from "axios";
import "./home.scss";
export default class HomeIndex extends React.Component {
    state={
        serviceCount: "", productCount: "", packageCount: "", saleCount: "", ranks: [], products: [],
    }

    componentWillMount() {
        let beginMonth=moment(new Date).startOf('month').format("YYYY-MM-DD")+" 00:00:00";
        let now       =moment(new Date).format("YYYY-MM-DD")+" 23:59:59";

        axios.post("service/getStatistics").then(res=>this.setState({serviceCount: res.data[0].count}));
        axios.post("serviceProduct/getStatistics", {status: 1}).then(res=>this.setState({productCount: res.data[0].count}))
        axios.post("serviceCombo/getStatistics").then(res=>this.setState({packageCount: res.data[0].count}))
        axios.post("serviceDiscount/getStatistics", {
            valid_time_begin: beginMonth,
            valid_time_end  : now
        }).then(res=>this.setState({saleCount: res.data[0].count}))
        axios.post("serviceProduct/get", {pageSize: 10}).then(res=>this.setState({products: res.data}))
        axios.post("service/getUserWorkRank").then(res=>this.setState({ranks: res.data}))
    }

    render() {
        let icon                                                                   ={background: "url(img/icon_60.png)"}
        let {ranks, serviceCount, productCount, packageCount, saleCount, products} =this.state;
        return (<div className="cashier-home">



            <Card title="已发布">
                <Row className="text-icon-item">
                    <Col sm={12} md={6}>
                        <div className="data-item">
                            <i  className="fa fa-folder-o data-icon" />
                            <div className="data-text">
                                <p className="d-title text">服务（个）</p>
                                <p className="d-number">{serviceCount}</p>
                            </div>
                        </div>
                    </Col>
                    <Col sm={12} md={6}>
                        <div className="data-item">
                            <i style={{background:"#808bc6"}} className="fa fa-file-o data-icon" />
                            <div className="data-text">
                                <p className="d-title">服务产品（个）</p>
                                <p className="d-number">{productCount}</p>
                            </div>
                        </div>
                    </Col>
                    <Col sm={12} md={6}>
                        <div className="data-item">
                            <i style={{background:"#7dc856"}}  className="fa fa-shopping-bag data-icon" />
                            <div className="data-text">
                                <p className="d-title">服务套餐（个）</p>
                                <p className="d-number">{packageCount}</p>
                            </div>
                        </div>
                    </Col>
                    <Col sm={12} md={6}>
                        <div className="data-item">
                            <i style={{background:"#868686"}}  className="fa fa-star-o data-icon" />
                            <div className="data-text">
                                <p className="d-title">优惠活动（个）</p>
                                <p className="d-number">{saleCount}</p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Card>
            <Row gutter={15}>
                <Col sm={24} md={16}>
                    <Card title="最近更新产品">
                        <ul>
                            {
                                products.sort((a, b)=>new Date(a.update_time)<new Date(b.update_time)).map((item, index)=> {
                                    let a        =Math.round((Date.now()-new Date(item.update_time))/86400000);
                                    let className=(a<8) ? "bg-warning2" : "bg-default";
                                    return (
                                        <li className="margin-bottom-lg" key={index}>
                                            <Row>
                                                <Col span={1}><i
                                                    className={classNames([`radius-small`, className])}> </i></Col>
                                                <Col span={15}>
                                                    <span className="circle"> </span>
                                                    【{item.service_name}】 {item.product_name}
                                                </Col>

                                                <Col className={"text-right"} span={8}>
                                                    {moment(item.update_time).fromNow()}
                                                </Col>
                                            </Row>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </Card>
                </Col>
                <Col sm={24} md={8}>
                    <Card title="最近活跃员工">
                        <ul>
                            {
                                ranks.map((item, index)=>(
                                    <li key={index} className="margin-bottom-lg">
                                        <Row>
                                            <Col span={2}>{index+1}</Col>
                                            <Col span={18}>{item.userRealName}</Col>
                                            <Col className={"text-right text-success"} span={4}>{item.workCount}次</Col>
                                        </Row>
                                    </li>
                                ))
                            }
                        </ul>
                    </Card>
                </Col>
            </Row>
        </div>)
    }
}
