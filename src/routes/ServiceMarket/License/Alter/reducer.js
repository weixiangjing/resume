/**
 *  created by yaojun on 17/3/3
 *
 */



"use strict";
import {alterLicense} from "../../../../model/Lisence";
import {hashHistory} from "react-router";
const Immutable           = require('immutable');
export const handler      = {}
export const initialState = () => Immutable.fromJS({
    searchParams:{},
    step:0,
    count:0
});

    

export function setValue (...params){
    let state=exports.state;
    for(let i=0;i<params.length;i+=2){
        let value = params[i+1];
        state=state.set(params[i],typeof value=="object"?Immutable.Map(value):value)
    }
    console.log(state.toJS())
    handler.$update(state);
}

export function submit(form,type){
   let send= form.getFieldsValue();
    send.unit_type=type;
    if(send.license_codes)
   alterLicense(send).then((res)=>{
      handler.$update("step",2,"count",send.license_codes.split(",").length)
   })
    
}