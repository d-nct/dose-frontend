<template>
  <q-page class="q-pa-lg bg-grey-10 text-white">
    <div v-if="loading" class="flex flex-center q-my-xl">
      <q-spinner-dots color="primary" size="50px" />
    </div>

    <div v-else-if="!review" class="text-center q-my-xl">
      <q-icon name="error_outline" size="4em" color="grey-5" />
      <p class="text-grey-7 q-mt-md">Avaliação não encontrada.</p>
      <q-btn to="/" label="Voltar para a Home" color="primary" flat />
    </div>

    <div v-else class="review-details q-mx-auto q-py-md">
      <q-card flat bordered class="bg-grey-9 text-white">
        <div class="review-item q-pa-md no-link-style">
          <div class="row items-center justify-between q-mb-md">
            <div class="text-h5 text-weight-bold title-font">
              {{ review.drink?.nome || "Drink não especificado" }}, de {{ review.estabelecimento?.nome ||
                "Estabelecimento não informado" }}
            </div>
            <div class="text-subtitle2 text-grey-4">
              Avaliado em {{ formatDate(review.data_criacao) }}
            </div>
          </div>

          <div class="row q-col-gutter-lg items-start">
            <div class="col-12 col-md-6 flex flex-center">
              <q-img :src="getImageUrl(review.imagem) || defaultImageUrl" :ratio="1" class="rounded-borders q-mb-md"
                style="max-width: 400px; width: 100%;">
                <template v-slot:error>
                  <div class="absolute-full flex flex-center bg-negative text-white">
                    Imagem não disponível
                  </div>
                </template>
              </q-img>
            </div>

            <div class="col-12 col-md-6">
              <div class="text-h6 q-mb-md">Detalhes da Avaliação</div>

              <div class="row items-center q-mb-sm">
                <span class="text-weight-bold q-mr-sm text-primary">Nota:</span>
                <q-rating :model-value="review.nota / 2" max="5" size="2.5em" color="primary" icon="star_border"
                  icon-selected="star" icon-half="star_half" readonly half-increments />
              </div>

              <div class="q-mb-sm">
                <span class="text-weight-bold text-primary">Preço:</span>
                <span class="text-white"> R$ {{ (review.preco?.$numberDecimal ?
                  parseFloat(review.preco.$numberDecimal).toFixed(2).replace('.', ',') :
                  '??') }}</span>
              </div>

              <div class="q-mb-lg">
                <span class="text-weight-bold text-primary">Destilado Base: </span>
                <span class="text-white"> {{ review.destilado_base || 'Não informado' }}</span>
              </div>

              <div class="q-mt-lg">
                <div class="text-h6 text-weight-bold q-mb-sm">
                  {{ review.usuario?.nome_usuario || "Um usuário anônimo" }} comentou:
                </div>
                <p class="text-white q-mt-sm comment-box bg-grey-8">
                  {{ review.comentario || "Nenhum comentário deixado." }}
                </p>
              </div>
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
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.comment-box {
  background-color: #333;
  border-left: 4px solid $primary;
  padding: 20px;
  border-radius: 8px;
  white-space: pre-wrap;
  font-size: 1.1em;
  line-height: 1.6;
}

.review-item .text-h6 {
  line-height: 1.2;
}

.review-item-link,
.review-item-link:hover,
.review-item-link:visited,
.review-item-link:active {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.no-link-style {
  text-decoration: none;
  color: inherit;
  cursor: default;
}

.q-img {
  border-radius: 8px;
  overflow: hidden;
}

.text-h5 {
  font-size: 2.2em;
}

.text-subtitle2 {
  font-size: 1.1em;
}

.text-caption {
  font-size: 1em;
}

.text-h6 {
  font-size: 1.5em;
}

.text-subtitle1 {
  font-size: 1.2em;
}
</style>
