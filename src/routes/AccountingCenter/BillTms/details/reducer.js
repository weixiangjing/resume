import axios from 'axios';
import {notification} from 'antd';

const Immutable                 = require('immutable');
export const handler           = {}
export const initialState       = ()=>{
  return Immutable.fromJS({
    list:[],
    loading:true,
    product:[],
    combo:[],
  });
}
export const getServieList=(id)=>{
  axios.post('serviceBill/getServieList',{order_no:id}).then((res)=>{
    const state=exports.state;
    const data=res.data;
    const product=[];
    const arr=[];
    const itemArr=[];
    const combo=[];
    data.map((item)=>{
      if(item.product_type==1){product.push(item)}
      if(item.product_type==2){itemArr.push(item)}
    })
    let sum=0;
    itemArr.map((item)=>{
      const obj=new Object()
      obj.service_name=item.service_name;
      obj.product_name=item.product_name;
      obj.billing_cycle=item.billing_cycle;
      sum+=item.buy_count*item.product_market_price;
      arr.push(obj);
    })
    if(itemArr.length){
      itemArr[0].sum=sum;
      itemArr[0].productArr=arr;
      combo.push(itemArr[0])
    }
    handler.$update(state.set('product',Immutable.List(product)).set('combo',Immutable.List(combo)))
  }).catch((err)=>{
    notification.error({
      message: '数据加载失败',
      description: err.message,
    })
  });
}//账单服务列表
export const updateBill=(params)=>{
  return axios.post('serviceBill/updateBill',params)
}
export const getList=(params)=>{
  axios.post("serviceBill/getList",params).then((res)=>{
    handler.$update(exports.state.set('list',Immutable.List(res.data)).set('loading',false))
  })
}
