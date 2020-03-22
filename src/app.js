import { authRead } from '@/util/auth-storage'
import api from '@/util/api'
import { history } from 'umi'

export const dva = {
    config: {
        onError(err) {
            err.preventDefault();
            console.error('dva onerr: ', err.message);
        },
    },
};

export function render(oldRender) {
    const auto_token = authRead()
    if (auto_token) {
        fetch(`${api.API_DOMIN}/authchk`, {
            method: 'GET',
            headers: new Headers({ Authorization: `Bearer ${auto_token}` })
        }).then(res => res.json())
            .then(data => {
                if (data.code === 200) {
                    oldRender()
                } else {
                    history.push('/account/login')
                    oldRender()
                }
            }).catch(e => console.error(e))
    } else {
        history.push('/account/login')
        oldRender()
    }
}