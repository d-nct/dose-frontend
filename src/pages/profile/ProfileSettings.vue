<template>
  <q-card dark bordered>
    <q-card-section>
      <div class="text-h6">Editar Perfil</div>
    </q-card-section>
    <q-card-section>
      <q-form @submit.prevent="updateProfile" class="q-gutter-md">
        <q-input v-model="formData.nome_usuario" label="Nome de Usuário" filled dark color="amber"
          :rules="[val => !!val || 'Nome de usuário não pode ser vazio']" />
        <q-btn type="submit" label="Salvar Nome de Usuário" color="primary" />
      </q-form>
    </q-card-section>

    <q-separator dark class="q-my-lg" />

    <q-card-section>
      <div class="text-h6">Alterar Senha</div>
    </q-card-section>
    <q-card-section>
      <q-form @submit.prevent="updatePassword" class="q-gutter-md">
        <q-input type="password" v-model="passwordData.senha_atual" label="Senha Atual" filled dark color="amber"
          :rules="[val => !!val || 'Campo obrigatório']" />
        <q-input type="password" v-model="passwordData.nova_senha" label="Nova Senha" filled dark color="amber"
          :rules="[val => val && val.length >= 6 || 'A senha deve ter no mínimo 6 caracteres']" />
        <q-btn type="submit" label="Alterar Senha" color="primary" />
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from 'vue';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores/auth-store';

const $q = useQuasar();
const authStore = useAuthStore();

const formData = ref({
  nome_usuario: authStore.usuario.nome_usuario
});

const passwordData = ref({
  senha_atual: '',
  nova_senha: ''
});

async function updateProfile() {
  if (!authStore.usuario || !authStore.usuario._id) return;

  try {
    const userId = authStore.usuario._id;
    const response = await api.put(`/usuarios/${userId}`, formData.value);
    authStore.setUser(response.data); // Atualiza o usuário no store
    $q.notify({ type: 'positive', message: 'Nome de usuário atualizado!' });
  } catch (err) {
    $q.notify({ type: 'negative', message: err.response?.data?.message || 'Erro ao atualizar perfil.' });
  }
}

async function updatePassword() {
  if (!authStore.usuario || !authStore.usuario._id) return;

  try {
    const userId = authStore.usuario._id;
    await api.put(`/usuarios/${userId}/senha`, passwordData.value);
    passwordData.value.senha_atual = '';
    passwordData.value.nova_senha = '';
    $q.notify({ type: 'positive', message: 'Senha alterada com sucesso!' });
  } catch (err) {
    $q.notify({ type: 'negative', message: err.response?.data?.message || 'Erro ao alterar senha. Verifique sua senha atual.' });
  }
}
</script>
