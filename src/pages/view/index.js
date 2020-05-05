import React, { useState, useEffect } from "react"
import { Avatar, Badge, Tag, Modal } from 'antd'
import { CaretRightOutlined } from '@ant-design/icons'
import request from '@/util/request'
import api from '@/util/api'
import { InfiniteLoader, AutoSizer, List } from 'react-virtualized'
import styles from './index.css'
import RemotePlayer from '@/components/RemotePlayer'

const ViewList = props => {
    const [dataList, setDataList] = useState([])
    const [rowCount, setRowCount] = useState(0)
    const [loading, setLoading] = useState(false)
    const [playCode, setPlayCode] = useState(false)

    const fetchData = (start = 0, end = 10) => {
        setLoading(true)
        request.get(api.view, { params: { start, end } })
            .then(result => {
                setLoading(false)
                const { code, data } = result
                if (code === 200) {
                    setDataList(dataList.concat(data))
                }
            })
    }
    useEffect(() => {
        request.get(api.viewcount)
            .then(result => {
                const { code, data } = result
                if (code === 200) {
                    setRowCount(data)
                }
            })
    }, [])
    useEffect(() => { fetchData() }, [])

    const isRowLoaded = ({ index }) => (!!dataList[index])

    const handleLoadMore = ({ startIndex, stopIndex }) => {
        if(stopIndex > 0){
            fetchData(startIndex, stopIndex || 1)
        }   
    }

    return (
        <div style={{ paddingTop: 30 }}>
            <Modal
                visible={playCode ? true : false}
                maskClosable={false}
                footer={null}
                width={365}
                destroyOnClose={true}
                onCancel={() => { setPlayCode(false) }}
            >
                <RemotePlayer playCode={playCode} />
            </Modal>
            <InfiniteLoader
                isRowLoaded={isRowLoaded}
                loadMoreRows={handleLoadMore}
                rowCount={rowCount}
            >
                {({ onRowsRendered, registerChild }) => (
                    <AutoSizer disableHeight>
                        {({ width }) => (
                            <List
                                height={600}
                                onRowsRendered={onRowsRendered}
                                ref={registerChild}
                                rowCount={rowCount}
                                rowHeight={120}
                                rowRenderer={({ key, index, style }) => {
                                    const rowVideo = dataList[index]
                                    return <div key={key} style={style}>
                                        {rowVideo
                                            ? <div className={styles.listitem}>
                                                <Badge count={index + 1} overflowCount={9999} offset={[-120, 0]}>
                                                    <Avatar shape="square" size={100} src={rowVideo.pic} />
                                                </Badge>
                                                <div style={{ display: 'inline-block', width: 400, height: 100, position: 'absolute' }}>
                                                    <Badge count={rowVideo.viewer} overflowCount={9999} offset={[20, 50]}>
                                                        <div style={{ display: 'inline-block', width: 400, height: 90 }}>
                                                            <div style={{ padding: 10 }}>{rowVideo.name}</div>
                                                            <div style={{ padding: 10 }}>
                                                                {rowVideo.year ? <Tag>{rowVideo.year}</Tag> : null}
                                                                {rowVideo.area ? <Tag>{rowVideo.area}</Tag> : null}
                                                                {rowVideo.type ? <Tag>{rowVideo.type}</Tag> : null}
                                                            </div>
                                                            <div style={{ position: 'absolute', right: 20, bottom: 5, fontSize: 25, cursor: 'pointer' }}><CaretRightOutlined onClick={() => setPlayCode(`${api.Play_DOMIN}/${rowVideo.playcode}`)} /></div>
                                                        </div>
                                                    </Badge>
                                                </div>
                                            </div> : null}
                                    </div>
                                }}
                                width={width}
                            />
                        )}
                    </AutoSizer>
                )}
            </InfiniteLoader>
        </div>
    )
}

export default ViewList