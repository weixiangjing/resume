import React from "react";
import {loadRoutes} from "../../util/routeUtil";
const Layout = ({children}) => (
    <div className="root-container clearfix">
        <div className='view-port-container'>{children}</div>
    </div>
);
module.exports = (store) => ({
    path       : '/account',
    component  : Layout,
    onEnter({location}, replace){
        var key  = "/account"
        let path = location.pathname;
        if (path === key || path === key.slice(1) || path === key + "/") {
            replace({pathname: '/account/login'});
        }
    },
    childRoutes: [
        ...loadRoutes(require('./routes'), store),
    ]
});
