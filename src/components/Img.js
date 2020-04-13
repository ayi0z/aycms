import React, { useCallback } from 'react'
import api from '@/util/api'

const setImgSrc = node => {
    node.target.src = `${api.Img_DOMIM}/aycms-black.png`
    node.target.removeEventListener('error', setImgSrc)
}

export default props => {
    const imgRef = useCallback(node => {
        if (node) {
            node.addEventListener('error', setImgSrc)
        }
    }, [])

    return (<img ref={imgRef}
        width="100%" height="100%" alt="piclist"
        {...props}
        style={{
            background: `url(${api.Img_DOMIM}/aycms-gray.png) center center / 100% no-repeat`,
            ...props.style
        }}
    />)
}