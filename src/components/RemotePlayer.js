import React, { useCallback, useState } from 'react'
import { Spin } from 'antd'

export default props => {
    const [loading, setLoading] = useState(true)
    const objRef = useCallback(node => {
        if (node) {
            node.addEventListener('load', () => {
                setLoading(false)
            })
        }
    }, [])
    return (
        <Spin spinning={loading}>
            <iframe ref={objRef} title="ifr"
                frameBorder="no"
                allowFullScreen="allowFullScreen"
                style={{ width: 320, height: 508 }}
                type="text/html"
                src={props.playCode}>No Movie</iframe>
        </Spin>
    )
}