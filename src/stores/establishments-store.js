import { defineStore } from 'pinia';
import { api } from 'boot/axios';

export const useEstablishmentsStore = defineStore('establishments', {
  state: () => ({
    establishments: [],
  }),

  actions: {
    async fetchEstablishments() {
      if (this.establishments.length > 0) return;
      try {
        const response = await api.get('/estabelecimentos');
        this.establishments = response.data;
      } catch (error) {
        console.error('Erro ao buscar a lista de estabelecimentos:', error);
      }
    },

    async createEstablishment(establishmentData) {
      try {
        const response = await api.post('/estabelecimentos', establishmentData);
        this.establishments.push(response.data);
        return response.data;
      } catch (error) {
        console.error('Erro ao criar o estabelecimento:', error);
        throw error;
      }
    }
  },
});