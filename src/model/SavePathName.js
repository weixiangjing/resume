"use strict";
class OldPathName {
  constructor() {
    this.pathname   = null;
    //
    window.OldPathName     = this;
    const cacheUser = getPathNameStore();
    if (cacheUser) this.setValue(cacheUser);
  }
  setValue(data) {
    this.pathname=data;
    storePathNameInfo(data);
  }



  logout() {
    this.pathname   = null;
    storePathNameInfo(null);
  }
}
OldPathName.STORE_KEY = 'old_path_name';
function storePathNameInfo(data) {
  if (data) {
    sessionStorage.setItem(OldPathName.STORE_KEY, data);
  } else {
    sessionStorage.removeItem(OldPathName.STORE_KEY);
  }
}
function getPathNameStore() {
  let pathname = sessionStorage.getItem(OldPathName.STORE_KEY);
  if (!pathname)return null;
  return pathname;
}

const singleInstance    = new OldPathName();
singleInstance.getClass = () => {
  return OldPathName
};
export default singleInstance;
