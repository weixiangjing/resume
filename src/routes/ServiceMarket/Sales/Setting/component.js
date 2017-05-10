/**
 *  created by yaojun on 17/3/3
 *
 */
import React from 'react';
import {Modal,Form,Button,Input,Radio,Row,Col,Popconfirm} from 'antd';
import {ControlItem} from "../../../../common/FormControl";
import {Table} from "../../../../common/Table";
import {handleSale,handler,showModal,postSale,toggleStatus} from "./reducer"
import {Auth} from "../../../../components/ActionWithAuth";
import "./index.scss";
const AuthConf = require("../../../../config/auth_func");
const rule_type =['','服务产品优惠活动规则','订购订单优惠活动规则','不限'];
export default class Component extends React.Component {
    render() {
        let columns =[
            {
                title:"规则编码",
                dataIndex:"rule_code"
            },{
                title:"规则名称",
                dataIndex:"rule_name"
            },{
                title:"规则类型",
                dataIndex:"rule_type",
                render:(a,col)=>rule_type[col.rule_type]
            },{
                title:"状态",
                dataIndex:"rule_status",
                className:"corner-mark",
                render:(a,col)=>col.rule_status==1?<span className="text-success"><i className="font-lg">.</i>可用</span>:<span className="text-danger"><i className="font-lg">.</i>停用</span>
            },{
                title:"创建时间",
                dataIndex:"create_time"
            },{
                title:"操作",
                render:(a,col)=>{
                    let status =col.rule_status==1?"停用":"启用"
                    return <span>
                        <Auth to={AuthConf.SERVICE_SALE_SETTING_UPDATE}>
                        <a onClick={()=>handleSale(this.form,col)}>编辑</a>
                        </Auth>
                        <Auth to={AuthConf.SERVICE_SALE_SETTING_SWITCH}>
                        <Popconfirm onConfirm={()=>toggleStatus(col).then(()=>Table.getTableInstance().update())} title={`确认要${status} 该活动？`}>
                        <a  className="margin-left-lg">{status}</a>
                        </Popconfirm>
                        </Auth>
                    </span>
                }
            },
        ]
        return (<div className="service-market-sale-setting">
           
            <AlterForm ref={(form)=>this.form=form}/>
          <Table extra={ <Auth to={AuthConf.SERVICE_SALE_ACTIVITY_ADD}>
              <Button onClick={()=>handleSale(this.form)} className={"pull-right"}>新建规则</Button>
          </Auth>} url="serviceDiscountRule/get" rowKey="id" columns={columns}/>
        </div>);
    }
}

class ModalForm extends  React.Component{
    render(){
        let layout ={
            labelCol:{span:4},
            wrapperCol:{span:18}
        }
        let sLayout={
            labelCol:{span:8},
            wrapperCol:{span:16}
        }
        let {getFieldDecorator} =this.props.form;
        let store = handler.$state();
        let visible = store.get("visible");
        let loading =store.get("loading");
        return (
            <Modal visible={visible}
                   title={"营销规则详情"}
                   confirmLoading={loading}
                   onOk={()=>postSale(this.props.form)}
                   onCancel={()=>showModal(false)}
                   width={600}>
                <Form>
                    <div className="form-hide">
                        <ControlItem name={'rule_id'} decorator={getFieldDecorator} label={"活动id"} >
                            <Input />
                        </ControlItem>
                    </div>
                    <Row>
                        <Col span={12}>
                    <ControlItem formItemLayout={sLayout} name={'rule_name'} decorator={getFieldDecorator} label={"标题"} required>
                        <Input />
                    </ControlItem>
                        </Col>
                      
                    </Row>
                    <ControlItem formItemLayout={layout} name={'rule_code'} decorator={getFieldDecorator} label={"规则编码"} required>
                        <Input />
                    </ControlItem>
                    <ControlItem formItemLayout={layout} name={'rule_desc'} decorator={getFieldDecorator} label={"规则说明"} >
                        <Input type={"textarea"} />
                    </ControlItem>
                    <ControlItem opts={{rules:[{
                        validator:(rule,value,cb)=>{
                            if(value){
                                try {
                                    JSON.parse(value);
                                }catch (e){
                                    
                                    cb("JSON 格式错误")
                                }
                            }
                            cb();
                        }
                    }]}} extra={"不填表示无须参数，多个参数使用多个JSON对象描述"} formItemLayout={layout} name={'rule_input_param'} decorator={getFieldDecorator} label={"参数模板"} >
                        <Input rows={5} type={"textarea"} />
                    </ControlItem>
                    <ControlItem required formItemLayout={layout} name={'rule_type'} decorator={getFieldDecorator} label={"适用优惠形式"} >
                        <Radio.Group>
                            <Radio value={1}>服务产品优惠活动规则</Radio>
                            <Radio value={2}>订购订单优惠活动规则</Radio>
                            <Radio value={3}>不限</Radio>
                        </Radio.Group>
                    </ControlItem>
                   
                </Form>
            </Modal>
        )
    }
}

const AlterForm =Form.create()(ModalForm);