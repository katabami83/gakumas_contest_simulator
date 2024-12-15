<template>
  <v-row>
    <v-col cols="12">
      <ContestSelector />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12">
      <StatusInputor />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12">
      <CompositionBuilder />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12">
      <v-btn
        :loading="props.simulationLoading"
        color="green-darken-2"
        height="48"
        block
        variant="elevated"
        @click="sendEvent"
      >
        <template v-slot:default> 実行 </template>
        <template v-slot:loader>
          <v-progress-circular width="2" indeterminate></v-progress-circular>
          <span>実行中({{ simulationDone }}/{{ simulationTotal }})</span>
        </template>
      </v-btn>
    </v-col>
  </v-row>
  <v-row class="sp-hide">
    <v-col>
      <v-text-field
        v-model="copyText"
        label="編成URL"
        readonly
        variant="solo"
        prepend-inner-icon="mdi-content-copy"
        @click:prependInner="copyToClipboard"
      ></v-text-field>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref } from 'vue';
import ContestSelector from './ContestSelector.vue';
import StatusInputor from './StatusInputor.vue';
import CompositionBuilder from './CompositionBuilder.vue';

const emits = defineEmits(['runSimulation']);
const sendEvent = () => {
  copyText.value = location.href;
  emits('runSimulation');
};
const props = defineProps({
  simulationLoading: {
    type: Boolean,
  },
  simulationTotal: {
    type: Number,
  },
  simulationDone: {
    type: Number,
  },
});

/**
 * 双方向データ
 */
const copyText = ref('編成URLが表示されます');

const copyToClipboard = () => {
  if (copyText.value.indexOf('http') == -1) return;
  navigator.clipboard
    .writeText(copyText.value)
    .then(() => {
      //
    })
    .catch(() => {
      //
    });
};
</script>

<style scoped>
@media (max-width: 600px) {
  .sp-hide {
    display: none;
  }
}
</style>
