import React from 'react';
import { Form, Icon, Input, Button, Checkbox ,notification,Spin,Modal} from 'antd';
import './index.scss';
import axios from 'axios';
import User from '../../../model/User';
import OldPathName from '../../../model/SavePathName';
const userSave='BmsSave';
const LoginTime='Bms_Login_Time';
const SavePawTime=1000*60*60*24*7;//保存密码周期
const SaveLoginTime = 1000*60*30;//保存登录周期

export function getStore(key) {
  var obj = localStorage.getItem(key);
  try {
    obj = JSON.parse(obj);
  } catch (e) {
  }
  return obj || null;
}
export function setStore(k,v) {localStorage.setItem(k,typeof v=== "object" ? JSON.stringify(v) : v );}

{
  let lastLogin=getStore(LoginTime);
  if(lastLogin&&(Date.now()-new Date(lastLogin)>=SavePawTime)){
    if(getStore(userSave)){
      let newU=getStore(userSave);
      newU.password='';
      newU.remember=false;
      setStore(userSave,newU);
    }
    setStore(LoginTime,null)
  }
}
class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {loading: false,isShowForm:true,loginErr:''}
    }
    componentWillMount(){
      const sys_no=this.props.router.location.query.sys_no;//系统编码
      const url=this.props.router.location.query.origin;//回调根地址
      const login=this.props.router.location.query.login;//回调地址login路由
      const systems=this.props.router.location.query.systems;//回调地址系统选择路由
      let to_url=OldPathName.pathname;//跳转页面--
      const query=this.props.router.location.query;
      if(url){
        this.setState({isShowForm:false})
        const href=location.href;
        const host=href.split("?");
        User.tokenLogin(query,host[0]).then(({userMenus}) => {
          if (userMenus.length > 0) {
            this.setState({loginErr:""})
            if(to_url){
              this.props.router.push(to_url);
            }else {
              this.props.router.push(Object.keys(User.authMap)[0]);
            }
          } else {
            notification.error({
              message: '无效用户'
            })
            this.setState({loginErr:"无效用户"})
          }
        }).catch((err) => {
          this.setState({loginErr:err.message})
          Modal.error({
            title     : '错误提示',
            content   : err.message,
            okText    : '确认',
            closable    :false,
            maskClosable    :false,
            onOk() {
              window.close();
            },
          });
        });
      }else {
        this.setState({isShowForm:true})
      }
    }
    render() {
        var form                                                  = this.props.form;
        const {getFieldDecorator, getFieldsValue, validateFields} = form;
        const FormItem                                            = Form.Item;
        const userNameFun                                         = () => {
            if (getStore(userSave)) {
                if (getStore(userSave).remember || getStore(userSave).username) {
                    return getStore(userSave);
                }
            } else {
                return {
                    username: '',
                    password: '',
                    remember: false
                }
            }
        }
      const {isShowForm,loading,loginErr}=this.state;
      return (

            <div className="login-content">

              {isShowForm&&<Form onSubmit={(e) => {
                    e.preventDefault();
                    validateFields((err, value) => {
                        if (!err) {
                            const parmas={
                              username:value.username.trim(),
                              password:value.password.trim(),
                              remember:value.remember
                            }
                            if (value.remember) {
                                setStore(userSave, parmas)
                            }
                            if (!getStore(LoginTime) && value.remember) {
                                setStore(LoginTime, new Date())
                            }
                            this.setState({loading: true})
                            User.login(parmas).then(({userMenus}) => {
                                if (userMenus.length > 0) {
                                    console.log(Object.keys(User.authMap)[0])
                                    this.props.router.push(Object.keys(User.authMap)[0]);
                                } else {
                                    notification.error({
                                        message: '无效用户'
                                    })
                                    this.setState({loading: false})
                                }
                            }).catch((err) => {
                                this.setState({loading: false})
                            });
                        }
                    })
                }} className="login-dialog">
                    <div style={{borderBottom: '1px solid #ddd', marginBottom: 15}}>
                        <h4>登录</h4>
                    </div>
                    <FormItem>
                        {getFieldDecorator('username', {
                            initialValue: userNameFun().username,
                            rules       : [{required: true, message: '请输入您的登录账号'}],
                        })(
                            <Input addonBefore={<Icon type="user"/>} placeholder="请输入您的登录账号"/>
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password', {
                            initialValue: userNameFun().password,
                            rules       : [{required: true, message: '请输入您的登录密码'}],
                        })(
                            <Input addonBefore={<Icon type="lock"/>} type="password" placeholder="请输入您的登录密码"/>
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('remember', {
                            valuePropName: 'checked',
                            initialValue : userNameFun().remember,
                        })(
                            <Checkbox>记住密码</Checkbox>
                        )}


                    </FormItem>

                    <FormItem>
                        <Button type="primary" htmlType="submit" className="login-form-button"
                                loading={loading}>
                            登录
                        </Button>
                    </FormItem>
                </Form>}
              {!isShowForm&&
                <Spin size="large" tip={`${loginErr?loginErr:"正在登录系统，请销后..."}`}>
                  <div style={{height:200}}></div>
                </Spin>
              }
            </div>
        );
    }
}

export default Form.create()(Login);


