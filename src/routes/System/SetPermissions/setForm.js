import React from 'react';
import {Modal, Form, Input, Select,Radio} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;


const SetForm = Form.create()(
  (props) => {
    const { form,disabled,SelectData} = props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 14},
    };
    return (
      <div>
        <p style={{marginBottom:15}}>权限资源属性</p>
        <Form  horizontal>
          <FormItem
            {...formItemLayout}
            label="类型："
          >
            {getFieldDecorator('res_type',{
              rules: [{required: true,message:"请选择类型"}],
              initialValue:SelectData.res_type
            })(
              <Radio.Group>
                <Radio value={'Menu'} disabled={disabled}>菜单（Menu）</Radio>
                <Radio value={'Action'} disabled={disabled}>操作（Action）</Radio>
              </Radio.Group>
            )}
          </FormItem>
          <FormItem
          {...formItemLayout}
          label="名称："
          >
          {getFieldDecorator('res_name',{
            rules: [{required: true, message: '请输入资源名称'}],
            initialValue:SelectData.res_name
          })(
            <Input placeholder="请输入" disabled={disabled}/>
          )}
          </FormItem>
          <FormItem
          {...formItemLayout}
          label="可用状态："
          >
          {getFieldDecorator('status',{
            rules: [{required: true, message: '请选择资源状态'}],
            initialValue:SelectData.status
          })(
            <Radio.Group>
              <Radio value={1} disabled={disabled}>启用</Radio>
              <Radio value={2} disabled={disabled}>关闭</Radio>
            </Radio.Group>
          )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="资源地址："
          >
            {getFieldDecorator('res_url',{
              rules: [{required: true, message: '请输入资源地址'}],
              initialValue:SelectData.res_url
            })(
              <Input  placeholder="请输入" disabled={disabled}/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="资源图标："
          >
            {getFieldDecorator('icon_url',{
              initialValue:SelectData.icon_url
            })(
              <Input  placeholder="请输入资源图标ICON" disabled={disabled}/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="描述："
          >
            {getFieldDecorator('description',{
              initialValue:SelectData.description
            })(
              <Input type="textarea" rows={4} placeholder="请输入" disabled={disabled}/>
            )}
          </FormItem>
        </Form>
      </div>

    );
  }
);
export default SetForm;

