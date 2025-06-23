<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <div class="col-12 col-md-8" style="max-width: 800px;">
        <q-btn
          label="Nova Avaliação"
          color="primary"
          icon="add"
          class="q-mb-md"
          @click="goToNewReview"
        />

        <q-list bordered separator>
          <q-item-label header>Feed de Avaliações</q-item-label>

          <q-item v-if="loading" class="justify-center">
            <q-spinner-dots color="primary" size="40px" />
          </q-item>
          
          <q-item v-else-if="reviewsStore.reviews.length === 0">
            <q-item-section>
              <q-item-label>Nenhuma avaliação ainda. Seja o primeiro!</q-item-label>
            </q-item-section>
          </q-item>

          <q-item v-for="review in reviewsStore.reviews" :key="review.avaliacao_id" class="q-py-md">
            <q-item-section avatar>
              <q-avatar>
                <img src="https://cdn.quasar.dev/img/boy-avatar.png">
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-weight-bold">{{ review.usuario?.nome_usuario || 'Usuário Anônimo' }}</q-item-label>
              <q-item-label caption>avaliou {{ review.drink?.nome || 'um drink' }}</q-item-label>
              <q-rating :model-value="review.nota" :max="10" size="18px" color="amber" readonly />
              <q-item-label class="q-mt-sm">{{ review.comentario }}</q-item-label>
            </q-item-section>

            <q-item-section side top>
              <q-item-label caption>{{ formatDate(review.data_criacao) }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useReviewsStore } from 'src/stores/reviews-store';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

const reviewsStore = useReviewsStore();
const router = useRouter();
const loading = ref(false);
const $q = useQuasar();

const goToNewReview = () => {
  router.push({ name: 'new-review' });
};

const fetchReviews = async () => {
  loading.value = true;
  try {
    await reviewsStore.fetchReviews();
  } catch (error) {
    console.error('Erro ao buscar as avaliações:', error);
    $q.notify({
      color: 'negative',
      position: 'top',
      message: 'Não foi possível carregar as avaliações. Tente novamente mais tarde.',
      icon: 'report_problem'
    });
  } finally {
    loading.value = false;
  }
};

// Formata a data para algo mais legível
const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('pt-BR', options);
};

onMounted(() => {
  fetchReviews();
});
</script>