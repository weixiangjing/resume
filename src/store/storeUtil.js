/**
 *  created by yaojun on 16/12/22
 *
 */
  


    

var localStore;

export function __initStore__(store){
    localStore=store;
}

export function dispatch(param){
    return localStore.dispatch(param);
}