<template>
  <router-link :to="{ name: 'review-details', params: { id: review._id } }" class="review-item-link">
    <div class="review-item q-mb-lg">
      <div class="row items-center justify-between q-mb-sm">
        <div class="text-h7 text-weight-bold title-font">
          {{ review.drink?.nome || "Birinight" }}, de {{ review.estabelecimento?.nome || "um botequim qualquer" }}
        </div>
        <div class="text-caption text-grey-6">{{ formatDate(review.data_criacao) || "Não lembro quando"
          }}</div>
      </div>

      <div class="row q-col-gutter-md">
        <div class="col-5 flex flex-column items-center">
          <q-img :src="getImageUrl(review.imagem) || defaultImageUrl" :ratio="1" class="rounded-borders q-mb-sm">
            <template v-slot:error>
              <div class="absolute-full flex flex-center bg-negative text-white">
                Não foi possível carregar a imagem
              </div>
            </template>
          </q-img>

          <q-rating :model-value="review.nota / 2" max="5" size="22px" color="primary" icon="star_border"
            icon-selected="star" icon-half="star_half" readonly half-increments class="q-mb-xs" />

          <div class="text-caption text-grey-5 full-width">
            Preço: R$ {{ (review.preco?.$numberDecimal ?
              parseFloat(review.preco.$numberDecimal).toFixed(2).replace('.', ',') :
              '??') }}
          </div>

          <div class="text-caption text-grey-5 full-width">
            Destilado: {{ review.drink?.destilado_base || "??" }}
          </div>
        </div>

        <div class="col-7">
          <div class="text-subtitle1">
            <span class="text-weight-bold">{{ review.usuario?.nome_usuario || "Alguém" }}</span> disse:
          </div>
          <p class="q-mt-xs comment-text">
            {{ truncateComment(review.comentario) || "Na verdade, nada declarou..." }}
          </p>
        </div>
      </div>
      <q-separator class="q-mt-lg" />
    </div>
  </router-link>
</template>

<script setup>
import { defineProps } from 'vue';

const { review } = defineProps({
  review: {
    type: Object,
    required: true
  }
});

const defaultImageUrl = import.meta.env.VITE_DEFAULT_IMAGE_URL;
const CHARACTER_LIMIT = 310;

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const truncateComment = (comment) => {
  if (!comment) return "Na verdade, nada declarou...";
  if (comment.length <= CHARACTER_LIMIT) {
    return comment;
  }
  return comment.substring(0, CHARACTER_LIMIT) + '...';
};

const getImageUrl = (caminhoRelativo) => {
  if (!caminhoRelativo) {
    return defaultImageUrl;
  }
  const caminhoCorrigido = caminhoRelativo.replace(/\\/g, '/');
  return `${import.meta.env.VITE_API_URL}/${caminhoCorrigido}`;
};
</script>

<style lang="scss" scoped>
.title-font {
  font-family: 'Inknut Antiqua', serif;
}

.review-item .text-h6 {
  line-height: 1.2
}

.review-item-link,
.review-item-link:hover,
.review-item-link:visited,
.review-item-link:active {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.comment-text {
  overflow: hidden;
}
</style>
