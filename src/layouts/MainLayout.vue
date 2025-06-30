<template>
  <q-layout view="lHh Lpr lFf">
    <!-- TODO: Deshardcodar a cor -->
    <q-header style="background-color: #121210" class="text-white">
      <q-toolbar class="flex flex-center">
        <q-toolbar-title class="text-center">
          <img src="/texto-dose.png" alt="Logo Dose" class="q-mt-sm" style="height: 40px; max-width: 100%;"
            @click="goHome" />
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer style="background-color: #121210" class="text-white">
      <q-tabs v-model="tab" class="text-grey-5" active-color="primary" indicator-color="primary" align="justify">
        <q-route-tab to="/" name="home" icon="home" />
        <q-route-tab to="/review/new" name="new-review" icon="add_circle" />
        <q-route-tab to="/profile" name="profile" icon="person" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const tab = ref('home');
const router = useRouter();

const goHome = () => {
  router.push({ path: '/' });
};
</script>

<style lang="scss" scoped>
.logo-font {
  font-family: 'Inknut Antiqua', serif;
  font-size: 2rem;
  font-weight: 700;
}
</style>
