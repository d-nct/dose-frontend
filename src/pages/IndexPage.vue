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
      <div v-for="review in reviewsStore.reviews" :key="review._id" class="review-item q-mb-lg">
        <div class="row items-center justify-between q-mb-sm">
          <div class="text-h7 text-weight-bold title-font">
            {{ review.drink?.nome || "Birinight" }}, de {{ review.estabelecimento?.nome || "um botequim qualquer" }}
          </div>
          <div class="text-caption text-grey-6">{{ formatDate(review.data_criacao) || "Não lembro quando"
          }}</div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-5 flex flex-column items-center"> <q-img :src="review.drink?.imagem || defaultImageUrl"
              :ratio="1" class="rounded-borders q-mb-sm"> <template v-slot:error>
                <div class="absolute-full flex flex-center bg-negative text-white">
                  Não foi possível carregar a imagem
                </div>
              </template>
            </q-img>

            <q-rating :model-value="review.nota / 2" max="5" size="22px" color="primary" icon="star_border"
              icon-selected="star" icon-half="star_half" readonly half-increments class="q-mb-xs" />
            <div class="text-caption text-grey-5">
              <div>Preço: R$ {{ review.preco?.toFixed(2).replace('.', ',') || "??" }}</div>
            </div>
            <div class="text-caption text-grey-5">
              <div>Destilado: {{ review.drink?.destilado_base || "??" }}</div>
            </div>
          </div>

          <div class="col-7">
            <div class="text-subtitle1">
              <span class="text-weight-bold">{{ review.usuario?.nome_usuario || "Alguém" }}</span> disse:
            </div>
            <p class="q-mt-xs comment-text">
              {{ isExpanded(review._id) ? (review.comentario || "Na verdade, nada declarou...") :
                truncateComment(review.comentario) }}
            </p>
            <q-btn v-if="shouldShowToggleButton(review.comentario)" flat dense no-caps size="sm" color="primary"
              :label="isExpanded(review._id) ? 'Ver menos' : 'Ver mais'" @click="toggleExpand(review._id)" />
            <q-btn v-else flat dense no-caps size="sm" color="primary" label="Ver mais"
              :to="{ name: 'review-details', params: { id: review._id } }" />
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

const expandedReviews = ref({});
const CHARACTER_LIMIT = 200;

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

const truncateComment = (comment) => {
  if (!comment) return "Na verdade, nada declarou...";
  if (comment.length <= CHARACTER_LIMIT) {
    return comment;
  }
  return comment.substring(0, CHARACTER_LIMIT) + '...';
};

const shouldShowToggleButton = (comment) => {
  return comment && comment.length > CHARACTER_LIMIT;
};

const isExpanded = (reviewId) => {
  return expandedReviews.value[reviewId];
};

const toggleExpand = (reviewId) => {
  expandedReviews.value = {
    ...expandedReviews.value,
    [reviewId]: !expandedReviews.value[reviewId]
  };
};

onMounted(() => {
  fetchReviews();
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

/* Opcional: Estilo para o parágrafo do comentário para controle de overflow, se necessário */
.comment-text {
  overflow: hidden;
  // text-overflow: ellipsis;
  // display: -webkit-box;
  // -webkit-line-clamp: 3; // Limita a 3 linhas, por exemplo. Pode ser uma alternativa ao JS.
  // -webkit-box-orient: vertical;
}
</style>
