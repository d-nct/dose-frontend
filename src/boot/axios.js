import axios from 'axios'

// Exemplo de como pegar o token do store de autenticação
import { useAuthStore } from 'src/stores/auth-store'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

export default ({ app /*, router */ }) => {
  // Seta o token em todas as requisições, se estiver logado
  api.interceptors.request.use(config => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  })

  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
}

export { api }