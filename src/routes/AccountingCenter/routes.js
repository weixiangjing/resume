module.exports = [
  {path: 'home', storeKey:'AccountHome',reducer: 'AccountingCenter/Home/reducer', component: 'AccountingCenter/Home/component'},
  {path: 'list/billtms',
    storeKey:'AccountBillTms',
    reducer: 'AccountingCenter/BillTms/reducer',
    component: 'AccountingCenter/BillTms/component',
    keepAlive: true,
    children:[
      {path: 'details', storeKey:'AccountBillTmsDetail', reducer: 'AccountingCenter/BillTms/details/reducer', component: 'AccountingCenter/BillTms/details/component'},
    ]
  },
  {path: 'billing/querya',
    storeKey:'AccountBillingQ',
    reducer: 'AccountingCenter/BillingAccount/AccountQuery/reducer',
    component: 'AccountingCenter/BillingAccount/AccountQuery/component',
    keepAlive: true,
    children:[
      {path: 'details', storeKey:'AccountBillingQDetail', reducer: 'AccountingCenter/BillingAccount/AccountQuery/details/reducer', component: 'AccountingCenter/BillingAccount/AccountQuery/details/component'},
    ]
  },
  {path: 'billing/queryr', storeKey:'AccountRunningQ', reducer: 'AccountingCenter/BillingAccount/RunningQuery/reducer', component: 'AccountingCenter/BillingAccount/RunningQuery/component'},
  {path: 'billing/topup',
    storeKey:'AccountCenterRecharge',
    reducer: 'AccountingCenter/BillingAccount/Recharge/reducer',
    component: 'AccountingCenter/BillingAccount/Recharge/component',
    keepAlive: true,
    children:[
      {path: 'details', storeKey:'AccountCenterRechargeDetail', reducer: 'AccountingCenter/BillingAccount/Recharge/details/reducer', component: 'AccountingCenter/BillingAccount/Recharge/details/component'},
    ]
  },
  {path: 'buyed/servicelist', storeKey:'AccountCenterBuyedService', reducer: 'AccountingCenter/BuyedService/ServiceList/reducer', component: 'AccountingCenter/BuyedService/ServiceList/component'},
  {path: 'buyed/query', storeKey:'AccountCenterBuyedAllowance', reducer: 'AccountingCenter/BuyedService/AllowanceQuery/reducer', component: 'AccountingCenter/BuyedService/AllowanceQuery/component'},
  {path: 'buyed/overdue', storeKey:'AccountCenterBuyedOverdue', reducer: 'AccountingCenter/BuyedService/OverdueQuery/reducer', component: 'AccountingCenter/BuyedService/OverdueQuery/component'},
  {path: 'buyed/beyond', storeKey:'AccountCenterBuyedBeyond', reducer: 'AccountingCenter/BuyedService/BeyondQuery/reducer', component: 'AccountingCenter/BuyedService/BeyondQuery/component'},
  
  
  
  
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

];
