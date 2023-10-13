import axios from 'axios'
import jwt_decode from "jwt-decode"
import dayjs from 'dayjs'

export const API = (window.location.href.includes('localhost') || window.location.href.includes('127.0.0.1')) ? 'http://127.0.0.1:8000/api/v1' : 'https://txrchat-wrvliqvr4q-uc.a.run.app/api/v1'
// export const API = 'https://txrchat-wrvliqvr4q-uc.a.run.app/api/v1'

// export const DOC_WS_API =`wss://txrchat-wrvliqvr4q-uc.a.run.app/ws/doc/`;
export const DOC_WS_API =
window.location.href.includes("localhost") ||
window.location.href.includes("127.0.0.1")
? `ws://127.0.0.1:8000/ws/doc/`
: `wss://txrchat-wrvliqvr4q-uc.a.run.app/ws/doc/`;

// export const COMPARISON_WS_API =`wss://txrchat-wrvliqvr4q-uc.a.run.app/ws/comparison/`;
export const COMPARISON_WS_API =
window.location.href.includes("localhost") ||
window.location.href.includes("127.0.0.1")
? `ws://127.0.0.1:8000/ws/comparison/`
: `wss://txrchat-wrvliqvr4q-uc.a.run.app/ws/comparison/`;

let authTokens = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
export const authAxios = axios.create({
    API,
    headers:{Authorization: `Bearer ${authTokens ? authTokens.access : null}`}
});

export const getDispositionFilename = (disposition) => {
    let filename = "";
    if (disposition && disposition.startsWith('attachment')) {
        var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        var matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
    }
    return filename
}

export async function refreshToken() {
    try {
        const response = await axios.post(`${API}/token/refresh/`, {
            refresh: authTokens.refresh
        });
        localStorage.setItem('authTokens', JSON.stringify(response.data))
        return response.data.access
    } catch (err) {
        if (err.response.status === 401) {
            localStorage.removeItem('authTokens')
            window.location.href = window.location.origin
        }
        throw err
    }
}

authAxios.interceptors.request.use(async req => {
    if(authTokens){
        req.headers.Authorization = `Bearer ${authTokens ? authTokens.access : null}`
        if (authTokens?.access) {
            const user = jwt_decode(authTokens.access)
            const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
            if(!isExpired) return req
        }
        try {
            const response = await axios.post(`${API}/token/refresh/`, {
                refresh: authTokens?.refresh
            });
            localStorage.setItem('authTokens', JSON.stringify(response.data))
            req.headers.Authorization = `Bearer ${response.data.access}`
            return req  
        } catch(err) {
            localStorage.removeItem('authTokens')
            window.location.href = window.location.origin
            // log in again
            // if (err.response.status == 401) {}
        }
    } else {
        if (!(window.location.href == window.location.origin)) {
            window.location.href = window.location.origin
        }
    }
})