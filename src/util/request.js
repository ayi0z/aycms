import { extend } from 'umi-request'
import { authRead } from '@/util/auth-storage'
import codeHandler from '@/util/code-handler'
import api from './api'

const request = extend({
    prefix: api.API_DOMIN,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    errorHandler(error) {
        if (error.response) {
            // 请求已发送但服务端返回状态码非 2xx 的响应
            // console.log(error.response.status);
            // console.log(error.response.headers);
            // console.log(error.data);
            // console.log(error.request);
            // console.log(codeMap[error.data.status])
            codeHandler(error.response.status, 'error')

        } else {
            // 请求初始化时出错或者没有响应返回的异常
            console.error(error.message);
            codeHandler(error.message, 'error')
        }
        throw error;
    },
})

request.interceptors.request.use(async (url, options) => {
    return ({
        options: {
            ...options,
            interceptors: true,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${authRead()}`
            }
        }
    })
})

request.interceptors.response.use(async (response) => {
    if (response.status === 200) {
        const { code } = await response.clone().json();
        if (code !== 200) {
            codeHandler(code, 'warn')
        }
    } else {
        codeHandler(response.status, 'warn')
    }
    return response;
});

export default request