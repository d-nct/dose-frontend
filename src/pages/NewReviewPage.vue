<template>
  <q-page class="q-pa-md bg-grey-10 text-white">
    <div class="q-mx-auto" style="max-width: 500px">
      <h4 class="text-center q-mt-none q-mb-md">Nova Avaliação</h4>

      <q-form @submit.prevent="onSubmit" class="q-gutter-md">
        <q-select filled dark color="amber" v-model="avaliacao.estabelecimento" :options="estabelecimentoOptions"
          option-value="_id" option-label="nome" label="Onde você bebeu?" lazy-rules
          :rules="[val => !!val || 'Por favor, selecione um estabelecimento']" emit-value map-options>
          <template v-slot:append>
            <q-btn round dense flat icon="add" @click="irParaPaginaCriacaoEstabelecimento">
              <q-tooltip class="bg-amber text-black" :offset="[10, 10]">
                Criar novo estabelecimento
              </q-tooltip>
            </q-btn>
          </template>
        </q-select>

        <q-select filled dark color="amber" v-model="avaliacao.drink" :options="drinkOptions" option-value="_id"
          option-label="nome" label="Qual foi o drink?" lazy-rules
          :rules="[val => !!val || 'Por favor, selecione um drink']" emit-value map-options>
          <template v-slot:append>
            <q-btn round dense flat icon="add" @click="irParaPaginaCriacaoDrink">
              <q-tooltip class="bg-amber text-black" :offset="[10, 10]">
                Criar novo drink
              </q-tooltip>
            </q-btn>
          </template>
        </q-select>

        <div class="q-py-md">
          <p class="q-mb-sm text-grey-5">Qual a sua nota?</p>
          <q-rating v-model="avaliacao.nota" size="2.5em" :max="5" color="amber" icon="star_border"
            icon-selected="star" icon-half="star_half" half-increments />
        </div>

        <q-input v-model="avaliacao.comentario" filled dark color="amber" type="textarea" label="Escreva sua avaliação"
          placeholder="O que você achou do drink?" lazy-rules
          :rules="[val => !!val && val.length > 0 || 'Seu comentário não pode estar vazio']" />

        <q-input v-model="avaliacao.destilado_base" filled dark color="amber" label="Destilado Base (Opcional)"
          placeholder="Ex: Cachaça Velho Barreiro, Vodka Smirnoff" />

        <q-input v-model.number="avaliacao.preco" filled dark color="amber" type="number" label="Preço (Opcional)"
          prefix="R$" :step="0.01" />

        <q-file v-model="imagemFile" filled dark color="amber" label="Envie uma foto do drink (Opcional)"
          accept="image/*">
          <template v-slot:prepend>
            <q-icon name="camera_alt" />
          </template>
        </q-file>

        <div class="q-pt-md">
          <q-btn label="Publicar Avaliação" type="submit" color="primary" class="full-width" size="lg" />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { api } from 'boot/axios';
import { useAuthStore } from 'src/stores/auth-store';

// --- Reatividade e Setup ---
const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();


// Guarda os dados do formulário
const avaliacao = ref({
  nota: 0,
  comentario: '',
  destilado_base: '',
  estabelecimento: null, // Guardará o ID do estabelecimento
  drink: null, // Guardará o ID do drink
  preco: null
});

const imagemFile = ref(null); // Para o upload do arquivo da imagem

// Guarda as opções para os campos de seleção
const estabelecimentoOptions = ref([]);
const drinkOptions = ref([]);

// --- Funções ---

function irParaPaginaCriacaoEstabelecimento() {
  router.push('/estabelecimentos/new');
}

function irParaPaginaCriacaoDrink() {
  router.push('/drinks/new');
}

// Busca os estabelecimentos da API para preencher o QSelect
async function fetchEstabelecimentos() {
  try {
    const response = await api.get('/estabelecimentos');
    estabelecimentoOptions.value = response.data;
  } catch (err) {
    $q.notify({
      color: 'negative',
      position: 'top',
      message: 'Falha ao carregar estabelecimentos.',
      icon: 'report_problem',
      error: err
    });
  }
}

// Busca os drinks da API para preencher o QSelect
async function fetchDrinks() {
  try {
    const response = await api.get('/drinks');
    drinkOptions.value = response.data;
  } catch (err) {
    $q.notify({
      color: 'negative',
      position: 'top',
      message: 'Falha ao carregar drinks.',
      icon: 'report_problem',
      error: err
    });
  }
}

// Função chamada ao submeter o formulário
async function onSubmit() {
  // Verifica o login
  if (!authStore.usuario || !authStore.usuario._id) {
    $q.notify({
      color: 'negative',
      message: 'Você precisa estar logado para criar uma avaliação.'
    });
    return; // Para a execução da função
  }

  const formData = new FormData();
  // Adiciona os campos do schema de avaliação
  formData.append('nota', avaliacao.value.nota * 2);
  formData.append('comentario', avaliacao.value.comentario);
  formData.append('destilado_base', avaliacao.value.destilado_base);
  formData.append('estabelecimento', avaliacao.value.estabelecimento);
  formData.append('drink', avaliacao.value.drink);
  formData.append('usuario', authStore.usuario._id);
  formData.append('preco', avaliacao.value.preco);

  if (imagemFile.value) {
    formData.append('imagem', imagemFile.value); // O backend precisa processar este arquivo
  }


  $q.loading.show({ message: 'Publicando...' });

  try {
    // Envia os dados para a API
    await api.post('/avaliacoes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    $q.notify({
      color: 'positive',
      position: 'top',
      message: 'Avaliação publicada com sucesso!',
      icon: 'check_circle'
    });

    // Redireciona o usuário para a página inicial ou para a página da avaliação
    router.push('/');

  } catch (err) {
    $q.notify({
      color: 'negative',
      position: 'top',
      message: 'Ocorreu um erro ao publicar. Tente novamente.',
      icon: 'report_problem',
      error: err
    });
  } finally {
    $q.loading.hide();
  }
}

// --- Lifecycle Hook ---

// Quando o componente for montado, busca os dados iniciais
onMounted(() => {
  fetchEstabelecimentos();
  fetchDrinks();
});
</script>

<style scoped>
.q-page {
  background-color: #121212;
  /* Cor de fundo escura, similar à imagem */
}
</style>
