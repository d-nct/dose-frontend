<template>
  <q-card dark bordered>
    <q-card-section>
      <div class="text-h6">Editar Perfil</div>
    </q-card-section>
    <q-card-section>
      <q-form @submit.prevent="updateProfile" class="q-gutter-md">
        <q-input
          v-model="formData.nome_usuario"
          label="Nome de Usuário"
          filled dark color="amber"
          :rules="[val => !!val || 'Nome de usuário não pode ser vazio']"
        />
        <q-btn type="submit" label="Salvar Nome de Usuário" color="primary" />
      </q-form>
    </q-card-section>

    <q-separator dark class="q-my-lg" />

    <q-card-section>
      <div class="text-h6">Alterar Senha</div>
    </q-card-section>
    <q-card-section>
      <q-form @submit.prevent="updatePassword" class="q-gutter-md">
        <q-input
          type="password"
          v-model="passwordData.senha_atual"
          label="Senha Atual"
          filled dark color="amber"
          :rules="[val => !!val || 'Campo obrigatório']"
        />
        <q-input
          type="password"
          v-model="passwordData.nova_senha"
          label="Nova Senha"
          filled dark color="amber"
          :rules="[val => val && val.length >= 6 || 'A senha deve ter no mínimo 6 caracteres']"
        />
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
  // Você precisará deste endpoint no seu backend
  try {
    const response = await api.put('/usuarios/meu-perfil', formData.value);
    // Atualiza o store local com os novos dados
    authStore.setUser(response.data.usuario);
    $q.notify({ type: 'positive', message: 'Nome de usuário atualizado!' });
  } catch (err) {
    $q.notify({ type: 'negative', message: err.response?.data?.message || 'Erro ao atualizar perfil.' });
  }
}

async function updatePassword() {
  // E deste também
  try {
    await api.put('/usuarios/meu-perfil/senha', passwordData.value);
    passwordData.value.senha_atual = '';
    passwordData.value.nova_senha = '';
    $q.notify({ type: 'positive', message: 'Senha alterada com sucesso!' });
  } catch (err) {
    $q.notify({ type: 'negative', message: err.response?.data?.message || 'Erro ao alterar senha. Verifique sua senha atual.' });
  }
}
</script>