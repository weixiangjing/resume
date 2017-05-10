"use strict";
import React from 'react';
import {Cascader,notification} from 'antd';
const PayChannel = require('../../model/PayChannel');
import classnames from 'classnames';
import './style.scss';

export default React.createClass({
    propTypes:{
        transfer:React.PropTypes.func,
        params:React.PropTypes.object,
        onload:React.PropTypes.func
    },
    getInitialState:function() {
        return {pending:false,payment:[],paymentMap:{}};
    },
    componentDidMount(){
        this.setState({pending:true});
        PayChannel.getAllChannel(this.props.params).then(payment=>{
            if(this.props.transfer)payment = this.props.transfer(payment);
            let paymentMap = {};
            payment.forEach(item=>{
                if(item.children){
                    item.children.forEach(child=>{
                        paymentMap[child.pay_channel_id] = child;
                    })
                }
            });
            this.setState({payment,paymentMap});
            if(this.props.onload)this.props.onload(payment);
        }).finally(()=>{
            this.setState({pending:false});
        });
    },
    handleChange(payment){
        let paymentObj = this.state.paymentMap[payment[1]];
        this.props.onChange([...payment,paymentObj])
    },
    render(){
        let props = Object.assign({},this.props);
        props.disabled = props.disabled || this.state.pending;
        if(undefined===props.showSearch)props.showSearch = true;
        let options = this.state.payment;
        let valueProps = this.props.value?{value:props.value}:{};
        return (<span className={classnames("payment-cascader",{'loading':this.state.pending})}>
            <Cascader disabled={props.disabled} defaultValue={props.value}  {...valueProps}
                      data={props.data} size={props.size} showSearch={props.showSearch} children={props.children}
                      options={options} onChange={(e)=>{
                        
                          this.handleChange(e);
                      }} placeholder={props.placeholder} id={props.id}/>
        </span>)
    }
})