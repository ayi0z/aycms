import styles from './index.css'
import { CloseOutlined } from '@ant-design/icons'
import { Layout, Pagination, Row, Col, Spin } from 'antd'
import React, { Component } from 'react'
import PictureList from '@/components/PictureList'
import { connect } from 'umi'
import SearchBar from '@/components/SearchBar'

const { Content } = Layout

@connect(({
  collect,
  videoClass,
  video,
  loading
}) => ({ collect, videoClass, video, loading }))
class VideosList extends Component {
  state = {
    pageIndex: 0,
    pageSize: 14,
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

  render() {
    const { pageSize, pageIndex } = this.state
    const { loading, video: { dataList: videoList, rowsCount } } = this.props

    return (
      <Content className={styles.normal}>
        <Row style={{ textAlign: 'center', padding: '10px' }}>
          <Col span={24}>
            <SearchBar onSearch={(search) => this.handleSearchSubmit(search)} />
            <Pagination size="small"
              style={{ marginTop: '.5rem' }}
              pageSize={pageSize}
              hideOnSinglePage={true}
              onChange={this.handlePageChange}
              current={pageIndex + 1}
              total={rowsCount} />
          </Col>
        </Row>
        <Spin size="large" spinning={loading.effects['video/queryPage']} delay={300}>
          <PictureList
            imgField="pic"
            pictures={videoList}
            imgWidth={150}
            imgHeight={210}
            height={500}
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