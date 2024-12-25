<template>
  <v-expansion-panel-text>
    <v-select label="種類" :items="typeList" v-model="preEffect.type" />
  </v-expansion-panel-text>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import DataLoader from '#/game/data/DataLoader.js';

const preEffect = defineModel('preEffect');

const typeList = [{ title: 'レッスン開始時手札に入る', value: 'レッスン開始時手札に入る' }];
</script>

<style scoped>
.delete-btn {
  display: block;
  width: 32px;
  /* height: 100%; */
  padding: 0;
  margin: 0;
  /* display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0;  */
}
.v-expansion-panel-title {
  min-width: none;
}
</style>
