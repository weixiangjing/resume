/**
 *  created by yaojun on 16/12/30
 *
 */
  


import React from "react";
    

export default class CustomIcon extends React.Component{
    /**
     * @protected
     */
    getTypes(){
        
    }
    render(){
        let props =this.props;
        let type =props.type;
        let width =this.width;
        let height =this.height;
        let source = this.source;
        let icon ={background:`url(img/${source}.png)  -${this.getTypes()[type]}px 0 no-repeat`}
        return (<div  className={`${props.className} inline-block`} style={{width,height,...icon}}></div>)
    }
    getIcon(index,offset=0){
        return this.width * index+offset;
    }
    static  propTypes={
        className:React.PropTypes.string,
        type:React.PropTypes.string.isRequired
    }
}