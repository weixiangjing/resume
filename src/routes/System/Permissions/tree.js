import { Tree } from 'antd';
import React from 'react';
import {in_array,unique} from '../../../util/helper';
const TreeNode = Tree.TreeNode;
const ADDROLE='ADDROLE';




const RightTree = React.createClass({
  getInitialState() {
    return {
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      treeId:''
    };
  },
  onExpand(expandedKeys) {
    console.log(expandedKeys);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  },
  onCheck(checkedKeys,info) {
    const {data,setcheckedKeys,getTree}=this.props;
    const pId=[];
    const forloop=(data,arr)=>data.map((item) => {
      arr.map((key)=>{if(key==item.res_id)item.checked=1;})
      if(item.checked==1){if(item.parent_id!=-1)pId.push(item.parent_id);}
    })
    const loop=data=>data.map((item) => {
      if(item.res_childs){
        loop(item.res_childs)
      }
      item.checked=0;
      for(let i=0;i<checkedKeys.length;i++){
        if(item.status==2&&checkedKeys[i]==item.res_id){checkedKeys.splice(i,1)}
        if(checkedKeys[i]==item.res_id){
          item.checked=1;
          pId.push(item.parent_id);
        }
      }
      forloop(data,unique(pId))
    })
    if(checkedKeys.length){loop(data)}else {
      const loopfor=data=>data.map((item) => {
        if(item.res_childs){loopfor(item.res_childs)}
        item.checked=0;
      })
      loopfor(data)
    };
    const index=[];
    const dataindex=[];
    for(let i=0;i<data.length;i++){
      if(data[i].res_childs){
        let childs=data[i].res_childs;
        for(let k=0;k<childs.length;k++){
          if(childs[k].checked!=0){index.push(i)}
        }
      }
      dataindex.push(i)
    }
    let arr=unique(index);
    for(let i=0;i<dataindex.length;i++){
      for(let v=0;v<arr.length;v++){
        if(dataindex[i]==arr[v]){dataindex.splice(i,1);}
      }
    }
    for(let i=0;i<dataindex.length;i++){data[dataindex[i]].checked=0;}
    for(let i=0;i<arr.length;i++){if(arr[i]!=undefined)data[arr[i]].checked=1;}
    this.setState({
      checkedKeys
    });
    getTree(data)
    setcheckedKeys(checkedKeys)
  },
  onSelect(selectedKeys, info) {
    console.log(info)
    this.setState({ selectedKeys });
  },
  render(props,state) {
    const {data,checkedKeys}=this.props;
    const loop = data => data.map((item) => {
      if (item.res_childs.length) {
        return (
          <TreeNode key={String(item.res_id)} title={<span>{item.res_type=='Action'?<i className="fa fa-toggle-right"></i>:<i className="fa fa-list"></i>}&nbsp;{item.res_name}</span>} disabled={item.status==2}>
            {loop(item.res_childs)}
          </TreeNode>
        );
      }
      return <TreeNode key={String(item.res_id)} title={<span>{item.res_type=='Action'?<i className="fa fa-toggle-right"></i>:<i className="fa fa-list"></i>}&nbsp;{item.res_name}</span>} disabled={item.status==2}/>;
    });
    return (<div>
        <p>权限列表：</p>
        <Tree
          checkable
          onExpand={this.onExpand} expandedKeys={this.state.expandedKeys}
          autoExpandParent={this.state.autoExpandParent}
          onCheck={this.onCheck} checkedKeys={checkedKeys}
          onSelect={this.onSelect} selectedKeys={this.state.selectedKeys}
        >
          {loop(data)}
        </Tree>
    </div>
    );
  },
});
export default RightTree;

