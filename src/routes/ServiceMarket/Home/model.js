/**
 *  created by yaojun on 17/1/11
 *
 */
  


    
import ajax from "axios";

export function getStoreCount(send) {
    return ajax.post("tmsStatistics/getConfigStoreCount",send).then(res=>res.data[0]['configStoreCount']);
}

export function getDeviceCount(){
    return ajax.post("tmsStatistics/getConfigDeviceCount").then(res=>res.data[0]['configDeviceCount']);
}

export function getChannelCount(){
    return ajax.post("tmsStatistics/getPaychannelCount").then(res=>res.data[0]['paychannelCount']);
}

export function getClosedChannelCount() {
    return ajax.post("tmsStatistics/getClosedPaychannelCount").then(res=>res.data[0]['closedPaychannelCount']);
}

export function getChannelCountWithPayMode(send){
    return ajax.post("tmsStatistics/getConfigStoreCountByPaymode",send);
}

export function getLatelyStore(send){
    return ajax.post("tmsStatistics/getConfigStore",send)
}

export function getRankingOfEmployee(send){
    return ajax.post("tmsStatistics/getConfigStoreRank",send);
}