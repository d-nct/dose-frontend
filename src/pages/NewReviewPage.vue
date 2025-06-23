<template>
  <q-page padding>
    <q-card class="q-pa-md" style="max-width: 600px; margin: auto;">
      <q-card-section class="text-h6">
        Nova Avaliação de Drink
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="handleNewReview" class="q-gutter-md">
          <q-select
            filled
            v-model="form.drink_id"
            :options="drinks"
            option-value="drink_id"
            option-label="nome"
            label="Selecione o Drink"
            lazy-rules
            :rules="[val => !!val || 'Por favor, selecione um drink']"
          />

          <q-rating
            v-model="form.nota"
            size="2em"
            :max="10"
            color="primary"
            icon="star_border"
            icon-selected="star"
          />

          <q-input
            filled
            v-model="form.comentario"
            label="Comentário"
            type="textarea"
            lazy-rules
            :rules="[val => val && val.length > 0 || 'Por favor, escreva um comentário']"
          />

          <q-btn
            label="Salvar Avaliação"
            type="submit"
            color="primary"
            class="full-width"
            :loading="loading"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useReviewsStore } from 'src/stores/reviews-store';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

const form = ref({
  drink_id: null,
  nota: 0,
  comentario: ''
});

const drinks = ref([]); // Aqui vamos popular com os drinks da sua API
const loading = ref(false);
const reviewsStore = useReviewsStore();
const router = useRouter();
const $q = useQuasar();

// Função para buscar os drinks e popular o select
const fetchDrinks = async () => {
  // ATENÇÃO: Você precisará implementar a lógica para buscar os drinks da sua API.
  // Exemplo de como poderia ser:
  // const response = await api.get('/drinks');
  // drinks.value = response.data;

  // Por enquanto, usaremos dados mocados:
  drinks.value = [
    { drink_id: '1', nome: 'Caipirinha' },
    { drink_id: '2', nome: 'Negroni' },
    { drink_id: '3', nome: 'Dry Martini' }
  ];
};

const handleNewReview = async () => {
  loading.value = true;
  try {
    await reviewsStore.createReview(form.value);
    $q.notify({
      color: 'positive',
      position: 'top',
      message: 'Avaliação criada com sucesso!',
      icon: 'check'
    });
    router.push({ name: 'home' }); // Redireciona para o feed
  } catch (error) {
    let errorMessage = 'Não foi possível criar a avaliação.';
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }
    $q.notify({
      color: 'negative',
      position: 'top',
      message: errorMessage,
      icon: 'report_problem'
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDrinks();
});
</script>