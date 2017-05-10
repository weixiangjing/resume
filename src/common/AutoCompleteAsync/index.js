import React from "react";
import ReactDOM from "react-dom";
import {Input} from "antd";
import axios from "axios";
import "./index.scss";
export const MOUNT_NODE=document.querySelector("#drop-options-container");
export default class AutoComplete extends React.Component {
    activeIndex      =0;
    options          =[]
    state            ={
        value: "",
        selectItem: {}
    }
    static colls=[];
    static clear (valueKes){
        let items=[]
        if(valueKes){
          items=AutoComplete.colls.filter(item=>valueKes.indexOf(item.props.valueKey)>-1);
        }else{
            items=AutoComplete.colls;
        }
        items.forEach((item)=>item.clear());
    }
    static  propTypes={
        url       : React.PropTypes.string.isRequired,
        requestKey: React.PropTypes.string.isRequired,
        params    : React.PropTypes.object,
        labelKey  : React.PropTypes.string.isRequired,
        valueKey  : React.PropTypes.string.isRequired,
        style:React.PropTypes.object,
        className:React.PropTypes.string,
        placeholder:React.PropTypes.string
    }
    init=false;
    clear(){
        this.setState({value:"",selectItem:{}});
        this.props.onChange&& this.props.onChange("");
    }
    handleChange(e) {

        this.setState({value: e.target.value});
        let rect    =e.target.getBoundingClientRect();
        let _rect   ={}
        _rect.top   =rect.top+document.body.scrollTop;
        _rect.left  =rect.left+document.body.scrollLeft;
        _rect.height=rect.height;
        _rect.width =rect.width;
        this._rect  =_rect;
        let params  =this.props.params||{};

        if(!e.target.value.trim()) {
            this.closeOptions();
            this.props.onChange && this.props.onChange("");
            return;
        };
        axios.post(this.props.url, {...params, [this.props.requestKey]: e.target.value.trim(), hideLoading: true}).then(res=> {
            let {labelKey, valueKey} =this.props;
            let opts                 =res.data.map(item=> {
                item["label"]=item[labelKey]+"("+item[valueKey]+")";
                item["value"]=item[valueKey];
                return item;
            });
            this.options             =opts;
            this.renderOptions(opts, _rect);
        });
    }

    renderOptions(options=[], rect, activeIndex=0) {
        if(this.state.value.trim())
        ReactDOM.render(<DropItem onSelect={(item)=>this.onSelect(item)} rect={rect} activeIndex={activeIndex} options={options}/>, MOUNT_NODE);
    }

    componentWillUnmount() {
      this.closeOptions();
        let index =AutoComplete.colls.findIndex((item)=>this==item);
        AutoComplete.colls.splice(index,1);
    }
    closeOptions(){
        ReactDOM.unmountComponentAtNode(MOUNT_NODE);
        this.activeIndex=0;
        this.options=[];
    }
    componentWillMount(){
        AutoComplete.colls.push(this);
    }

    handleDown(e) {
        if(this.options.length==0) return;
        let index=0;
        switch(e.keyCode) {
            case  40:
                index=this.activeIndex;
                if(index===this.options.length-1) {
                    this.activeIndex=0;
                } else {
                    this.activeIndex+=1;
                }
                this.renderOptions(this.options, this._rect, this.activeIndex);
                break;//down
            case  38:
                index=this.activeIndex;
                if(index===0) {
                    return;
                } else {
                    this.activeIndex-=1;
                }
                this.renderOptions(this.options, this._rect, this.activeIndex);
                break;//up
            case 13:
                // select
                if(!this.state.value.trim()) return
                let item=this.options[this.activeIndex];
                this.onSelect(item);
                break;
        }
    }

    onSelect(item) {
        if(item) {

            if(this.props.inForm){
                this.props.onChange(item.value,item);
            }else{
                this.setState({value: item.label, selectItem: item});
                this.props.onChange && this.props.onChange(item.value,item);
            }
        }
        this.closeOptions();

    }
    handleFocus(e){
        if(this._rect){
            e.stopPropagation();
            let value =e.target.value;
            if(!value.trim()) return;
            this.renderOptions(this.options,this._rect,0);

        }

    }

    render() {
        let {value,inForm=true,style,placeholder} =this.props;
        return (
            <div className="auto-complete-async">
                <Input onClick={(e)=>e.stopPropagation()} onKeyDown={(e)=>this.handleDown(e)}
                       onFocus={(e)=>this.handleFocus(e)}
                       onCompositionEnd={(e)=> {
                           this.lock=false
                           this.handleChange(e)
                       }}
                       placeholder={placeholder}
                       style={style}
                       value={this.state.value}
                       onChange={(e)=>this.handleChange(e)}

                />
            </div>
        )
    }
}
class DropItem extends React.Component {
    static propTypes={
        options    : React.PropTypes.array.isRequired,
        rect       : React.PropTypes.object.isRequired,
        activeIndex: React.PropTypes.number.isRequired,
        onSelect:React.PropTypes.func.isRequired
    }

    handleSelect(e) {
        this.props.onSelect(e);
    }

    saveRef(ref, index) {
        this.__refs[index]=ref;
        window.rr         =ref;
    }

    static MAX_HEIGHT=260;
           __refs    =[]

    render() {
        let {options =[], rect, activeIndex} =this.props;
        let activeRef=this.__refs[activeIndex];
        if(activeRef) {
            if(activeRef.offsetTop>DropItem.MAX_HEIGHT-activeRef.clientHeight) {
                this.container.scrollTop+=activeRef.clientHeight;
            } else {
                let top                 =this.container.scrollTop-activeRef.clientHeight
                this.container.scrollTop=top<=0 ? 0 : top;
            }
        }
        return (

            <ul ref={ref=>this.container=ref} style={{
                left: rect.left, top: rect.top+rect.height+10, width: rect.width, maxHeight: DropItem.MAX_HEIGHT
            }} className="auto-complete-drop-container">
                {
                    options.map((item, index)=> {
                        return (<li ref={(ref)=>this.saveRef(ref, index)} className={activeIndex===index ? "on" : ""}
                                    onClick={()=>this.handleSelect(item)}
                                    key={item.value}>{item.label}</li>)
                    })

                }

            </ul>

           );
    }
}

window.auto=AutoComplete;
