import React from 'react'
import HeaderComponent from '../../components/Header';
import User from "../../model/User"
import './CoreLayout.scss'
import { Layout, Breadcrumb} from 'antd';
const { Content,Footer } = Layout;
const BreadcrumbItem = Breadcrumb.Item;

export const CoreLayout = (props) => {
    let {children,location} = props;
    let paths = location.pathname.split('/').filter(item=>item);
   
   
   let breadConf=User.getBreadcrumbWithPath(paths);
    return (
    <Layout>
        <HeaderComponent/>
        <Content style={{ padding: '0 50px' }}>
            <Breadcrumb style={{ margin: '12px 0' }}>
                {
                    breadConf.map(item=>{
                       return  <BreadcrumbItem key={item.route}>{item.label}</BreadcrumbItem>
                    })
                }
            </Breadcrumb>
            {children}
        </Content>
        <Footer className="tms-footer" >
            <ul className="pull-left margin-left-lg ">
                <li><strong>商户</strong></li>
                <li><span className="circle "> </span><a target="_blank" href="http://www.wangpos.com">旺POS官网</a></li>
                <li><span className="circle "> </span><a target="_blank" href="http://mp.wangpos.com">商户平台</a></li>
            </ul>
            <ul className="pull-left margin-left-lg ">
                <li><strong>服务商</strong></li>
                <li><span className="circle"> </span><a target="_blank" href="http://posdl.wangpos.com">代理商/合作伙伴平台</a></li>
                <li><span className="circle"> </span><a target="_blank" href="http://bp.wangpos.com">BP开放平台</a></li>
                <li><span className="circle"> </span><a target="_blank" href="http://boss.wangpos.com">VN平台</a></li>

            </ul>
            <ul className="pull-left margin-left-lg ">
                <li><strong>运营服务</strong></li>
                <li><span className="circle"> </span><a target="_blank" href="http://pos.weipass.cn/PosAdmin/">运营支撑平台</a></li>
                <li><span className="circle"> </span><a target="_blank" href="http://jfop.wangpos.com/console/">金服运营平台</a></li>
            </ul>
            
            <div className="pull-right company-right">
                <div className="company-logo-desc">
                    <img src={require("./assets/wangPOS2.png")}/>
                    <div>
                        <span className="font-small ">@2016-2017</span>
                        <div><strong>北京微智全景信息技术有限公司</strong></div>
                        <div style={{marginTop:24}}><span className="text-info">TMS v1.0.1 </span>build 2016.12.19</div>
                    </div>
                </div>
               
            </div>

        </Footer>
    </Layout>
    )
};
 
CoreLayout.propTypes = {
  children : React.PropTypes.element.isRequired
};
export default CoreLayout
