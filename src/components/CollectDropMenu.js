import React, { Component } from 'react'
import { CloudDownloadOutlined } from '@ant-design/icons';
import { Menu } from 'antd';

class CollectDropMenu extends Component {
  render() {
    const { onMenuClick } = this.props
    return (
      <Menu onClick={onMenuClick}>
        <Menu.Item key="today">
          <CloudDownloadOutlined />
          采集当天
        </Menu.Item>
        <Menu.Item key="week">
          <CloudDownloadOutlined />
          采集本周
        </Menu.Item>
        <Menu.Item key="all">
          <CloudDownloadOutlined />
          采集所有
        </Menu.Item>
      </Menu>
    );
  }
}

export default CollectDropMenu