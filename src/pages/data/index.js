/**
 * tabtitle: 视频
 * icon: VideoCameraOutlined
 */

import styles from './index.css'
import { SearchOutlined, CloseOutlined } from '@ant-design/icons'
import { Form, Layout, Pagination, Row, Col, Button, Input, Drawer, Spin, Select } from 'antd'
import React, { Component } from 'react'
import PictureList from '@/components/PictureList'
// import VideoDl from '@/components/VideoDl'
import { connect } from 'umi'

const { Content } = Layout

const YearList = (n = 5) => {
  let years = []
  let toyear = new Date().getFullYear()
  let minyear = toyear - n
  for (; toyear >= minyear; toyear--) {
    years.push(toyear)
  }
  return years
}

@connect(({
  collect,
  videoClass,
  video,
  loading
}) => ({ collect, videoClass, video, loading }))
class VideosList extends Component {
  state = {
    drawerVisable: false,
    pageIndex: 0,
    pageSize: 21,
    searchName: '',
    searchYear: '',
    searchType: '',
    searchCollect: ''
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'videoClass/queryList',
      payload: { preid: 0 }
    })
    dispatch({
      type: 'collect/query',
    })
    this.handleSearchSubmit()
  }

  handleOpenSearchDrawer = (e) => {
    this.setState({ drawerVisable: true })
  }
  handleCloseDrawer = (e) => {
    this.setState({ drawerVisable: false })
  }
  doSearch = async () => {
    const { dispatch } = this.props
    await dispatch({ type: 'video/clearList' })

    setTimeout(() => {
      const { pageSize, pageIndex,
        searchName, searchCollect,
        searchType, searchYear } = this.state
      dispatch({
        type: 'video/queryPage',
        payload: {
          pageSize,
          pageIndex,
          searchName,
          searchCollect,
          searchType,
          searchYear
        }
      })
    }, 1000)
  }
  handleSearchSubmit = values => {
    values = values || {}
    values = JSON.parse(JSON.stringify(values), (k, v) => { if (v) return v })
    const { searchName,
      searchCollect,
      searchType,
      searchYear } = values
    this.setState({
      pageIndex: 0,
      searchName,
      searchCollect,
      searchType,
      searchYear
    }, () => { this.doSearch() })
  }
  handlePageChange = pageIndex => {
    this.setState({ pageIndex: pageIndex - 1 }, () => {
      this.doSearch()
    })
  }

  selectOptionsRender = (datasource, text = 'text', value = 'value', key = 'key') => {
    return (datasource || []).map((item, i) => (<Select.Option
      key={item[key] || i}
      value={item[value] || item}>
      {item[text] || item}
    </Select.Option>))
  }

  render() {
    const { drawerVisable, pageSize, pageIndex, searchName, searchYear, searchType, searchCollect } = this.state
    const { loading,
      videoClass: { dataList: videoClassList },
      collect: { dataList: collectList },
      video: { dataList: videoList, rowsCount } } = this.props

    return (
      <Content className={styles.normal}>
        <Drawer visible={drawerVisable}
          placement="top"
          closable={false}
          height={80}
          getContainer={false}
          onClose={this.handleCloseDrawer}
          style={{ position: 'absolute', textAlign: 'center' }}>
          <Form onFinish={this.handleSearchSubmit}
            initialValues={{ searchName, searchYear, searchType, searchCollect }}
          >
            <Input.Group compact>
              <Form.Item noStyle name='searchName'>
                <Input style={{ width: 200, textAlign: 'left' }} placeholder="名称"></Input>
              </Form.Item>
              <Form.Item noStyle name='searchYear'>
                <Select style={{ width: 100 }} placeholder="年度">
                  <Select.Option value="">全部</Select.Option>
                  {this.selectOptionsRender(YearList())}
                  <Select.Option value="early">更早</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item noStyle name='searchType'>
                <Select loading={loading.effects['videoClass/queryList']} style={{ width: 150 }} placeholder="视频类型">
                  <Select.Option value="">全部</Select.Option>
                  {this.selectOptionsRender(videoClassList, 'name', 'id', 'id')}
                </Select>
              </Form.Item>
              <Form.Item noStyle name='searchCollect'>
                <Select loading={loading.effects['collect/query']} style={{ width: 160 }} placeholder="视频采集源">
                  <Select.Option value="">全部</Select.Option>
                  {this.selectOptionsRender(collectList, 'name', 'id', 'id')}
                </Select>
              </Form.Item>
              <Form.Item noStyle>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>查询</Button>
              </Form.Item>
            </Input.Group>
          </Form>
        </Drawer>
        <Row style={{ textAlign: 'center', padding: '10px' }}>
          <Col span={22}>
            <Pagination size="small"
              pageSize={pageSize}
              hideOnSinglePage={true}
              onChange={this.handlePageChange}
              current={pageIndex + 1}
              total={rowsCount} />
          </Col>
          <Col span={2}><Button size="small" icon={<SearchOutlined />} onClick={this.handleOpenSearchDrawer}></Button></Col>
        </Row>
        <Spin size="large" spinning={loading.effects['video/queryPage']} delay={300}>
          <PictureList
            imgField="pic"
            pictures={videoList}
            imgWidth={150}
            imgHeight={210}
            renderDec={({ item, index }, closeHandler) => {
              return (<>
                <h1>{item.name}</h1>
                <i><CloseOutlined onClick={closeHandler} /></i>
                <em />
                <p className={styles.videoinfo}>
                  <span>{item.type}</span>
                  <span>{item.lang}</span>
                  <span>{item.area}</span>
                  <span>{item.year}</span>
                </p>
                <p>导演：{item.director}</p>
                <p>演员：{item.actor}</p>
                <p>{item.des}</p>
                {/* <VideoDl videoId={item.id}></VideoDl> */}
              </>)
            }}
          />
        </Spin>
      </Content>
    )
  }
}

export default VideosList