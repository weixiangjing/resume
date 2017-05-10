/**
 *  created by yaojun on 17/3/3
 *
 */
import React from "react";
import {Link, hashHistory} from "react-router";
import {Form, Input, Button, Row, Col, Switch, Popconfirm,Icon} from "antd";
import {CardTable} from "../../../../common/Table";
import {ServiceSelect} from "../../../../components/Select/ServiceType";
import {handler, toggleStatus} from "./reducer";
import {Auth} from "../../../../components/ActionWithAuth";
const AuthConf = require("../../../../config/auth_func");
import "./index.scss";
const FormItem = Form.Item;

class SearchForm extends React.Component {

    render() {
        let {getFieldDecorator, getFieldsValue} = this.props.form;
        return (
            <Form className="over-hide" inline onSubmit={(e) => {
                e.preventDefault();
                CardTable.getTableInstance().reload(getFieldsValue());
            }}>
            
                    
                <FormItem label={"套餐名称"}>
                    {
                        getFieldDecorator("keywords")(
                            <Input/>
                        )
                    }
                </FormItem>
                <FormItem label={"套餐包括服务"}>
                    {
                        getFieldDecorator("service_code")(
                            <ServiceSelect/>
                        )
                    }
                </FormItem>
                    
                  
                        <Button onClick={() => {
                            this.props.form.resetFields()
                        }} className={"margin-left-lg"}>清除</Button>
                        <Button className={"margin-left"} type={"primary"} htmlType={"submit"}>搜索</Button>
                 
              
               
               
            </Form>
        
        )
    }
}
const BindSearchForm = Form.create()(SearchForm);
export default class Component extends React.Component {
    componentWillUpdate(){
        if(handler._reload){
            CardTable.getTableInstance().reload()
            handler._reload=false;
        }{
            CardTable.getTableInstance().update();
        }

    }
    render() {
        let children = this.props.children;

        return (
            <div className="margin-top-lg sale-package">
                {children}
                <div style={{display:children?"none":"block"}}>
                <BindSearchForm/>
                <CardTable className="margin-top"
                           url="serviceCombo/get"
                           pageSize={5}
                           renderContent={(list, table) => (
                               <Row gutter={24}>
                                   {
                                       list.map(item => (
                                           <Col key={item.combo_code} md={12} lg={8} sm={12}>
                                               <div className="card-item">
                                                   <div className="card-body">
                                                       <div className="card-title">
                                                <span title={item.combo_name} className="main-title text-ellipsis">
                                                  {validateDateRange(item,table.state.date)}  {item.combo_name}
                                                </span>
                                                           <div className="text-danger pull-right large">
                                                               ￥{item.combo_discount_price / 100}
                                                           </div>
                                                       </div>
                                                       <ul className="label-li">
                                                           {
                                                               item.serviceProduct && item.serviceProduct.filter(item=>item.product_quantity!=0).map(item => (
                                                                   <li key={item.product_code}>
                                                                       <Row>
                                                                           <Col
                                                                               title={`【${item.service_name}】${item.product_name}`}
                                                                               className="pack-item-title" span={20}>
                                                                               【{item.service_name}】{item.product_name}
                                                                           </Col>
                                                                           <Col className="pack-item-num" span={4}>
                                                                               x{item.product_quantity}
                                                                           </Col>
                                                            
                                                                       </Row>
                                                                   </li>
                                                               ))
                                                           }
                                            
                                            
                                                       </ul>
                                                   </div>
                                                   <div className="card-footer">
                                                       <Auth to={AuthConf.SERVICE_SALE_PACK_SWITCH}>
                                                       <Popconfirm title={`确认要${item.combo_status==1?'停用':'启用'}该套餐吗？`}
                                                                   onConfirm={() => toggleStatus(item).then(()=>CardTable.getTableInstance().update())}>
                                                           
                                            <span className="pull-left">
                                                <Switch checked={item.combo_status == 1} checkedChildren={"开"}
                                                        unCheckedChildren={"关"}/>
                                            </span>
                                                       </Popconfirm>
                                                       </Auth>
                                                       <span className="pull-right">
                                                           <Auth to={AuthConf.SERVICE_SALE_PACK_UPDATE}>
                                                <Link to={`/secenter/sales/package/update?id=${item.combo_code}`}
                                                      className="margin-left-lg margin-right-lg"> 编辑</Link>
                                                           </Auth>
                                            </span>
                                        
                                                   </div>
                                               </div>
                                           </Col>
                                       ))
                                   }
                        
                                   <Auth to={AuthConf.SERVICE_SALE_PACK_ADD}>
                                   <Col  md={12} lg={8} sm={12}>
                                       <div onClick={() => {
                                           hashHistory.push("/secenter/sales/package/update")
                                       }}  className="card-item  center">
                                           <div   className="add-item">
                                               <Icon type="plus"/>
                                           </div>
                                       </div>
                                   </Col>
                                   </Auth>
                               </Row>
                           )}/>
                </div>
            </div>
        );
    }
}

function validateDateRange(item,now){
    if(now.diff(item.combo_exp_date)>0){
        return <label className="label label-default">已失效</label>
    }else if(now.diff(item.combo_eff_date)<0){
        return <label className="label label-default">未生效</label>
    }
    return null;
}



