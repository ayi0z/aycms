import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Input, Button, message, Form } from 'antd';
import { authClear, authSave } from '@/util/auth-storage'
import api from '@/util/api'
import { Component } from 'react';
import styles from './login.css';
import { history } from 'umi'

class LoginForm extends Component {
  state = {
    loading: false
  }

  componentDidMount() {
    authClear()
  }

  handleSubmit = values => {
    authClear()
    this.setState({ loading: true })
    fetch(`${api.API_DOMIN}/auth`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      body: new URLSearchParams(values).toString()
    }).then(res => {
      this.setState({ loading: false })
      return res.json()
    }).then((data) => {
      if (data.code === 200) {
        authSave(data.data)
        message.success({ content: '登入成功!', duration: 2 })
        history.push('/')
      } else {
        console.warn(`登陆失败[${data.code}]:${data.msg}`)
        message.warn({ content: `登陆失败[${data.code}]:${data.msg}`, duration: 3 })
      }
    }).catch(e => {
      this.setState({ loading: false })
      message.error({ content: `未知错误: ${e.message}`, duration: 3 })
      console.error(e)
    })
  }

  render() {
    const { loading } = this.state
    return (
      <div className={styles.normal}>
        <Form onFinish={this.handleSubmit} className={styles.login_form}>
          <Form.Item name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
            <Input prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Please input your Password!' }]}>
            <Input.Password prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} className={styles.login_form_button_login}>
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default LoginForm