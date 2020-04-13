import { CloudSyncOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { history } from 'umi';
import styles from './index.css';
import React from 'react'

const { Header } = Layout;
function BasicLayout(props) {
  const pathname = props.location.pathname

  if (pathname === '/account/login') {
    return (props.children);
  }

  const menuKey = pathname.split('/')[1]

  return (
    <Layout style={{ backgroundColor: '#fff' }}>
      <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
        <div className={styles.logo} ><CloudSyncOutlined className={styles.icon} /> AYCMS </div>
        <Menu
          theme="dark"
          mode="horizontal"
          style={{ lineHeight: '64px' }}
          defaultSelectedKeys={[menuKey]}
          onSelect={e => history.push(`/${e.key}`)}
        >
          <Menu.Item key="collect">采集</Menu.Item>
          <Menu.Item key="data">数据</Menu.Item>
          <Menu.Item key="play">播放</Menu.Item>
          <Menu.Item key="banner">广告</Menu.Item>
        </Menu>
      </Header>
      <div style={{ marginTop: 64 }}>
        {props.children}
      </div>
    </Layout>
  );
}

export default BasicLayout;
