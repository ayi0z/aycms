
const AUTH_TOKEN = 'asldjfaskdjfjwoqieuoqwejrlkwqeoif'

export default {
    'POST /api/account/login': (req, res) => {
        if(req.body.username === 'admin' && req.body.password === '1234') {
            res.send({
                status:'ok',
                authToken: AUTH_TOKEN 
            })
        }else{
            res.send({
                status:'fail',
                msg:'login failed'
            })
        }
        
    },
    'POST /api/account/loginchk': (req, res) => {
        if(req.headers.authorization === AUTH_TOKEN) {
            res.send({ status:'ok' })
        }else { res.send({ status:'fail' }) }
    },
}