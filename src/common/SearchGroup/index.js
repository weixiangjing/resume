/**
 *  created by yaojun on 2017/4/12
 *
 */
import React from "react";
import "./index.scss";
export class SearchGroupBordered extends React.Component {
    render() {
        let {group=[]}=this.props;
        return (
            <div className="search-group-bordered">
                {
                    group.map(item=> {
                        return <div key={item.title} className="row-item">
                            <label className="col-item"><span className="isRequired">{item.required?"*":""}</span>{item.title}:</label>
                            <div className="col-item">{item.content}</div>
                        </div>
                    })
                }
            </div>
        )
    }
}
