/**
 *  created by yaojun on 2017/3/8
 *
 */



import axios from "axios";
import {cleanEmpty} from "../util/helper"

export const addService=(body)=>{
  return   axios.post('service/add',cleanEmpty(body));
}

export const getService=(param={})=>{
    if(!param.pageSize){
        param.pageSize=2
    }
    
    return axios.post("service/get",cleanEmpty(param))
}

export const alter=(data)=>{
    return axios.post("service/update",data);
}

export const getProduct=(body)=>{
    return axios.post("serviceProduct/get",cleanEmpty(body))
}

export const alterProduct=(body)=>{
    return axios.post("serviceProduct/update",body)
}
export const addProduct=(body)=>{
    return axios.post("serviceProduct/add",body)
}


// 服务套餐
export const getPackage=(body)=>{
    return axios.post("serviceCombo/get",body);
}
export const addPackage=(body)=>{
    return axios.post("serviceCombo/add",body);
}
export const alterPackage=(body)=>{
    return axios.post("serviceCombo/update",body);
}
