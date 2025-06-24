<template>
  <div class="fullscreen dark-page flex flex-center column">
    <q-page-sticky position="top-left" :offset="[18, 18]"> <q-btn icon="arrow_back" flat dense round color="grey-5"
        @click="voltar" />
    </q-page-sticky>

    <div class="q-mb-xs">
      <img src="/icons/favicon-256x256.png" alt="Logo Dose"
        style="height: 180px; width: 180px; border-radius: 25%; object-fit: cover;" />
    </div>

    <div class="text-center q-mb-sm">
      <div class="claro text-h5 text-weight-bold">avalie suas doses</div>
      <div class="claro">é rápido e fácil.</div>
    </div>

    <div style="width: 300px; max-width: 90%;">
      <q-form @submit.prevent="handleRegister" class="q-gutter-y-xs">
        <q-input v-model="form.nome_usuario" label="nome do sommelier" lazy-rules
          :rules="[val => val && val.length > 0 || 'Escolha sabiamente...']" class="custom-input-register"
          label-color="grey-5" color="primary" dark>
          <template v-slot:prepend>
            <q-icon name="sentiment_very_satisfied" color="grey-5" /> </template>
        </q-input>

        <q-input v-model="form.senha" label="senha" type="password" lazy-rules :rules="[
          val => val && val.length >= 3 || 'Essa senha já está em uso! Escolha outra!'
        ]" class="custom-input-register" label-color="grey-5" color="primary" dark>
          <template v-slot:prepend>
            <q-icon name="lock" color="grey-5" />
          </template>
        </q-input>

        <q-input v-model="passwordConfirm" label="confirme a senha" type="password" lazy-rules :rules="[
          val => val && val === form.senha || 'As senhas não coincidem!'
        ]" class="custom-input-register" label-color="grey-5" color="primary" dark>
          <template v-slot:prepend>
            <q-icon name="lock_reset" color="grey-5" /> </template>
        </q-input>

        <q-btn label="Registrar" type="submit" color="primary" class="full-width q-mt-xl" :loading="loading" />

        <q-separator color="grey-8" class="q-mt-md" />
        <div class="text-center q-pa-sm">
          <q-btn label="Login! Login! Login!" class="text-weight-semibold" color="primary" flat dense no-caps
            :to="{ name: 'login' }" />
        </div>
      </q-form>
    </div>
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

const voltar = () => {
  if (window.history.length > 1) {
    router.go(-1);
  } else {
    router.push({ path: '/' });
  }
};

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
    // Assumindo que você tem uma rota 'register-success' ou similar para quando o registro é bem-sucedido
    // Ou você pode redirecionar para 'login'
    router.push({ name: 'register-success' }); // ou router.push({ name: 'login' });
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
/* Reutilizando a mesma classe de estilo para os inputs */
.custom-input-register {
  .q-field__control:before {
    border-bottom: 1px solid #757575 !important;
  }

  .q-field__control:hover:before {
    border-bottom: 1px solid var(--q-color-primary) !important;
  }

  .q-field__control:after {
    border-bottom: 2px solid var(--q-color-primary) !important;
  }
}
</style>
