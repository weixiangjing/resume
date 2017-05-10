/**
 *  created by yaojun on 17/3/3
 *
 */



"use strict";
import {alterPackage} from "../../../../model/ServiceProduct";
import {message} from "antd";
const Immutable           = require('immutable');
export const handler      = {}
export const initialState = () => Immutable.fromJS({});
export function deletePackage(id) {
  return   alterPackage({
        is_delete : 2,
        combo_code: id
    }).then(() => {
        message.success("删除成功");
      return true
    });
}
export function toggleStatus(item) {
   return alterPackage({
        combo_code: item.combo_code,
        combo_status    : item.combo_status == 1 ? 2 : 1
    })
}

export function setValue(path,value){
    let state = exports.state.updateIn()
}