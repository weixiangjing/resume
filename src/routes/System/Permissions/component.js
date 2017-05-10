import React from 'react';
import {Card, Col, Row,notification,Icon,Modal,Form,Input,Button,Popconfirm,Spin,Radio} from 'antd';
import RegistrationForm from './modal';
import './index.scss';
import User from '../../../model/User';
import {in_array,unique} from '../../../util/helper';
import {Auth} from '../../../components/ActionWithAuth';
import {SYSTEM_PERMISSIONS_ADD,SYSTEM_PERMISSIONS_UPDATE,
  SYSTEM_PERMISSIONS_DISTRIBUTION,SYSTEM_PERMISSIONS_DELETE} from '../../../config/auth_func'
import {SearchGroupBordered} from '../../../common/SearchGroup';

export const EDIT='EDIT';
export const DISTRIBUTION='DISTRIBUTION';
export const ADDROLE='ADDROLE';
export const DELETEROLE='DELETEROLE';

export default React.createClass({

  getInitialState() {
    return {
      visible: false,
      count: 9,
      text:'',
      index:'',
      treeData:[],
      role_user_count:'',
      data:{},
      allocrole:'',
      treeId:'',
      mockData:[],
      targetKeys:[],
      checkedKeys:[],
      loading:true,
      confirmLoading:false,
      statusValue:""
    };
  },
  componentWillMount(){
    this.props.getRoleList({operator_id:User.userid});
  },
  saveFormRef(form){
    this.form = form;
  },
  setTargetKeys(targetKeys){
    this.setState({
      targetKeys:targetKeys,
    });
  },
  setcheckedKeys(checkedKeys){
    this.setState({
      checkedKeys:checkedKeys,
    });
  },
  callbake(data){
    const targetKeys = [];//已分配列表
    const mockData = [];//可分配列表
    const treeList=[];
    const roleArr=[];
    const Arr=[];
    if(data[0].able_alloc_Userlist){
      const rolelist=data[0];
       rolelist.able_alloc_Userlist.map((item)=>{
         item.status==1?item.disabled=false:item.disabled=true;
         item.key=String(item.user_id);
         mockData.push(item);
       });
       if(rolelist.already_alloc_Userlist)rolelist.already_alloc_Userlist.map((item)=>{
         item.key=String(item.user_id);
         mockData.push(item);
         targetKeys.push(item.key);
       })
    }else if(data[0].res_list){
      data[0].res_list.map((item)=>{
        treeList.push(item)
      })
    }else {
      for(let i=0;i<data.length;i++){
        treeList.push(data[i])
      }
    };
    const loop=data=>data.map((item) => {
      if(item.res_childs){
        loop(item.res_childs)
      }
      if(item.checked==1){
        roleArr.push(String(item.res_id))
      }
      if(item.checked==0)Arr.push(String(item.parent_id));
      if(item.status==2){item.checked=0};
      unique(Arr).map((key)=>{
        if(key==item.res_id){Arr.push(String(item.parent_id));}
      })
    });
    loop(treeList);
    const checkedKeys=unique(roleArr);
    for(let i=0;i<checkedKeys.length;i++){
      unique(Arr).map((key)=>{
        if(key==checkedKeys[i]){checkedKeys.splice(i,1);}
      })
    }
    this.setState({
      treeData:treeList,
      mockData:mockData,
      targetKeys:targetKeys,
      checkedKeys:checkedKeys
    });
  },
  showModal(i,obj,str){
    const arr=this.state.actionArr;
    this.setState({visible: true ,loading:true});
    if(str==EDIT){
      let params={
        role_id:obj.role_id+'',
        role_name:obj.role_name
      }
      this.props.getRoleMenusEdit(params,this.callbake).then(()=>{
        this.setState({
          index:i,
          data:obj,
          text:str,
          treeId:'',
          allocrole:'',
          loading:false
        });
      });
    }
    if(str==ADDROLE){
      this.props.getRoleMenusList(this.callbake).then(()=>{
        this.setState({
          index:i,
          data:obj,
          text:str,
          treeId:'',
          allocrole:'',
          loading:false
        });
      });
    }
  },
  handleCancel(){
    this.setState({
      visible: false ,

    });
  },
  handleCreate(){
    const form = this.form;
    const {text,index,data,treeData,allocrole,treeId,statusValue}= this.state;
    const role_params={operator_id:User.userid};
    if(statusValue)role_params.status=statusValue;
    if(text!=DISTRIBUTION)form.validateFields((err, values) => {
      if (err) {return;}
      this.setState({confirmLoading:true})
      if(text==EDIT){
        let editData={
          role_id: data.role_id,
          role_name:values.role_name.trim(),
          role_description: values.description,
          role_status:values.status,
          res_list: treeId?treeId:treeData,
          operator_id:User.userid
        }
        this.props.saveRole(index,editData).then(()=>{
          this.props.getRoleList(role_params);
          this.setState({
            visible: false ,
            confirmLoading:false
          })
        })
      }
      if(text==ADDROLE){
        let editData={
          role_name:values.role_name.trim(),
          role_description: values.description,
          role_status:values.status,
          res_list: treeId?treeId:treeData,
          operator_id:User.userid
        }
        this.props.CreatRole(editData).then(()=>{
          this.props.getRoleList(role_params);
          this.setState({
            visible: false ,
            confirmLoading:false
          })
        })
      }
      form.resetFields();
    });
    if(allocrole){
      let role={
        operator_id:User.userid,
        role_id:data.role_id,
        already_alloc_Userlist:allocrole,
        status:data.status
      }
      this.setState({confirmLoading:true})
      this.props.setAllocRole(role).then(()=>{
        this.setState({
          visible: false,
          role_user_count:allocrole.length,
          confirmLoading:false
        })
        this.props.getRoleList(role_params);
      });

    }
  },
  onDelete(i,obj,str){
    const params={
      role_id:obj.role_id+'',
      role_name:obj.role_name,
      operator_id:String(User.userid)
    }
    const {statusValue}=this.state;
    const role_params={ operator_id:String(User.userid)};
    if(statusValue)role_params.status=statusValue;
    this.props.DeleteRole(i,params).then(()=>{
      this.props.getRoleList(role_params);
      this.setState({
        visible: false ,
        index:i,
        loading:false
      });
    });
  },
  getTree(tree){
    this.setState({
      treeId:tree
    });
  },
  distribution(i,obj,str){
    const id=obj.role_id+"";
    this.setState({visible: true ,loading:true});
    this.props.getRoleUserList(id,this.callbake).then(()=>{
      this.setState({
        index:i,
        data:obj,
        text:str,
        allocrole:'',
        loading:false,
      });
    });
},
  setAllocRole(obj){this.setState({allocrole:obj})},
  onChangeStatus(e){
    const value=e.target.value;
    const params={operator_id:String(User.userid)};
    if(value)params.status=value;
    this.setState({statusValue:value});
    this.props.getRoleList(params);
  },
render(props,state){
    const List=state.get('list').toJS();
  return (
    <div className="permissions">
      <SearchGroupBordered group={[{
            title:"状态",
            content:
                        <Radio.Group onChange={this.onChangeStatus} value={this.state.statusValue}>
                            <Radio.Button value="">（全部）</Radio.Button>
                            <Radio.Button value="1">可用</Radio.Button>
                            <Radio.Button value="2">已停用</Radio.Button>
                        </Radio.Group>

        }]}/>
      {state.get('load')==false&&<p className="total-top">共搜索到{List.length}个结果</p>}
      <Spin spinning={state.get('load')}>
        <Row gutter={16}>
          {state.get('load')==false?
            List.map((obj,i) => {
              return (<Col span="8" style={{marginBottom:15}} key={i} >
                <Card title={obj.role_name} extra={<span>{obj.role_user_count}<i className="fa fa-users fa-lg" /></span>} className="myCard">
                  <p>{obj.description}</p>
                  <hr></hr>
                  {obj.status==1?<span className="text-success" style={{float:'left'}}>· 可用</span>:<span className="text-warning" style={{float:'left'}}>· 已关闭</span>}
                  <span style={{float:'right'}}>
                  <Auth to={SYSTEM_PERMISSIONS_UPDATE}><a onClick={()=>this.showModal(i,obj,EDIT)}>编辑</a></Auth>
                  <Auth to={SYSTEM_PERMISSIONS_DISTRIBUTION}>
                    <span className="ant-divider"/>
                  <a onClick={()=>this.distribution(i,obj,DISTRIBUTION)}>分配用户</a>
                  </Auth>
                  {obj.role_user_count==0?<Auth to={SYSTEM_PERMISSIONS_DELETE}><span className="ant-divider"/>
                    <Popconfirm title="您确认要删除此角色吗?" onConfirm={()=>this.onDelete(i,obj,DELETEROLE)}><a>删除</a></Popconfirm>
                  </Auth>:""}
                </span>
                </Card>
              </Col>
              )}):''
          }
          <Auth to={SYSTEM_PERMISSIONS_ADD}>
            <Col span="8" className="myCard_plus">
              <Card onClick={()=>this.showModal(null,null,ADDROLE)}>
                <p className="plus"><Icon type="plus" /></p>
              </Card>
            </Col>
          </Auth>
          <RegistrationForm
            visible={this.state.visible}
            ref={this.saveFormRef}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
            treeData={this.state.treeData}
            getTree={this.getTree}
            text={this.state.text}
            mockData={this.state.mockData}
            targetKeys={this.state.targetKeys}
            setAllocRole={this.setAllocRole}
            data={this.state.data}
            setTargetKeys={this.setTargetKeys}
            setcheckedKeys={this.setcheckedKeys}
            checkedKeys={this.state.checkedKeys}
            loading={this.state.loading}
            confirmLoading={this.state.confirmLoading}
          />
        </Row>
      </Spin>
    </div>
    )
  }
})
