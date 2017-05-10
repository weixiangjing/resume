/**
 *  created by yaojun on 17/1/5
 *
 */
import ajax from "axios";
const source_channel_list  = "tmsPaychannel/getPayChannel";
const source_provider_list = "tmsPaymode/getSp";
const source_mode_list     = "tmsPaymode/getPaymode";

export function getChannel(send = {}) {
    return ajax.post(source_channel_list, send);
}
export function getChannelType(type=0) {
    return (["自营", "非自营", "混合"])[+type-1];
}
export function getAllChannel(params={}) {
    return getChannel(Object.assign({pageSize: 999},params))
    .then(res => res.data)
    .then(data => {
        let cache_pay_mode = {};
        data.forEach(channel => {
            let modeId    = channel.pay_mode_id;
            channel.value = channel.pay_channel_id;
            channel.label = channel.pay_channel_name;
            if (!cache_pay_mode[modeId]) {
                cache_pay_mode[modeId] = {
                    pay_mode_name: channel.pay_mode_name,
                    children     : [],
                    label        : channel.pay_mode_name,
                    value        : modeId,
                    pay_mode_id  : modeId
                }
            }
            cache_pay_mode[modeId].children.push(channel);
        });
        return Object.keys(cache_pay_mode).map(item => cache_pay_mode[item]);
    })
}
export function getPayMode() {
    return ajax.post(source_mode_list, {pageSize: 1000}).then(res => res.data);
}
export function getNotOpenPayMode() {
    return ajax.post('tmsStorePaychannel/getNotOpenedPaymode', {pageSize: 1000}).then(res => res.data);
}
export function getOpenPayChannel(params = {}) {
    return ajax.post('tmsStorePaychannel/getOpenedPaychannel', params).then(res => res.data);
}
export function getNotOpenPayChannel(params = {}) {
    return ajax.post('tmsStorePaychannel/getNotOpenedPaychannel', params).then(res => res.data);
}
export function getProvider(send={}) {
    return ajax.post(source_provider_list, {...send,pageSize: 1000}).then(res => res.data);
}
export function updateChannel(send) {
    return ajax.post("tmsPaychannel/updatePayChannel", send)
}
export function addChannel(send) {
    return ajax.post("tmsPaychannel/addPayChannel", send)
}
export function getWorkable(params={}) {
    return ajax.post("tmsPaymode/getBzAblity",params)
}
export function openPaychannel(params = {}) {
    return ajax.post('tmsStorePaychannel/openPaychannel', params);
}
export function getConfigPayChannelBis(pay_channel_id){
    return ajax.post("tmsPaychannel/getPaychannelBzAblity",{status:1,pay_channel_id,pageSize:999}).then(res=>res.data);
}
export const ChannelStatus = {
    VALID  : {value: 1, label: '使用中'},
    INVALID: {value: 2, label: '已关闭'}
};
export const ChannelStatusValues = Object.values(ChannelStatus);
export const ChannelStatusMap    = (() => {
    let map = {};
    ChannelStatusValues.forEach((item) => {
        map[item.value] = item;
    });
    return map;
})();
