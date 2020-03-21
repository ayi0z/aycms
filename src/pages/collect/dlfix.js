
import styles from './dlfix.css';
import React from 'react'
import api from "@/util/api";
import request from '@/util/request'
import { Form, Button, Input, notification } from 'antd'
import { formItemLayout, tailFormItemLayout } from '@/util/form-layout'
import qs from 'qs'

export default function (props) {

  const doReplace = values => {
    if (!props.collectId) return

    request.put(`${api.fixdl}/${props.collectId}`, { data: qs.stringify(values) })
      .then(data => {
        if (data.code === 200) {
          notification.success({
            message: `检查完成`,
            description: `本次共检查了 ${data.data} 条播放链接.`,
            placement: 'bottomRight'
          })
        }
      })
  }

  return (
    <div className={styles.normal}>
      <Form {...formItemLayout} onFinish={doReplace}>
        <Form.Item label='旧 URL:' name='oldurl' rules={[{ required: true, min:10 }]} hasFeedback>
          <Input placeholder="将要被替换的url" />
        </Form.Item>
        <Form.Item label='新 URL:' name='newurl' rules={[{ required: true, min:10 }]} hasFeedback>
          <Input placeholder="替换后的url" />
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">替换</Button>
        </Form.Item>
      </Form>
    </div>
  );
}
