<template>
  <!-- <q-page class="fullscreen dark-page flex flex-center column"> -->
  <q-page class="q-pa-md flex">
    <!-- <q-page-sticky position="top-left" :offset="[18, 18]"> <q-btn icon="arrow_back" flat dense round color="grey-5"
        @click="voltar" />
    </q-page-sticky> -->

    <div v-if="loading" class="flex flex-center q-my-xl">
      <q-spinner-dots color="primary" size="50px" />
    </div>

    <div v-else-if="!review" class="text-center q-my-xl">
      <q-icon name="error_outline" size="4em" color="grey-5" />
      <p class="text-grey-7 q-mt-md">Avaliação não encontrada.</p>
      <q-btn to="/" label="Voltar para a Home" color="primary" flat />
    </div>

    <div v-else class="review-details">
      <q-card flat bordered>
        <div class="review-item q-mb-lg no-link-style">
          <div class="row items-center justify-between q-mb-sm">
            <div class="text-h7 text-weight-bold title-font">
              {{ review.drink?.nome || "Drink não especificado" }}, de {{ review.estabelecimento?.nome || "Estabelecimento não informado" }}
            </div>
            <div class="text-caption text-grey-6">
              Avaliado em {{ formatDate(review.data_criacao) }}
            </div>
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-5 flex flex-column items-center">
              <q-img :src="getImageUrl(review.imagem) || defaultImageUrl" :ratio="1" class="rounded-borders q-mb-sm" style="max-width: 300px">
                <template v-slot:error>
                  <div class="absolute-full flex flex-center bg-negative text-white">
                    Imagem não disponível
                  </div>
                </template>
              </q-img>

              <q-rating :model-value="review.nota / 2" max="5" size="2em" color="primary" icon="star_border"
                icon-selected="star" icon-half="star_half" readonly half-increments class="q-mb-xs" />

              <div class="text-caption text-grey-5 full-width">
                <span class="text-weight-bold">Preço:</span> R$ {{ (review.preco?.$numberDecimal ?
                parseFloat(review.preco.$numberDecimal).toFixed(2).replace('.', ',') :
                '??') }}
              </div>

              <div class="text-caption text-grey-5 full-width">
                <span class="text-weight-bold">Destilado Base:</span> {{ review.drink?.destilado_base || 'Não informado' }}
              </div>
            </div>

            <div class="col-12 col-md-7">
              <div class="text-subtitle1 text-weight-bold">
                {{ review.usuario?.nome_usuario || "Um usuário anônimo" }} comentou:
              </div>
              <p class="text-black q-mt-sm comment-box">
                {{ review.comentario || "Nenhum comentário deixado." }}
              </p>
            </div>
          </div>
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, /* useRouter */ } from 'vue-router';
import { useReviewsStore } from 'src/stores/reviews-store';
// import { useDrinksStore } from 'src/stores/drinks-store'; // Importa o store de drinks

const route = useRoute();
// const router = useRouter();
const reviewsStore = useReviewsStore();
// const drinksStore = useDrinksStore(); // Instancia o store de drinks

const loading = ref(false);
const review = ref(null);
const defaultImageUrl = import.meta.env.VITE_DEFAULT_IMAGE_URL;

const reviewId = computed(() => route.params.id);

const fetchReviewDetails = async () => {
  if (!reviewId.value) return;

  loading.value = true;
  try {
    const fetchedReview = await reviewsStore.fetchReviewById(reviewId.value);

    // Se o drink não veio populado ou não tem o destilado, busca em separado
    // if (fetchedReview && fetchedReview.drink && !fetchedReview.drink.destilado_base) {
    //   const fullDrink = await drinksStore.fetchDrinkById(fetchedReview.drink._id);
    //   fetchedReview.drink = fullDrink; // Substitui o objeto 'drink' pela versão completa
    // }

    review.value = fetchedReview;

  } catch (error) {
    console.error('Erro ao buscar detalhes da avaliação:', error);
    review.value = null;
  } finally {
    loading.value = false;
  }
};

const getImageUrl = (caminhoRelativo) => {
  if (!caminhoRelativo) {
    return defaultImageUrl;
  }

  // Garante que as barras estejam no formato correto para URL (/)
  const caminhoCorrigido = caminhoRelativo.replace(/\\/g, '/');

  // Monta e retorna a URL completa
  return `${import.meta.env.VITE_API_URL}/${caminhoCorrigido}`;
};

const formatDate = (dateString) => {
  if (!dateString) return 'Data não disponível';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

// const voltar = () => {
//   if (window.history.length > 1) {
//     router.go(-1);
//   } else {
//     router.push({ path: '/' });
//   }
// };

onMounted(() => {
  fetchReviewDetails();
});
</script>

<style lang="scss" scoped>
.title-font {
  font-family: 'Inknut Antiqua', serif;
}

.review-details {
  max-width: 900px;
  margin: 0 auto;
}

.comment-box {
  background-color: #f9f9f9;
  border-left: 4px solid $primary;
  padding: 16px;
  border-radius: 4px;
  white-space: pre-wrap; // Preserva quebras de linha e espaços
}

.review-item .text-h6 {
  line-height: 1.2
}

.review-item-link,
.review-item-link:hover,
.review-item-link:visited,
.review-item-link:active {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.comment-text {
  overflow: hidden;
}

.no-link-style {
  text-decoration: none;
  color: inherit;
  cursor: default;
}
</style>
