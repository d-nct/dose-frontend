<template>
  <q-page class="q-pa-md">
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
        <q-card-section>
          <div class="text-h5 text-weight-bold title-font">
            {{ review.drink?.nome || "Drink não especificado" }}
          </div>
          <div class="text-subtitle1 text-grey-7">
            por {{ review.estabelecimento?.nome || "Estabelecimento não informado" }}
          </div>
          <div class="text-caption text-grey-6 q-mt-sm">
            Avaliado em {{ formatDate(review.data_criacao) }}
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="row q-col-gutter-lg">
          <div class="col-12 col-md-5 flex flex-center">
            <q-img
              :src="review.drink?.imagem || defaultImageUrl"
              :ratio="1"
              class="rounded-borders"
              style="max-width: 300px"
            >
              <template v-slot:error>
                <div class="absolute-full flex flex-center bg-negative text-white">
                  Imagem não disponível
                </div>
              </template>
            </q-img>
          </div>

          <div class="col-12 col-md-7">
            <div class="text-h6 q-mb-md">Detalhes da Avaliação</div>

            <div class="row items-center q-mb-sm">
              <span class="text-weight-bold q-mr-sm">Nota:</span>
              <q-rating
                :model-value="review.nota / 2"
                max="5"
                size="2em"
                color="primary"
                icon="star_border"
                icon-selected="star"
                icon-half="star_half"
                readonly
                half-increments
              />
            </div>

            <div class="q-mb-sm">
              <span class="text-weight-bold">Preço:</span>
              <span class="text-grey-8"> R$ {{ review.preco?.toFixed(2).replace('.', ',') || 'Não informado' }}</span>
            </div>

            <div class="q-mb-sm">
              <span class="text-weight-bold">Destilado Base:</span>
              <span class="text-grey-8"> {{ review.drink?.destilado_base || 'Não informado' }}</span>
            </div>

            <div class="q-mt-lg">
              <div class="text-subtitle1 text-weight-bold">
                {{ review.usuario?.nome_usuario || "Um usuário anônimo" }} comentou:
              </div>
              <p class="text-body1 q-mt-sm comment-box">
                {{ review.comentario || "Nenhum comentário deixado." }}
              </p>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions class="q-pa-md">
          <q-btn flat round icon="share" />
          <q-btn flat color="primary">Compartilhar</q-btn>
          <q-space />
          <q-btn to="/" label="Ver outras avaliações" color="primary" outline />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useReviewsStore } from 'src/stores/reviews-store';

const route = useRoute();
const reviewsStore = useReviewsStore();

const loading = ref(false);
const review = ref(null);
const defaultImageUrl = import.meta.env.VITE_DEFAULT_IMAGE_URL;

const reviewId = computed(() => route.params.id);

const fetchReviewDetails = async () => {
  if (!reviewId.value) return;

  loading.value = true;
  try {
    // Tenta buscar do store primeiro, se já estiver lá
    const existingReview = reviewsStore.reviews.find(r => r._id === reviewId.value);
    if (existingReview) {
      review.value = existingReview;
    } else {
      // Se não, busca da API (supondo que você tenha um método para isso)
      review.value = await reviewsStore.fetchReviewById(reviewId.value);
    }
  } catch (error) {
    console.error('Erro ao buscar detalhes da avaliação:', error);
    review.value = null; // Garante que a mensagem de erro seja mostrada
  } finally {
    loading.value = false;
  }
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
</style>
