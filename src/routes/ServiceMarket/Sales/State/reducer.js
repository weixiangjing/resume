/**
 *  created by yaojun on 17/3/3
 *
 */



"use strict";
import {stat} from "../../../../model/Sale";
import moment from "moment"
const Immutable           = require('immutable');
export const handler      = {}
export const initialState = () => Immutable.fromJS({
    stat:{}
});

    
export const dateFormat ="YYYY-MM-DD HH:mm:ss";
export function statState(body){
    stat(body).then(res=>handler.$update(
        exports.state.set("stat",Immutable.Map(res.data[0]))
    ))
}