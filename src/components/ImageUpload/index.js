/**
 *  created by yaojun on 2017/3/8
 *
 */


import React from "react";
import {Upload,Button,Icon} from 'antd';
import {BASE_URL} from "../../config/api"


export class ImageUpload extends React.Component{
    static propTypes={
        label:React.PropTypes.string,
        onChange:React.PropTypes.func,
        onResponse:React.PropTypes.func,
        multiple:React.PropTypes.bool
    }
    state={
        pending:false
    }
    render(){
        let {label="上传图片",multiple=false,onChange,onResponse,value} =this.props;
        return (
            <Upload
                data={(file)=>{
                    
                    return {
                        fileName:file.name
                    }
                }}
                beforeUpload={()=>this.setState({pending:true})}
                onChange={(e)=>{
                    if(e.file.status==="done"){
                        if(onChange){
                            let result = e.file.response.data.map(item=>item.url);
                            this.setState({pending:false})
                            onChange(multiple?result:result[0]);
                        }
                        if(onResponse){
                            onResponse(e.file.response.data);
                        }
                    }
                }}
                
                multiple={multiple}
                showUploadList={false}
                name={"fileData"}
                action={`${BASE_URL}file/uploadFile/bsIcon`}>
                <Button><Icon type={this.state.pending?'loading':'upload'}/>{label}</Button>
            </Upload>
            )
       
    }
}
