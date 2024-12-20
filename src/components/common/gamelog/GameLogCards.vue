<template>
  <div class="log-cards">
    <div v-for="(card, index) in data.cards" :key="index" class="log-cards-item">
      <div>
        <v-img
          aspect-ratio="1/1"
          :src="`${baseImageURL}/cards/card_${card[0]}.webp`"
          :alt="`Card ${card[0]}`"
          :class="[
            'log-cards-item-card',
            { disable: card[2] == '0' },
            { selected: card[2] == '2' },
          ]"
        />
        <div class="log-cards-item-text">{{ card[1] }}</div>
      </div>
    </div>
    <div v-if="data.cards.length == 0" class="empty">手札がありません</div>
  </div>
</template>

<script setup>
import { baseImageURL } from '@/store/constant.js';
const { data } = defineProps({
  data: {
    type: Object,
    require: true,
  },
});
</script>

<style scoped>
.log-cards {
  display: flex;
  gap: 10px;
  margin: 3px 0;
  border: solid 1px rgb(var(--v-theme-border-2));
  border-radius: 5px;
  justify-content: space-around;
  overflow: hidden;
  padding: 5px 5px 0px 5px;
  text-align: center;
}

.empty {
  padding-bottom: 5px;
}

.log-cards-item {
  width: calc((100% - 20px) / 5);
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
