/**
 *  created by yaojun on 2017/3/14
 *
 */
  


    

import axios from "axios";

export function addRule(body){
  return  axios.post("serviceDiscountRule/add",body)
}

export function getRule(body){
    return axios.post("serviceDiscountRule/get",body);
}

export function alterRule(body) {
    return axios.post("serviceDiscountRule/update",body)
}
export function addActivity(body){
    return axios.post("serviceDiscount/add",body);
}

export function alterActivity(body={}){
    return axios.post("serviceDiscount/update",body);
}
export function getActivity(body){
    return axios.post("serviceDiscount/get",body);
}

export function stat(body){
    return axios.post("serviceDiscount/getStatistics",body);
}