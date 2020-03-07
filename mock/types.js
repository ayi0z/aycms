import mockjs from 'mockjs'
import { delay } from 'roadhog-api-doc'

let mockdata = mockjs.mock({
    'data|10': [{
        id: '@increment',
        key: '@increment',
        name: '@first',
        sort: '@increment',
        'type|1': ['video', 'article'],
        'prelevel|1': [0, 1, 2, 3, 4],
        'children|2': [{
            id: '@increment',
            key: '@increment',
            name: '@first',
            sort: '@increment',
            'type|1': ['video', 'article'],
            'prelevel|1': [0, 1, 2, 3, 4]
        }]
    }]
})

const proxy = {
    'GET /api/types': (req, res) => {
        res.send({
            status: 'ok',
            data: mockdata.data
        })
    },
    'DELETE /api/types': (req, res) => {
        const ids = req.body.ids.split(',')
        mockdata.data = mockdata.data.filter(c => !ids.includes(`${c.id}`))

        res.send({
            status: 'ok',
            data: req.body.ids.split(',')
        })
    },
    'POST /api/types': (req, res) => {
        res.send({
            status: 'ok'
        })
    }
}

export default delay(proxy, 1000)