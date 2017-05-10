/**
 *  created by yaojun on 17/1/6
 *
 */
  


    
import ajax from "axios";

export function getProfit(send){
   return ajax.post("tmsPayRate/getPayRate",send);
}

export function updateProfit(send){
    return ajax.post("tmsPayRate/updatePayRate",send);
}

export function addProfit(send){
    return ajax.post("tmsPayRate/addPayRate",send);
}