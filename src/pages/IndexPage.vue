<template>
  <q-page class="q-pa-md">
    <div class="text-h6 q-mb-md text-weight-bold page-title">Tá na boca do povo:</div>

    <div v-if="loading" class="flex flex-center q-my-xl">
      <q-spinner-dots color="primary" size="50px" />
    </div>

    <div v-else-if="!reviewsStore.reviews || reviewsStore.reviews.length === 0" class="text-center q-my-xl">
      <q-icon name="local_bar" size="4em" color="grey-5" />
      <p class="text-grey-7 q-mt-md">Nenhuma avaliação ainda. Seja o primeiro!</p>
    </div>

    <div v-else>
      <ReviewCard v-for="review in reviewsStore.reviews" :key="review._id" :review="review" />
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useReviewsStore } from 'src/stores/reviews-store';
import ReviewCard from 'src/components/ReviewCard.vue';

const reviewsStore = useReviewsStore();
const loading = ref(false);

const fetchReviews = async () => {
  loading.value = true;
  try {
    await reviewsStore.fetchReviews();
  } catch (error) {
    console.error('Erro ao buscar as avaliações:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchReviews();
});
</script>

<style lang="scss" scoped>
.page-title {
  font-family: 'Inknut Antiqua', serif;
}
</style>
