/**
 *  created by yaojun on 17/3/3
 *
 */



"use strict";
import {alter} from "../../../../model/ServiceProduct";

const Immutable           = require('immutable');
export const handler      = {}
export const initialState = () => Immutable.fromJS({
    loading:false,
    formData:{},
    list:[],
    total:0,
    pageNum:1,
    pageSize:2
});

    

function loading(loading=true){
    let state =  exports.state.set("loading",loading);

    handler.$update(
       state
    )
}

// 停用 | 删除
export const stop=(data,table)=>{
    loading();
  return alter(data).then(()=>handler.$update("loading",false))
}

