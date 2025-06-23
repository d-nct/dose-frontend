import { defineStore } from 'pinia';
import axios from 'axios'; // Usaremos axios para as chamadas

// A URL base da sua API no Render
const API_URL = 'https://sua-api.onrender.com/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('userToken') || null,
    usuario: JSON.parse(localStorage.getItem('userData')) || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(credentials) {
      try {
        // Faz a chamada para a sua API de login
        const response = await axios.post(`${API_URL}/usuarios/login`, credentials);

        const { token, ...userData } = response.data;

        // Armazena o token no estado e no localStorage
        this.token = token;
        localStorage.setItem('userToken', token);

        // Armazena os dados do usuário
        this.usuario = userData;
        localStorage.setItem('userData', JSON.stringify(userData));

        // Configura o cabeçalho do axios para requisições futuras
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      } catch (error) {
        // Se der erro, limpa qualquer dado antigo e propaga o erro
        this.logout();
        throw error;
      }
    },

    logout() {
      this.token = null;
      this.usuario = null;
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      delete axios.defaults.headers.common['Authorization'];
      // Em uma aplicação real, você redirecionaria para a página de login aqui
      // this.router.push('/login');
    },
  },
});