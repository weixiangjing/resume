
import React from "react";
import {ControlItem} from "../FormControl";
import {Select,Input} from "antd";
import "./index.scss";
export default class ComboUnitIdFormItem extends React.Component {
    static propTypes={
        getFieldDecorator:React.PropTypes.func.isRequired
    }
    render() {
        return (
            <div className="unit-id-type-group">
                
                <ControlItem decorator={this.props.getFieldDecorator} initialValue={'1'} required name={"unit_type"} label={'计费单元'} >
                    <Select  style={{width: 80}}>
                        <Select.Option value={'1'}>商户</Select.Option>
                        <Select.Option value={'2'}>Mcode</Select.Option>
                        <Select.Option value={'3'}>设备</Select.Option>
                        <Select.Option value={'4'}>应用内账号</Select.Option>
                    </Select>
                </ControlItem>
                <ControlItem required name={"unit_id"}
                             label={'计算单元标识'}
                             decorator={this.props.getFieldDecorator}>
                    <Input placeholder="输入计费单元标识号"/>
                </ControlItem>
            </div>
        )
    }
}