import mockjs from 'mockjs'
import { delay } from 'roadhog-api-doc'

let mockdata = mockjs.mock({
    'data|10': [{
        id: '@increment',
        key: '@increment',
        name: '@first',
        apiurl: '@url',
        params: '',
        'apitype|1': ['video', 'article'],
        'datatype|1': ['xml', 'json'],
        'updatemode|1': ['addupdate', 'add', 'update']
    }]
})

const proxy = {
    'GET /api/collect': (req, res) => {
        const { id } = req.query
        const mid = parseInt(id)
        res.send({
            status: 'ok',
            data: mockdata.data.find(m => m.id === mid)
        })
    },
    'GET /api/collects': (req, res) => {
        res.send({
            status: 'ok',
            data: mockdata.data
        })
    },
    'DELETE /api/collects': (req, res) => {
        const ids = req.body.ids.split(',')
        mockdata.data = mockdata.data.filter(c => !ids.includes(`${c.id}`))

        res.send({
            status: 'ok',
            data: req.body.ids.split(',')
        })
    },
    'POST /api/collects': (req, res) => {
        res.send({
            status: 'ok'
        })
    },
    'GET /api/collect/progress': (req, res) => {
        res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": '*',
        })
        res.write("event:taskinfo\n")
        res.write("data:"+JSON.stringify({total:36, currentidx:5})+"\n\n")
        res.flush("retry: 10000\n");

        let interval = setInterval(() => {
            res.write("event:progress\n")
            res.write("data:" + JSON.stringify(mockjs.mock({
                "progress|1": [
                    {
                        key: '@guid',
                        name: '死神来了6',
                        upmode: '入库',
                        result: 'ok'
                    },
                    {
                        key: '@guid',
                        name: '战神',
                        upmode: '入库',
                        result: 'ok'
                    },
                    {
                        key: '@guid',
                        name: '魁拔',
                        upmode: '更新资源',
                        result: 'fail'
                    }
                ]
            }).progress) + "\n\n")
            res.flush("retry: 10000\n");
        }, 1000)

        setTimeout(() => {
            clearInterval(interval)
            res.write('event:finish\n')
            res.write('data:0\n\n')
            res.flush();
        }, 20000)
    }
}

export default delay(proxy, 1000)