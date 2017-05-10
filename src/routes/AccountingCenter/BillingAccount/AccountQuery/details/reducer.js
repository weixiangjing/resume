import axios from 'axios';
import {notification} from 'antd';

const Immutable                 = require('immutable');
export const handler           = {}
export const initialState       = ()=>{
  return Immutable.fromJS({
    fwq_list:[],
    account_query_list:[],
    fwq_statistics:[],
    loading:true
  });
}
const loop=(list)=>list.map((item)=>{
  if(item.book_occur_amount&&!isNaN(item.book_occur_amount)){
    if(item.book_type==1){item.book_occur_amount=0-item.book_occur_amount;}
  }
})
export const getList=(params)=>{
  axios.post('serviceAccount/get',params).then((res)=>{
    const state=exports.state;
    handler.$update(state.set('account_query_list',Immutable.List(res.data)).set('loading',false))
  })
};//账户列表
export const getFwList=(params)=>{
  axios.post('serviceAccount/getFw',{...params,pageSize:9999}).then((res)=>{
    if(res.data.length){loop(res.data);}
    const state=exports.state;
    handler.$update(state.set('fwq_list',Immutable.List(res.data)))
  })
};//账户收支明细
export const getFwS=(params)=>{
  axios.post('serviceAccount/getFwStatistics',params).then((res)=>{
    const state=exports.state;
    handler.$update(state.set('fwq_statistics',Immutable.List(res.data)))
  })
};//账户收支统计
export const getDate=(date)=>{
  let newDate=new Date(date);
  let dateYear = newDate.getFullYear(newDate);
  let dateMonth = newDate.getMonth(newDate) + 1;
  let dateDate,endDate;
  if(dateYear%4==0&&dateMonth==2){dateDate=29;}
  else if(dateMonth==2){dateDate=28}
  else if(dateMonth<8){dateDate=dateMonth%2==0?30:31}
  else if(dateMonth>7){dateDate=dateMonth%2==0?31:30}
  dateMonth = dateMonth < 10 ? "0" + dateMonth : dateMonth;
  dateDate = dateDate < 10 ? "0" + dateDate : dateDate;
  endDate= dateYear + "-" + dateMonth + "-" + dateDate + " 23:59:59";
  return endDate
}
export const closeAccount=(id,no)=>{
  axios.post('serviceAccount/closeAccount',{id:id}).then(()=>{
    getList({account_no:no})
  })
}//冻结账户
export const openAccount=(id,no)=>{
  axios.post('serviceAccount/openAccount',{id:id}).then(()=>{
   getList({account_no:no})
  })
}//解冻账户
