<template>
  <div class="fullscreen dark-page flex flex-center">
    <q-card class="q-pa-md shadow-1 my-card" style="width: 400px;">
      <q-card-section class="text-center">
        <div class="claro text-h5 text-weight-bold">Criar Conta</div>
        <div class="claro">É rápido e fácil.</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="handleRegister" class="q-gutter-md">
          <q-input filled v-model="form.nome_usuario" label="Nome de Usuário" lazy-rules
            :rules="[val => val && val.length > 0 || 'Por favor, escolha um nome de usuário']" />

          <q-input filled v-model="form.senha" label="Senha" type="password" lazy-rules :rules="[
            val => val && val.length >= 3 || 'A senha deve ter no mínimo 3 caracteres'
          ]" />

          <q-input filled v-model="passwordConfirm" label="Confirme a Senha" type="password" lazy-rules :rules="[
            val => val && val === form.senha || 'As senhas não coincidem'
          ]" />

          <q-btn label="Registrar" type="submit" color="primary" class="full-width" :loading="loading" />
        </q-form>
      </q-card-section>

      <q-card-section class="text-center q-pt-none">
        <div class="claro">
          Já tem uma conta?
          <router-link to="/login" class="text-claro text-weight-bold" style="text-decoration: none">
            Faça Login.
          </router-link>
        </div>
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
const passwordConfirm = ref('');
const loading = ref(false);
const authStore = useAuthStore();
const router = useRouter();
const $q = useQuasar();

const handleRegister = async () => {
  if (form.value.senha !== passwordConfirm.value) {
    $q.notify({
      color: 'negative',
      message: 'As senhas não coincidem!'
    });
    return;
  }

  loading.value = true;
  try {
    await authStore.register(form.value);
    router.push({ name: 'register-success' });
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Não foi possível criar a conta. O usuário já pode existir.';
    $q.notify({
      color: 'negative',
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
