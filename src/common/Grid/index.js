import React from "react";
import "./index.scss";
const TypeNumber=React.PropTypes.number;
/**
 *
 * 相对于父容器宽度布局
 */
export class Col extends React.Component {
    static id       =0;
    static propTypes={
        xs: TypeNumber, //< 468
        sm: TypeNumber,// >468
        md: TypeNumber,// >768
        lg: TypeNumber,// >992
        xl: TypeNumber,// >1200
        w:TypeNumber
    }
    static Size     ={
        sm: 468, md: 768, lg: 992, xl: 1200
    }
    getSize() {
        let {xs, sm, md, lg, xl, width} =this.props;
        let useSize
        if(width<Col.Size.sm) {
            useSize=xs;
        } else if(width>Col.Size.sm&&width<Col.Size.md) {
            useSize=sm;
        } else if(width>Col.Size.md&&width<Col.Size.lg) {
            useSize=md;
        } else if(width>Col.Size.lg&&width<Col.Size.xl) {
            useSize=lg;
        } else if(width>Col.Size.xl) {
            useSize=xl;
        }
        return useSize;
    }

    render() {
        let {className, padding, children, grid}=this.props
        let percentage                          =this.getSize()/grid*100;
        return (
            <div style={{width: `${percentage}%`, padding}} className={`grid-col ${className}`}>
                {children}
            </div>
        )
    }
}
export class Row extends React.Component {
    id    =(Math.random())+"";
    offset=0;
    state ={
        width: 0
    }
    static propTypes={
        gutter: React.PropTypes.number, gird: React.PropTypes.number
    }

    componentDidMount() {

        this.container=this.refs[this.id];
        let rect      =this.container.getBoundingClientRect();
        this.width    =rect.width;
        this.offset   =window.innerWidth-this.width;
        Grid.addEvent(this);
    }

    onResize(clientWidth) {
        let width =clientWidth-this.offset
        if(width === this.state.width) return ;
        this.setState({width})
    }

    render() {
        let {children, className, style, gutter, grid=12} =this.props;
        children                                     =React.Children.map(children, (item)=> {
            let pad={}
            if(gutter) {
                pad.padding=gutter
            }
            return React.cloneElement(item, Object.assign({}, item.props, {grid, width: this.state.width, ...pad}));
        })
        return (<div style={style} className={`grid-row ${className||""}`} ref={this.id}>

            {children}
        </div>)
    }
}
class Grid {
    static  timer   =0;
    static  handlers=[];
    static  initEvent() {
        this.width=window.innerWidth;
        window.addEventListener("resize", Grid.handleResize, false);
    }
    static changeCount    =0;
    static lastChangeCount=0;
    static handleResize() {
        if(Grid.timer===0) {
            Grid.timer=setInterval(()=> {
                if(Grid.lastChangeCount===Grid.changeCount) {
                    clearInterval(Grid.timer);
                    Grid.timer=Grid.lastChangeCount=Grid.changeCount=0;
                    Grid.handlers.forEach(gridItem=> {
                        gridItem.onResize(window.innerWidth)
                    });
                }
                Grid.lastChangeCount=Grid.changeCount;
            }, 300);
        }
        Grid.changeCount+=1;
    }
    static addEvent(grid) {
        this.handlers.push(grid);
        grid.onResize(grid.width);
    }
    static removeEvent(grid) {
        Grid.handlers.splice(Grid.handlers.findIndex(grid), 1);
    }
}
Grid.initEvent();