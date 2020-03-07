import request from '@/util/request'
import api from '@/util/api'

export default {
    mamespace: 'videoDl',
    state: {
        dataList: []
    },
    effects: {
        *queryList({ payload, callback }, { call, put }) {
            const result = yield call(() => (request.get(`${api.videodl}/${payload.vid}/${payload.cid}`)))
            const { code, data } = result
            if (code === 200) {
                yield put({
                    type: 'queryListSuccess', payload: { list: data }
                })
            }
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