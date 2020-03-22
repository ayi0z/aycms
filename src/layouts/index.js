import { CloudSyncOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Layout, Menu, Tabs } from 'antd';
import { history } from 'umi';
import styles from './index.css';
import React from 'react'

const { TabPane } = Tabs;
const { Header } = Layout;

const IconsMap = {
  VideoCameraOutlined: (<VideoCameraOutlined />)
}

function BasicLayout(props) {
  const pathname = props.location.pathname

  if (pathname === '/account/login') {
    return (props.children);
  }

  const menuKey = pathname.split('/')[1]

  const TabsMenus = () => {
    const pathRouter = props.route.routes.find(c => c.path === `/${menuKey}`)
    const tabRoutes = pathRouter
      && pathRouter.routes
      && pathRouter.routes.map(c => ({ path: c.path, tabtitle: c.tabtitle, icon: c.icon })).filter(c => c.tabtitle)

    if (!tabRoutes || !tabRoutes.length) {
      return props.children
    }

    return (
      <Tabs tabBarStyle={{ textAlign: 'center' }} onChange={tabPaneChange} activeKey={pathname}>
        {
          tabRoutes.map(r => (
            <TabPane
              tab={<span>{IconsMap[r.icon]}{r.tabtitle}</span>}
              key={r.path}
            >
              {props.children}
            </TabPane>
          ))
        }
      </Tabs>
    );
  }

  const MenuSlected = (e) => {
    history.push(`/${e.key}`)
  }

  const tabPaneChange = (e) => {
    history.push(e)
  }

  return (
    <Layout style={{ backgroundColor: '#fff' }}>
      <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
        <div className={styles.logo} ><CloudSyncOutlined className={styles.icon} /> AYCMS </div>
        <Menu
          theme="dark"
          mode="horizontal"
          style={{ lineHeight: '64px' }}
          defaultSelectedKeys={[menuKey]}
          onSelect={MenuSlected}
        >
          <Menu.Item key="collect">采集</Menu.Item>
          <Menu.Item key="data">数据</Menu.Item>
          <Menu.Item key="banner">广告</Menu.Item>
        </Menu>
      </Header>
      <div style={{ marginTop: 64 }}>
        {TabsMenus()}
      </div>
    </Layout>
  );
}

export default BasicLayout;
