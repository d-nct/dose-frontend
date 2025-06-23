<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-dark text-white" bordered>
      <q-toolbar class="flex flex-center">
        <q-toolbar-title class="text-center">
          <span class="logo-font">dose</span>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-dark text-white" bordered>
      <q-tabs
        v-model="tab"
        class="text-grey-5"
        active-color="primary"
        indicator-color="primary"
        align="justify"
      >
        <q-route-tab to="/" name="home" icon="home" />
        <q-route-tab to="/review/new" name="new-review" icon="add_circle" />
        <q-route-tab to="/profile" name="profile" icon="person" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue';

const tab = ref('home');
</script>

<style lang="scss" scoped>
.logo-font {
  font-family: 'Inknut Antiqua', serif;
  font-size: 2rem;
  font-weight: 700;
}
</style>