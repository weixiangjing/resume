/**
 *  created by yaojun on 2017/3/7
 *
 */



"use strict";
import {getPackage,addPackage,alterPackage} from "../../../../../model/ServiceProduct"
import moment from "moment";
import {hashHistory} from "react-router";
import {message,notification} from "antd";
import {handler as parentHandler} from "../reducer"
const Immutable           = require('immutable');

export const handler      = {}
export const initialState = () => Immutable.fromJS({});

    

export function echoPackage (query,form){
    getPackage(query).then(res=>{
        let obj =res.data[0];
        obj.combo_discount_price/=100;
        obj.combo_eff_date=moment(obj.combo_eff_date);
        obj.combo_exp_date=moment(obj.combo_exp_date);
        obj.serviceProduct=Immutable.fromJS(obj.serviceProduct);
        if(form)form.setFieldsValue(obj);
    })
}

const dateFormat="YYYY-MM-DD HH:mm:ss";
export function postPackage(form){
    form.validateFields((error,value)=>{
        if(error) return ;
        let promise;
        console.log(value)
        value.combo_eff_date=value.combo_eff_date.format(dateFormat);
        value.combo_exp_date=value.combo_exp_date.format(dateFormat);
        value.combo_discount_price*=100;
        if(value.serviceProduct){
            value.serviceProduct=value.serviceProduct.map((item)=>{
                let obj ={};
                    obj.product_code=item.get("product_code");
                    obj.product_quantity=item.get("product_quantity");
                    return obj;
            }).toJS()
        }
        
        if(value.combo_code){
            //alter
         promise=   alterPackage(value);
        }else{
            //add
           promise= addPackage(value).then(()=>{
               parentHandler._reload=true;
           })
        }
        promise.then(()=>{
            message.success("操作成功");
            hashHistory.goBack();
        })
    })
}

export function deletePackage(item,resetFields){
    alterPackage({
        is_delete:"2",
        combo_code:item
        
    }).then(()=>{
        
        resetFields();
        hashHistory.goBack();
    })
}