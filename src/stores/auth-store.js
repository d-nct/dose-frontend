// src/stores/auth-store.js

import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('userToken') || null,
    usuario: JSON.parse(localStorage.getItem('userData')) || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    canManageContent: (state) => {
      return state.usuario && state.usuario.credencial > 1;
    },
    canManagePeople: (state) => {
      return state.usuario && state.usuario.credencial > 2;
    },
    isGod: (state) => {
      return state.usuario && state.usuario.credencial > 3;
    },
  },

  actions: {
    async register(credentials) {
      const response = await api.post(`/usuarios/`, credentials);
      return response.data;
    },

    async login(credentials) {
      try {
        const response = await api.post(`/usuarios/login`, credentials);

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

    setUser(userData) {
      this.usuario = userData;
      localStorage.setItem('userData', JSON.stringify(userData));
    },
  },
});