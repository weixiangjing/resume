/**
 *  created by yaojun on 17/1/6
 *
 */
  


    

export const SDK_CONF= [
    {
        key:"T1",value:"交易SDK V1"
    },{
        key:"C3",value:"收银SDK V3"
    },{
        key:"C1",value:"收银SDK V1"
    }
]

export function getValueWithKey(key){
    SDK_CONF.some(item=>{
        if(item.key==key){
            key=item.value;
            return true;
        }
        
    })
    return key;
    
}