/**
 *  created by yaojun on 17/1/6
 *
 */
  


    

import ajax from "axios";

export function getPayPlugin(send){
  return   ajax.post("tmsPayPlugin/getPayPlugin",send).then(res=>res.data);
}
export function updatePayPlugin(send){
    return ajax.post("tmsPayPlugin/updatePayPlugin",send);
}
export function addPayPlugin(send){
    return ajax.post("tmsPayPlugin/addPayPlugin",send);
}
