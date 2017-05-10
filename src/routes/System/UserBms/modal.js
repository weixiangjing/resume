import React from 'react';
import axios from 'axios';
import {Modal, Form, Input, Select} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;


const RegistrationForm = Form.create()(React.createClass({
  getInitialState() {
    return {
      select:[]
    };
  },
  render(props){
    const { visible,onCancel, onCreate,  form ,select,roleData,confirmLoading} = this.props;
    const { getFieldDecorator } = form;
    const roleValue=roleData||new Object();
    const role_id=roleValue.role_id?String(roleValue.role_id):'';
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 14},
    };
    const loop=data=>data.map((item)=>{
      const value=item.role_id+"";
      return(
        <Option value={value} key={item.role_id}>{item.role_name}</Option>
      )
    })
    return (
      <Modal
        visible={visible}
        title="编辑用户信息"
        okText="确认"
        onOk={()=>onCreate(form)}
        onCancel={()=>onCancel(form)}
        confirmLoading={confirmLoading}
        className="modal-no-cancel">
        <Form>
          <FormItem
            {...formItemLayout}
            label="登录名"
          >
            {getFieldDecorator('user',{
              rules: [{required: true, message: '登录名不能为空'},{type:'email',message: '请输入正确的邮箱地址'}],
              initialValue: roleValue.username
            })(
              <Input placeholder="输入正确的邮箱地址作为登录名" disabled={roleValue.username?true:false} type="email"/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="用户姓名"
          >
            {getFieldDecorator('name',{
              rules: [{required: true, message: '请输入真实姓名'}],
              initialValue: roleValue.real_name
            })(
              <Input placeholder="输入用户真实姓名"/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="联系电话"
          >
            {getFieldDecorator('phone',{
              rules: [
                {pattern: /^1[0-9]{10}$/, message: '请输入正确的手机号'},
              ],
              initialValue: roleValue.tel_phone
            })(
              <Input placeholder="输入用户手机号" type='tel' maxLength="11" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="角色"
          >
            {getFieldDecorator('role_id', {
              initialValue: role_id
            })(
              <Select className="icp-selector">
                {loop(select)}
              </Select>
            )}
          </FormItem>


        </Form>
      </Modal>
    );
  }
}))
export default RegistrationForm;
