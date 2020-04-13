import React, { useState, useEffect } from 'react'
import { SearchOutlined } from '@ant-design/icons'
import { Form, Button, Input, Select } from 'antd'
import { YearList } from '@/util/utils'
import request from '@/util/request'
import api from '@/util/api'

export default props => {
    const { onSearch } = props

    const [videoClassList, setVideoClassList] = useState([])
    const [collectList, setCollectList] = useState([])

    useEffect(() => {
        request.get(`${api.videoclass}/0`)
            .then(result => {
                const { code, data } = result
                if (code) {
                    setVideoClassList(data)
                }
            })
        request.get(api.collect)
            .then(result => {
                const { code, data } = result
                if (code) {
                    setCollectList(data)
                }
            })
    }, [])

    const handleSearchSubmit = values => {
        values = values || {}
        values = JSON.parse(JSON.stringify(values), (k, v) => { if (v) return v })
        onSearch(values)
    }

    const selectOptionsRender = (datasource, text = 'text', value = 'value', key = 'key') => {
        return (datasource || []).map((item, i) => (
            <Select.Option
                key={item[key] || i}
                value={item[value] || item}>
                {item[text] || item}
            </Select.Option>))
    }

    return (
        <Form onFinish={handleSearchSubmit}>
            <Input.Group compact>
                <Form.Item noStyle name='searchName'>
                    <Input style={{ width: 200, textAlign: 'left' }} placeholder="名称"></Input>
                </Form.Item>
                <Form.Item noStyle name='searchYear'>
                    <Select style={{ width: 100 }} placeholder="年度">
                        <Select.Option value="">全部</Select.Option>
                        {selectOptionsRender(YearList())}
                        <Select.Option value="early">更早</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item noStyle name='searchType'>
                    <Select loading={false} style={{ width: 150 }} placeholder="视频类型">
                        <Select.Option value="">全部</Select.Option>
                        {selectOptionsRender(videoClassList, 'name', 'id', 'id')}
                    </Select>
                </Form.Item>
                <Form.Item noStyle name='searchCollect'>
                    <Select loading={false} style={{ width: 160 }} placeholder="视频采集源">
                        <Select.Option value="">全部</Select.Option>
                        {selectOptionsRender(collectList, 'name', 'id', 'id')}
                    </Select>
                </Form.Item>
                <Form.Item noStyle>
                    <Button type="primary" htmlType="submit" icon={<SearchOutlined style={{ fontSize: '1rem', lineHeight: '1.7rem' }} />}>查询</Button>
                </Form.Item>
            </Input.Group>
        </Form>
    )
}