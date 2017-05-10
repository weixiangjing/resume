/**
 *  created by yaojun on 17/3/3
 *
 */



"use strict";
import {hashHistory} from "react-router";
const Immutable           = require('immutable');
import {addService,getService,alter} from "../../../../model/ServiceProduct";
import {handler as parentHandler} from "../Info/reducer"
export const handler      = {}
export const initialState = () => Immutable.fromJS({
    pic:"",
    data:{}
});

    
export const echo=(id,form)=>{
    getService({service_code:id}).then(res=>{
        form.setFieldsValue(res.data[0]);
    })
}
export const add=(form,e)=>{
    e.preventDefault();
    form.validateFields((error,value)=>{
        
        if(error) return ;
        
        let promise;
        
        
       
        value.service_icon="bsIcon/"+value.service_icon.split('bsIcon/')[1];
        value._msg=1;
        if(value.service_code){
           promise= alter(value)
        }else{
           promise= addService(value).then(()=>{
               parentHandler._reload=true;
           })
        }
        promise.then(()=>{
            hashHistory.goBack();

        })
       
        
    })
}

export const setSerPic=(pic)=>{
    handler.$update(
        exports.state.set("pic",pic)
    )
}
