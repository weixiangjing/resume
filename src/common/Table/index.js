/**
 *  created by yaojun on 2017/3/13
 *
 */
import React from "react";
import {Table as AntTable, Pagination, Spin, Alert} from "antd";
import {paginationOptions, cleanEmpty,isEmptyObject} from "../../util/helper";
import axios from "axios";
import "./index.scss";

const TableCollection =[]
const Types = React.PropTypes;
// 表格分页
export class Table extends React.Component {
    static  propTypes = {
        // extends props
        params           : Types.object,
        url              : Types.string.isRequired,
        forceUpdate      : Types.bool,// 每次都会刷新数据
        pageSize         : Types.number,
        requiredProps    : Types.array,
        requireOneOfProps: Types.array,
        autoInit:Types.bool,
        fixedParams:Types.object,
        showPage:Types.bool,
        extra:Types.element,
        showTotal:Types.bool,
        onParams:Types.func,
        name:Types.string,// 可以根据该名称找到table 的实例
        // callback
        onLoad           : Types.func,
        // return false 表示 终止请求
        onFetchBefore    : Types.func,
        // from ant
        className      : Types.string,
        rowKey         : Types.string.isRequired,
        columns        : Types.array.isRequired,
        rowSelection   : Types.object,
        pageSizeOptions: Types.array
    }
            state     = {
                loading : false,
                pageSize: this.props.pageSize || 20,
                pageNum : 1,
                columns : [],
                data    : [],
                total   : 0,
            }

    componentWillReceiveProps(props) {
        if (props.forceUpdate) {
            this.fetch(undefined, props.params);
        }
    }
    static getTableInstance(tableName){
        if(!tableName) return TableCollection[TableCollection.length-1];// 默认返回栈顶table实例
        return TableCollection.find(item=>item.props.name==tableName);
    }
    componentWillMount() {
        TableCollection.push(this);
        this.autoInit=this.props.autoInit!==false;
        if(this.autoInit){
            this.fetch(undefined, this.props.params);
        }

    }

    componentWillUnmount(){
        let index= TableCollection.findIndex((item=>item.props.name==this.props.name));
        TableCollection.splice(index,1);
    }
    
    
    
    /**
     * 请求第一页数据
     * @param params
     */
    reload(params){
        this.autoInit=true;
        this.fetch({pageSize:this.state.pageSize,pageNum:1},params);
    }
    /**
     *
     * @param [params] 无参数将使用上一次请求使用的参数，有参数将和上一次参数合并，覆盖
     */
    update(params) {
        this.autoInit=true;
        if(params ===true){
            this.fetch();
        }else{
            if(params){
                this.fetch(undefined,params)
            }else{
                this.fetch(undefined,this.requestParams);
            }
        }

    }

    // 索引 页显示数量发生改变时更新
    handleChange(obj, jump, sorter={}) {
        let orderBy = {};
        if (sorter.columnKey) {
            orderBy.order   = sorter.order === "descend" ? 2 : 1;
            orderBy.orderby = sorter.columnKey;
        }
        if(this.requestParams){
            delete this.requestParams.pageSize;
            delete this.requestParams.pageNum;
        }
        this.fetch({
            ...orderBy,
            pageSize: obj.pageSize,
            pageNum : obj.current
        }, Object.assign({},this.props.params,this.requestParams));
    }

    fetch(obj={pageSize: this.state.pageSize, pageNum: this.state.pageNum}, params = {}) {
        let url = this.props.url;
        let send = { ...cleanEmpty(params)};
        let required = this.props.requiredProps;
        let oneMore = this.props.requireOneOfProps;
        
        if (required) {
            required = required.filter(item => !!item);// 如果为undefined 或者"" ，则忽略
            for (let i = 0; i < required.length; i++) {
                let value = send[required[i]];
                if (value === undefined || value === "" || value === null) {
                    console.warn("Table Component ", url, "缺少必须参数【", required[i], '】', send);
                    return;
                }
            }
        }
        
        if(oneMore){
            oneMore =oneMore.filter(item=>!!item);
            let flag=false;
            for(let i=0;i<oneMore.length;i++){
                let value = send[oneMore[i]];
                if(value) flag=true;
            }
            if(flag===false) {
                console.warn("Table Component ",url,"最少提供 ",oneMore,"中的一个参数")
                return ;
            }
        }
        if (this.props.onFetchBefore) {
            let isFetch = this.props.onFetchBefore(send, this);
            if (isFetch===false) return;
        }
        this.setState({loading: true});
        send={...obj,...cleanEmpty(params)};
        if(this.props.fixedParams) {
            send=Object.assign({}, this.props.fixedParams, send);
        }
        this.requestParams=send;
        
        if(this.props.onParams){
           this.requestParams=send= this.props.onParams(send,this);
        }
        axios.post(url, send).then((res) => {

            this.setState({
                pageSize: obj.pageSize,
                pageNum : obj.pageNum,
                data    : res.data.map(item=>{item._date=res.date;return item}),
                total   : res.total,
                loading : false,
                date:res.date
            },() => {
                this.props.onLoad && this.props.onLoad(this.state)
            })
        }).catch(()=>{
            this.setState({loading:false})
        })
    }

    render() {
        let {columns, rowKey, className, rowSelection, pageSizeOptions,showPage=true,extra,showTotal=true} =this.props;
        let {data, loading, total, pageSize,pageNum}                    =this.state;
        let selection                                                   = {};
        if (rowSelection) {
            selection.rowSelection = rowSelection;
        }
      

        if(this.autoInit===false)return null;
        return (

            <div className="common-table">
                <div className="table-header-bar over-hide margin-v">
                    {
                      showTotal && <div className="pull-left">共搜索到 {total} 个结果</div>
                    }
                    
                    <div className="pull-right">{extra}</div>
                </div>
                <AntTable columns={columns}
                                         dataSource={data}
                                         loading={loading}
                                         rowKey={rowKey}
                                         {...selection}
                                         className={className}

                                         onChange={(obj, sorter, a) => this.handleChange(obj, sorter, a)}
                                         pagination={showPage?paginationOptions(total, pageSize, undefined, undefined, undefined, pageSizeOptions,pageNum):false}/>
                   
            </div>

        )
    }
}
// 卡片分页
export class CardTable extends Table {
    static  propTypes = {
        // extends props
        params         : Types.object,
        url            : Types.string.isRequired,
        onLoad         : Types.func,
        extra:Types.element,
        // from ant
        className      : Types.string,
        rowKey         : Types.string,
        columns        : Types.array,
        pageSizeOptions: Types.array,
        pageSize       : Types.number,
        renderContent  : Types.func.isRequired
    }

    render() {
        let {className, renderContent, pageSizeOptions,extra,showTotal=true,showPage=true}      =this.props;
        let {pageNum, pageSize, total, data, loading}=this.state;
       
        console.log(pageNum)
        
        if(this.autoInit===false) return null;

        return (
            <div className={`${className} common-card-table`}>
                <div className="common-table-header-bar over-hide margin-v">
                    {
                        showTotal && <div className="pull-left">共搜索到 {total} 个结果</div>
                    }
                    <div className="pull-right">{extra}</div>
                </div>
                <Spin spinning={loading}>
                   
                    {renderContent(data, this)}
                    {(total>0 && showPage) && <div className="over-hide common-table-footer-bar">
                            <Pagination
                                
                                
                                        className="margin-v-lg"
                                        onShowSizeChange={(current, pageSize) => {
                                            this.handleChange({current, pageSize})
                                        }}
                                        onChange={(index) => {
                                            this.handleChange({
                                                current : index,
                                                pageSize: this.state.pageSize
                                            })
                                        }}   {...paginationOptions(total, pageSize, undefined, undefined, undefined, pageSizeOptions,pageNum)}/>
                        </div> }
                </Spin>
            </div>
        )
    }
}


