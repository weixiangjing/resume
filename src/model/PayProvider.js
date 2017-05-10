/**
 *  created by yaojun on 17/1/9
 *
 */
  


    
import ajax from "axios";

export function getProvider(send){
  return   ajax.post("tmsPaymode/getSp",send);
}
export function updateProvider(send){
    return   ajax.post("tmsPaymode/updateSp",send)
}

export function addProvider(send){
    return  ajax.post("tmsPaymode/addSp",send)
}

