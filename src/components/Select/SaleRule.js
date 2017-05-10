/**
 *  created by yaojun on 2017/3/16
 *
 */



import {SelectBase} from "./base";
import {getRule} from "../../model/Sale";


export class SaleRulesSelect extends SelectBase{
    onInit=false;

    componentWillReceiveProps(props){
        console.log(props)
        if(props.status!==this.props.status)
        this.getOptions(props);
    }
    
    getOptions(props=this.props){
        let send ={pageSize:300,rule_status:1};
        if(props.status==1){ // 产品
            send.rule_type=1;
        }else if(props.status==2){// 订单
            send.rule_type=2;
        }

        send.rule_type+=",3";


        getRule(send).then(({data})=>this.setState({
            options:data.map(item=>({...item,label:item.rule_name,value:item.id}))
        }))
        return []
    }
}
