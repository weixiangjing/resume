/**
 *  created by yaojun on 17/3/3
 *
 */



"use strict";
import {addRule,alterRule} from "../../../../model/Sale";
import {Table} from "../../../../common/Table"
const Immutable           = require('immutable');
export const handler      = {}
export const initialState = () => Immutable.fromJS({
    visible:false,
    loading:false
});

    

export function showModal(visible=true){
    handler.$update(
        exports.state.set("visible",visible).set("loading",false)
    )
}

export function handleSale(form,value){
    showModal();
    setTimeout(()=>{
        if(value){
            value.rule_id=value.id;
            form.setFieldsValue(value);
        }else{
            form.resetFields();
        }
    })
   
}

export function postSale(form){
    form.validateFields((error,value)=>{
        if(error) return ;
        let promise;
        handler.$update(
            exports.state.set("loading",true)
        )
      
        
        console.log(value)
        if(value.rule_id){ //alter
            promise= alterRule(value).then(()=>Table.getTableInstance().update())
        }else{
            // add
            promise=addRule(value).then(()=>Table.getTableInstance().reload())
        }
        promise.finally(()=>{
            showModal(false);

        })
    })
}
export function toggleStatus(col){
 return alterRule({
     rule_id:col.id,
     rule_status:col.rule_status==1?2:1
 })
}