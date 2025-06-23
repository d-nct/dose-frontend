// src/pages/LoginPage.vue

<template>
  <div class="fullscreen bg-grey-2 flex flex-center">
    <q-card class="q-pa-md shadow-2 my-card" style="width: 400px;">
      <q-card-section class="text-center">
        <div class="text-grey-9 text-h5 text-weight-bold">Bem-vindo</div>
        <div class="text-grey-8">Faça login para continuar</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="handleLogin" class="q-gutter-md">
          <q-input
            filled
            v-model="form.nome_usuario"
            label="Nome de Usuário"
            lazy-rules
            :rules="[val => val && val.length > 0 || 'Por favor, digite seu usuário']"
          />

          <q-input
            filled
            v-model="form.senha"
            label="Senha"
            type="password"
            lazy-rules
            :rules="[val => val && val.length > 0 || 'Por favor, digite sua senha']"
          />

          <q-btn
            label="Login"
            type="submit"
            color="primary"
            class="full-width"
            :loading="loading"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from 'src/stores/auth-store';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

const form = ref({
  nome_usuario: '',
  senha: ''
});

const loading = ref(false);
const authStore = useAuthStore();
const router = useRouter();
const $q = useQuasar();

const handleLogin = async () => {
  loading.value = true;
  try {
    await authStore.login(form.value);
    router.push({ name: 'home' });
  } catch (error) {
    let errorMessage = 'Usuário ou senha inválidos. Tente novamente.';

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
</script>

<style scoped>
.my-card {
  border-radius: 12px;
}
</style>