import { Transfer ,notification} from 'antd';
import React from 'react';
import axios from 'axios';


const TransferModal = React.createClass({
  getInitialState() {
    return {
      mockData: [],
      targetKeys: [],
    };
  },
  handleChange(targetKeys, direction, moveKeys) {
    const {rolelist,mockData}=this.props;
    const selectRole=[];
    mockData.map((item)=>{
      targetKeys.map((key)=>{
        if(key==item.key){
          selectRole.push(item)
        }
      })
      moveKeys.map((key)=>{
        if(key==item.key)item.status==1?item.disabled=false:item.disabled=true;
      })
    })
    this.props.setAllocRole(selectRole)
    this.props.setTargetKeys(targetKeys)
    this.setState({ targetKeys ,mockData});
  },
  renderItem(item) {
    const customLabel = (
      <span className="custom-item" key={item.id}>
         {item.real_name}（{item.username}）
      </span>
    );

    return {
      label: customLabel,  // for displayed item
      value: item.username,   // for title and filter matching
    };
  },
  render() {
    return (
      <Transfer
        dataSource={this.props.mockData}
        listStyle={{
          width: 300,
          height: 300,
        }}
        titles={['可分配用户', '已分配用户']}
        targetKeys={this.props.targetKeys}
        onChange={this.handleChange}
        render={this.renderItem}
      />
    );
  },
});

export default TransferModal;
