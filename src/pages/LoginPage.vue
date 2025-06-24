<template>
  <div class="fullscreen dark-page flex flex-center column">
    <div class="claro text-h5 text-weight-bold q-mb-md">
      bora tomar uma
    </div>

    <div class="q-mb-md"> <img src="/icons/favicon-256x256.png" alt="Logo Dose"
        style="height: 180px; width: 180px; border-radius: 30%; object-fit: cover;" />
    </div>

    <div style="width: 300px; max-width: 90%;"> <q-form @submit.prevent="handleLogin" class="q-gutter-y-lg">
        <q-input v-model="form.nome_usuario" label="nome do sommelier" lazy-rules
          :rules="[val => val && val.length > 0 || 'Digite seu usuário direito']" class="custom-input-login"
          label-color="grey-5" color="primary" dark>
          <template v-slot:prepend>
            <q-icon name="sentiment_very_satisfied" color="grey-5" /> </template>
        </q-input>

        <q-input v-model="form.senha" label="senha" type="password" lazy-rules
          :rules="[val => val && val.length > 0 || 'Digite sua senha direito']" class="custom-input-login"
          label-color="grey-5" color="primary" dark>
          <template v-slot:prepend>
            <q-icon name="lock" color="grey-5" /> </template>
        </q-input>

        <q-btn label="Login" type="submit" color="primary" class="full-width q-mt-md" :loading="loading" />

        <q-separator color="grey-8" class="q-mt-md" />
        <div class="text-center q-pa-sm">
          <q-btn label="Registre-se! Registre-se! Registre-se!" class="text-weight-semibold" color="primary" flat dense
            no-caps :to="{ name: 'register' }" />
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
/*
  O .my-card não é mais necessário, pois removemos o q-card.
  Ajustamos o estilo dos inputs para ficarem mais parecidos com o screenshot.
*/
.custom-input-login {
  .q-field__control:before {
    border-bottom: 1px solid #757575 !important;
    /* Cor da linha inferior padrão */
  }

  .q-field__control:hover:before {
    border-bottom: 1px solid var(--q-color-primary) !important;
    /* Cor da linha inferior ao passar o mouse */
  }

  .q-field__control:after {
    border-bottom: 2px solid var(--q-color-primary) !important;
    /* Cor da linha inferior quando focado */
  }
}
</style>
