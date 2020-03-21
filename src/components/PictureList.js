import React, { useState, useCallback } from 'react'
import { CloseOutlined } from '@ant-design/icons';
import QueueAnim from 'rc-queue-anim'
import TweenOne, { TweenOneGroup } from 'rc-tween-one'
import styles from './PictureList.css'
import PropTypes from 'prop-types'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import api from '@/util/api'
import { Modal, Spin } from 'antd'

const setImgSrc = node => {
    node.target.src = `${api.Img_DOMIM}/aycms-black.png`
    node.target.removeEventListener('error', setImgSrc)
}
const PictureList = (props) => {
    const [playCode, setPlayCode] = useState(false)
    const imgRef = useCallback(node => {
        if (node) {
            node.addEventListener('error', setImgSrc)
        }
    }, [])

    const objRef = useCallback(node => {
        if (node) {
            node.addEventListener('load', () => {
                setLoading(false)
            })
        }
    }, [])

    const { imgField, pictures, imgWidth, imgHeight, imgXPadding, imgYPadding, renderDec } = props
    const [picOpen, setPicOpen] = useState({})
    const [loading, setLoading] = useState(false)

    const imgBoxWidth = imgWidth + imgXPadding * 2
    const imgBoxHeight = imgHeight + imgYPadding * 2
    const tPicOpen = { ...picOpen }

    // const onImgClick = (e, i) => {
    const onImgClick = (item) => {
        setLoading(true)
        setPlayCode(`${api.Play_DOMIN}/${item.playcode}`)
        // Object.keys(tPicOpen).forEach((key) => {
        //     if (key !== i && tPicOpen[key]) {
        //         tPicOpen[key] = false
        //     }
        // })
        // tPicOpen[i] = true
        // setPicOpen(tPicOpen)
    }

    const onClose = (i) => {
        tPicOpen[i] = false
        setPicOpen(tPicOpen)
    }

    const onTweenEnd = (i) => {
        delete tPicOpen[i]
        setPicOpen(tPicOpen)
    }

    const getDelay = (e, imgColumn) => {
        const i = e.index + pictures.length % imgColumn
        return (i % imgColumn) * 100 + Math.floor(i / imgColumn) * 100 + 200
    }

    const picLiRender = (imgColumn) => {
        return pictures.map((item, i) => {
            const isEnter = typeof picOpen[i] === 'boolean'  // 面板展开
            const isOpen = picOpen[i]    // 面板展开

            const isRight = Math.floor((i % imgColumn) / (imgColumn / 2))
            const rowIndex = Math.floor(i / imgColumn)

            const liLeft = isEnter ? 0 : imgBoxWidth * (i % imgColumn)
            const liRight = isEnter ? 0 : imgBoxWidth * (imgColumn - (i % imgColumn) - 1)

            let liTop = imgBoxHeight * rowIndex
            liTop = isEnter ? rowIndex ? (rowIndex - 1) * imgBoxHeight : 0 : liTop

            const liStyle = isEnter ? { zIndex: 1 } : null
            let liAnimation = isEnter ?
                ({
                    onComplete: onTweenEnd.bind(this, i),
                    delay: 400,
                    ease: 'easeInOutCubic',
                    boxShadow: '0 2px 8px rgba(140, 140, 140, .35)',
                    left: isRight ? '' : liLeft,
                    right: isRight ? liRight : '',
                    width: imgWidth,
                    height: imgHeight,
                    top: liTop
                })
                : null
            liAnimation = isOpen ?
                ({
                    ease: 'easeInOutCubic',
                    boxShadow: '0 0px 0px rgba(140, 140, 140, 0)',
                    width: '100%',
                    height: imgBoxHeight + imgHeight,
                    left: isRight ? '' : '0%',
                    right: isRight ? '0%' : ''
                }) : liAnimation

            // 位置 js 控制；
            return (
                <TweenOne
                    component="li"
                    key={i}
                    style={{
                        left: isRight ? '' : liLeft,
                        right: isRight ? liRight : '',
                        top: liTop,
                        width: imgWidth,
                        height: imgHeight,
                        backgroundColor: '#fff',
                        ...liStyle,
                    }}
                    animation={liAnimation}
                >
                    <TweenOne
                        component="a"
                        // onClick={e => onImgClick(e, i)}
                        onClick={e => onImgClick(item)}
                        style={{
                            left: isRight ? '' : 0,
                            right: isRight ? 0 : '',
                            top: 0,
                            width: imgWidth,
                            height: imgHeight
                        }}
                    >
                        <img ref={imgRef} src={item[imgField]}
                            width="100%" height="100%" alt="piclist"
                            style={{ background: `url(${api.Img_DOMIM}/aycms-gray.png) center center / 100% no-repeat` }}
                        />
                    </TweenOne>
                    <TweenOneGroup
                        enter={[
                            { opacity: 0, duration: 0, type: 'from', delay: 400, },
                            { ease: 'easeOutCubic', type: 'from', left: isRight ? '50%' : '0%' },
                        ]}
                        leave={{ ease: 'easeInOutCubic', opacity: 0, left: isRight ? '50%' : '0%' }}
                        component=""
                    >
                        {isOpen &&
                            (<div
                                className={styles.pic_list_text_wrapper}
                                key={i}
                                style={{
                                    width: imgBoxWidth * (imgColumn - 1) - 10,
                                    left: isRight ? '' : imgBoxWidth,
                                    right: isRight ? imgBoxWidth : '',
                                }}
                            >
                                {renderDec({ item, index: i }, () => { onClose(i) })}
                            </div>)
                        }
                    </TweenOneGroup>
                </TweenOne>
            );
        });
    }

    return (<div className={styles.pic_list_wrapper} style={{ height: props.height }}>
        <Modal
            visible={playCode ? true : false}
            footer={null}
            width={365}
            destroyOnClose={true}
            onCancel={() => { setPlayCode(false) }}
        >
            <Spin spinning={loading}>
                <object ref={objRef} style={{ width: 320, height: 508 }} type="text/html" data={playCode}>No Movie</object>
            </Spin>
        </Modal>
        <AutoSizer>
            {
                ({ width, height }) => {
                    if (width) {
                        const imgColumn = Math.floor(width / imgBoxWidth)
                        const ulWidth = imgColumn * imgBoxWidth
                        return (
                            <div className={styles.pic_list} style={{ height, width }}>
                                <QueueAnim
                                    delay={(e) => getDelay(e, imgColumn)}
                                    component="ul"
                                    className={styles.pic_list_image_wrapper}
                                    interval={0}
                                    type="bottom"
                                    style={{ width: ulWidth }}
                                >
                                    {picLiRender(imgColumn)}
                                </QueueAnim>

                            </div>
                        )
                    }
                }
            }
        </AutoSizer>
    </div>
    )
}

PictureList.propTypes = {
    imgField: PropTypes.string,
    height: PropTypes.number,
    imgWidth: PropTypes.number,
    imgHeight: PropTypes.number,
    imgXPadding: PropTypes.number,
    imgYPadding: PropTypes.number,
    renderDec: PropTypes.func
}
PictureList.defaultProps = {
    imgField: 'image',
    height: 500,
    imgWidth: 110,
    imgHeight: 76,
    imgXPadding: 5,
    imgYPadding: 5,
    renderDec: ({ item }, closeHandler) => {
        return (
            <>
                <h1>{item.title}</h1>
                <i><CloseOutlined onClick={closeHandler} /></i>
                <em />
                <p>{item.content}</p>
            </>
        )
    }
}

export default PictureList