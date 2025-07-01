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
      <router-link v-for="review in reviewsStore.reviews" :key="review._id"
        :to="{ name: 'review-details', params: { id: review._id } }" class="review-item-link">
        <div class="review-item q-mb-lg">
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

              <!-- Coloca em full width para não concatenar com o Destilado -->
              <div class="text-caption text-grey-5 full-width">
                Preço: R$ {{ (review.preco?.$numberDecimal ?
                  parseFloat(review.preco.$numberDecimal).toFixed(2).replace('.', ',') :
                '??') }}
              </div>

              <div class="text-caption text-grey-5 full-width">
                Destilado: {{ review.destilado_base || "??" }}
              </div>
            </div>

            <div class="col-7">
              <div class="text-subtitle1">
                <span class="text-weight-bold">{{ review.usuario?.nome_usuario || "Alguém" }}</span> disse:
              </div>
              <p class="q-mt-xs comment-text">
                {{ truncateComment(review.comentario) || "Na verdade, nada declarou..." }}
              </p>
            </div>
          </div>
          <q-separator class="q-mt-lg" />
        </div>
      </router-link>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useReviewsStore } from 'src/stores/reviews-store';

const reviewsStore = useReviewsStore();
const loading = ref(false);
const defaultImageUrl = import.meta.env.VITE_DEFAULT_IMAGE_URL;

const CHARACTER_LIMIT = 310;

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
