<template>
  <div>
    <div v-if="loading" class="text-center q-py-xl">
      <q-spinner-dots color="primary" size="40px" />
    </div>
    <div v-else-if="reviewsStore.userReviews.length === 0" class="text-center text-grey q-py-xl">
      <q-icon name="rate_review" size="60px" class="q-mb-md" />
      <p class="text-h6">Nenhuma avaliação encontrada.</p>
      <p>Parece que você ainda não avaliou nenhum drink.</p>
    </div>
    <div v-else>
      <ReviewCard v-for="review in reviewsStore.userReviews" :key="review._id" :review="review" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from 'src/stores/auth-store';
import { useReviewsStore } from 'src/stores/reviews-store';
import ReviewCard from 'src/components/ReviewCard.vue';

const loading = ref(true);
const authStore = useAuthStore();
const reviewsStore = useReviewsStore();

async function fetchMyReviews() {
  if (!authStore.usuario || !authStore.usuario._id) {
    loading.value = false;
    return;
  }

  loading.value = true;

  try {
    await reviewsStore.fetchMyReviews(authStore.usuario._id);
  } catch (error) {
    console.error('Erro ao buscar suas avaliações:', error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchMyReviews();
});
</script>

<style lang="scss" scoped>
.page-title,
.title-font {
  font-family: 'Inknut Antiqua', serif;
}

.review-item .text-h6 {
  line-height: 1.2
}

/* O reset para o router-link */
.review-item-link,
.review-item-link:hover,
.review-item-link:visited,
.review-item-link:active {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

/* Opcional: Estilo para o parágrafo do comentário para controle de overflow, se necessário */
.comment-text {
  overflow: hidden;
  // text-overflow: ellipsis;
  // display: -webkit-box;
  // -webkit-line-clamp: 3; // Limita a 3 linhas, por exemplo. Pode ser uma alternativa ao JS.
  // -webkit-box-orient: vertical;
}
</style>
