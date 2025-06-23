<template>
  <q-card class="my-card">
    <q-card-section>
      <div class="row items-center no-wrap">
        <div class="col">
          <div class="text-h6">{{ review.user.name }}</div>
          <q-rating
            :model-value="review.rating"
            size="2em"
            color="yellow-8"
            icon="star_border"
            icon-selected="star"
            icon-half="star_half"
            readonly
          />
        </div>

        <div class="col-auto">
          <q-btn color="grey-7" round flat icon="more_vert">
            <q-menu cover auto-close>
              <q-list>
                <q-item clickable>
                  <q-item-section>Reportar</q-item-section>
                </q-item>
                </q-list>
            </q-menu>
          </q-btn>
        </div>
      </div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <div class="text-subtitle1">
        {{ review.drink.name }}
      </div>
      <div class="text-caption text-grey">
        {{ review.comment }}
      </div>
    </q-card-section>

    <q-separator />

    <q-card-actions>
      <q-btn flat round icon="share" />
      <q-btn flat color="primary">Compartilhar</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
export default {
  name: 'ReviewCard',
  props: {
    // A prop 'review' receberá o objeto de avaliação completo
    // que virá do seu backend (já populado com user e drink)
    review: {
      type: Object,
      required: true,
      validator: (prop) => {
        // Validação básica para garantir que o objeto de review tenha as propriedades esperadas
        return (
          prop.user &&
          typeof prop.user.name === 'string' &&
          prop.rating !== undefined &&
          typeof prop.comment === 'string' &&
          prop.drink &&
          typeof prop.drink.name === 'string'
        );
      },
    },
  },
  // Você pode adicionar computed properties, methods, etc., aqui, se necessário
};
</script>

<style lang="scss" scoped>
.my-card {
  width: 100%;
  max-width: 350px; // Apenas um exemplo, ajuste conforme necessário
  margin: 15px; // Espaçamento entre os cards
}
</style>