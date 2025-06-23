import { defineStore } from 'pinia';
import axios from 'axios';

// A URL base da sua API
const API_URL = import.meta.env.VITE_API_URL;

export const useReviewsStore = defineStore('reviews', {
  state: () => ({
    reviews: [],
  }),

  actions: {
    async fetchReviews() {
      try {
        const response = await axios.get(`${API_URL}/avaliacoes`); // Endpoint para buscar avaliações
        this.reviews = response.data;
      } catch (error) {
        console.error('Erro ao buscar avaliações:', error);
        throw error;
      }
    },

    async createReview(reviewData) {
      try {
        const response = await axios.post(`${API_URL}/avaliacoes`, reviewData); // Endpoint para criar avaliação
        // Adiciona a nova avaliação no início da lista para reatividade
        this.reviews.unshift(response.data);
      } catch (error) {
        console.error('Erro ao criar avaliação:', error);
        throw error;
      }
    },
  },
});