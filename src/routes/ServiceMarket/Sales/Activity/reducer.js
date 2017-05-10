/**
 *  created by yaojun on 17/3/3
 *
 */



"use strict";
import {alterActivity} from "../../../../model/Sale"
const Immutable           = require('immutable');
export const handler      = {}
export const initialState = () => Immutable.fromJS({});

    

export function  toggleStatus({discount_status,discountId}){
   return alterActivity({discount_status:discount_status==1?2:1,discountId})

}
