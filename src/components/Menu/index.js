"use strict";
import {Icon, Layout, Menu} from "antd";
import React from "react";
import "./menu.scss";
const {Sider}   = Layout;
const {SubMenu} = Menu;
class MenuComponent extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            selectedKeys: [], openKeys: []
        }
    }

    static contextTypes={
        router: React.PropTypes.object
    };

    componentWillReceiveProps() {
        let name=this.context.router.location.pathname
        name    =name.split("/").slice(0, 4).join('/');
        this.setState({selectedKeys: [name]});
    }

    componentDidMount() {
        let name=this.context.router.location.pathname
        name    =name.split("/").slice(0, 4).join('/');
        this.setState({selectedKeys: [this.context.router.location.pathname]});
    }

    componentWillMount() {
        let openKeys=[];
        let items   =this.props.items||[];
        if(items.length==0) {
            throw  new Error("无权访问");
        }
        items.map(item=> {
            if(item.children) openKeys.push(item.name);
        });

    }

    onTitleClick(e) {
        let fullPath=this.context.router.getCurrentLocation().pathname
        let key=e.key;
        if(key!==fullPath&&fullPath.indexOf(key)===0) {

            this.context.router.goBack();
        }
    }

    handelMenuItemSelect(item) {

        this.context.router.push(item.key);
    }
    onOpenChange = (openKeys) => {
       if(openKeys.length>1){
           let key =openKeys.slice(-1);
           this.setState({openKeys:key});
       }else{
           this.setState({openKeys:openKeys});
       }

    }

    render() {
        let menu     =this.props.items||[]
        let menuClass=this.props.menuClass||"";
        return <Sider className="slide-bar">
            <Menu onClick={(e)=>this.onTitleClick(e)} mode="inline"
                  selectedKeys={this.state.selectedKeys}
                  openKeys={this.state.openKeys}
                  onOpenChange={this.onOpenChange}
                  onSelect={this.handelMenuItemSelect.bind(this)} className={menuClass}>
                {menu.map((menu)=> {
                    let children=menu.children;
                    if(children) {
                        return <SubMenu key={menu.name}
                                        title={<span><i className={`fa fa-${menu.icon_url}`}/>{menu.name}</span>}>
                            {children.map(item=> {
                                return <Menu.Item
                                    key={"/"+item.route}>{item.name}</Menu.Item>
                            })}
                        </SubMenu>
                    } else {
                        return <Menu.Item className="final"
                                          key={"/"+menu.route}><Icon type={menu.icon}/>
                            <i className={`fa fa-${menu.icon_url}`}/>
                            {menu.name}</Menu.Item>
                    }
                })}
            </Menu>
        </Sider>
    }
}
export default MenuComponent;