import axios from 'axios';
import {notification} from 'antd';
const Immutable = require('immutable');
export const PERMISSIONS_RESULT = 'SYSTEM_PERMISSIONS_RESULT';
export const PERMISSIONS_TREE = 'SYSTEM_PERMISSIONS_TREE';
export const PERMISSIONS_ROLE_USERLIST = 'SYSTEM_PERMISSIONS_ROLE_USERLIST';
export const PERMISSIONS_ROLE = 'SYSTEM_PERMISSIONS_ROLE';
module.exports = class {

  initialState(){
    return Immutable.fromJS({
      list:[],//角色列表
      data:[],//角色资源列表
      roleuserlist:[],//角色用户列表
      load:true
    })
  }

  mapDispatchToProps = {
    getRoleList: (params) => {
      return (dispatch) => {
        return axios.post('role/RoleList',params).then((res)=>{
          dispatch({
            type: PERMISSIONS_RESULT,
            list: res.data,
            load:false
          })
        }).catch((err)=>{
          notification.error({
            message: '数据加载失败',
            description: err.message,
          })
        });
      }
    },//获取所有角色列表
    getRoleMenusList: (call) => {
      return (dispatch) => {
        return axios.post('role/RoleMenusList').then((res)=>{
          dispatch({
            type: PERMISSIONS_TREE,
            data: res.data
          })
          call(res.data)
        }).catch((err)=>{
          notification.error({
            message: '数据加载失败',
            description: err.message,
          })
        });
      }
    },//所有角色资源列表
    getRoleUserList: (id,call) => {
      return (dispatch) => {
        return axios.post('role/RoleUserList',{role_id:id}).then((res)=>{
          dispatch({
            type: PERMISSIONS_ROLE_USERLIST,
            roleuserlist: res.data
          })
          call(res.data)
        }).catch((err)=>{
          notification.error({
            message: '数据加载失败',
            description: err.message,
          })
        });
      }
    },//获取指定角色分配用户列表
    setAllocRole: (params) => {
      return () => {
        return axios.post('role/AllocRole',params).then((res)=>{
          notification.success({
            message: '保存成功',
            description: res.info,
          })
        }).catch((err)=>{
          notification.error({
            message: '数据加载失败',
            description: err.message,
          })
        });
      }
    },//保存角色分配用户
    getRoleMenusEdit: (params,call) => {
      return (dispatch) => {
        return axios.post('role/RoleMenusEdit',params).then((res)=>{
          dispatch({
            type: PERMISSIONS_TREE,
            data: res.data
          })
          call(res.data)
        }).catch((err)=>{
          notification.error({
            message: '数据加载失败',
            description: err.message,
          })
        });
      }
    },//获取指定角色资源列表
    DeleteRole:(index,params)=>{
      return (dispatch) => {
        return axios.post('role/RoleDelete',params).then((res)=>{
          /*dispatch({
            type: PERMISSIONS_RESULT,
            list: this.state.get('list').delete(index)
          })*/
          notification.success({
            message: '删除成功',
            description: res.message,
          })
        }).catch((err)=>{
          notification.error({
            message: '数据加载失败',
            description: err.message,
          })
        });
      }
    },//删除角色
    saveRole:(index,params)=>{
      return (dispatch) => {
        return axios.post('role/RoleMenusEditSave',params).then((res)=>{
          dispatch({
            type: PERMISSIONS_RESULT,
            list: this.state.get('list').setIn([index],params)
          })
          notification.success({
            message: '保存成功',
            description: res.info,
          })
        }).catch((err)=>{
          notification.error({
            message: '数据加载失败',
            description: err.message,
          })
        });
      }
    },//保存角色修改
    CreatRole:(params)=>{
      return (dispatch) => {
        return axios.post('role/RoleMenusCreate',params).then((res)=>{
          dispatch({
            type: PERMISSIONS_RESULT,
            list: this.state.get('list').push(params)
          })
        }).catch((err)=>{
          notification.error({
            message: '数据加载失败',
            description: err.message,
          })
        });
      }
    }//创建新角色
  };

  handler = {
    [PERMISSIONS_RESULT](state, action){return state.set('list',Immutable.List(action.list)).set('load',action.load);},
    [PERMISSIONS_TREE](state, action){return state.set('data',Immutable.List(action.data));},
    [PERMISSIONS_ROLE_USERLIST](state, action){return state.set('roleuserlist',Immutable.List(action.roleuserlist));},

  }
};
