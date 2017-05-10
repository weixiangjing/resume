"use strict";
import React from "react";
import axios from "axios";
import {Button, Modal, Form, Row, Col, Input, Select, DatePicker, AutoComplete} from "antd";
import ModalBody from "./modalbody";
import "./style.scss";
import {showTaskModal} from "../../../util/helper";
import AutoCompleteAsync from "../../../common/AutoCompleteAsync";
import {Table} from "../../../common/Table";
import moment from "moment";
const FormItem   =Form.Item;
const Option     =Select.Option;
const RangePicker=DatePicker.RangePicker;
let creatTable;
const staetDate=new Date(Date.now()-3*24*60*60*1000)

export default React.createClass({
    getInitialState() {
        return {
            visible: false, gList: [], total: 0,
        };
    }, handleOk(){
        this.setState({
            visible: false
        })
    }, handleCancel(){
        this.setState({
            visible: false
        })
    }, showModal(text){
        this.setState({
            visible: true, gList: text
        })
    }, getValue(){
        const value=this.form.getFieldsValue();
        if(value.start_date&&value.start_date.length) {
            value.create_time_begin=value.start_date[0].format('YYYY-MM-DD 00:00:00');
            value.create_time_end  =value.start_date[1].format('YYYY-MM-DD 23:59:59');
        }
        if(!value.start_date) {
            value.create_time_begin=moment(staetDate).format('YYYY-MM-DD 00:00:00');
            value.create_time_end  =moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        }
        if(value.channel_id) {
            value.pay_channel_id=value.channel_id[1]
        }
        return value;
    }, onLoading(e){
        this.setState({total: e.total});
    }, render(props, state){
        const columns=[{
            title: '时间', dataIndex: 'create_time',
        }, {
            title: '操作类型', dataIndex: 'logType', render: logType=>logType==1 ? (<span>账号安全</span>) : <span>服务市场管理</span>
        }, {
            title: '操作者', dataIndex: 'userRealName',
        },
          //{title: '计费单元标识', dataIndex: 'log_tag'},
          {
            title: '日志说明', dataIndex: 'description',
        }, {
            title : '操作',
            key   : 'action',
            render: (text, record, index)=>(<span><a onClick={()=>this.showModal(text)}>查看</a></span>)
        }];
        return (<div>
            <SearchForm ref={form=>this.form=form} onSubmit={()=>creatTable.update(this.getValue())}/>
            {this.state.total ? <div style={{textAlign: "right"}}><Button
                    onClick={()=>axios.post('serviceLog/getLog', {...this.getValue(),"export":"1"}).then(()=>showTaskModal())}>导出数据</Button></div> : ''}
            <Table
                bordered
                params={{
                    create_time_begin:moment(staetDate).format('YYYY-MM-DD 00:00:00'),
                    create_time_end  :moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
                }}
                className='data-table'
                columns={columns}
                url="serviceLog/getLog"
                rowKey={'id'}
                ref={t=>creatTable=t}
                onLoad={this.onLoading}
            />
            <Modal title="操作日志详情" visible={this.state.visible}
                   onOk={this.handleOk} onCancel={this.handleCancel}
            >
                <ModalBody mBody={this.state.gList}/>
            </Modal>

        </div>)
    }
})
const SearchForm=Form.create()(React.createClass({
    getInitialState: function() {
        return {
            pending: false, result: [],
        };
    }, handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue)=> {
            if(err)return;
            this.props.onSubmit();
        });
    },
  disabledDate(current){
        return current&&current.valueOf()>Date.now();
    }, render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form horizontal className={["ant-advanced-search-form", "myform"]} onSubmit={this.handleSubmit}>
                <div className="formFields">
                    <Row gutter={5}>
                        <Col xs={2} sm={4} md={6} lg={8}>
                            <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="操作时间：">
                                {getFieldDecorator('start_date', {
                                  rules: [{required: true, message: '请选择一段时期'}],
                                  initialValue:[moment(staetDate), moment(Date.now())]
                                })(<RangePicker disabledDate={this.disabledDate}/>)}
                            </FormItem>
                        </Col>
                        <Col xs={2} sm={4} md={6} lg={8}>
                            <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="操作类型：">
                                {getFieldDecorator('logType', {})(<Select placeholder="全部类型" allowClear>
                                    <Option value="1">账号安全</Option>
                                    <Option value="2">服务市场管理</Option>
                                </Select>)}
                            </FormItem>
                        </Col>
                        <Col xs={2} sm={4} md={6} lg={8}>
                            <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="操作者：">
                                {getFieldDecorator('userId', {})(
                                  <AutoCompleteAsync
                                    url="user/searchUser"
                                    requestKey="keywords"
                                    labelKey="real_name"
                                    valueKey="user_id"
                                    placeholder="请输入关键字快速匹配"
                                  />)}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={5}>
                        <Col xs={2} sm={4} md={6} lg={8}>
                            <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="操作关键词：">
                                {getFieldDecorator('keywords', {
                                    //initialValue:this.state.keyWords,
                                })(<AutoComplete
                                    className="user_auto"
                                    dataSource={["服务产品发布", "服务许可变更", "优惠活动发布"]}
                                    //onChange={this.handleChange}
                                    allowClear
                                />)}
                            </FormItem>
                        </Col>
                        <Col xs={2} sm={4} md={6} lg={8}>
                            <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="计费单元标识：" style={{display:"none"}}>
                                {getFieldDecorator('mcodes', {})(<Input placeholder="输入门店MCODE"/>)}
                            </FormItem>
                        </Col>
                        <Col span={4} className='text-right' style={{float: 'right'}}>
                            <Button type="primary" htmlType="submit" loading={this.state.pending}>搜索</Button>
                        </Col>
                    </Row>
                </div>
            </Form>
        );
    },
}));
