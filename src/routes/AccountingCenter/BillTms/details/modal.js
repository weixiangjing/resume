import React from 'react';
import axios from 'axios';
import {Modal, Form, Input, Select,InputNumber} from 'antd';
import {delcommafy,toThousands} from '../../../../util/helper'
const FormItem = Form.Item;
const Option = Select.Option;


const PricingForm = Form.create()(React.createClass({
  getInitialState() {
    return {
      changeNum:"",
    };
  },
  onChangeNum(v){this.setState({changeNum:v})},
  render(props){
    const { visible,onCancel, onCreate,  form ,modalValue} = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 14},
    };
    const order_discount_amount=()=>{
      if(this.state.changeNum){
        const num=modalValue.order_discount_amount?
        this.state.changeNum*100+Number(modalValue.order_discount_amount):this.state.changeNum*100;
        let v=toThousands('元',num);
        return v;
      }else if(modalValue.order_discount_amount){
        let v=toThousands('元',modalValue.order_discount_amount);
        return v;
      }else {return '0.00';}
    };
    const order_pay_amount=()=>{
      if(order_discount_amount()=='0.00'){
        return toThousands('元',modalValue.order_pay_amount)
      }else {
        let v=modalValue.order_pay_amount-delcommafy(order_discount_amount())*100;
        return toThousands('元',v);
      }
    };
    return (
      <Modal
        visible={visible}
        title="编辑用户信息"
        okText="确认"
        onOk={onCreate}
        onCancel={onCancel}
        >
        <p><span className="top_span">订单总金额：</span><span style={{color:"#f60"}}>{toThousands('元',modalValue.order_pay_amount)}</span>元</p>
        <Form>
          <FormItem
            {...formItemLayout}
            label="人工减免金额："
          >
            {getFieldDecorator('manual_adjust_amount',{
              rules: [{required: true, message: '优惠金额不能为空'}],
              //initialValue: modalValue.manual_adjust_amount?modalValue.manual_adjust_amount/100:0
            })(
              <InputNumber min={1} onChange={this.onChangeNum}/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="批价操作说明："
          >
            {getFieldDecorator('manual_adjust_note',{
              rules: [{required: true, message: '请输入批价操作说明'}],
              //initialValue: modalValue.manual_adjust_note
            })(
              <Input type="textarea" rows={4} placeholder="对手工批价操作的说明" />
            )}
          </FormItem>
        </Form>
        <p className="_note">【调价后】
          <span>优惠总金额：</span><span style={{color:"#3c0"}}>{order_discount_amount()}</span>元，
          <span>账单总金额：</span><span style={{color:"#f60"}}>{order_pay_amount()}</span>元
        </p>
      </Modal>
    );
  }
}))
export default PricingForm;
