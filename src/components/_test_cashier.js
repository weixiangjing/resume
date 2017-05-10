module.exports= {
    menus:[
        {
            name:"概况",
            route:"/cashier/home",
            icon:"bar-chart"
        },{
            name:"收银参数",
            icon:"calculator",
            isExpand:true,
            expandIcon:"up",
            collapseIcon:"down",
            children:[
                {
                    name:"单门店",
                    route:"/cashier/config/store"
                   
                },
                {
                    name:"多门店",
                    route:"/cashier/config/stores"
                  
                },
                {
                    name:"高级查询",
                    route:"/cashier/config/query"
                  
                }
            ]
        },{
            name:"基本信息",
            icon:"info-circle-o",
            isExpand:true,
            expandIcon:"up",
            collapseIcon:"down",
            children:[
                {
                    name:"通道列表",
                  
                    route:"/cashier/info/channel"

                },
                {
                    name:"手续费率",
                    route:"/cashier/info/profit"
                  
                }, {
                    name:"银行卡BIN",
                    route:"/cashier/info/bin"
                   
                }, {
                    name:"地区信息",
                    route:"/cashier/info/area"
                   
                },{
                    name:"通道服务商",
                    route:"/cashier/info/provider"
                   
                }
            ]
        }
    ]
}
