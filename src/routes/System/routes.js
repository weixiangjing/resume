module.exports = [
  {path: 'userbms', storeKey:'SystemUserBms',reducer:'System/UserBms/reducer', component: 'System/UserBms/component.js'},
  {path: 'permissions', storeKey:'SystemPermissions',reducer:'System/Permissions/reducer', component: 'System/Permissions/component'},
  {path: 'operationlog', storeKey:'SystemOperationLog',reducer:'System/OperationLog/reducer', component: 'System/OperationLog/component'},
  {path: 'set', storeKey:'SystemSetPermissions',reducer:'System/SetPermissions/reducer', component: 'System/SetPermissions/component'},

];
