/**
 *  created by yaojun on 17/1/4
 *
 */
import React from "react";
import Immutable from "immutable";
import {Modal,message} from "antd";
import {hashHistory} from "react-router";
import {getApi} from "../config/api";
export function amountFormat(num) {
    num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num))
        num = "0";
    let sign  = (num == (num = Math.abs(num)));
    num       = Math.floor(num * 100 + 0.50000000001);
    let cents = num % 100;
    num       = Math.floor(num / 100).toString();
    if (cents < 10)
        cents = "0" + cents;
    for (let i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
        num = num.substring(0, num.length - (4 * i + 3)) + ',' +
            num.substring(num.length - (4 * i + 3));
    return (((sign) ? '' : '-') + num + '.' + cents);
}
export function cleanEmpty(send) {
    let result = {}
    for (let key in send) {
        if (send[key] !== undefined && send[key] !== "") {
            result[key] = send[key];
        }
    }
    return result;
}
export function paginationOptions(total, pageSize = 20, size = "small", showQuickJumper = true, showSizeChanger = true,pageSizeOptions,current) {
    let obj ={total, pageSize, showQuickJumper, showSizeChanger, size}
    if(pageSizeOptions){
        obj.pageSizeOptions=pageSizeOptions;
    }
    if(typeof current !=="undefined"){
        obj.current=current;
    }
    return obj;
}
export function unique(arr) {
    arr.sort(); //先排序
    let res = [arr[0]];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] !== res[res.length - 1]) {
            res.push(arr[i]);
        }
    }
    return res;
}
export function in_array(arr, str) {
    for (let i = 0; i < arr.length; i++) {
        if (String(arr[i]).indexOf(str) != -1)
            return true;
    }
    return false;
}
// table 表格 加载数据，搜索过滤数据
export function loading(handler, state, pending, searchData) {
    state = state.set("loading", loading);
    if (searchData) {
        if (searchData.__replace) {
            state = state.updateIn(['formData'], () => Immutable.Map(searchData))
        } else {
            state = state.updateIn(['formData', searchData.name], () => searchData.value)
        }
    }
    handler.$update(
        state
    )
    return state.get("formData").toJS();
}
export function toThousands(unit, n) {
    var num;
    if (unit == '万元') {
        num = n / (100 * 10000);
        if (num < 1000) {
            num = num.toFixed(2)
        } else {
            num = parseInt(Math.round(num))
        }
    }
    ;
    if (unit == '元') {
        num = (n / 100).toFixed(2)
    }
    ;
    if ((num + "") == "") {
        return "";
    }
    num = num + "";
    if (/^.*\..*$/.test(num)) {
        var pointIndex = num.lastIndexOf(".");
        var intPart    = num.substring(0, pointIndex);
        var pointPart  = num.substring(pointIndex + 1, num.length);
        intPart        = intPart + "";
        var re         = /(-?\d+)(\d{3})/
        while (re.test(intPart)) {
            intPart = intPart.replace(re, "$1,$2")
        }
        num = intPart + "." + pointPart;
    } else {
        num    = num + "";
        var re = /(-?\d+)(\d{3})/
        while (re.test(num)) {
            num = num.replace(re, "$1,$2")
        }
    }
    return num;
}//数字千分位显示
export function delcommafy(num) {
    if ((num + "") == "") {
        return "";
    }
    num = num.replace(/,/gi, '');
    return num;
}//数字去千分位
// 通过浏览器直接发起get请求
export function downloadWithForm(api, params={}) {

    params=JSON.parse(JSON.stringify(params));
    let url = getApi(api);
    let form    = document.querySelector("#download-form");
    let wrapper = document.createElement("div");

    form.action = url;
    params.export="1";


    params= cleanEmpty(params);
    for (let name in params) {
        let input   = document.createElement("input");
        input.name  = name;
        input.type  = "hidden";
        input.value = params[name];
        wrapper.appendChild(input);
    }
    form.appendChild(wrapper);
    console.log(params)
    form.submit();
    delete params.export
    form.removeChild(wrapper);
}
export function setDateTime(strat,end) {
  if(!strat|| !end)return " ";
  //if(strat.indexOf("-")!=-1){strat=strat.replace(/-/g, "/");}
  //if(end.indexOf("-")!=-1){end=end.replace(/-/g, "/");}
    let ms=new Date(end)-new Date(strat)
    let date=ms/(1000*60*60*24);
    let hours=parseInt((date-parseInt(date))*24);
    let minutes=parseInt((date*24-parseInt(date*24))*60);
    if(date>=1&&date<5){
      let time=hours?(parseInt(date)+'天'+hours+"小时"):parseInt(date)+'天';
      return time;
    }
    if(date>=0.0417&&date<1){
      let time=minutes?(parseInt(date*24)+'小时'+minutes+"分钟"):parseInt(date*24)+'小时';
      return time;
    }
    if(date>0&&date<0.0417){return "即将结束"}
    if(date==0||date<0){return "已到期";}
    if(date>999){return ">999天";}
    let time5=parseInt(date)+'天'
    return time5;
}
export function isEmptyObject(e) {
  for (var t in e)
    return !1;
  return !0
}

export function showTaskModal(type){
  message.success("操作成功");
  window.__header.showTaskTips();
}
