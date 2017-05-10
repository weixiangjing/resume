/**
 *  created by yaojun on 16/12/28
 *
 */









import immutable from "immutable";

let base =immutable.fromJS({
    title:"",
    type:"",
    description:"",
    key:"",
    validator:[{rule:"required",value:"true",message:"请输入该字段",id:Math.random()}],
    defaultValue:"",
    disabled:""
})

export default [
    {
        label:"文本（单行）",
        params :base.set("title","单行").set("type","text").toJS()
    },{
        
        label:"文本（多行）",
        params:base.set("title","多行").set("type","textarea").set("rows","5").toJS()
    },{
        label:"文件",
        params: {
            title      : "文件上传",
            type       : "file",
            action     : "",
            description: "",
            key:""
        }
    },{
        label:"按钮",
        params: {
            title : "点击我吧",
            action: "handleClick",
            type  : "button"
        }
    },{
        label:'提示',
        params:{
            type:"notice",
            description:"notice",
            showAs:"info"
        }
    },{
        label:"单选",
        params:base.set("title","单选").set("type","radio").set("options",[{id:Math.random(),label:"field",value:"1"}]).toJS()
    },{
        label:'多选',
        params:base.set("title","checkbox").set("type","checkbox").set("options",[{id:Math.random(),label:"field",value:"1"}]).toJS()
    },{
        label:"下拉菜单",
        params:base.set("title","select").set("type","select").set("options",[{id:Math.random(),label:"field",value:"1"}]).toJS()
    },{
        label:"日期",
        params:base.set("title","date time").set("type","datetime").toJS()
    }

]