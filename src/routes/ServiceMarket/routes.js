module.exports = [
    {path: 'home', keepAlive: true, component: 'ServiceMarket/Home/index'},
    {path        : 'service/info',
        storeKey : "ServiceInfo",
        keepAlive: true,
        component: 'ServiceMarket/Services/Info/component.js',
        reducer  : "ServiceMarket/Services/Info/reducer.js",
        children:[
            {
                storeKey:"ServiceInfoAlter",
                component:"ServiceMarket/Services/Alter/component.js",
                reducer  : "ServiceMarket/Services/Alter/reducer.js",
                path:"update"
            }
        ]
    },
    {path        : 'service/prod',
        storeKey : "ServiceProd",
        keepAlive: true,
        component: 'ServiceMarket/Services/Prod/component.js',
        reducer  : "ServiceMarket/Services/Prod/reducer.js"
    },
    {path        : 'license/update',
        storeKey : "LicenseAlter",
        keepAlive: true,
        component: 'ServiceMarket/License/Alter/component.js',
        reducer  : "ServiceMarket/License/Alter/reducer.js"
    },
    {path        : 'license/query',
        storeKey : "LicenseQuery",
        keepAlive: true,
        component: 'ServiceMarket/License/Query/component.js',
        reducer  : "ServiceMarket/License/Query/reducer.js",
        children:[
            {
                component:"ServiceMarket/License/Query/Detail/index.js",
                path:"detail"
            }
        ]
    },
    {path        : 'sales/activity',
        storeKey : "SalesActivity",
        keepAlive: true,
        component: 'ServiceMarket/Sales/Activity/component.js',
        reducer  : "ServiceMarket/Sales/Activity/reducer.js",
        children:[
            {
                storeKey:"SalesActivityAlter",
                component:"ServiceMarket/Sales/Activity/Alter/index.js",
                reducer:"ServiceMarket/Sales/Activity/Alter/reducer.js",
                path:'update'
            }
        ]
    },
    {path        : 'sales/setting',
        storeKey : "SalesSetting",
        keepAlive: true,
        component: 'ServiceMarket/Sales/Setting/component.js',
        reducer  : "ServiceMarket/Sales/Setting/reducer.js"
    },
    {path        : 'sales/state',
        storeKey : "SalesState",
        keepAlive: true,
        component: 'ServiceMarket/Sales/State/component.js',
        reducer  : "ServiceMarket/Sales/State/reducer.js"
    },
    {path        : 'sales/package',
        storeKey : "SalesPackage",
        keepAlive: true,
        component: 'ServiceMarket/Sales/Package/component.js',
        reducer  : "ServiceMarket/Sales/Package/reducer.js",
        children:[
            {
                storeKey:"SalesPackageAlter",
                component:"ServiceMarket/Sales/Package/Alter/index.js",
                reducer:"ServiceMarket/Sales/Package/Alter/reducer.js",
                path:'update'
            }
        ]
    },
];
