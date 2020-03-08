/**
 * tabtitle: 视频
 * icon: VideoCameraOutlined
 */
import { connect } from 'dva'
import React, { PureComponent } from 'react';
import {
  DeleteOutlined,
  EditOutlined,
  LinkOutlined,
  PlusOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import {
  Divider, Drawer, Button,
  Table, Popconfirm, Dropdown,
  Row, Col, Modal, Tabs
} from 'antd';
import styles from './index.css';
import ApiEdit from './apiedit'
import ClassMap from './classmap'
import DlFix from './dlfix'
import CollectProgress from './collectprogress'
import CollectDropMenu from '@/components/CollectDropMenu'

const drawerChildrenRender = (drawerVisible, collectId) => {
  if (drawerVisible) {
    return (<Tabs defaultActiveKey="1">
      <Tabs.TabPane tab="资源站" key="1">
        <ApiEdit></ApiEdit>
      </Tabs.TabPane>
      <Tabs.TabPane tab="视频类型映射" key="2" disabled={!collectId}>
        <ClassMap></ClassMap>
      </Tabs.TabPane>
      <Tabs.TabPane tab="播放地址替换" key="3" disabled={!collectId}>
        <DlFix collectId={collectId}></DlFix>
      </Tabs.TabPane>
    </Tabs>)
  }
}

@connect(({ collect, loading }) => ({ collect, loading }))
class Collect extends PureComponent {
  state = {
    drawerVisible: false,
    modalVisible: false,
    selectedRowKeys: [],
    collectType: undefined,
    collects: []
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({ type: 'collect/query' })
  }

  handleSwitchDrawerVisible = async e => {
    const { drawerVisible } = this.state
    const { dispatch } = this.props
    await dispatch({ type: 'collect/setApiId', payload: { collectId: e || 0 } })
    this.setState({ drawerVisible: !drawerVisible })
  }

  handleDrawerVisableChange = e => {
    if (!e) {
      const { dispatch } = this.props
      dispatch({ type: 'collect/clearApi' })
    }
  }

  handleTableRowSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys })
  }
  handleDeleteSelectedRows = e => {
    this.onDeleteCollect(this.state.selectedRowKeys)
  }
  onDeleteCollect = ids => {
    if (ids && ids.length > 0) {
      const { dispatch } = this.props
      dispatch({ type: 'collect/delete', payload: ids })
    }
  }

  handleCloseModal = e => {
    this.setState({ modalVisible: false })
  }
  handleCollectMenuClick(e, record) {
    record = record
      ? [{ id: record.id, name: record.name }]
      : this.props.collect.dataList
        .filter(c => this.state.selectedRowKeys.includes(c.id))
        .map(c => ({ id: c.id, name: c.name }))
    this.onCollect(e.key, record)
  }
  onCollect = (type, record) => {
    this.setState({ modalVisible: true, collects: record, collectType: type })
  }

  render() {
    const { drawerVisible, selectedRowKeys, modalVisible, collects, collectType } = this.state
    const { collect: { dataList, collectId }, loading } = this.props

    const columns = [
      {
        title: 'No',
        width: 60,
        dataIndex: 'id',
        key: 'id',
        // fixed: 'left'
      },
      {
        title: 'Name',
        width: 120,
        dataIndex: 'name',
        key: 'name',
        // fixed: 'left',
        render: (text, record) => (
          record.weburl
            ? <a href={record.weburl} target='blank'>{text}<LinkOutlined /></a>
            : text
        )
      },
      {
        title: 'Url',
        dataIndex: 'apiurl',
        key: 'apiurl',
        render: (text, record) => {
          let { last } = record
          if (last) {
            last = new Date(last)
            return (<div>{text} <sub style={{ color: '#d28989' }}>{last.toLocaleDateString()} {last.toLocaleTimeString()}</sub></div>)
          }
          return text
        }
      },
      {
        title: 'Action',
        key: 'operation',
        // fixed: 'right',
        width: 140,
        render: (text, record) => (
          <div>
            <Dropdown
              overlay={() => (<CollectDropMenu onMenuClick={e => this.handleCollectMenuClick(e, record)}></CollectDropMenu>)}>
              <Button size="small" style={{ border: 'none', boxShadow: 'none' }}>
                <UnorderedListOutlined style={{ fontSize: '10px' }} />
              </Button>
            </Dropdown>
            <Divider type="vertical" />
            <Button.Group>
              <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => this.handleSwitchDrawerVisible(record.id)} />
              <Popconfirm title="确认删除?" okText="是" cancelText="否" placement="leftTop" onConfirm={() => this.onDeleteCollect([record.id])}>
                <Button loading={loading.effects['collect/delete']} type="danger" size="small" icon={<DeleteOutlined />} />
              </Popconfirm>
            </Button.Group>
          </div>
        ),
      },
    ];

    return (
      <div className={styles.normal}>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button.Group>
              <Button type='primary' icon={<PlusOutlined />} onClick={() => this.handleSwitchDrawerVisible()}>添加</Button>
              <Dropdown
                overlay={() => (<CollectDropMenu onMenuClick={e => this.handleCollectMenuClick(e)}></CollectDropMenu>)}>
                <Button type='primary' icon={<UnorderedListOutlined />}>采集</Button>
              </Dropdown>
              <Popconfirm title="确认删除?" okText="是" cancelText="否" placement="leftTop" onConfirm={this.handleDeleteSelectedRows}>
                <Button type='danger' loading={loading.effects['collect/delete']} icon={<DeleteOutlined />}>删除</Button>
              </Popconfirm>
            </Button.Group>
          </Col>
        </Row>
        <Table
          rowKey='id'
          rowSelection={{ selectedRowKeys, onChange: this.handleTableRowSelectChange }}
          loading={loading.effects['collect/query']}
          pagination={{ pageSize: 10 }}
          columns={columns}
          dataSource={dataList}
          style={{ height: '450px' }}
          size="small"
        // scroll={{ x: 1400 }} 
        />
        <Drawer
          width={720}
          onClose={() => this.handleSwitchDrawerVisible()}
          visible={drawerVisible}
          afterVisibleChange={this.handleDrawerVisableChange}
          placement="right"
          height="90vh"
          getContainer={false}
          destroyOnClose={true}
          style={{ position: 'absolute' }}
        >
          {drawerChildrenRender(drawerVisible, collectId)}
        </Drawer>
        <Modal
          centered
          visible={modalVisible}
          closable={false}
          footer={null}
          destroyOnClose={true}
        >
          <CollectProgress collects={collects} collectType={collectType} onClose={this.handleCloseModal}></CollectProgress>
        </Modal>
      </div>
    );
  }
}

export default Collect