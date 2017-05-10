"use strict";
import React from 'react';
import {Row,Col,Form,Input,Radio,Checkbox,Select,Button,DatePicker,Alert} from 'antd';
const FormItem = Form.Item;
const monent = require('moment');

export default Form.create()(React.createClass({
    render(){
        return <Form horizontal>
            <DynamicForm {...this.props}/>
        </Form>
    }
}));

const DynamicForm = ({form,items,labelCol,wrapperCol,preview})=>{
    let params = items;
    if(!params || !params.length)return null;
    const isPreview = preview === true;
    return <div>
        {params.map((field,index)=>{
            if(checkIsNotFormField(field)){
                if(isPreview)return null;
                return <Row key={field.id} className='ant-form-item'>
                    <Col span={labelCol?labelCol.span:undefined}/>
                    <Col span={labelCol?wrapperCol.span:undefined}><DynamicOtherField field={field}/></Col>
                </Row>;
            }
            if(!field.key){
                console.log('no key',field);
                return null;
            }
            return <DynamicFormField preview={isPreview} key={index} field={field} form={form} labelCol={labelCol} wrapperCol={wrapperCol}/>
        })}
    </div>
};
const DynamicFormField = React.createClass({
    render(){
        const isPreview = this.props.preview;
        let {field,labelCol,wrapperCol} = this.props;
        return <FormItem labelCol={labelCol} wrapperCol={wrapperCol} label={field.title}>
            {this.getFormItem(field)}
            {isPreview?null:<div className="small text-muted">{field.description}</div>}
        </FormItem>
    },
    getFormItem(field){
        const {getFieldDecorator} = this.props.form;
        let defaultValue = field.defaultValue;
        if(''===defaultValue)defaultValue = undefined;
        const commonProperties = {readOnly:field.readOnly,disabled:this.props.preview || field.disabled};
        const fieldsOption = {initialValue:defaultValue,rules: field.validator};
        switch (field.type){
            case 'text':
            case 'textarea':
                return getFieldDecorator(field.key, {
                    ...fieldsOption
                })(<Input type={field.type} rows={field.rows} {...commonProperties}/>);
            case 'radio':
                return getFieldDecorator(field.key, {
                    ...fieldsOption
                })(<XRadioGroup {...commonProperties} options={field.options}/>);
            case 'checkbox':
                return getFieldDecorator(field.key, {
                    ...fieldsOption
                })(<XCheckBoxGroup {...commonProperties} options={field.options}/>);
            case 'select':
                return getFieldDecorator(field.key, {
                    ...fieldsOption
                })(<Select {...commonProperties}>
                    {field.options.map(item=>{
                        return <Select.Option key={item.id} value={item.value}>{item.label}</Select.Option>
                    })}
                </Select>);
            case 'datetime':
                return getFieldDecorator(field.key, {
                    ...fieldsOption
                })(<XDatePicker {...commonProperties}/>);
            default:return <label>{field.type}</label>
        }
    }
});
const DynamicOtherField = ({field})=>{
    switch (field.type){
        case 'button':
            return <Button>{field.title}</Button>;
        case 'notice':
            return <Alert message={field.description} type={field.showAs}/>;
        default: return null;
    }
};
const checkIsNotFormField = (field)=>{
    return ['button','notice'].indexOf(field.type) != -1;
};

const XDatePicker = React.createClass({
    decorateProps(){
        let {value,defaultValue,onChange,format} = this.props;
        let decorate = Object.assign({},this.props);
        if(typeof value == 'string')decorate.value = monent(value);
        if(typeof defaultValue == 'string')decorate.defaultValue = monent(defaultValue);
        decorate.onChange = (value)=>{
            onChange(value.format(format||'YYYY-MM-DD'));
        };
        return decorate;
    },
    render(){
        return <DatePicker {...this.decorateProps()}/>
    }
});
const XCheckBoxGroup = React.createClass({
    decorateProps(){
        let {value,defaultValue} = this.props;
        let decorate = Object.assign({},this.props);
        if(typeof value == 'string')decorate.value = window.JSON.parse(value);
        if(typeof defaultValue == 'string')decorate.defaultValue = window.JSON.parse(defaultValue);
        return decorate;
    },
    render(){
        return <Checkbox.Group {...this.decorateProps()}/>
    }
});
const XRadioGroup = React.createClass({

    render(){
        return (<Radio.Group {...this.props}>
            {this.props.options.map(item=>{
                return <Radio key={item.id} value={String(item.value)}>{item.label}</Radio>
            })}
        </Radio.Group>)
    }
});