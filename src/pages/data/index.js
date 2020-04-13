import styles from './index.css'
import { SettingOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { Layout, Pagination, Row, Col, Card, Modal } from 'antd'
import React, { useState, useEffect } from 'react'
import SearchBar from '@/components/SearchBar'
import RemotePlayer from '@/components/RemotePlayer'
import Img from '@/components/Img'
import request from '@/util/request'
import api from '@/util/api'

const { Content } = Layout

const VideosList = props => {
  const [pageIndex, setPageIndex] = useState(0)
  const pageSize = 24
  const [search, setSearch] = useState({})
  const [rowsCount, setRowsCount] = useState(0)
  const [rowList, setRowList] = useState([])
  const [playCode, setPlayCode] = useState(false)

  const doSearch = async () => {
    const { searchName, searchCollect, searchType, searchYear } = search

    request.get(api.video_page, {
      params: { pageIndex, pageSize, searchName, searchCollect, searchType, searchYear }
    }).then(result => {
      const { code, data } = result
      if (code === 200) {
        setRowList(data.rows)
        setRowsCount(data.rowsCount)
        console.log(result)
      }
    })
  }

  useEffect(() => {
    doSearch()
  }, [pageIndex, search])

  const handlePageChange = pageIndex => {
    setPageIndex(pageIndex - 1)
  }

  return (
    <Content className={styles.normal}>
      <Row style={{ textAlign: 'center', padding: '10px' }}>
        <Col span={24}>
          <SearchBar onSearch={(search) => setSearch(search)} />
          <Pagination size="small"
            style={{ marginTop: '.5rem' }}
            pageSize={pageSize}
            hideOnSinglePage={true}
            onChange={handlePageChange}
            current={pageIndex + 1}
            total={rowsCount} />
        </Col>
      </Row>
      <Row>
        <Col span={1}></Col>
        <Col span={22}>
          <Card style={{ border: 'none' }}
            bodyStyle={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}>
            {rowList.map(r => (
              <Card.Grid key={r.id} style={{ padding: '1rem', width: 180 }}>
                <Card style={{
                  width: '100%',
                  height: 400,
                  border: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
                  bodyStyle={{ flexGrow: 1 }}
                  cover={
                    <Img alt={r.name}
                      src={r.pic}
                      style={{ maxHeight: 180, cursor: 'pointer' }}
                      onClick={() => setPlayCode(`${api.Play_DOMIN}/${r.playcode}`)} />
                  }
                  actions={[
                    <SettingOutlined key="setting" />,
                    <EditOutlined key="edit" />,
                    <DeleteOutlined key="delete" />,
                  ]}
                >
                  <Card.Meta style={{ paddingTop: '.5rem' }}
                    title={<span style={{ fontSize: 12 }}>{r.name}</span>}
                    description={<div style={{
                      marginBottom: '.5rem',
                      maxHeight: 180,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start'
                    }}>
                      <span style={{ fontSize: 12 }}>时间：{r.year}</span>
                      <span style={{ fontSize: 12 }}>区域：{r.area}</span>
                      <span style={{ fontSize: 12 }}>语言：{r.lang}</span>
                      <span style={{ fontSize: 12 }}>类型：{r.type}</span>
                      <span style={{
                        fontSize: 12,
                        width: '100%',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                      }}>导演：{r.director}</span>
                      <span style={{
                        fontSize: 12,
                        width: '100%',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                      }}>演员：{r.actor}</span>
                    </div>} />
                </Card>
              </Card.Grid>)
            )}
          </Card>
        </Col>
        <Col span={1}></Col>
      </Row>
      <Modal
        visible={playCode ? true : false}
        footer={null}
        width={365}
        destroyOnClose={true}
        onCancel={() => { setPlayCode(false) }}
      >
        <RemotePlayer playCode={playCode} />
      </Modal>
    </Content>
  )
}

export default VideosList