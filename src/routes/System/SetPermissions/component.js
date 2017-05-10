
import React from 'react';
import { Tree, Input ,Button,notification,Icon,Menu, Dropdown,Row,Col,Modal,Spin} from 'antd';
import SetForm from './setForm';
import './style.scss';
import User from '../../../model/User';

const TreeNode = Tree.TreeNode;
const Search = Input.Search;
const MINUS = 'MINUS';

const dataList = [];
const generateList = (data) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const key = node.id;
    dataList.push({ key, res_name: node.res_name });
    if (node.res_childs) {
      generateList(node.res_childs, node.id);
    }
  }
};

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.res_childs) {
      if (node.res_childs.some(item => item.id === key)) {
        parentKey = node.id;
      } else if (getParentKey(key, node.res_childs)) {
        parentKey = getParentKey(key, node.res_childs);
      }
    }
  }
  return parentKey;
};
export default React.createClass({
  getInitialState() {
    return {
      gData:[],
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      visible:false,
      keySelect:'',
      disabled:true,
      selectedKeys:[],
      SelectData:'',
      str:'',
      loading:false,
      Treeloading:true,
      IsDrag:false
    };
  },
  componentWillMount(){
    this.props.getResourceList(this.callback)
  },
  callback(obj){
    this.setState({
      Treeloading:false,
      gData:obj
    })
  },
  onDragEnter(info) {
    //console.log(info);
    // expandedKeys 需要受控时设置
     this.setState({
       IsDrag:true
     });
  },
  onDrop(info) {
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    // const dragNodesKeys = info.dragNodesKeys;
  const loop = (data, key, callback) => {
    data.forEach((item, index, arr) => {
      if (item.id == key) {
        return callback(item, index, arr);
      }
      if (item.res_childs) {
        return loop(item.res_childs, key, callback);
      }
    });
  };
  const data = [...this.state.gData];
    let dragObj;
  loop(data, dragKey, (item, index, arr) => {
    arr.splice(index, 1);
    dragObj = item;
  });
    if (info.dropToGap) {
    let ar;
    let i;
    loop(data, dropKey, (item, index, arr) => {
      ar = arr;
      i = index;
    });
      ar.splice(i+1, 0, dragObj);//拖到指定元素下方
      //ar.splice(i, 0, dragObj);//拖到指定元素上方
  } else {
      loop(data, dropKey, (item) => {
      item.res_childs = item.res_childs || [];
      // where to insert 示例添加到尾部，可以是随意位置
      item.res_childs.push(dragObj);
    });
  }
    this.setState({
    gData: data,
  });
},
  onExpand  (expandedKeys) {
  this.setState({
    expandedKeys,
    autoExpandParent: false,
  });
},
  onChange(e) {
  const value = e.target.value;
    const {gData}=this.state;
  const expandedKeys = [];
  dataList.forEach((item) => {
    if (item.res_name.indexOf(value) > -1) {
      expandedKeys.push(getParentKey(item.key,gData));
    }
  });
  const uniqueExpandedKeys = [];
  expandedKeys.forEach((item) => {
    if (item && uniqueExpandedKeys.indexOf(item) === -1) {
      uniqueExpandedKeys.push(String(item));
    }
  });
    this.setState({
    expandedKeys: uniqueExpandedKeys,
    searchValue: value,
    autoExpandParent: true,
  });
},
  onSelect( selectedKeys,info){
    const key=selectedKeys+''
    const isNew=selectedKeys=='new'?false:true;
    this.setState({
      keySelect:selectedKeys,
      visible:true,
      disabled:isNew,
      SelectData:info,
      selectedKeys:[key],
    })
  },
  handleCreate(){
    const setForm=this.Form;
    const {gData,SelectData,keySelect,str,IsDrag}=this.state;
    var through=false;
    const loop=(data,id)=>data.map((item,index)=>{
      if(item.res_childs){
        loop(item.res_childs,item.id)
      }
      if(item.res_childs==undefined)item.res_childs=[];
      item.parent_id=id;
      item.sort_num=index;
    })
    if(setForm){
      setForm.validateFields((err, values) => {
        if (err) {return;}
        for(let k in values){if(k!='status'&&values[k]){values[k]=values[k].trim();}}
        for(let key in SelectData){
          for(let v in values){
            if(key==v){
              if(SelectData[key]!=values[v])through=true;
            }
          }
        }
        if(keySelect=='new')through=true;
        if(through==false&&IsDrag==false){
          notification.warning({
            message: '未作任何修改',
          })
          return false;
        }
        this.setState({loading:true})
        const loopData=(data)=>data.map((item)=>{
          if(keySelect==item.id){
            for(let i=0;i<data.length;i++){
              if(keySelect==data[i].id) {
                data[i]=values;
                if(keySelect!='new')data[i].id=keySelect;
              }
            }
          }else if(item.res_childs){
            loopData(item.res_childs,item.id)
            if(keySelect=='new'){
              values.parent_id=item.id;
            }
          }
        })
        loopData(gData);
        loop(gData,-1)
        const prams={
          operator_id:User.userid,
          res_list:gData
        }
        this.props.ResourceNew(prams).then(()=>{
          this.props.getResourceList(this.callback)
          this.setState({
            visible: false ,
            gData:gData,
            keySelect:'',
            loading:false,
            IsDrag:false
          });
        });
        setForm.resetFields();
      });
    }else {
      if(IsDrag==false){
        notification.warning({
          message: '未作任何修改',
        })
        return false;
      }
      loop(gData,-1);
      const prams={operator_id:User.userid, res_list:gData};
      this.setState({loading:true})
      this.props.ResourceNew(prams).then(()=>{
        this.props.getResourceList(this.callback)
        this.setState({
          visible: false ,
          gData:gData,
          keySelect:'',
          loading:false,
          IsDrag:false
        });
      });
    }
  },
  setForm(form){this.Form=form},
  onEdit(){
    this.setState({
      disabled:false
    })
  },
  onMinus(key,str,name){
    const {gData}=this.state;
    const loop=data =>data.map((item)=>{
      if(key==item.id){
        for(let i=0;i<data.length;i++){
          if(key==data[i].id) {
            data.splice(i,1)
          }
        }
      }else if(item.res_childs){
        loop(item.res_childs)
      }
    })
    loop(gData);
    const parmas={
      operator_id:String(User.userid),
      res_id:key,
      res_name:name
    }
    const me=this;
    Modal.confirm({
      title: '提示',
      content: `是否要删除“${name}”？`,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        if(key=='new'){
          me.props.getResourceList(me.callback);
          me.setState({visible:false,keySelect:'',})
        }
        else {
          me.props.DeleteResource(parmas).then(()=>{
            me.props.getResourceList(me.callback)
            me.setState({
              gData:gData,
              visible:false,
              keySelect:'',
              str:str
            })
          });
        }
      },
      onCancel() {},
    });
  },
  onAdd(key,str){
    const {gData,expandedKeys}=this.state;
    const newData={res_name:'新标题', id:'new',res_childs:[]};
    var not=true;
    const ret=data=>data.map((item)=>{
      if(item.res_childs){ret(item.res_childs)}
      if(item.id=='new'){
        notification.error({
          message: '请先保存已新建的资源',
        });
        not=false;
      }
    })
    ret(gData);
    const loop=data =>data.map((item)=>{
      if(item.res_childs){loop(item.res_childs)}
      if(key==item.id){
        for(let i=0;i<data.length;i++){
          if(key==data[i].id) {
            if(str=='child'){
              if(data[i].res_childs){
                data[i].res_childs.push(newData)
              }else {
                data[i].res_childs=[newData];
              }
              expandedKeys.push(String(data[i].id))
            }else {
              data.push(newData)
            }
          }
        }
      }
    })
    if(not)loop(gData);
    this.setState({
      gData:gData,
      visible:true,
      keySelect:'new',
      selectedKeys:['new'],
      disabled:false,
      expandedKeys:expandedKeys,
      str:str
  })
    this.onSelect('new',newData)
  },
  menuHtml(key){
    return (
      <Menu>
        <Menu.Item>
          <a onClick={()=>this.onAdd(key,'level')}>创建同级新节点</a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={()=>this.onAdd(key,'child')}>创建子级新节点</a>
        </Menu.Item>
      </Menu>
    )
  },
  render(props,state) {
    generateList(this.state.gData);
    const { searchValue, expandedKeys, autoExpandParent ,selectedKeys,Treeloading} = this.state;
    const loop = data => data.map((item) => {
      const index = item.res_name.search(searchValue);
      const beforeStr = item.res_name.substr(0, index);
      const afterStr = item.res_name.substr(index + searchValue.length);
      const resId=item.id+'';
      const res_name = index > -1 ? (
        <span>
          {beforeStr}
          <span className="ant-tree-searchable-filter">{searchValue}</span>
          {afterStr}
        </span>
      ) : <span>{item.res_name}</span>;
      if (item.res_childs.length>0) {
        return (
          <TreeNode key={resId} title={
            <div>{item.res_type=='Action'?<i className="fa fa-toggle-right"></i>:<i className="fa fa-list"></i>}&nbsp;<span onClick={()=>this.onSelect(resId,item)} className="lg-icon">{res_name}</span>&nbsp;
              {this.state.keySelect==resId?
              <span>
                <Icon type="edit" onClick={this.onEdit} className="lg-icon"/>
                <Icon type="minus-circle-o" onClick={()=>this.onMinus(resId,MINUS,item.res_name)} className="lg-icon"/>
                <Dropdown className="lg-icon" overlay={this.menuHtml(resId)}><i className="ant-dropdown-link"><Icon type="plus-circle-o"/></i></Dropdown>
                &nbsp;&nbsp;<i className="fa fa-ellipsis-v"></i><i className="fa fa-ellipsis-v"></i>
              </span>
              :''
              }
            </div>
          }>{loop(item.res_childs)}</TreeNode>
        );
      }
      return <TreeNode key={resId} title={<div>{item.res_type=='Action'?<i className="fa fa-toggle-right"></i>:<i className="fa fa-list"></i>}&nbsp;
              <span onClick={()=>this.onSelect(resId,item)} className="lg-icon">{res_name}</span>&nbsp;
              {this.state.keySelect==resId?
              <span>
                <Icon type="edit" onClick={this.onEdit} className="lg-icon"/>
                <Icon type="minus-circle-o" onClick={()=>this.onMinus(resId,MINUS,item.res_name)} className="lg-icon"/>
                <Dropdown className="lg-icon" overlay={this.menuHtml(resId)}><i className="ant-dropdown-link"><Icon type="plus-circle-o" /></i></Dropdown>
                &nbsp;&nbsp;<i className="fa fa-ellipsis-v"></i><i className="fa fa-ellipsis-v"></i>
              </span>
              :''
              }</div>} />;
    });
    return (
      <div className="Resource">
        <Search
          style={{ width: 200 }}
          placeholder="Search"
          onChange={this.onChange}
        />
        <Button type="primary" style={{float:'right'}} onClick={this.handleCreate} loading={this.state.loading}>保存</Button>
        <hr style={{marginTop:15}}/>
        <Row>
          <Col xs={12}>
            <div className={`example ${Treeloading?"showLoad":"hideLoad"}`}><Spin spinning={Treeloading}/></div>
            <Tree
              draggable
              onExpand={this.onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              onDragEnter={this.onDragEnter}
              onDrop={this.onDrop}
              selectedKeys={selectedKeys}
            >
              {loop(this.state.gData)}
            </Tree>
          </Col>
          <Col xs={12}>{
            this.state.visible?
              <SetForm
                ref={this.setForm}
                SelectData={this.state.SelectData}
                disabled={this.state.disabled}
              />:''}
          </Col>
        </Row>
      </div>
    );
  }
})

