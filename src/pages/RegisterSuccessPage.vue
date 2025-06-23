<template>
  <div class="fullscreen bg-grey-2 flex flex-center">
    <q-card class="q-pa-md shadow-2 my-card text-center" style="width: 450px;">
      <q-card-section>
        <q-icon name="check_circle" color="positive" size="6em" />
      </q-card-section>

      <q-card-section>
        <div class="text-h5 text-weight-bold">Conta Criada com Sucesso!</div>
        <div class="text-grey-8 q-mt-sm">
          Seu registro foi concluído. Agora você já pode fazer parte da comunidade Dose.
        </div>
      </q-card-section>

      <q-card-section>
        <q-btn
          label="Ir para o Login"
          color="primary"
          class="full-width"
          size="lg"
          to="/login"
          no-caps
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
</script>

<style scoped>
.my-card {
  border-radius: 12px;
}
</style>