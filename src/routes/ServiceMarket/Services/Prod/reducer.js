/**
 *  created by yaojun on 17/3/3
 *
 */



"use strict";
import {addProduct, alterProduct} from "../../../../model/ServiceProduct";
import {Table} from "../../../../common/Table";
const Immutable           = require('immutable');
const decimal =require("decimal.js");
export const handler      = {}
export const initialState = () => Immutable.fromJS({
    visible     : false,
    tableLoading: false,
    formLoading : false,
    formData    : {},
    list        : [],
    total       : 0,
    pageSize    : 20,
    disableService:false
});
export function showModal(visible = true) {
    handler.$update(
        exports.state.set("visible", visible)
    )
}
export function handleProd(form, data,sForm) {
   
    showModal();
    let service;
    if (data) {
        data.product_market_price=decimal(data.product_market_price).div(100).valueOf();
        data.product_cost_price=decimal(data.product_cost_price).div(100).valueOf();
        form.setFieldsValue(data)
        setTimeout(()=> form.setFieldsValue(data))
       
    } else{
        form.resetFields();
    }
        
    if(sForm){
        service= sForm.getFieldValue("service_code");
        form.setFieldsValue({"service_code":service});
        if(!data && service){
            handler.$update("disableService",true)
        }else{
            handler.$update("disableService",false)
        }
        

    }else{
        handler.$update("disableService",false)
    }
}
export function postProd(form) {
    form.validateFields((error, value) => {
        let promise;
        if (error) return;
        handler.$update(
            exports.state.set("formLoading", true)
        )
        value.product_market_price *= 100;
        value.product_cost_price *= 100;
        if (value.product_code) { //alter
            promise = alterProduct(value).then(()=>{
                Table.getTableInstance().update()
                handler.$update(
                    exports.state.set("formLoading", false)
                    .set("visible", false)
                )
            }).catch(()=>{
                handler.$update(
                    exports.state.set("formLoading", false)
                )
            })
        } else {
            promise = addProduct(value).then(()=>{
                Table.getTableInstance().update({pageNum:1,service_code:value.service_code});
                    handler.$update(
                    exports.state.set("formLoading", false)
                    .set("visible", false)
                )
            }).catch(()=>{
                handler.$update(
                    exports.state.set("formLoading", false)
                )
            })
            // add
        }
    });
}
export function toggleStatus(col) {
    return alterProduct({
        product_code  : col.product_code,
        product_status: col.product_status == 1 ? 2 : 1,
        _error           : 1
    })
}