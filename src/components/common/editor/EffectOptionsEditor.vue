<template>
  <div class="d-flex ga-2" v-for="option in options">
    <v-select label="タイプ" :items="typeList" v-model="option.type" />
    <v-text-field label="対象" v-model="option.target" />
    <v-text-field label="効果量" v-model.number="option.value" type="Number" />
  </div>
</template>

<script setup>
const options = defineModel('options');

const typeList = [
  { title: '%加算', value: 'increase_by_percentage' },
  { title: '倍加算', value: 'increase_by_factor' },
  { title: '倍効果適用', value: 'status_coef_bonus' },
];
</script>
