import React from "react";
import {getProduct} from "../../model/ServiceProduct";
import {AutoComplete} from "antd";
import "./index.scss";
export default class CAutoComplete extends React.Component {
    result = [];
    origin = []
    state = {
        options: []
    }
    componentWillMount() {
      this.loadData().then(res=>this.onLoad(res));
    }
    onLoad(res){
        this.result = res.data.map(item => item.product_name);
        this.origin = res.data;
        this.setState({options:this.result});
    }
    /**
     * 重写该方法获取数据，返回promise
     * @protected
     */
    loadData(){
       return  getProduct({product_status:1,pageSize: 999})
    }
    handleChange(e) {
       
    }
    
    /**
     * 重写该方法，当选择数据时调用
     * @protected
     * @param e
     */
    handleSelect(e) {
        console.log(e)
        let value = this.origin.find(item => item.product_name === e);
        this.props.onChange(value.product_code,value);
    }
    render() {
        let options = this.state.options;
        let {value,inForm} =this.props;
        let props ={}
        if(inForm){
            props.value=value;
        }else{
            props.defaultValue=value;
        }
        return (
            <AutoComplete
                          className="c-auto"
                          {...props}
                          style={{width: 200}}
                          onChange={(e) => this.handleChange(e)}
                          onSelect={(e) => this.handleSelect(e)}
                          placeholder="请选择服务产品"
                          dataSource={options}
                          filterOption={(inputValue, option) => {
                              return option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                          }}
                          allowClear
            />
        
        )
    }
}
