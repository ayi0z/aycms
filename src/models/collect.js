import request from '@/util/request'
import api from '@/util/api'
import qs from 'qs'

export default {
    namespace: 'collect',
    state: {
        collectId: 0,
        dataList: []
    },
    effects: {
        *query({ payload }, { call, put }) {
            const result = yield call(() => (request.get(api.collect, { params: payload })))
            const { code, data } = result
            if (code === 200) {
                yield put({
                    type: 'querySuccess',
                    payload: {
                        list: data
                    }
                })
            }
        },
        *querySingle({ payload, callback }, { call, put }) {
            const result = yield call(() => (request.get(`${api.collect}/${payload.id}`)))
            // const { code, data } = result
            // if (code === 200) {
            //     yield put({ type: 'querySingleSucc', payload: data })
            // }
            if (callback) callback(result)
        },
        *delete({ payload }, { call, put }) {
            const result = yield call(() => (request.delete(api.collect, { params: { ids: payload } })), payload)
            const { code } = result
            if (code === 200) {
                const result = yield call(() => (request.get(api.collect)))
                const { code, data } = result
                if (code === 200) {
                    yield put({ type: 'querySuccess', payload: { list: data } })
                }
            }
        },
        *save({ payload }, { call, put }) {
            const result = yield call(() => {
                return payload.id
                    ? request.put(`${api.collect}/${payload.id}`, { data: qs.stringify(payload) })
                    : request.post(api.collect, { data: qs.stringify(payload) })
            }, payload)
            const { code } = result
            const newCollectId = payload.id || result.data
            if (code === 200) {
                const result = yield call(() => (request.get(api.collect)))
                const { code, data } = result
                if (code === 200) {
                    yield put({ type: 'querySuccess', payload: { list: data, collectId: newCollectId } })
                }
            }
        },
        *queryClass({ payload, callback }, { call }) {
            const result = yield call(() => (request.get(`${api.collect_class}/${payload.id}`)))
            if (callback) callback(result)
        }
    },
    reducers: {
        querySuccess(state, { payload }) {
            const { list, collectId } = payload
            return {
                ...state,
                collectId,
                dataList: list
            }
        },
        querySingleSucc(state, { payload }) {
            return {
                ...state,
                api: payload
            }
        },
        setApiId(state, { payload }) {
            const { collectId } = payload
            return {
                ...state,
                collectId: collectId
            }
        },
        clearApi(state) {
            return {
                ...state,
                collectId: 0
            }
        }
    }
}