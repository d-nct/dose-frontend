<template>
  <q-page class="bg-grey-10 text-white q-pa-md">
    <div class="q-mx-auto" style="max-width: 800px">

      <div class="row items-center q-mb-lg">
        <q-avatar size="80px" class="q-mr-md">
          <img :src="authStore.usuario.imagem || defaultImageUrl">
        </q-avatar>
        <div class="col">
          <h5 class="q-my-none">{{ authStore.usuario.nome_usuario }}</h5>
          <div class="row q-gutter-md text-grey-5">
            <!-- TODO: Implementar a lógica -->
            <!-- <span><strong>45</strong> Seguidores</span>
            <span><strong>67</strong> Seguindo</span> -->
            <span><strong>{{ reviewsStore.userReviews.length }}</strong> Avaliações</span>
          </div>
        </div>
        <q-btn label="Sair" @click="handleLogout" color="negative" flat icon="logout" class="q-ml-auto" />
      </div>

      <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify"
        narrow-indicator>
        <q-route-tab name="reviews" label="Minhas Avaliações" to="/profile" exact />
        <q-route-tab name="settings" label="Configurações" to="/profile/configuracoes" exact />
      </q-tabs>

      <q-separator />

      <div class="q-mt-lg">
        <router-view />
      </div>

    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from 'src/stores/auth-store';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useReviewsStore } from 'src/stores/reviews-store';

const authStore = useAuthStore();
const router = useRouter();
const $q = useQuasar();
const reviewsStore = useReviewsStore();
const tab = ref('reviews'); // A aba inicial ativa
const defaultImageUrl = import.meta.env.VITE_DEFAULT_IMAGE_URL;

onMounted(async () => {
  if (authStore.usuario && authStore.usuario._id) {
    await reviewsStore.fetchMyReviews(authStore.usuario._id);
  }
});

function handleLogout() {
  $q.dialog({
    title: 'Confirmar Saída',
    message: 'Você tem certeza que deseja sair?',
    cancel: true,
    persistent: true,
    ok: {
      label: 'Sair',
      color: 'negative'
    }
  }).onOk(() => {
    authStore.logout();
    router.push('/login');
    $q.notify({ type: 'positive', message: 'Você saiu com sucesso.' });
  });
}
</script>
