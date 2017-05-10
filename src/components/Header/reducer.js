/**
 * Created by yaojun on 16/11/3.
 */

export const CHANGE_USER = "CHANGE_USER";
export const CHANGE_FUNC_LIST = "CHANGE_FUNC_LIST"
export const SYNC_ACTION_ERROR="@@sync_action_error";


export const changeUser = (user)=>({type: CHANGE_USER, user})
export const changeFunc = (list)=>({type: CHANGE_FUNC_LIST, list});
export const initialState = {
    systemName: "代理商/合作伙伴平台",
    user: {}

}
export const ACTION_HANDLERS = {
    [SYNC_ACTION_ERROR]:(a,action)=>{
        return a;
    },
    [CHANGE_USER]: (state, action)=> {
        return Object.assign({},{user:action.user,systemName:"代理商平台"})
    }, [CHANGE_FUNC_LIST]: (state, list)=> {
        return state
    }
}


