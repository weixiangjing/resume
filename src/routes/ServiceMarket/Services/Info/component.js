/**
 *  created by yaojun on 17/3/3
 *
 */
import React from "react";
import {Form, Switch, Row, Col, Popconfirm, Icon,Radio,Input} from "antd";
import {CardTable} from "../../../../common/Table";
import {SearchGroupBordered} from "../../../../common/SearchGroup";
import {handler} from "./reducer";
import {Auth} from "../../../../components/ActionWithAuth";
const  AuthConf =require ("../../../../config/auth_func");


import {Link} from "react-router";
import {stop} from "./reducer";

export default class Component extends React.Component {
    componentWillUpdate(){
        if(handler._reload){
            CardTable.getTableInstance().reload();
            handler._reload=false;
        }else{
            CardTable.getTableInstance().update();
        }
    }
    render() {
        let children=this.props.children;

        return (<div>
            {children}
            <div style={{display:children?"none":"block"}}>

            <AntForm/>
            <div>
                <CardTable
                    url={"service/get"}
                    renderContent={(list, table)=> {
                        return (
                            <Row gutter={24}>
                                {
                                    list.map((item, index)=> {
                                        return <Col key={index} md={12} lg={8}>
                                            <div className="card-item">
                                                <div className="card-body">
                       <span>
                           <img className="card-body-pic" src={decodeURIComponent(item.service_icon)}/>
                       </span>
                                                    <span className="text-group">
                           <strong className="text-ellipsis block">{item.service_name}</strong>
                           <div className=" text-ellipsis block">{item.service_provider}</div>
                           <div>{item.update_time}</div>
                           
                       </span>
                                                </div>
                                                <div className="card-footer">
                                                    <Auth to={AuthConf.SERVICE_INFO_SWITCH}>
                                                    <Popconfirm title={`确认${item.service_status==1 ? '停用' : '启用'}该服务？`}
                                                                onConfirm={()=>stop({
                                                                    service_code  : item.service_code,
                                                                    service_status: item.service_status==1 ? 2 : 1
                                                                }).then(()=>CardTable.getTableInstance().update())}>
                                                       
                        <span className="pull-left">
                            
                            
                           <Switch checked={item.service_status==1} checkedChildren={"开"} unCheckedChildren={"关"}/>
                          
                        </span>
                                                       
                                                    </Popconfirm>
                                                    </Auth>
                                                    <span className="pull-right">
                                                        <Auth to={AuthConf.SERVICE_INFO_MANAGER}>
                            <Link to={`/secenter/service/prod?id=${item.service_code}`}> 产品管理</Link>
                                                        </Auth>
                                                        <Auth to={AuthConf.SERVICE_INFO_UPDATE}>
                            <Link to={`/secenter/service/info/update?id=${item.service_code}`}
                                  className="margin-left-lg margin-right-lg"> 编辑</Link>
                                                        </Auth>
                                                        <Auth to={AuthConf.SERVICE_INFO_DELETE}>
                                            <Popconfirm title="确认删除该服务？"
                                                        onConfirm={()=>stop({
                                                            service_code: item.service_code, is_delete: 2
                                                        }).then(()=>CardTable.getTableInstance().update())}
                                            >
                                                 <a>删除</a>
                                            </Popconfirm>
                                                        </Auth>
                        </span>
                                                </div>
                                            </div>
                                        </Col>
                                    })
                                }
                                
                                
                                <Auth to={AuthConf.SERVICE_INFO_ADD}>
                                <Col md={12} lg={8}>
                                    <div className="card-item center">
                                        <Link to="secenter/service/info/update" className="add-item">
                                            <Icon type="plus"/>
                                        </Link>
                                    </div>
                                </Col>
                                </Auth>
                            </Row>
                        )
                    }}/>


            </div>
            </div>
        </div>);
    }
}
let _form ;
class SearchForm extends React.Component {
    render() {
        let {getFieldDecorator} =this.props.form;
        _form=this.props.form;
        const items=[{
            label: "（全部）", value: ""
        }, {
            label: "基础服务", value: "1"
        }, {
            label: "增值服务", value: "2"
        }, {
            label: "通讯服务", value: "3"
        }]
        return (
            <Form onSubmit={(e)=> {
                e.preventDefault()
                CardTable.getTableInstance().reload(this.props.form.getFieldsValue())
            }}>
                <SearchGroupBordered group={[{
                    title:"服务类型",
                    content:<Form.Item>
                        {
                            getFieldDecorator("service_type",{
                                initialValue:""
                            })(
                                <Radio.Group size="small">
                                    <Radio.Button value="">（全部）</Radio.Button>
                                    <Radio.Button value="1">基础服务</Radio.Button>
                                    <Radio.Button value="2">增值服务</Radio.Button>
                                    <Radio.Button value="3">通讯服务</Radio.Button>
                                </Radio.Group>
                            )
                        }
                    </Form.Item>

                },{
                    title:"服务名称",
                    content:<Form.Item>
                        {
                            getFieldDecorator("keywords")( <Input style={{width:200}} placeholder="输入服务名称关键字"/>)
                        }

                    </Form.Item>
                }]}/>
            </Form>
        )
    }
}
const AntForm=Form.create({
    onFieldsChange:(a,fields)=>{
        if(fields.service_type){
           CardTable.getTableInstance().reload( _form.getFieldsValue());
        }
    }
})(SearchForm);
