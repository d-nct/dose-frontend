<template>
  <div>
    <div v-if="loading" class="text-center q-py-xl">
      <q-spinner-dots color="primary" size="40px" />
    </div>
    <div v-else-if="avaliacoes.length === 0" class="text-center text-grey q-py-xl">
      <q-icon name="rate_review" size="60px" class="q-mb-md" />
      <p class="text-h6">Nenhuma avaliação encontrada.</p>
      <p>Parece que você ainda não avaliou nenhum drink.</p>
    </div>
    <div v-else class="q-gutter-md">
      <q-card v-for="review in avaliacoes" :key="review._id" dark bordered>
        <q-card-section>
          <div class="text-h6">Drink: {{ review.drink.nome }}</div>
          <div class="text-subtitle2">em {{ review.estabelecimento.nome }}</div>
          <q-rating :model-value="review.nota / 2" :max="5" size="20px" color="amber" readonly />
        </q-card-section>
        <q-card-section class="q-pt-none">
          {{ review.comentario }}
        </q-card-section>
        <q-separator dark />
        <q-card-actions>
          <q-btn flat dense color="primary">Editar</q-btn>
          <q-btn flat dense color="negative">Excluir</q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const loading = ref(true);
const avaliacoes = ref([]);

async function fetchMyReviews() {
  try {
    // Você precisará criar este endpoint no seu backend
    const response = await api.get('/usuarios/meu-perfil/avaliacoes');
    avaliacoes.value = response.data;
  } catch (err) {
    $q.notify({ type: 'negative', message: 'Erro ao buscar suas avaliações.', error: err });
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchMyReviews();
});
</script>