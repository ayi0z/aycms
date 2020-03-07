import React, { useState, useEffect, useRef } from "react"
import styles from './index.css'
import api from "@/util/api"
import request from '@/util/request'
import { Table, Button, Popconfirm, Switch, Form, Input, InputNumber } from "antd";
import { DeleteOutlined } from '@ant-design/icons'
import qs from 'qs'

export default function () {
  const [bannerList, setBannerList] = useState([])
  const formRef = useRef(null)

  const fetchBannerList = () => {
    request.get(api.banner)
      .then(res => {
        const { code, data } = res
        if (code === 200 && data) {
          setBannerList(data)
        }
      })
  }

  useEffect(() => { fetchBannerList() }, [])

  const onDel = delBannerId => {
    if (delBannerId) {
      request.delete(`${api.banner}/${delBannerId}`)
        .then(res => {
          const { code, data } = res
          if (code === 200 && data) {
            fetchBannerList()
          }
        })
    }
  }

  const onSwitch = switchBanner => {
    if (switchBanner) {
      request.put(`${api.banner}/${switchBanner.id}`, { data: qs.stringify({ del_on: switchBanner.del_on ? 0 : Date.now() }) })
        .then(res => {
          const { code, data } = res
          if (code === 200 && data) {
            fetchBannerList()
          }
        })
    }
  }

  const formFinish = values => {
    if (values) {
      const id = values.id
      values.href = values.href || '#'
      const res = id
        ? request.put(`${api.banner}/${id}`, { data: qs.stringify(values) })
        : request.post(api.banner, { data: qs.stringify(values) })

      res.then(res => {
        const { code, data } = res
        if (code === 200 && data) {
          fetchBannerList()
          formRef.current.setFieldsValue({ id: 0, alt: '', src: '', href: '', sort: 0 })
        }
      })
    }
  }

  return (
    <div className={styles.normal}>
      <div style={{ textAlign: 'center', padding: 10 }}>
        <Form onFinish={formFinish} ref={formRef} initialValues={{ sort: 0 }}>
          <Input.Group compact>
            < Form.Item name="id" noStyle >
              <Input style={{ display: 'none' }} />
            </Form.Item>
            <Form.Item name='href' rules={[{ required: true }]} hasFeedback>
              <Input style={{ width: 220, textAlign: 'left' }} placeholder="href, type in '#' if no value"></Input>
            </Form.Item>
            <Form.Item name='src' rules={[{ required: true }]} hasFeedback>
              <Input style={{ width: 220, textAlign: 'left' }} placeholder="image src"></Input>
            </Form.Item>
            <Form.Item name='alt' rules={[{ required: true }]} hasFeedback>
              <Input style={{ width: 200, textAlign: 'left' }} placeholder="image alt"></Input>
            </Form.Item>
            <Form.Item name='sort' rules={[{ required: true }]} hasFeedback>
              <InputNumber style={{ width: 60, textAlign: 'left' }} min={0} placeholder="sort"></InputNumber>
            </Form.Item>
            <Form.Item noStyle>
              <Button type="primary" htmlType="submit">保存</Button>
            </Form.Item>
          </Input.Group>
        </Form>
      </div>
      <Table
        rowKey='id'
        onRow={record => ({
          onDoubleClick: event => {
            formRef.current.setFieldsValue({
              id: record.id,
              alt: record.alt,
              href: record.href,
              src: record.src,
              sort: record.sort
            })
          }
        })}
        pagination={{ pageSize: 10 }}
        columns={columns(onSwitch, onDel)}
        dataSource={bannerList}
        style={{ height: '450px' }}
        size="small"
      />
    </div>
  );
}

const columns = (change, confirm) => ([
  {
    title: 'sort',
    dataIndex: 'sort',
    key: 'sort'
  },
  {
    title: 'alt',
    width: 120,
    dataIndex: 'alt',
    key: 'alt'
  },
  {
    title: 'href',
    dataIndex: 'href',
    key: 'href'
  },
  {
    title: 'src',
    dataIndex: 'src',
    key: 'src',
    width: 100,
    render: (text, record) => {
      return (<a className={styles.imgAlink} href={record.href || '#'} target="_blank" rel="noopener noreferrer">
        <img alt={record.alt} src={record.src} /></a>)
    }
  },
  {
    title: 'view',
    dataIndex: 'view',
    width: 60,
    key: 'view'
  },
  {
    title: 'click',
    dataIndex: 'click',
    width: 60,
    key: 'click'
  },
  {
    title: 'Action',
    key: 'operation',
    width: 50,
    render: (text, record) => (
      <div style={{ textAlign: 'center' }}>
        <Switch size="small" checkedChildren="上线" unCheckedChildren="下线" checked={!record.del_on} onChange={() => { change(record) }} />
        <br />
        <Popconfirm title="删除后将不可恢复,确认删除?" okText="是" cancelText="否" placement="leftTop" onConfirm={() => { confirm(record.id) }}>
          <Button type="danger" size="small" icon={<DeleteOutlined />} />
        </Popconfirm>
      </div>
    ),
  },
])