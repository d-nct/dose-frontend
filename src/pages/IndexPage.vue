<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-md text-weight-bold page-title">Feed</div>

    <div v-if="loading" class="flex flex-center q-my-xl">
      <q-spinner-dots color="primary" size="50px" />
    </div>

    <div v-else-if="!reviewsStore.reviews || reviewsStore.reviews.length === 0" class="text-center q-my-xl">
      <q-icon name="local_bar" size="4em" color="grey-5" />
      <p class="text-grey-7 q-mt-md">Nenhuma avaliação ainda. Seja o primeiro!</p>
    </div>

    <div v-else>
      <div v-for="review in reviewsStore.reviews" :key="review._id" class="review-item q-mb-lg">
        <div class="row items-center justify-between q-mb-sm">
          <div class="text-h6 text-weight-bold title-font">
            {{ review.drink?.nome }}, do {{ review.estabelecimento?.nome }}
          </div>
          <div class="text-caption text-grey-6">{{ formatDate(review.data_criacao) }}</div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-5">
            <q-img
              :src="review.drink?.imagem || defaultImageUrl"
              :ratio="1"
              class="rounded-borders"
            >
              <template v-slot:error>
                <div class="absolute-full flex flex-center bg-negative text-white">
                  Não foi possível carregar a imagem
                </div>
              </template>
            </q-img>
          </div>
          <div class="col-7">
            <div class="text-subtitle1">
              <span class="text-weight-bold">{{ review.usuario?.nome_usuario }}</span> disse:
            </div>
            <p class="q-mt-xs">{{ review.comentario }}</p>
            <q-rating
              :model-value="review.nota / 2"
              max="5"
              size="22px"
              color="primary"
              icon="star_border"
              icon-selected="star"
              icon-half="star_half"
              readonly
              half-increments
            />
            <div class="q-mt-md text-caption text-grey-5">
              <div>Preço: R$ {{ review.preco?.toFixed(2).replace('.', ',') }}</div>
              <div>{{ review.drink?.ingrediente_principal }}</div>
            </div>
          </div>
        </div>
        <q-separator class="q-mt-lg" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useReviewsStore } from 'src/stores/reviews-store';

const reviewsStore = useReviewsStore();
const loading = ref(false);
const defaultImageUrl = import.meta.env.VITE_DEFAULT_IMAGE_URL;

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

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

onMounted(() => {
  fetchReviews();
});
</script>

<style lang="scss" scoped>
.page-title, .title-font {
  font-family: 'Inknut Antiqua', serif;
}
.review-item .text-h6 {
  line-height: 1.2
}
</style>