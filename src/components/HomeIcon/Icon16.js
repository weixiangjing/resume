/**
 *  created by yaojun on 16/12/30
 *
 */



import CustomIcon from "./CustomIcon";



export default class Icon16 extends CustomIcon{
    width=16;
    height=16;
    source="icon16";
    getTypes(){
        return {
            "text":this.getIcon(0),
            "textarea":this.getIcon(0),
            "file":this.getIcon(5),
            "button":this.getIcon(4),
            "radio":this.getIcon(2),
            "checkbox":this.getIcon(3),
            "select":this.getIcon(1),
            "datetime":this.getIcon(6),
            "notice":this.getIcon(7),
            "store":this.getIcon(8),
            "terminal":this.getIcon(9)
        }
      
    }
    
}


    

