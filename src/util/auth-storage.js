const X_AUTH_TOKEN = 'x-auth-token'

export function authSave(token){
    localStorage.setItem(X_AUTH_TOKEN, token)
} 

export function authRead(){
    return localStorage.getItem(X_AUTH_TOKEN)
}

export function authClear(){
    localStorage.removeItem(X_AUTH_TOKEN)
}

export default {
    authSave,
    authRead,
    authClear
}