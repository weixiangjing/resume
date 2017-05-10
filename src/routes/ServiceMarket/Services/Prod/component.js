/**
 *  created by yaojun on 17/3/3
 *
 */
import React from "react";
import {Form, Input, Button, Modal, Row, Col,Icon, Radio, Select, Popconfirm} from "antd";
import {Table} from "../../../../common/Table";
import {ServiceSelect} from "../../../../components/Select/ServiceType";
import {Auth} from "../../../../components/ActionWithAuth";

import {showModal, handler, handleProd, postProd, toggleStatus} from "./reducer";
import {downloadWithForm,showTaskModal} from "../../../../util/helper";
const AuthConf= require("../../../../config/auth_func");
import axios from 'axios';
const FormItem     =Form.Item;
const billing_cycle=['无', '按天', '按月', '按年'];
const billing_mode =['', '按用量', '按周期', '一次性'];
const billing_class=['', 'text-success', 'text-danger'];

export default class Component extends React.Component {
    render() {
        const columns=[{
            title: "产品编码", dataIndex: "product_code"
        }, {
            title: "服务产品", render: (a, col)=><span>【{col.service_name}】{col.product_name}</span>
        }, {
            title: "分组标识", dataIndex: "product_group_name"
        }, {
            title: "状态", className: "corner-mark", render: (a, col)=> {
                return <span className={billing_class[col.product_status]}><i
                    className="font-lg">.</i>{col.product_status==1 ? "可用" : "停用"}</span>
            }
        }, {
            title: "计费周期", render: (a, col)=>billing_cycle[col.billing_cycle]
        }, {
            title: "计费模式", render: (a, col)=>billing_mode[col.billing_mode]
        }, {
            title: "计量总量", render: (a, col)=>col.billing_total ? col.billing_total : "--"
        }, {
            title: "计费单元", render: (a, col)=>col.billing_unit ? col.billing_unit : "--"
        }, {
            title: "操作", render: (a, col)=> {
                let status=col.product_status==1 ? "停用" : "启用";
                return (<span>
                    <Auth to={AuthConf.SERVICE_PROD_UPDATE}>
                      <a onClick={()=>handleProd(this.form, Object.assign({},col))} className="margin-right-lg">编辑</a>
                    </Auth>
                    <Auth to={AuthConf.SERVICE_PROD_SWITCH}>
                        <Popconfirm onConfirm={()=> {
                            toggleStatus(col).then(()=>Table.getTableInstance().update());
                        }} title={`确认要${status}该产品？`}>
                        <a >{status}</a>
                        </Popconfirm>
                    </Auth>
                    </span>)
            }
        }]
        const id=this.props.location.query.id;
        return (
            <div>
                {/*test*/}
                <ProdForm ref={form=>this.sForm=form} serviceId={id}/>
                <Table extra={  <div>
                    <Auth to={AuthConf.SERVICE_PROD_ADD}>
                    <Button onClick={()=> {
                        handleProd(this.form,null,this.sForm);
                    }} className={"pull-right"}>
                      <Icon type="plus"/>  新建服务产品
                    </Button>
                    </Auth>
                    <Auth to={AuthConf.SERVICE_PROD_EXPORT}>
                    <Button onClick={()=>axios.post("serviceProduct/get",Object.assign({"export":"1"},this.sForm.getFieldsValue())).then(()=>
                    showTaskModal(1))}
                            className={"pull-right margin-right-lg"}>
                       <Icon type="export"/> 导出数据
                    </Button>
                    </Auth>
                    <ModalForm ref={(form)=> {
                        this.form=form
                    }}/>
                </div>} rowKey={'product_code'}

                       params={{service_code:id}}

                       url={"serviceProduct/get"}
                       className={"margin-top-lg"}
                       columns={columns}/>
            </div>
        );
    }
}
class AlterForm extends React.Component {

    render() {
        let {getFieldDecorator, getFieldValue,setFieldsValue} = this.props.form;
        const formItemLayout                   ={
            labelCol: {span: 6}, wrapperCol: {span: 14},
        };
        const largeLayout                      ={
            labelCol: {span: 3}, wrapperCol: {span: 19}
        }
        let store                              =handler.$state();
        let visible                            =store.get("visible");
        let loading                            =store.get("formLoading");
        let product_code                       =getFieldValue("product_code");
        let disableService =store.get("disableService");
        console.log(disableService)
        window.form=this.props.form;
        return (
            <Modal
                confirmLoading={loading}
                onCancel={()=>showModal(false)}
                onOk={()=> {
                    postProd(this.props.form);
                }}
                title={"服务产品信息页"} width={800} visible={visible}>
                <Form className="over-hide" onSubmit={()=> {
                }}>
                    <Row>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label={"产品名称"}>
                                {
                                    getFieldDecorator("product_name", {
                                        rules: [{
                                            required: true, message: "产品名称必填"
                                        }]
                                    })(<Input/>)
                                }
                            </FormItem>
                        </Col>

                        <Col span={12}>
                            <div className={product_code ? "" : "form-hide"}>
                                {
                                    <FormItem {...formItemLayout} label={"产品编号"}>
                                        {
                                            getFieldDecorator("product_code")(<Input disabled={true}/>)
                                        }
                                    </FormItem>
                                }
                            </div>


                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label={"所属服务"}>
                                {
                                    getFieldDecorator("service_code", {
                                        rules: [{
                                            required: true, message: "所属服务必填"
                                        }]
                                    })(<ServiceSelect disable={disableService}/>)
                                }
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label={"分组标识"}>
                                {
                                    getFieldDecorator("product_group_name")(<Input/>)
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem {...largeLayout} label={"产品说明"}>
                        {
                            getFieldDecorator("product_desc")(<Input type={"textarea"}/>)
                        }
                    </FormItem>
                    <Row>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label={"计费模式"}>
                                {
                                    getFieldDecorator("billing_mode", {
                                        rules: [{
                                            required: true, message: "计费模式必填"
                                        }]
                                    })(<Select onChange={(e)=>{
                                       if(e==3){

                                           setFieldsValue({
                                               billing_cycle:0,
                                               product_is_support_auto_renew:1
                                           })
                                       }
                                    }}>
                                        <Select.Option value={1}>按用量</Select.Option>
                                        <Select.Option value={2}>按周期</Select.Option>
                                        <Select.Option value={3}>一次性</Select.Option>
                                    </Select>)
                                }
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label={"计费周期"}>
                                {
                                    getFieldDecorator("billing_cycle", {
                                        rules: [{
                                            required: true, message: "计费周期必填"
                                        }]
                                    })(<Select disabled={getFieldValue("billing_mode")==3}>
                                        {
                                            billing_cycle.map((item, index)=><Select.Option key={item}
                                                                                            value={index}>{item}</Select.Option>)
                                        }


                                    </Select>)
                                }
                            </FormItem>
                        </Col>

                    </Row>
                    {
                        getFieldValue("billing_mode")==1&&<Row>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label={"计量总量"}>
                                    {
                                        getFieldDecorator("billing_total",{
                                            rules:[{required:true,message:"计量总量必填"}]
                                        })(<Input type="number"/>)
                                    }
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label={"计量单位"}>
                                    {
                                        getFieldDecorator("billing_unit",{
                                            rules:[{required:true,message:"计量单位必填"}]
                                        })(<Input/>)
                                    }
                                </FormItem>
                            </Col>

                        </Row>
                    }

                    <Row>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label={"计费单元类型"}>
                                {
                                    getFieldDecorator("unit_type", {
                                        rules: [{
                                            required: true, message: "计费单元类型必填"
                                        }]
                                    })(<Select>
                                        <Select.Option value={1}>商户</Select.Option>
                                        <Select.Option value={2}>门店Mcode</Select.Option>
                                        <Select.Option value={3}>设备EN</Select.Option>
                                        <Select.Option value={4}>应用</Select.Option>
                                    </Select>)
                                }
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label={"支持自动续费"}>
                                {
                                    getFieldDecorator("product_is_support_auto_renew", {
                                        rules: [{
                                            required: true, message: "支持自动续费必填"
                                        }]
                                    })(<Select disabled={getFieldValue("billing_mode")==3}>
                                        <Select.Option value={1}>不支持</Select.Option>
                                        <Select.Option value={2}>支持</Select.Option>
                                    </Select>)
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label={"市场价（元）"}>
                                {
                                    getFieldDecorator("product_market_price", {
                                        rules: [{
                                            required: true, message: "市场价必填"
                                        }]
                                    })(<Input type="number"/>)
                                }
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label={"成本价（元）"}>
                                {
                                    getFieldDecorator("product_cost_price", {
                                        rules: [{
                                            required: true, message: "成本价必填"
                                        }]
                                    })(<Input type="number"/>)
                                }
                            </FormItem>
                        </Col>

                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label={"使用优先级"}>
                                {
                                    getFieldDecorator("product_deduct_sort_index", {
                                        rules: [{
                                            required: true, message: "使用优先级必填"
                                        }]
                                    })(<Radio.Group>
                                        <Radio value={1}>高</Radio>
                                        <Radio value={2}>中</Radio>
                                        <Radio value={3}>低</Radio>
                                    </Radio.Group>)
                                }
                            </FormItem>
                        </Col>

                    </Row>
                </Form>
            </Modal>
        )
    }
}
class SearchForm extends React.Component {
    componentDidMount(){
        if(this.props.serviceId){
            let params={service_code:this.props.serviceId}
            this.props.form.setFieldsValue(params)
        }
    }
    render() {
        let {getFieldDecorator, getFieldsValue} = this.props.form;
        return (
            <Form className="over-hide" inline={true} onSubmit={(e)=> {
                e.preventDefault();
                let send=getFieldsValue();
                Table.getTableInstance().reload(send);
            }}>
                {/**/}
                <FormItem label={"所属服务"}>
                    {
                        getFieldDecorator("service_code")(<ServiceSelect/>)
                    }
                </FormItem>
                <FormItem label={"服务产品"}>
                    {
                        getFieldDecorator("keywords")(<Input style={{width: 200}} placeholder="请输入产品名称关键词查询"/>)
                    }
                </FormItem>

                <Button onClick={()=> {
                    this.props.form.resetFields()
                }} className={"margin-left-lg "}>清除</Button>
                <Button  type={"primary"} className="margin-left" htmlType={"submit"}>搜索</Button>
            </Form>
        )
    }
}
const ModalForm=Form.create()(AlterForm);
const ProdForm =Form.create()(SearchForm);

