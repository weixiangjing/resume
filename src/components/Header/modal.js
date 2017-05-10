import {Modal, Form, Input} from 'antd';
import React from 'react';
const FormItem = Form.Item;


const MenuMoadl = Form.create()(React.createClass({
  getInitialState() {
    return {
      passwordDirty: false,
    };
  },
  handlePasswordBlur(e) {
    const value = e.target.value;
    this.setState({ passwordDirty: this.state.passwordDirty || !!value });
  },
  checkPassword(rule, value, callback) {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('newpassword')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  },
  checkConfirm(rule, value, callback) {
    const form = this.props.form;
    if (value && this.state.passwordDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  },
  render(props){
    const { visible,onCancel, onCreate,  form ,UserData,loading} = this.props;
    const { getFieldDecorator } = form;
    const roleValue=UserData||new Object();
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 14},
    };
    return (
      <Modal
        visible={visible}
        title="编辑用户信息"
        okText="确认"
        onOk={onCreate}
        onCancel={onCancel}
        confirmLoading={loading}
        className="modal-no-cancel">
        <Form>
          <FormItem
            {...formItemLayout}
            label="登录名："
          >
            {getFieldDecorator('username',{
              rules: [{required: true, message: '请输入正确的邮箱地址'}],
              initialValue: roleValue.username
            })(
              <Input placeholder="输入正确的邮箱地址作为登录名"  disabled={true}/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="旧密码："
          >
            {getFieldDecorator('oldpassword', {
              rules: [{
                required: true, message: 'Please input your password!',
              }],
            })(
              <Input type="password" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="新密码："
          >
            {getFieldDecorator('newpassword', {
              rules: [{
                required: true, message: 'Please input your password!',
              }, {
                validator: this.checkConfirm,
              }],
            })(
              <Input type="password" onBlur={this.handlePasswordBlur} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="再次输入新密码："
          >
            {getFieldDecorator('confirm', {
              rules: [{
                required: true, message: 'Please confirm your password!',
              }, {
                validator: this.checkPassword,
              }],
            })(
              <Input type="password" />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}))
export default MenuMoadl;
