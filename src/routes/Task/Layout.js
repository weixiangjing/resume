import React from 'react'
import {loadRoutes} from '../../util/routeUtil'
import {Layout} from 'antd';
import "./layout.scss";
const {Content} = Layout;

const LayoutComponent = ({ children }) => (
    <Layout className="view-port-container task-container">
        <Content className="view-port-content">
            {children}
        </Content>
    </Layout>
);

const ROOT = '/task';
module.exports = (store) => ({
    path: ROOT,
    component: LayoutComponent,
    //onChange(prevState, nextState, replace, callback){
    //    if(nextState.location.pathname==ROOT){
    //        let route = User.getFirstRouteByRoot(ROOT);
    //        if(route)replace({pathname:route});
    //    }
    //    callback();
    //},
    childRoutes: [
        ...loadRoutes(require('./routes'), store),
    ]
});
