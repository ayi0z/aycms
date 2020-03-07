import request from '@/util/request'
import api from '@/util/api'
import qs from 'qs'

export default {
    mamespace: 'classmap',
    state: {
        dataList: []
    },
    effects: {
        *queryList({ payload, callback }, { call, put }) {
            const result = yield call(() => (request.get(`${api.classmap}/${payload.cid}`)))
            const { code, data } = result
            if (code === 200) {
                yield put({
                    type: 'queryListSuccess', payload: { list: data }
                })
            }
            if (callback) callback(result)
        },
        *save({ payload, callback }, { call, put }) {
            const result = yield call(() => (request.post(api.classmap, { data: qs.stringify(payload) })), payload)
            if (callback) callback(result)
        }
    },
    reducers: {
        queryListSuccess(state, { payload }) {
            const { list } = payload
            return {
                ...state,
                dataList: list
            }
        },
    }
}