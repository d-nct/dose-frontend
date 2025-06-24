<template>
    <q-page class="q-pa-md bg-grey-10 text-white">
        <div class="q-mx-auto" style="max-width: 500px">
            <div class="row items-center q-mb-md">
                <q-btn flat round dense icon="arrow_back" @click="voltar" class="q-mr-sm" />
                <h4 class="text-h5 q-my-none">Novo Drink</h4>
            </div>

            <q-form @submit.prevent="onSubmit" class="q-gutter-md">
                <q-input v-model="drink.nome" filled dark color="amber" label="Nome do Drink"
                    placeholder="Ex: Caipirinha" lazy-rules
                    :rules="[val => !!val && val.length > 0 || 'O nome é obrigatório']" />

                <q-input v-model="drink.descricao" filled dark color="amber" type="textarea"
                    label="Descrição (Opcional)" placeholder="Descreva o drink, seus ingredientes, etc." />

                <q-select filled dark color="amber" v-model="drink.categoria" :options="categoriaOptions"
                    option-value="_id" option-label="nome" label="Categoria (Opcional)" emit-value map-options
                    clearable>
                    <template v-slot:append>
                        <q-btn v-if="authStore.canManageContent" round dense flat icon="add"
                            @click="irParaPaginaCriacaoCategoria">
                            <q-tooltip class="bg-amber text-black" :offset="[10, 10]">
                                Criar nova categoria (Admin)
                            </q-tooltip>
                        </q-btn>
                    </template>
                </q-select>

                <q-file v-model="imagemFile" filled dark color="amber" label="Foto do drink (Opcional)"
                    accept="image/*">
                    <template v-slot:prepend>
                        <q-icon name="local_bar" />
                    </template>
                </q-file>

                <div class="q-pt-md">
                    <q-btn label="Salvar Drink" type="submit" color="primary" class="full-width" size="lg" />
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

const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();

// Guarda os dados do formulário
const drink = ref({
  nome: '',
  descricao: '',
  categoria: null
});
const imagemFile = ref(null);
const categoriaOptions = ref([]);

// Função para retornar à página anterior
function voltar() {
  router.go(-1);
}

function irParaPaginaCriacaoCategoria() {
  router.push('/categorias/new');
}

// Busca as categorias para o campo de seleção
async function fetchCategorias() {
  try {
    const response = await api.get('/categorias');
    categoriaOptions.value = response.data;
  } catch (err) {
    $q.notify({
      color: 'negative',
      position: 'top',
      message: 'Falha ao carregar categorias.',
      icon: 'report_problem',
      error: err
    });
  }
}

// Função de submissão do formulário
async function onSubmit() {
  const formData = new FormData();
  formData.append('nome', drink.value.nome);
  formData.append('descricao', drink.value.descricao);

  if (drink.value.categoria) {
    formData.append('categoria', drink.value.categoria);
  }
  if (imagemFile.value) {
    formData.append('imagem', imagemFile.value);
  }

  // IMPORTANTE: O schema do drink pede um `usuario`.
  // Você deve adicionar o ID do usuário logado aqui.
  // Ex: formData.append('usuario', authStore.user.id);
  
  $q.loading.show({ message: 'Salvando...' });

  try {
    await api.post('/drinks', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    $q.notify({
      color: 'positive',
      position: 'top',
      message: 'Drink criado com sucesso!',
      icon: 'check_circle'
    });

    voltar(); // Volta para a página de avaliação

  } catch (err) {
    $q.notify({
      color: 'negative',
      position: 'top',
      message: 'Erro ao criar drink. Verifique os dados.',
      icon: 'report_problem',
      error: err
    });
  } finally {
    $q.loading.hide();
  }
}

// Busca os dados iniciais quando a página é carregada
onMounted(() => {
  fetchCategorias();
});
</script>

<style scoped>
.q-page {
  background-color: #121212;
}
</style>