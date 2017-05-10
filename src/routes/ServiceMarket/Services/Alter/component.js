/**
 *  created by yaojun on 17/3/3
 *
 */
import React from "react";
import {Form,Input,Row,Col,Upload,Button} from "antd";

import {BASE_URL} from '../../../../config/api';
import {ImageUpload} from "../../../../components/ImageUpload";
import {ServiceType,ServiceWeight} from "../../../../components/Select/ServiceType";

import {add,echo} from "./reducer";
const FormItem = Form.Item;
class SearchForm extends React.Component {
    componentWillMount(){
        if(this.props.alterId){
            echo(this.props.alterId,this.props.form);
        }
    }
    render() {
        let {getFieldDecorator,getFieldValue} = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span:18  },
        };
        const largeLayout={
            labelCol:{span:3},
            wrapperCol:{span:14}
        }
        let alterId = this.props.alterId;
        let src =getFieldValue('service_icon');
        return (
            <Form onSubmit={(e) => add(this.props.form,e)}>
                <Row>
                    <Col span={12}>
                        {
                            alterId &&
                            <FormItem {...formItemLayout} label={"服务编号"}>
                                {
                                    getFieldDecorator("service_code")(
                                        <Input disabled={!!alterId}/>
                                    )
                                }
                            </FormItem>
                        }
                        <FormItem {...formItemLayout} label={"服务名称"}>
                            {
                                getFieldDecorator("service_name",{
                                    rules:[
                                        {
                                            required:true,message:"请输入服务名称"
                                        }
                                    ]
                                })(
                                    <Input/>
                                )
                            }
                        </FormItem>
                        <FormItem {...formItemLayout} label={"服务类型"}>
                            {
                                getFieldDecorator("service_type",{
                                    rules:[
                                        {
                                            required:true,message:"请输入服务类型"
                                        }
                                    ]
                                })(<ServiceType/>
                                )
                            }
                        </FormItem>
                        <FormItem {...formItemLayout} label={"服务提供商"}>
                            {
                                getFieldDecorator("service_provider",{
                                    rules:[
                                        {
                                            required:true,message:"请输入服务提供商"
                                        }
                                    ]
                                })(
                                    <Input/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={12}>
    
                      <div style={{marginLeft:48}}>
                        <div className="margin-bottom">
                            <img onError={(e)=>e.target.src="default.png"} width={120} height={120} src={decodeURIComponent(src)} />
                        </div>
    
                          <FormItem >
                              {
                                  getFieldDecorator("service_icon",{
                                      rules:[
                                          {
                                              required:true,message:"请上传服务图片"
                                          }
                                      ]
                                  })(<ImageUpload/>)
                              }
                          </FormItem>
                       
                      </div>
                    </Col>
                </Row>
             
    
                <FormItem {...largeLayout} label={"服务内容"}>
                    {
                        getFieldDecorator("service_desc",{
                            rules:[
                                {
                                    required:true,message:"请填写本服务提供的内容、范围及相关细则"
                                }
                            ]
                        })(
                            <Input rows={6} type={"textarea"}/>
                        )
                    }
                </FormItem>
    
                <FormItem {...largeLayout} label={"服务协议"}>
                    {
                        getFieldDecorator("service_agreement",{
                            rules:[
                                {
                                    required:true,message:"请填写本服务的详细服务协议"
                                }
                            ]
                        })(
                            <Input rows={6}  type={"textarea"}/>
                        )
                    }
                </FormItem> <FormItem {...largeLayout} label={"服务优先级"}>
                {
                    getFieldDecorator("service_priority",{
                        rules:[
                            {
                                required:true,message:"请选择服务优先级"
                            }
                        ]
                    })(
                       <ServiceWeight/>
                    )
                }
            </FormItem>
                <Row>
                    <Col offset={3}>
                <Button htmlType={"submit"} type="primary">提交</Button>
                    </Col>
                </Row>
            </Form>
        )
    }
}

const SerForm =Form.create()(SearchForm);
export default class AlterService extends React.Component{
    render(){
        return  <SerForm alterId={this.props.location.query.id}/>
    }
}