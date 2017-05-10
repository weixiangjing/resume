/**
 *  created by yaojun on 2017/3/9
 *
 */
import React from "react";
import {Select, Cascader} from "antd";
export class SelectBase extends React.Component {
    static  propTypes = {
        inForm: React.PropTypes.bool // 默认在表单中使用，单独使用时 为false
    }
            state     = {
                options: this.getOptions()
            }
    
    getOptions() {
        return [];
    }
    
    handleChange(e) {
        this.props.onChange && this.props.onChange(e,this.state.options.find((item=>e==item.value)));
    }
    
    render() {
        let {onChange, value, inForm = true,disable=false} = this.props;
        let options                  = this.state.options;
        let valueProps               = {};
        if (inForm) {
            valueProps.value = value === undefined ? '' : value + '';
        } else {
            valueProps.defaultValue = value === undefined ? '' : value + '';
        }
       
        return (
            <Select showSearch
                    disabled={disable}
                    size={"large"}
                    filterOption={(input, opt) => opt.props.children.indexOf(input) > -1}
                    style={{width: 200, verticalAlign: "middle"}} {...valueProps}
                    notFoundContent={''}
                    onChange={(e) => this.handleChange(e)}>
                {
                    options.map(item => {
                        if (typeof item === "object") {
                            return <Select.Option value={String(item.value)}
                                                  key={item.value}>{item.label}</Select.Option>
                        }
                        return (<Select.Option value={item} key={item}>{item}</Select.Option>);
                    })
                }
            
            </Select>
        )
    }
}
export class CascaderBase extends SelectBase {
    
    loadData() {
    }
    render() {
        let { value, inForm = true} = this.props;
        let valueProps               = {};
        if (inForm) {
            valueProps.value = value === undefined ? [] : value ;
        } else {
            valueProps.defaultValue = value === undefined ? [] : value ;
        }
        return (
            <Cascader
                size="large"
                changeOnSelect
                placeholder=""
                showSearch
                notFoundContent=""
                onChange={(e)=>this.handleChange(e)}
                loadData={(data) => this.loadData(data)}
                options={this.state.options}
                style={{minWidth: 200, verticalAlign: "middle"}}
                {...valueProps}
              >
            </Cascader>
        )
    }
}
