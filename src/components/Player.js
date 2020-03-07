import React, { useState, useCallback } from 'react'
import 'dplayer/dist/DPlayer.min.css'
import styles from './Player.css'
import DPlayer from 'dplayer'
import Hls from 'hls.js'

const Player = (props) => {
    const defaultOptions = {
        autoplay: true,
        theme: '#FADFA3',
        // loop: true,  
        lang: 'zh-cn',
        screenshot: true,
        hotkey: true,
        preload: 'auto',
        volume: 0.7,
        mutex: true
    }

    const { options, playlist, currentdl, danmakuapi } = props
    const [currentDl, setCurrentDl] = useState(currentdl)

    const refHandler = useCallback(node => {
        if (node) {
            const dpp = new DPlayer({
                container: node,
                ...Object.assign({}, defaultOptions, options),
                video: {
                    url: currentDl.url,
                    type: 'customHls',
                    customType: {
                        customHls: function (video, player) {
                            const hls = new Hls();
                            hls.loadSource(video.src);
                            hls.attachMedia(video);
                        },
                    }
                },
                danmaku: {
                    id: currentDl.id,
                    api: danmakuapi || 'https://dplayer.moerats.com/',
                    maximum: 1000,
                    bottom: '15%',
                    unlimited: true,
                },
            })
            dpp.on('waiting', () => {
                dpp.notice('正在拼命加载, 请稍后...')
            })

            if (playlist) {
                dpp.on('ended', () => {
                    const currentIdx = playlist.findIndex(c => c.id === currentDl.id)
                    if (playlist.length > (currentIdx + 1)) {
                        setCurrentDl(playlist[currentIdx + 1])
                    }
                })
            }
        }
    }, [defaultOptions, options, currentDl.url, currentDl.id, danmakuapi, playlist])

    return (<div ref={refHandler} className={styles.normal}></div>)
}

export default Player