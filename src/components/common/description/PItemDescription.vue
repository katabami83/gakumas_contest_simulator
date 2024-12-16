<template>
  <div class="title">{{ entity.name }}</div>
  <div>{{ content.trigger }}</div>
  <div v-if="content.condition">{{ content.condition }}なら</div>
  <div v-for="effect in content.effects">・{{ effect }}</div>
  <div class="sub-information-box text-primary">
    <div>レッスン中{{ `${entity.limit < 0 ? '∞' : entity.limit}` }}回</div>
  </div>
  <div class="card-classification">
    <div>{{ content.plan }}</div>
    <div v-if="String(entity.id)[0] == '2'">固有</div>
    <div v-else-if="String(entity.id)[0] == '4'">コンテスト</div>
  </div>
</template>
<script setup>
import EntityTranslator from '#/utils/EntityTranslator.js';
import { computed } from 'vue';

const { entity } = defineProps(['entity']);

const content = computed(() => {
  return EntityTranslator.translate(entity);
});
</script>

<style scoped>
.card-classification {
  display: flex;
  flex-wrap: wrap;
  font-size: 0.75em;
  margin: auto;
  justify-content: center;
}
.card-classification div:not(:last-of-type)::after {
  content: '/';
  color: rgb(var(--v-theme-text-1));
  margin: 0 0.1em;
}

.title {
  font-weight: bold;
  font-size: 1.1em;
}
.sub-information-box {
  margin-top: 2px;
  font-size: 0.85em;
}
</style>
