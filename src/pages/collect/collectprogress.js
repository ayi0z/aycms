
import styles from './collectprogress.css'
import { CloseOutlined, DeploymentUnitOutlined } from '@ant-design/icons';
import { List, Button, Statistic, PageHeader, Row, Col, Progress, Modal } from 'antd'
import React, { Component } from 'react'
import api from '@/util/api'
import request from '@/util/request'
import { authRead } from '@/util/auth-storage'
import EventSource from 'eventsource'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import VList from 'react-virtualized/dist/commonjs/List'

class CollectProgress extends Component {
  state = {
    loading: false,
    btnloading: false,
    gpagecount: 0,
    gpageidx: 0,
    grecordcount: 0,
    gprogress: [],
    gprogresspercent: 0
  }

  sse = e => {
    const { collectId, collectType } = this.props
    if (!collectId || !collectType) return
    this.setState({
      loading: true,
      btnloading: true,
      gpagecount: 0,
      gpageidx: 0,
      grecordcount: 0,
      gprogress: [],
      gprogresspercent: 0
    })

    if ('EventSource' in window) {
      const streamurl = `${api.ayserverapi}${api.progress}/${collectId}/${collectType}`
      var source = new EventSource(streamurl, {
        headers: { Authorization: `Bearer ${authRead()}` }
      })
      source.onopen = e => {
        this.setState({ loading: true, btnloading: true })
      }
      source.onerror = e => {
        source.close()
        Modal.error({
          title: '数据采集发生错误',
          content: e.message,
        })
        this.setState({ loading: false, btnloading: false })
      }
      source.addEventListener('taskinfo', e => {
        if (e.data) {
          const task = JSON.parse(e.data)
          this.setState({
            loading: false,
            gpagecount: task.pagecount,
            gpageidx: task.pageidx,
            grecordcount: parseInt(task.recordcount)
          })
        }
      })

      source.addEventListener('progress', e => {
        if (e.data) {
          const progress = JSON.parse(e.data)
          let ggprogress = [...this.state.gprogress]
          ggprogress.unshift(progress)
          this.setState({
            gprogress: ggprogress,
            gprogresspercent: Math.round(ggprogress.length / this.state.grecordcount * 100)
          })
        }
      })

      source.addEventListener('finish', e => {
        source.close()
        this.setState({ btnloading: false, loading: false })
        request.put(`${api.collect_last}/${collectId}`)
      })
    }
  }

  render() {
    const { loading, btnloading, gpagecount, gpageidx, gprogress, gprogresspercent, grecordcount } = this.state
    const { collectId, collectType, collectName, onClose } = this.props
    return (
      <div>
        <PageHeader
          ghost={false}
          subTitle={`正在采集: ${collectName}`}
          extra={<Button.Group>
            <Button disabled={!collectId && !collectType} loading={btnloading} type="primary" icon={<DeploymentUnitOutlined />} onClick={this.sse}>开始采集</Button>
            <Button disabled={btnloading} type="danger" icon={<CloseOutlined />} onClick={onClose}></Button>
          </Button.Group>
          }
        >
          <Row>
            <Col span={9}>
              <Statistic title="页码" value={gpageidx} suffix={`/ ${gpagecount}`} />
            </Col>
            <Col span={9}>
              <Statistic title="视频数" value={gprogress.length} suffix={`/ ${grecordcount}`} />
            </Col>
            <Col span={6}>
              <Progress
                type="circle"
                width={60}
                strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
                percent={gprogresspercent}
              />
            </Col>
          </Row>
        </PageHeader>
        <List
          size="small"
          loading={loading}
          bordered
        >
          <AutoSizer disableHeight>
            {({ width }) => (
              <VList
                ref="List"
                className={styles.List}
                height={400}
                rowCount={gprogress.length}
                rowHeight={30}
                rowRenderer={({ index, key, style }) => {
                  const item = gprogress[index]
                  return (
                    <List.Item key={key} style={style}>
                      <span className={styles.progress_name}>{item.name}</span>
                      <span className={styles.progress_upmode}>{item.upmode}</span>
                      <span className={item.result === 'ok' ? styles.progress_result_succ : styles.progress_result_fail}>...{item.result}</span>
                    </List.Item>
                  )
                }}
                scrollToIndex={1}
                width={width}
              />
            )}
          </AutoSizer>
        </List>
      </div >
    );
  }
}


export default CollectProgress