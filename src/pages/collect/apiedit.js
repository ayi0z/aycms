import styles from './apiedit.css';
import React, { Component } from 'react'
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Input, Radio, Button, Tooltip, Form } from 'antd';
import { formItemLayout, tailFormItemLayout } from '@/util/form-layout'
import { connect } from 'dva'

@connect(({ collect, loading }) => ({ collect, loading: loading }))
class ApiEdit extends Component {
    state = {
        api: null
    }
    handleSubmit = values => {
        values['params'] = values['params'] || ''
        values['weburl'] = values['weburl'] || ''
        const { dispatch } = this.props
        dispatch({ type: 'collect/save', payload: values })
    }

    formRef = React.createRef()

    componentDidMount() {
        const { dispatch, collect } = this.props
        const { collectId } = collect
        if (collectId) {
            dispatch({
                type: 'collect/querySingle',
                payload: { id: collectId },
                callback: res => {
                    if (res.code === 200) {
                        this.setState({ api: res.data }, ()=>{
                            this.formRef.current.resetFields()
                        })
                    }
                }
            })
        }
    }

    render() {
        const { loading } = this.props
        const { api } = this.state
        return (
            <div className={styles.normal}>
                <Form ref={this.formRef} {...formItemLayout} onFinish={this.handleSubmit}
                    initialValues={{
                        id: api && api.id,
                        name: api && api.name,
                        weburl: api && api.weburl,
                        apiurl: api && api.apiurl,
                        params: api && api.params,
                        datatype: api && api && api.datatype || 'xml',
                        apitype: api && api.apitype || 'video',
                        updatemode: api && api.updatemode || 'addupdate',
                    }}>
                    < Form.Item label="id" name="id" noStyle >
                        <Input style={{ display: 'none' }} />
                    </Form.Item>
                    < Form.Item label="资源名称" name="name" hasFeedback
                        rules={[{ required: true, message: '请填写资源名称!' }]} >
                        <Input value={api && api.name} />
                    </Form.Item>
                    <Form.Item label="官网地址" name="weburl" hasFeedback>
                        <Input placeholder='官网地址' />
                    </Form.Item>
                    <Form.Item label="接口URL" name="apiurl" hasFeedback
                        rules={[{ required: true, message: '请填写接口URL!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label={<span>附加参数&nbsp;
                        <Tooltip title="提示信息：一般&开头，例如老版xml格式采集下载地址需加入&ct=1">
                            <QuestionCircleOutlined />
                        </Tooltip>
                    </span>} name="params" hasFeedback>
                        <Input />
                    </Form.Item>
                    <Form.Item label="数据格式" name="datatype" rules={[{ required: true }]}>
                        <Radio.Group>
                            <Radio value="xml">xml</Radio>
                            <Radio value="json">json</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="资源类型" name="apitype" rules={[{ required: true }]}>
                        <Radio.Group>
                            <Radio value="video">视频</Radio>
                            <Radio value="article" disabled>文章</Radio>
                            <Radio value="picture" disabled>图片</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label={<span>数据处理&nbsp;
                        <Tooltip title="提示信息：如果某个资源作为副资源不想新增数据，可以只勾选更新。">
                            <QuestionCircleOutlined />
                        </Tooltip>
                    </span>} name="updatemode" rules={[{ required: true }]}>
                        <Radio.Group>
                            <Radio value="addupdate">新增+更新</Radio>
                            <Radio value="add">新增</Radio>
                            <Radio value="update">更新</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" loading={loading.effects['collect/querySingle'] || loading.effects['collect/save']} htmlType="submit" style={{ marginRight: '5px' }}>保存</Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

export default ApiEdit
