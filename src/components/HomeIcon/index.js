

import React from "react";
import CustomIcon from "./CustomIcon";
export class  Icon60 extends CustomIcon{
    getTypes(){
        return {
            "home":0,
            "device":60,
            "stat":120,
            "stat-warn":180,
            "list":240,
            "amount":300
        }
    
    }
    width=60;
    height=60;
    source="icon_60"; // public/img/icon_60.png;
}

export class Icon32 extends  CustomIcon{
    width=32;
    height=32;
    source="icon32";
    getTypes(){
        return {
            "stat":0,
            "list":this.getIcon(1),
            "amount":this.getIcon(2),
            "amount-o":this.getIcon(3),
            "home":this.getIcon(4),
            "device":this.getIcon(5),
            "address":this.getIcon(6)
        }
    }
}


