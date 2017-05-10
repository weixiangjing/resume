import axios from 'axios';
import {notification} from 'antd';
import moment from "moment";

const Immutable                 = require('immutable');
export const handler           = {}
export const initialState       = ()=>{
  return Immutable.fromJS({
    tendency:[],
    showG2:false,
    dateBill:{},
    Bill:{},
    dateFwBill:{},
    FwBill:{}

  });
}
export const getPurchaseServiceRank=()=>{
  return axios.post('serviceBill/getPurchaseServiceRank',{pageSize:10})
}
export const getUserPurchaseServiceRank=()=>{
  return axios.post('serviceBill/getUserPurchaseServiceRank',{pageSize:10})
}
export const getFwStatistics=(params)=>{
  axios.post('serviceAccount/getRechargeOrder',params).then((res)=>{
    const state=exports.state;
    let data={};
    if(res.data.length){
      let sum=0;
      for(let i=0;i<res.data.length;i++){
        if(res.data[i].charge_amount)sum+=res.data[i].charge_amount;
      }
      data.count=res.data.length;
      data.sum=sum;
    }else {
      data.count=0;
      data.sum=0;
    }
    if(params.book_trade_time_begin&&params.book_trade_time_end){
      handler.$update(state.set('dateFwBill',Immutable.fromJS(data)))
    }else {
      handler.$update(state.set('FwBill',Immutable.fromJS(data)))
    }
  })
}//充值统计查询
export const getStatistics=(params)=>{
  axios.post('serviceBill/getStatistics',params).then((res)=>{
    const state=exports.state;
    if(params.time_begin&&params.time_end){
      handler.$update(state.set('dateBill',Immutable.fromJS(res.data[0])))
    }else {
      handler.$update(state.set('Bill',Immutable.fromJS(res.data[0])))
    }
  })
}//服务统计
export const gettendency=(send)=>{
  axios.post('serviceBill/trendCount',send).then((res)=>{
    const state=exports.state;
   res.data.map((item)=>{
      item.trade_amount /= 100;
     item.week_date=moment(item.trade_date).format('MM-DDddd');
    })
    const tendency=res.data;
    handler.$update(state.set('tendency',Immutable.List(tendency)).set('showG2',true))
  })
}
