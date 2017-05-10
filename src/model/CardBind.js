/**
 *  created by yaojun on 17/1/9
 *
 */
  


    

import ajax from "axios";
export function getCard(send){
   return  ajax.post("cardBin/query",send);
}

export function uploadCard(data){
    return ajax.post("cardBin/upload",data);
}