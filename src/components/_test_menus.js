/**
 *  created by yaojun on 16/12/13
 *
 */





/**
 *  created by yaojun on 16/11/21
 *
 */





module.exports= {
    menus:[
      {
        name:'系统功能',
        icon:"info-circle-o",
        isExpand:true,
        expandIcon:"up",
        collapseIcon:"down",
        children:[
          {
            name:"用户管理",
            route:"/system/usertms",
            icon:"meh-o"
          },{
            name:"角色权限管理",
            route:"/system/permissions",
            icon:"meh-o"
          },{
            name:"权限设置",
            route:"/system/set",
            icon:"meh-o"
          },{
            name:"操作日志",
            route:"/system/operationlog",
            icon:"meh-o"
          },
        ]
      }
    
    ]
}
