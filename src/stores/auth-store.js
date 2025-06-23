// src/stores/auth-store.js

import { defineStore } from 'pinia';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('userToken') || null,
    usuario: JSON.parse(localStorage.getItem('userData')) || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async register(credentials) {
      const response = await axios.post(`${API_URL}/usuarios/`, credentials);
      return response.data;
    },

    async login(credentials) {
      try {
        const response = await axios.post(`${API_URL}/usuarios/login`, credentials);

        const { token, ...userData } = response.data;

        this.token = token;
        localStorage.setItem('userToken', token);

        this.usuario = userData;
        localStorage.setItem('userData', JSON.stringify(userData));

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      } catch (error) {
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
    },
  },
});