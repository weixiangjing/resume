import React from 'react'
import {loadRoutes} from '../../util/routeUtil';
import SlideMenu from "../../components/Menu/index";
import User from "../../model/User";
import {Layout} from 'antd';
const {Content} = Layout;

const LayoutComponent = ({ children }) => (
  <Layout className="view-port-container">
    <SlideMenu items={User.getSecondMenus()}/>
    <Content className="view-port-content">
      {children}
    </Content>
  </Layout>
);

const ROOT = '/accenter';
module.exports = (store) => ({
  path: ROOT,
  component: LayoutComponent,
  onChange(prevState, nextState, replace, callback){
    if(nextState.location.pathname==ROOT){
      let route = User.getFirstRouteByRoot(ROOT);
      console.log('route',route);
      if(route)replace({pathname:route});
    }
    callback();
  },
  childRoutes: [
    ...loadRoutes(require('./routes'),store),
  ]
});
