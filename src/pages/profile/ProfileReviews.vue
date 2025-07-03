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
          <q-rating :model-value="review.nota / 2" :max="5" size="20px" color="amber" readonly half-increments icon-half="star_half" />
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
import { useAuthStore } from 'src/stores/auth-store';

const loading = ref(true);
const avaliacoes = ref([]);
const authStore = useAuthStore();

async function fetchMyReviews() {
  if (!authStore.usuario || !authStore.usuario._id) {
    loading.value = false;
    return;
  }

  try {
    const userId = authStore.usuario._id;
    const response = await api.get(`/usuarios/${userId}/avaliacoes`);
    avaliacoes.value = response.data;
  } catch (err) {
    console.error('Erro ao buscar suas avaliações:', err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchMyReviews();
});
</script>
