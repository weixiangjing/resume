import React from 'react';
import {Popconfirm, Button,notification,Form,Radio,Input} from 'antd';
import RegistrationForm from './modal';
import axios from 'axios';
import User from '../../../model/User';
import {UserStatusSwitch,DeleteUser,ModifyUser,NewUser} from './reducer';
import {Auth} from '../../../components/ActionWithAuth';
import {SYSTEM_USERTMS_ADD,SYSTEM_USERTMS_UPDATE,
  SYSTEM_USERTMS_STATUS,SYSTEM_USERTMS_DELETE,SYSTEM_USERTMS_RESETPAW} from '../../../config/auth_func';
import {SearchGroupBordered} from '../../../common/SearchGroup';
import {Table} from '../../../common/Table';
const FormItem = Form.Item;

let cardTable;
export default React.createClass({

  getInitialState() {
    return {
      visible: false,
      data:null,
      select:[],
      loading:true,
      confirmLoading:false,
    };
  },
  componentWillMount(){
    axios.post('user/RoleSelectList').then((data)=>{
      data.data.map((item)=>{
        item.id=item.id+"";
      })
      this.setState({
        select:data.data,
      })
    })
  },
  showModal(record){
    this.setState({
      visible:true,
      data:record,
    })
  },
  handleCancel(form){
    form.resetFields();
    this.setState({
      visible: false,
    });
  },
  saveFormRef(form){this.modalform = form;},
  handleCreate(form){
    const {data,select}= this.state;
    form.validateFields((err, values) => {
      if (err) {return;}
      var RoleName;
      this.setState({confirmLoading:true})
      select.map((item)=>{
        if(values.role_id==item.role_id){
          RoleName=item.role_name
        }
      })
      if(data){
        let editData={
          role_id: values.role_id,
          username:data.username,
          real_name: values.name.trim(),
          tel_phone: values.phone,
          status:data.status,
          operator_id:User.userid,
          user_id:data.user_id,
          role_name:RoleName
        }
        if(editData.role_id=='')delete editData.role_id;
        ModifyUser(editData).then(()=>{
          cardTable.update(this.setHandlerValue());
          this.setState({visible: false , confirmLoading:false});
        }).catch((err)=>{
          this.setState({confirmLoading:false,});
        })
      }else {
        let newData={
          role_id: values.role_id,
          username:values.user.trim(),
          real_name: values.name.trim(),
          tel_phone: values.phone,
          status:1,
          operator_id:User.userid,
          role_name:RoleName
        }
        if(newData.role_id=='')delete newData.role_id;
        NewUser(newData).then((res)=>{
          cardTable.update(this.setHandlerValue());
          this.setState({visible: false , confirmLoading:false,});
        }).catch((err)=>{
          this.setState({confirmLoading:false,});
        })
      }
      form.resetFields();
    });
  },
  onUseState(text){
    text.status=text.status==1?2:1;
    text.operator_id=User.userid;
    UserStatusSwitch(text).then(()=>{
      cardTable.update(this.setHandlerValue())
    });
  },
  onDelete(text){
    DeleteUser({user_id:text.user_id}).then(()=>{
      notification.success({
        message: `成功删除${text.username}`,
      })
      cardTable.update(this.setHandlerValue())
    });
  },
  resetPassWord(text){
    axios.post('user/ResetPassword',{
      user_id:text.user_id,
      operator_id:User.userid
    }).then((res)=>{
      notification.success({message: '密码重置成功'})
    })
  },
  setHandlerValue(){
    let values={};
    if(this.form){
      values=this.form.getFieldsValue();
    }
    return values;
  },
  render(props,state){
    const columns=[
      {
        title: '登录名',
        dataIndex: 'username',
      }, {
        title: '姓名',
        dataIndex: 'real_name',
      }, {
        title: '联系电话',
        dataIndex: 'tel_phone',
      }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render:status=>status==1?(<span className="text-success">· 可用</span>):<span className="text-warning">· 已关闭</span>
      }, {
        title: '角色',
        dataIndex: 'role_name',
      },  {
        title: '操作',
        key: 'action',
        render: (text, record, index) => {
          let status=record.status;
          return (
            <span>
            <Auth to={SYSTEM_USERTMS_UPDATE}>
              <a onClick={()=>this.showModal(record)}>编辑</a>
            </Auth>


            <Auth to={SYSTEM_USERTMS_RESETPAW}><span className="ant-divider"/>
              <Popconfirm title={`您是否要重置用户【${record.username}】的密码?`} onConfirm={()=>this.resetPassWord(record)}><a>重置密码</a></Popconfirm>
            </Auth>
              {text.user_id!=1?(<span>
            <Auth to={SYSTEM_USERTMS_STATUS}><span className="ant-divider"/>
              <Popconfirm title={<span>您是否要<b style={{color:"#f90"}}>{status==1?'停用':'启用'}</b>用户【{record.username}】?</span>} onConfirm={()=>this.onUseState(record)}><a>{status==1?'停用':'启用'}</a></Popconfirm>
            </Auth>
              <Auth to={SYSTEM_USERTMS_DELETE}>
                <span className="ant-divider"/>
              <Popconfirm title={`您是否要删除用户【${record.username}】?`} onConfirm={()=>this.onDelete(record)}><a>删除</a></Popconfirm>
              </Auth>
            </span>):''}
          </span>
          );
        },
      }
    ];
    return (<div>
      <AntForm ref={(form)=>this.form=form} onSubmit={()=>cardTable.reload(this.setHandlerValue())}/>
      <RegistrationForm
        visible={this.state.visible}
        ref={this.saveFormRef}
        onCancel={this.handleCancel}
        onCreate={this.handleCreate}
        select={this.state.select}
        roleData={this.state.data}
        confirmLoading={this.state.confirmLoading}
      />
      <Table
        extra={<Auth to={SYSTEM_USERTMS_ADD}>
        <Button type="primary" onClick={()=>this.showModal()}>新建用户</Button>
      </Auth>}
        url="user/UserList"
        columns={columns}
        ref={(t)=>cardTable=t}
        rowKey={"username"}
        pageSize={10}
      />
    </div>)
  }
})

let _form ;
const AntForm=Form.create({
  onFieldsChange:(a,fields)=>{
    if(fields.status){
      cardTable.update(_form.getFieldsValue());
    }
  }}
)(React.createClass({
  getInitialState: function () {
    return {

    };
  },

  render(){
    const {getFieldDecorator}=this.props.form;
    _form=this.props.form;
    return (
      <Form onSubmit={(e) => {
                e.preventDefault()
                this.props.form.validateFields((err, fieldsValue) => {
                  if (err)return;
                  this.props.onSubmit();
                });
            }} className="myform">
        <SearchGroupBordered group={[{
            title:"状态",
            content:<FormItem>
                {
                    getFieldDecorator("status",{
                      initialValue:""
                    })(
                        <Radio.Group>
                            <Radio.Button value="">（全部）</Radio.Button>
                            <Radio.Button value="1">可用</Radio.Button>
                            <Radio.Button value="2">已停用</Radio.Button>
                        </Radio.Group>
                    )
                }
            </FormItem>
        },{
            title:"按关键字查找",
            content:<div>
                <FormItem>
                    {
                        getFieldDecorator("keywords", {
                        })(
                            <Input placeholder="请输入关键词查询"/>
                        )
                    }
                </FormItem>
                <FormItem><Button type="primary" htmlType="submit">查询</Button></FormItem>
            </div>
        }]}/>
      </Form>
    )
  }
}));


