/**
 *  created by yaojun on 17/3/3
 *
 */



"use strict";
import {addActivity, alterActivity,getActivity} from "../../../../../model/Sale";
import {notification,message} from "antd";
import {Table} from "../../../../../common/Table"
import {hashHistory} from "react-router"
import {handler as parentHandler} from "../reducer"
import moment from "moment";
const decimal=require("decimal.js");
const Immutable           = require('immutable');
export const handler      = {}
export const dateFormat="YYYY-MM-DD HH:mm:ss"
export const initialState = () => Immutable.fromJS({
    step: "1",
    isAlter:false,
    isDelete:false// 是否可以删除
});
let form2Data=null;
export function changeStep(form1,form2,step,callback) {
    
    form1.validateFields((error,value)=>{
        if(error) return ;
        
        handler.$update(
            exports.state.set("step", step)
        )
        let item =exports.state.get("item")
        if(step==2 &&item){
            setTimeout(()=>{
                callback(item);
            },200)// 将值回显到表单上
        
        
        }
    });
   
   
}
export function postData(form1, form2) {

        doPost(form1, form2)
    
}

export function echoActivity(send,form1){
    getActivity(send).then(({data})=>{
        let item =data[0]

        item.discount_cff_date=moment(item.discount_cff_date);
        item.discount_exp_date=moment(item.discount_exp_date);
        item.discount_budget_amount=decimal(item.discount_budget_amount).div(100);
        item.discount_adjust_amount=decimal(item.discount_adjust_amount).div(100);
        item.copy_of_input_param="";
        if(item.rule_input_param_value){
           let rule= JSON.parse(item.rule_input_param_value);
            item.copy_of_input_param=rule.map(item=>item.param_value).join(",");
            item.rule_placeholder=rule.map(item=>item.param_desc).join(",");
        }

        item.origin_rule_params=item.rule_input_param_value;

        if(item.discount_status==2){
            handler.$update("isAlter",true)
        }else{
            handler.$update("isDelete",true);
        }
        handler.$update("item",item);
        form1.setFieldsValue(item);
    })
}


function doPost(form,form2) {
    form.validateFields((error, value) => {
        if (error) return;
        form2.validateFields((error,value2)=>{
            if(error) return ;
           let send= Object.assign({},value,value2);
    
            let promise;
            send.rule_type=value.discount_type;
            send.discount_cff_date=send.discount_cff_date.format(dateFormat)
            send.discount_exp_date=send.discount_exp_date.format(dateFormat);
            send.discount_budget_amount=decimal(send.discount_budget_amount).mul(100).valueOf()
            send.discount_adjust_amount=decimal(send.discount_adjust_amount).mul(100).valueOf();

            if(send.copy_of_input_param){

                let rule =JSON.parse(send.origin_rule_params);
                let rule_values= send.copy_of_input_param.split(",");
                if(rule.length !=rule_values.length){
                    return form2.setFields({
                        copy_of_input_param:{
                            value:send.copy_of_input_param,
                            errors:[new Error("参数值与限定条件不匹配")]
                        }

                    })
                }
                let ruleStr=window.JSON.stringify(rule.map((item,index)=>{
                    item.param_value=rule_values[index];
                    return item;
                }))
                send.rule_input_param_value=ruleStr;

            }

            console.log("send params:",send);
            if (send.discountId) {//alter
                promise = alterActivity(send)
            } else {
                //add
                promise = addActivity(send).then(()=>{
                    parentHandler._reload=true;
                })
            }

            promise.then(()=>{
                hashHistory.goBack();

                message.success("操作成功")
            })
            
        })
        
        
    })
}
export function deleteActivity(id){
    alterActivity({
        discountId:id,is_delete:2
    }).then(res=>{
        message.success("操作成功");
        hashHistory.goBack()
        
    })
}

