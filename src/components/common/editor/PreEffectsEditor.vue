<template>
  <v-expansion-panels>
    <v-expansion-panel v-for="(_, index) in preEffects">
      <v-expansion-panel-title class="pa-4 py-0">
        <template v-slot:default="{ expanded }">
          <v-btn
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
      <PreEffectEditor v-model:preEffect="preEffects[index]" />
    </v-expansion-panel>
    <v-expansion-panel>
      <v-btn @click="addEffect" block elevation="0"><v-icon>mdi-plus</v-icon></v-btn>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup>
import { computed } from 'vue';
import PreEffectEditor from './PreEffectEditor.vue';
import EntityTranslator from '#/utils/EntityTranslator.js';

const addEffect = () => {
  preEffects.value.push({ type: 'レッスン開始時手札に入る', value: 0 });
};

const deleteEffect = (index) => {
  preEffects.value.splice(index, 1);
};

const preEffects = defineModel('preEffects');
const description = computed(() =>
  preEffects.value.map((preEffect) => EntityTranslator.translatePreEffect(preEffect))
);
</script>
