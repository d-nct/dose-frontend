<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <div class="col-12 col-md-8" style="max-width: 700px;">
        <h4 class="page-title q-mb-md">Avaliar um Drink</h4>

        <q-form @submit.prevent="handleSubmit">
          <q-card flat bordered>
            <q-card-section class="q-gutter-md">
              <q-select filled dark v-model="form.drink" use-input hide-selected fill-input input-debounce="0"
                :options="filteredDrinks" @filter="filterFn" @new-value="addNewDrink" option-value="_id"
                option-label="nome" label="Qual drink você avaliou? (Digite para criar um novo)" lazy-rules
                :rules="[val => !!val || 'Por favor, selecione ou crie um drink']" :loading="loadingDrinks">
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Nenhum resultado. Pressione Enter para adicionar.
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>

              <div>
                <q-item-label class="q-mb-sm">Nota</q-item-label>
                <q-rating v-model="ratingModel" max="5" size="2.5em" color="primary" icon="star_border"
                  icon-selected="star" icon-half="star_half" half-increments />
              </div>

              <q-input v-model="form.comentario" filled dark type="textarea" label="Como foi sua experiência?"
                lazy-rules :rules="[val => val && val.length > 0 || 'Por favor, escreva um comentário']" />

              <q-input v-model="form.destilado_base" filled dark label="Qual foi o destilado principal?" />
            </q-card-section>

            <q-separator dark />

            <q-card-actions class="q-pa-md">
              <q-btn label="Enviar Avaliação" type="submit" color="primary" class="full-width" size="lg"
                :loading="submitting" />
            </q-card-actions>
          </q-card>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useDrinksStore } from 'src/stores/drinks-store';
import { useReviewsStore } from 'src/stores/reviews-store';

const $q = useQuasar();
const router = useRouter();
const drinksStore = useDrinksStore();
const reviewsStore = useReviewsStore();

const form = ref({
  drink: null,
  nota: 0,
  comentario: '',
  destilado_base: ''
});

// 1. LÓGICA DA NOTA
const ratingModel = ref(0); // Modelo para o q-rating (0 a 5)
// Observa o modelo de 5 estrelas e atualiza o de 10 pontos
watch(ratingModel, (newValue) => {
  form.value.nota = newValue * 2;
});

const loadingDrinks = ref(false);
const submitting = ref(false);
const filteredDrinks = ref([]);

// 2. LÓGICA DE CRIAR/FILTRAR DRINKS
const filterFn = (val, update) => {
  if (val === '') {
    update(() => {
      filteredDrinks.value = drinksStore.drinks;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    filteredDrinks.value = drinksStore.drinks.filter(
      v => v.nome.toLowerCase().indexOf(needle) > -1
    );
  });
};

const addNewDrink = async (inputValue, doneFn) => {
  submitting.value = true;
  try {
    const newDrink = await drinksStore.createDrink({ nome: inputValue });
    // Define o drink recém-criado como o selecionado no formulário
    form.value.drink = newDrink;
    doneFn(newDrink, 'add-unique');
  } catch (err) {
    $q.notify({ 
      color: 'negative', 
      message: 'Não foi possível criar o novo drink.',
      error: err
    });
  } finally {
    submitting.value = false;
  }
};


const handleSubmit = async () => {
  submitting.value = true;
  try {
    const payload = {
      ...form.value,
      drink: form.value.drink._id
    };

    await reviewsStore.createReview(payload);
    $q.notify({
      color: 'positive',
      icon: 'check_circle',
      message: 'Avaliação enviada com sucesso!'
    });

    await reviewsStore.fetchReviews();
    router.push({ name: 'home' });

  } catch (err) {
    $q.notify({
      color: 'negative',
      icon: 'report_problem',
      message: 'Não foi possível enviar a avaliação. Tente novamente.',
      error: err
    });
  } finally {
    submitting.value = false;
  }
};

onMounted(async () => {
  loadingDrinks.value = true;
  await drinksStore.fetchDrinks();
  filteredDrinks.value = drinksStore.drinks; // Inicializa o filtro
  loadingDrinks.value = false;
});
</script>

<style lang="scss" scoped>
.page-title {
  font-family: 'Inknut Antiqua', serif;
}
</style>