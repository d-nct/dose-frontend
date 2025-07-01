<template>
  <q-page class="q-pa-md bg-grey-10 text-white">
    <div class="q-mx-auto" style="max-width: 500px">
      <div class="row items-center q-mb-md">
        <q-btn flat round dense icon="arrow_back" @click="voltar" class="q-mr-sm" />
        <h4 class="text-h5 q-my-none">Novo Estabelecimento</h4>
      </div>

      <q-form @submit.prevent="onSubmit" class="q-gutter-md">
        <q-input v-model="estabelecimento.nome" filled dark color="amber" label="Nome do Estabelecimento"
          placeholder="Ex: Lapa Irish Pub" lazy-rules
          :rules="[val => !!val && val.length > 0 || 'O nome é obrigatório']" />

        <q-input v-model="estabelecimento.endereco" filled dark color="amber" label="Endereço (Opcional)"
          placeholder="Ex: Rua Evaristo da Veiga, 147 - Lapa, Rio de Janeiro" />

        <q-file v-model="imagemFile" filled dark color="amber" label="Foto do local (Opcional)"
          accept=".jpg, .png, image/*">
          <template v-slot:prepend>
            <q-icon name="storefront" />
          </template>
        </q-file>

        <div class="q-pt-md">
          <q-btn label="Salvar Estabelecimento" type="submit" color="primary" class="full-width" size="lg" />
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

// Guarda os dados do formulário
const estabelecimento = ref({
  nome: '',
  endereco: ''
});
const imagemFile = ref(null); // Para o arquivo da imagem

// Função para retornar à página anterior
function voltar() {
  router.go(-1); // Navega uma entrada para trás no histórico
}

// Função de submissão do formulário
async function onSubmit() {
  const formData = new FormData();
  formData.append('nome', estabelecimento.value.nome);

  if (estabelecimento.value.endereco) {
    formData.append('endereco', estabelecimento.value.endereco);
  }

  if (imagemFile.value) {
    formData.append('imagem', imagemFile.value);
  }

  $q.loading.show({ message: 'Salvando...' });

  console.log(Object.fromEntries(formData.entries()));

  try {
    // Envia os dados para a API
    await api.post('/estabelecimentos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    $q.notify({
      color: 'positive',
      position: 'top',
      message: 'Estabelecimento criado com sucesso!',
      icon: 'check_circle'
    });

    // Volta para a página anterior (a de avaliação)
    voltar();

  } catch (err) {
    $q.notify({
      color: 'negative',
      position: 'top',
      message: 'Erro ao criar estabelecimento. Verifique os dados.',
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
