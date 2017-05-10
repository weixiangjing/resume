

import React from "react";
import Immutable from "immutable";
import {message} from "antd";
import ProductItem from "../../../../../common/ProductItem/productItem";
import QueueAnim from "rc-queue-anim";
export default class ServiceProductFormItem extends React.Component {
    remove(index) {
        let values = this.props.value;
        let arr;
        if(this.props.mode){// 如果是修改套餐只修改数量为0，否则删除该商品
                arr =this.props.value.updateIn([index,'product_quantity'],()=>0);
        }else{
            arr= values.delete(index);
        }
       
        this.props.onChange(arr);
    }
    add(index) {
        this.handle(index,true);
    }
    handle(index, isAdd ) {
        let values = this.props.value;
        this.props.onChange(values.updateIn([index, 'product_quantity'], (num) => {
            if (isAdd){
    
                if(num==100) return num;
                return num + 1;
            }
            else{
                if (num == 1 )return num
                return num - 1;
            }
        }));
    }
    sub(index) {
        this.handle(index,false);
    }
    push(b){

        let value = this.props.value
        if(value &&value.filter(item=>item.get("product_quantity")!=0).size==5){
            return message.warn("只能添加5个服务产品");
        }
        b.product_quantity=1;
        if(value){
            let index=value.findIndex((item)=>item.get("product_code")==b.product_code);
            if(index>-1){// 如果已经存在，添加数量
                if( value.get(index).get("product_quantity")>0){
                    return  message.warn("该产品已经添加");
                }else{


                   return this.props.onChange(value.updateIn([index],(item)=>item.set("product_quantity",1)))
                }

            }
            this.props.onChange(value.push(Immutable.Map(b)));
        }else{
            this.props.onChange(Immutable.fromJS([b]));
        }
    }
    render() {
        let {value = Immutable.List()} =this.props;
        
        return (
            <QueueAnim leaveReverse type={['right','left']} className="margin-top">


                {
                    value.map((item, index) =>item.get("product_quantity")!=0?<ProductItem
                             key={item.get("product_code")}
                             onDelete={(index) => this.remove( index)}
                             onAdd={(index) => this.add( index)}
                             onMinus={(index) => this.sub( index)}
                             item={item}
                             index={index}/>:null)
                         .toArray()
                }

            </QueueAnim>
        )
    }
}