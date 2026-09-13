import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
})

api.interceptors.request.use((config) => {
    let token = localStorage.getItem('access_token')
    if (token) {
        token = token.replace(/"/g, '').trim()
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config

        if (original.url?.includes('/auth/logout/')) {
            return Promise.reject(error)
        }

        if (error.response?.status === 401 && !original._retry) {
            original._retry = true
            let refresh = localStorage.getItem('refresh_token')

            if (refresh) {
                refresh = refresh.replace(/"/g, '').trim()
                try {
                    const res = await axios.post(`${BASE_URL}/auth/token/refresh/`, {
                        refresh: refresh
                    })

                    const newToken = res.data.access
                    localStorage.setItem('access_token', newToken)

                    original.headers.Authorization = `Bearer ${newToken}`
                    return api(original)
                } catch (refreshError) {
                    localStorage.clear()
                    window.location.href = '/login'
                    return Promise.reject(refreshError)
                }
            } else {
                localStorage.clear()
                window.location.href = '/login'
            }
        }
        return Promise.reject(error)
    }
)

export default api