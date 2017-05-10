/**
 *  created by yaojun on 2017/3/7
 *
 */
import React from "react";
import {Form} from "antd";
const FormItem = Form.Item;
export class ControlItem extends React.Component {
    static  propTypes = {
        label         : React.PropTypes.string,
        decorator     : React.PropTypes.func,
        name          : React.PropTypes.string,
        opts          : React.PropTypes.object,
        children      : React.PropTypes.element,
        required      : React.PropTypes.bool,
        formItemLayout: React.PropTypes.object,
        extra         : React.PropTypes.string,
        initialValue  : React.PropTypes.any,
        valuePropName : React.PropTypes.string,
        onChange      : React.PropTypes.func
    }
    
    render() {
        let {
                onChange,
                initialValue,
                valuePropName,
                label,
                decorator,
                name,
                opts = {rules: []},
                children,
                required,
                formItemLayout,
                extra
            }        = this.props;
        if (required) {
            opts.rules.push({
                required: true, message: `${label}必须填写`
            })
            if (initialValue) {
                opts.initialValue = initialValue;
            }
            if (onChange) {
                opts.getValueFromEvent = onChange;
            }
            if (valuePropName) {
                opts.valuePropName = valuePropName;
            }
        }
        return (
            <FormItem extra={extra} {...formItemLayout} label={label}>
                {
                    decorator(name, opts)(children)
                }
            </FormItem>
        )
    }
}