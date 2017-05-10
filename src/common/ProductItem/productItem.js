/**
 *  created by yaojun on 2017/3/7
 *
 */


import React from "react";
import {Icon,Popconfirm} from "antd"
import "./index.scss";
export default class ProductItem extends  React.Component{
    static  propTypes={
        title:React.PropTypes.string,
        amount:React.PropTypes.string,
        num:React.PropTypes.string,
        desc:React.PropTypes.string
    }
    render(){
        let {item,onDelete,index,onAdd,onMinus} =this.props;
        return (
            <div className="product-item margin-bottom">
                <div className="item-desc-num">
                    <div>
                        <div className="item">
                            <span className="sec_title">{item.get("service_name")}</span>
                            <span className="sec_title text-danger pull-right">￥{item.get("product_market_price")/100} 元/月</span>
                        </div>
                        <div className="item">
                            <span className="des-text padding-h">{item.get("product_name")}</span>
                            <span className="pull-right quantity-bar">
                                <Icon className="font-lg" onClick={()=>onAdd(index)} type="plus-square-o"/>
                                <span>{item.get("product_quantity")}</span>
                                <Icon className="font-lg" onClick={()=>onMinus(index)} type="minus-square-o"/>
                                
                                </span>
                        </div>
                    </div>
                   
                    
                </div>
                <div className="item-del">
                    <Popconfirm title="确认要删除该产品吗？" onConfirm={()=>onDelete(index)}>
                        
                    <Icon  type="delete"/>
                    </Popconfirm>
                </div>
            </div>
        )
    }
}