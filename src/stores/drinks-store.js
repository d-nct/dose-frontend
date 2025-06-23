import { defineStore } from 'pinia';
import { api } from 'boot/axios';

export const useDrinksStore = defineStore('drinks', {
  state: () => ({
    drinks: [],
  }),

  actions: {
    async fetchDrinks() {
      if (this.drinks.length > 0) return;
      try {
        const response = await api.get('/drinks');
        this.drinks = response.data;
      } catch (error) {
        console.error('Erro ao buscar a lista de drinks:', error);
      }
    },

    async createDrink(drinkData) {
      try {
        const response = await api.post('/drinks', drinkData);
        this.drinks.push(response.data);
        return response.data; // Retorna o drink recém-criado
      } catch (error) {
        console.error('Erro ao criar o drink:', error);
        throw error;
      }
    }
  },
});