import React, {useState, useEffect } from 'react'
import { Tabs, Modal } from 'antd';
import { connect } from 'umi'
import styles from './VideoDl.css'
import Player from '@/components/Player'

const TabTitle = (props) => {
    const { collectList, vcitem } = props
    const collect = collectList.find(c => c.id === vcitem.cid)
    return (
        <>
            <div>{collect && collect.name}</div>
            <div style={{ color: '#489e2c', fontSize: '12px', fontWeight: 'normal' }}>{vcitem.note}</div>
        </>
    )
}
const VideoDlItem = connect(({ videoDl }) => ({ videoDl }))((props) => {
    const { onplay, videocollect, dispatch, videoDl: { dataList: dllist } } = props

    useEffect(() => {
        dispatch({
            type: 'videoDl/queryList',
            payload: { vid: videocollect.vid, cid: videocollect.cid }
        })
    }, [videocollect.vid, videocollect.cid, dispatch])

    return dllist.map(c => {
        return (<div className={styles.dl} key={c.id} onClick={() => onplay(c)}>{c.title}</div>)
    })
})

const VideoDl = (props) => {
    const { dispatch, videoId,
        collect: { dataList: collectList },
        videoCollect: { dataList: videoCollectList },
        videoDl: { dataList: videoDlList }
    } = props

    const [playerVisable, setPlayerVisable] = useState(false)

    useEffect(() => {
        if (videoId) {
            dispatch({
                type: 'videoCollect/queryList',
                payload: { id: videoId }
            })
        }
    }, [dispatch, videoId])

    const [currentDl, setCurrentDl] = useState(null)

    const doPlay = (dl) => {
        setCurrentDl(dl)
        setPlayerVisable(true)
    }
    const doCloseModal = () => {
        setCurrentDl(null)
        setPlayerVisable(false)
    }

    return (
        <>
            <Modal visible={playerVisable}
                width={800}
                onCancel={doCloseModal}
                footer={null}
                maskClosable={false}
                destroyOnClose={true}>
                <Player playlist={videoDlList} currentdl={currentDl} />
            </Modal>
            <Tabs defaultActiveKey="1" tabBarStyle={{ padding: 0, marginBottom: 5 }}>
                {
                    videoCollectList.map((vcitem, vcindex) => {
                        return (
                            <Tabs.TabPane tab={<TabTitle vcitem={vcitem} collectList={collectList} />} key={vcindex}>
                                <span style={{ fontSize: 12, padding: '2px 3px' }}>最后更新: {new Date(vcitem.last).toLocaleDateString()} : {new Date(vcitem.last).toLocaleTimeString()}</span>
                                <div className={styles.dlContainer}>
                                    <VideoDlItem videocollect={vcitem} onplay={doPlay} />
                                </div>
                            </Tabs.TabPane>
                        )
                    })
                }
            </Tabs>
        </>)
}

export default connect(({
    loading,
    collect,
    videoCollect,
    videoDl
}) => ({
    loading,
    collect,
    videoCollect,
    videoDl
}))(VideoDl)