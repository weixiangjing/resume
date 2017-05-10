import React from 'react';
import {Modal, Form, Input, Select,Switch,Row,Col,Tree,Radio,Spin} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import {EDIT,DISTRIBUTION,ADDROLE} from './component'


import RightTree from './tree';
import TransferModal from './Transfer';
const RegistrationForm = Form.create()(
  (props) => {
    const { visible,onCancel, onCreate, form ,treeData,getTree,text,getEmployees,setAllocRole,data,mockData,targetKeys,setTargetKeys,setcheckedKeys,checkedKeys,loading,confirmLoading} = props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 14},
    };
    const value=data||new Object();
    return (
      <Modal
        visible={visible}
        title={text==EDIT||ADDROLE?"角色信息":"角色用户分配"}
        okText="确认"
        onOk={onCreate}
        onCancel={onCancel}
        confirmLoading={confirmLoading}
        className="modal-no-cancel"
        width={700}
      >
        {text!=DISTRIBUTION?<Row>
          <Col span="12">
            <Form  horizontal>
              <FormItem
                {...formItemLayout}
                label="角色名"
              >
                {getFieldDecorator('role_name',{
                  rules: [{required: true, message: '请输入正确的角色名'}],
                  initialValue: value.role_name
                })(
                  <Input placeholder="请输入" disabled={value.role_id==1?true:false}/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="角色描述"
              >
                {getFieldDecorator('description',{
                  initialValue: value.description
                })(
                  <Input type="textarea" rows={4} placeholder="请输入" maxLength="100"/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="启用"
              >
                {getFieldDecorator('status',{
                  rules: [{required: true}],
                  initialValue:value.status
                })(
                  <Radio.Group>
                    <Radio value={1} disabled={value.role_id==1||value.role_user_count>0?true:false}>启用</Radio>
                    <Radio value={2} disabled={value.role_id==1||value.role_user_count>0?true:false}>关闭</Radio>
                  </Radio.Group>

                )}
              </FormItem>
            </Form>
          </Col>
          <Col span="12">
            <RightTree data={treeData} getTree={getTree} setcheckedKeys={setcheckedKeys} checkedKeys={checkedKeys}/>
          </Col>
        </Row>:''}
        {text==DISTRIBUTION?<Row>
          <TransferModal getEmployees={getEmployees} setAllocRole={setAllocRole} targetKeys={targetKeys} mockData={mockData} setTargetKeys={setTargetKeys}/>
        </Row>:''}
        <div className={`example ${loading?"showLoad":"hideLoad"}`}><Spin spinning={loading}/></div>
      </Modal>
    );
  }
);
export default RegistrationForm;
