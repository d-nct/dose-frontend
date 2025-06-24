// src/pages/NewCategoryPage.vue

<template>
  <q-page class="q-pa-md bg-grey-10 text-white">
    <div class="q-mx-auto" style="max-width: 500px">
      <div class="row items-center q-mb-md">
        <q-btn flat round dense icon="arrow_back" @click="voltar" class="q-mr-sm" />
        <h4 class="text-h5 q-my-none">Nova Categoria</h4>
      </div>

      <q-form @submit.prevent="onSubmit" class="q-gutter-md">
        <q-input
          v-model="categoria.nome"
          filled
          dark
          color="amber"
          label="Nome da Categoria"
          placeholder="Ex: Clássicos, Destilados, Sem Álcool"
          lazy-rules
          :rules="[val => !!val && val.length > 0 || 'O nome é obrigatório']"
        />
        <q-input
          v-model="categoria.descricao"
          filled
          dark
          color="amber"
          type="textarea"
          label="Descrição (Opcional)"
        />
        <div class="q-pt-md">
          <q-btn label="Salvar Categoria" type="submit" color="primary" class="full-width" size="lg" />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { api } from 'boot/axios';

const $q = useQuasar();
const router = useRouter();

const categoria = ref({
  nome: '',
  descricao: ''
});

function voltar() {
  router.go(-1);
}

async function onSubmit() {
  $q.loading.show({ message: 'Salvando...' });
  try {
    // Endpoint para criar uma nova categoria no backend
    await api.post('/categorias', categoria.value);
    $q.notify({
      color: 'positive',
      position: 'top',
      message: 'Categoria criada com sucesso!',
      icon: 'check_circle'
    });
    voltar(); // Volta para a página anterior (criação de drink)
  } catch (err) {
    $q.notify({
      color: 'negative',
      position: 'top',
      message: 'Erro ao criar categoria. Verifique se ela já existe.',
      icon: 'report_problem',
      error: err
    });
  } finally {
    $q.loading.hide();
  }
}
</script>

<style scoped>
.q-page {
  background-color: #121212;
}
</style>