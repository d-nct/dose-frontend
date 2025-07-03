import { defineStore } from 'pinia'
import { api } from 'boot/axios'

export const useReviewsStore = defineStore('reviews', {
  state: () => ({
    reviews: [],
    userReviews: [],
  }),

  actions: {
    async fetchReviews() {
      try {
        const response = await api.get('/avaliacoes')
        this.reviews = response.data
      } catch (error) {
        console.error('Erro ao buscar avaliações:', error)
        throw error
      }
    },

    async createReview(reviewData) {
      try {
        const response = await api.post('/avaliacoes', reviewData)
        // Adiciona a nova avaliação no início da lista para reatividade
        this.reviews.unshift(response.data)
      } catch (error) {
        console.error('Erro ao criar avaliação:', error)
        throw error
      }
    },

    async voteForReview(reviewId, voteType) {
      try {
        const response = await api.post(`/avaliacoes/${reviewId}/voto`, { tipoVoto: voteType })
        this.updateReviewInState(response.data)
      } catch (error) {
        console.error(`Erro ao registrar voto (${voteType}):`, error)
        throw error
      }
    },

    async upvoteReview(reviewId) {
      await this.voteForReview(reviewId, 'upvote')
    },

    async downvoteReview(reviewId) {
      await this.voteForReview(reviewId, 'downvote')
    },

    // Ação auxiliar para atualizar uma avaliação no state sem recarregar tudo
    updateReviewInState(updatedReview) {
      const index = this.reviews.findIndex((r) => r._id === updatedReview._id)
      if (index !== -1) {
        this.reviews[index] = updatedReview
      }
    },

    async fetchReviewById(reviewId) {
      try {
        const response = await api.get(`/avaliacoes/${reviewId}`)
        return response.data
      } catch (error) {
        console.error(`Erro ao buscar a avaliação ${reviewId}:`, error)
        throw error
      }
    },

    async fetchMyReviews(userId) {
      try {
        const response = await api.get(`/usuarios/${userId}/avaliacoes`)
        this.userReviews = response.data
      } catch (err) {
        console.error('Erro ao buscar suas avaliações:', err)
      }
    },
  },
})
