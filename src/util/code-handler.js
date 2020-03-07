import { message } from 'antd'

const codeHandler = {
    500: '服务器内部错误',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
    401: '登陆失效，重新登陆',
    403: '资源不可用',
    404: '请求的资源在服务器上不存在',
    6404: '资源库连接失败，通常是因为网络不稳定或资源库服务器禁用了采集',
    6500: 'XML格式不正确，无法获取class.',
    6501: '无效参数.'
}
const codeCallbackHandler = {
    401: () => { require('umi/router').push('/account/login') }
}

export default (code, t = 'info') => {
    const msg = message[t]
    const ch = codeHandler[code]
    const call = codeCallbackHandler[code]

    if (msg && ch) msg(ch, 3)
    else if (msg && !call) msg(code, 3)

    if (call) call()
}