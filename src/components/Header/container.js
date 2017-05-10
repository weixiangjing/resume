/**
 * Created by yaojun on 16/11/2.
 */

import Header  from './Header';
import {connect} from "react-redux";

import {changeFunc,changeUser} from "./reducer";

const mapDispatchToProps={changeFunc,changeUser};


const mapStateToProps = (state)=>{
    return {user:state.user}
}

export default connect(mapStateToProps,mapDispatchToProps)(Header)