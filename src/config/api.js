/**
 *  created by yaojun on 17/2/24
 *
 */





export const BASE_URL="/api/";














export function getApi(api=""){
    if(api[0]=="/"){
       api=api.slice(1);
    }
    return BASE_URL+api;
}
