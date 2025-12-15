import axios from 'axios'

export const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8080',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Não redirecionar em rotas de autenticação inicial
    const isAuthRoute = error.config?.url?.includes('/api/auth')

    if (error.response?.status === 401 && !isAuthRoute) {
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    }
    return Promise.reject(error)
  }
)
