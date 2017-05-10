import axios from 'axios';
import {notification} from 'antd';

const Immutable                 = require('immutable');
export const handler           = {}
export const initialState       = ()=>{
  return Immutable.fromJS({

  });
}
export const UserStatusSwitch=(params)=>{return axios.post('user/UserStatusSwitch',params)};//修改用户状态
export const DeleteUser=(params)=>{return axios.post('user/UserDelete',params)};//删除用户
export const ModifyUser=(params)=>{return axios.post('user/UserEditSave',params)};//编辑用户
export const NewUser=(params)=>{return axios.post('user/NewUser',params)};//新建用户
