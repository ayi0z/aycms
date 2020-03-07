import request from '@/util/request'
import api from '@/util/api'

export default {
    mamespace: 'video',
    state: {
        rowsCount: 0,
        dataList: []
    },
    effects: {
        *queryList({ payload }, { call, put }) {
            const result = yield call(() => (request.get(api.video, { params: payload })))
            const { code, data } = result
            if (code === 200) {
                yield put({
                    type: 'queryListSuccess', payload: { list: data }
                })
            }
        },
        *queryPage({ payload }, { call, put }) {
            const result = yield call(() => (request.get(api.video_page, { params: payload })))
            const { code, data } = result
            if (code === 200) {
                yield put({
                    type: 'queryListSuccess', payload: { list: data.rows, rowsCount: data.rowsCount }
                })
            }
        }
    },
    reducers: {
        queryListSuccess(state, { payload }) {
            const { list, rowsCount } = payload
            return {
                ...state,
                rowsCount,
                dataList: list
            }
        },
        clearList(state, { payload }) {
            return {
                ...state,
                dataList: []
            }
        }
    }
}