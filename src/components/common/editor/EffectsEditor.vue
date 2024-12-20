<template>
  <v-expansion-panels>
    <v-expansion-panel v-for="(_, index) in effects">
      <v-expansion-panel-title class="pa-4 py-0">
        <template v-slot:default="{ expanded }">
          <v-btn
            v-if="isAdd"
            icon="mdi-delete"
            density="comfortable"
            @click.stop="deleteEffect(index)"
            elevation="0"
          ></v-btn>
          <div class="pa-4">
            {{ description[index] }}
          </div>
        </template>
      </v-expansion-panel-title>
      <EffectEditor v-model:effect="effects[index]" />
    </v-expansion-panel>
    <v-expansion-panel v-if="isAdd">
      <v-btn @click="addEffect" block elevation="0"><v-icon>mdi-plus</v-icon></v-btn>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup>
import { computed } from 'vue';
import EffectEditor from './EffectEditor.vue';
import EntityTranslator from '#/utils/EntityTranslator.js';

const addEffect = () => {
  effects.value.push({ type: 'score', value: 1 });
};

const deleteEffect = (index) => {
  effects.value.splice(index, 1);
};

const effects = defineModel('effects');
const description = computed(() =>
  effects.value.map((effect) => EntityTranslator.translateEffect(effect))
);
const { isAdd } = defineProps({ isAdd: { type: Boolean } });
</script>
