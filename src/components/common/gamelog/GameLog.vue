<template>
  <div class="simulation-log">
    <div v-for="(node, index) in parsedLogs" :key="index">
      <component :is="node.type" :data="node" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import Text from './GameLogText.vue';
import Turn from './GameLogTurn.vue';
import Box from './GameLogBox.vue';
import Cards from './GameLogCards.vue';
import Deck from './GameLogDeck.vue';

const { data } = defineProps(['data']);

const parsedLogs = computed(() => parseLogs(data));

const parseLogs = (logs) => {
  const stack = [];
  const parsed = [];

  logs.forEach((log) => {
    if (log.type === 'turnStart') {
      const [turn, turnType, score, hp, genki] = log.text.split(':');
      const newNode = {
        type: Turn,
        turn,
        turnType,
        score,
        hp,
        genki,
        children: [],
      };
      if (stack.length > 0) {
        stack[stack.length - 1].children.push(newNode);
      } else {
        parsed.push(newNode);
      }
      stack.push(newNode);
    } else if (log.type === 'box') {
      const [title, icon] = log.text.split(':');
      const [iconType, iconId, iconColor] = icon?.split('_') ?? [];
      const newNode = {
        type: Box,
        title: title,
        icon: { type: iconType, id: iconId, color: iconColor },
        children: [],
      };
      if (stack.length > 0) {
        stack[stack.length - 1].children.push(newNode);
      } else {
        parsed.push(newNode);
      }
      stack.push(newNode);
    } else if (log.type === 'cards') {
      const cardData = log.text ? log.text.split(':').map((data) => data.split('_')) : [];
      const newCards = { type: Cards, cards: cardData };
      if (stack.length > 0) {
        stack[stack.length - 1].children.push(newCards);
      } else {
        parsed.push(newCards);
      }
    } else if (log.type === 'deck') {
      const cardData = log.text ? log.text.split(':') : [];
      const newCards = { type: Deck, cards: cardData };
      if (stack.length > 0) {
        stack[stack.length - 1].children.push(newCards);
      } else {
        parsed.push(newCards);
      }
    } else if (log.type === 'content') {
      const newText = { type: Text, content: log.text };
      if (stack.length > 0) {
        stack[stack.length - 1].children.push(newText);
      } else {
        parsed.push(newText);
      }
    } else if (log.type === 'end') {
      stack.pop();
    }
  });
  return parsed;
};
</script>

<style scoped>
.simulation-log {
  font-family: Arial, sans-serif;
  line-height: 1.5;
}
</style>
