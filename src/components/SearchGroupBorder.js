/**
 *  created by yaojun on 16/12/29
 *
 */
import React from "react";
import {Form,Radio, Icon, Input,Spin} from "antd";
import className from "classnames";
const InputSearch = Input.Search;
const FormItem    = Form.Item;
const RadioGroup  = Radio.Group;
const RadioButton = Radio.Button;
export class SearchGroupBorder extends React.Component {
    render() {
        return (   <div className="search-group-border">
            {
                this.props.children
            }
        </div>)
    }
}
export class SearchItemWithRadio extends React.Component {
    state            = {status: false,forceClose:false};
    static propTypes = {
        title            : React.PropTypes.string.isRequired,
        name             : React.PropTypes.string.isRequired,
        form :React.PropTypes.any.isRequired,
        items            : React.PropTypes.array.isRequired,
        length           : React.PropTypes.number
    }

    toggleStatus() {
        this.setState({status: !this.state.status})
    }

    componentWillMount(){
        setTimeout(()=>{
            if(this.isEmpty ){
                this.setState({forceClose:true});
            }

        },10000);
    }

    render() {
        let {title, name, items, length,onSelect=()=>{}} =this.props;
        let _items = this.state.status ? items : items.slice(0, length || 10);
        let {getFieldDecorator,setFieldsValue,initialValue} =this.props.form;
        let firstItem =_items[0];
        this.isEmpty= !firstItem||(_items.length==1 && !firstItem.value)
        let forceClose= this.state.forceClose;
        if(forceClose) this.isEmpty=false;
        return ( <FormItem>

            <Spin spinning={this.isEmpty}>
            <label className="search-label">{title}</label>


            {
                getFieldDecorator(name,{
                    initialValue
                })(

                         <RadioGroup  onChange={(e)=>{
                             setTimeout(()=>{ // 先把form值设置了后，在执行change 事件

                                 onSelect({[name]:e.target.value})
                             })

                         }} size="small" style={{paddingLeft:30}} className="search-radio-item ant-none-border ant-active-color">
                        {_items.map((item,index)=>(
                            <RadioButton key={item.value} value={''+item.value} >{item.label}</RadioButton>))}
                    </RadioGroup>

                )
            }
                {

                   items.length>10 && <span onClick={()=>this.toggleStatus()} className="collapse-icon cursor text-primary">
                展开<Icon className={className(["margin-left", "transition", {"rotate360": this.state.status}])}
                        type="down"/></span>

                }
            </Spin>

        </FormItem>)
    }
}


export class SearchItemWithInput extends React.Component {
    static propTypes = {
        getFieldDecorator: React.PropTypes.func.isRequired
    }
    render() {
        let {getFieldDecorator, title, name, placeholder,onChange} = this.props;
        let _change = onChange||function(){}
        return (
            <FormItem>
                <label className="search-label">{title}</label>
                <span style={{width:300}}  className="search-radio-item">
                      {
                          getFieldDecorator(name, {})(
                              <InputSearch onSearch={({value})=>_change(value)} onPressEnter={({target})=>_change(target.value)} className={'normal-input'} placeholder={placeholder}/>
                          )
                      }
                    </span>
            </FormItem>
        )
    }
}
