<template>
  <PItemSelector
    :pItemList="pIdolPItems"
    :autoSelect="true"
    v-model:selectedPItem="selectedIdolPItems[0]"
  />
  <PItemSelector
    :pItemList="normalPItems"
    v-for="(_, index) in selectedIdolPItems.slice(1)"
    v-model:selectedPItem="selectedIdolPItems[index + 1]"
    :key="index"
  />
</template>

<script setup>
import PItemSelector from './selector/PItemSelector.vue';
import DataLoader from '#/game/data/DataLoader';
import { selectedIdolPItems, pIdolPItems, pIdolPlan } from '@/store/store.js';
import { onMounted, ref, watch } from 'vue';

const normalPItems = ref(Array.from(DataLoader.p_item_map).map((item) => item[1]));

onMounted(() => {
  const pIdolPlanWatch = () => {
    normalPItems.value = Array.from(DataLoader.p_item_map)
      .map((item) => item[1])
      .filter(
        (item) =>
          String(item.id)[0] == '3' && // サポートのPアイテム
          (item.plan == 'free' || item.plan == pIdolPlan.value) && // プラン一致
          item.effects
      );
  };
  pIdolPlanWatch();
  watch(pIdolPlan, pIdolPlanWatch);
});
</script>

<style scoped></style>
