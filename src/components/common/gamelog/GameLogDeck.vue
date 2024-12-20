<template>
  <div class="log-cards">
    <div class="log-title">
      <FontAwesomeIcon :icon="['fas', 'shuffle']" class="text-visual-text-1" />山札シャッフル
    </div>
    <div class="log-cards-list">
      <div v-for="(card, index) in data.cards" :key="index" class="log-cards-item">
        <div>
          <v-img
            aspect-ratio="1/1"
            :src="`${baseImageURL}/cards/card_${card}.webp`"
            :alt="`Card ${card}`"
            :class="['log-cards-item-card']"
          />
        </div>
      </div>
      <div v-if="data.cards.length == 0" class="empty">デッキがありません</div>
    </div>
  </div>
</template>

<script setup>
import { baseImageURL } from '@/store/constant.js';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
const { data } = defineProps({
  data: {
    type: Object,
    require: true,
  },
});
</script>

<style scoped>
.log-cards {
  margin: 3px 0;
  border: solid 1px rgb(var(--v-theme-border-2));
  border-radius: 5px;
  overflow: hidden;
}

.log-title {
  font-size: 1em;
  padding: 2px 5px;
  background-color: rgb(var(--v-theme-bg-2));
}

.log-cards-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(40px, 1fr));
  gap: 5px;
  width: 100%;
  padding: 5px;
}

.empty {
  padding-bottom: 5px;
  text-align: center;
}

.log-cards-item-card {
  margin: auto;
  max-width: 70px;
  width: 100%;
  object-fit: cover;
  border-radius: 5px;
}

.log-cards-item-card.selected {
  filter: brightness(110%) contrast(95%) drop-shadow(0 0 4px yellow);
}

.log-cards-item-card.disable {
  filter: brightness(60%);
}

.log-cards-item-text {
  text-align: center;
  font-size: 0.8em;
}
</style>
