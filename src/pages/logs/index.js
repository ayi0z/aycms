import React, { useEffect, useState } from 'react'
import request from '@/util/request'
import api from '@/util/api'
import { Layout, Menu, Spin } from 'antd'
import { authRead } from '@/util/auth-storage'
import styles from './index.css'

const LogRow = props => {
    if (!props.log) return null

    let log = {}
    try {
        log = JSON.parse(props.log.replace(/\\n/g, ' '))
    } catch (e) {
        console.error({ e, j: props.log.replace(/\\n/g, ' ') })
        return null
    }
    return (
        <div className={log.level === 'info' ? styles.log : styles.logerr}>
            <span>{log.timestamp}</span>
            <span>{log.level}</span>
            {
                JSON.stringify(log.message)
            }
        </div>
    )
}

export default props => {
    const [logs, setLogs] = useState([])
    const [log, setLog] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        request.get(`/logs`)
            .then(res => {
                if (res.code === 200) {
                    const data = res.data.map(c => {
                        const pA = c.indexOf('_'), pB = c.indexOf('.')
                        const n = c.substring(0, pA),
                            t = c.substring(pA + 1, pB)
                        return { p: c, n, t }
                    }).sort((a, b) => {
                        const x = a.t * 1 || 0,
                            y = b.t * 1 || 0
                        return y - x
                    })

                    setLogs(data)
                }
            })
    }, [])

    const loadLog = e => {
        setLoading(true)
        fetch(`${api.API_DOMIN}/${e.key}`, {
            method: 'GET',
            headers: new Headers({ Authorization: `Bearer ${authRead()}` })
        }).then(data => data.text().then(r => {
            setLog(r.split('\n').filter(l => r))
            setLoading(false)
        })
        ).catch(e => {
            setLoading(false)
            console.error(e)
        })
    }

    return (
        <Layout>
            <Layout.Sider className={styles.layout}>
                <Menu theme="dark" onClick={loadLog} >
                    {
                        logs.map(l => (
                            <Menu.Item key={l.p}>
                                {l.t} - {l.n}
                            </Menu.Item>
                        ))
                    }
                </Menu>
            </Layout.Sider>
            <Spin spinning={loading}>
                <Layout.Content className={styles.layout}>
                    {
                        log && log.length ? log.map((l, i) => (<LogRow key={i} log={l} />)) : 'no log'
                    }
                </Layout.Content>
            </Spin>
        </Layout>
    )
}