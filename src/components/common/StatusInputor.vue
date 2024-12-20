<template>
  <v-row class="pa-0">
    <v-col cols="3" class="pa-0">
      <div class="status-block">
        <p class="status-title text-vocal-text-1">ボーカル</p>
        <input type="number" v-model.number="inputStatus.vocal" class="status-input" />
        <div class="adjusted-value-box bg-vocal-bg-3 text-vocal-text-1">
          <p>{{ status.vocal }}%</p>
        </div>
      </div>
    </v-col>

    <v-col cols="3" class="pa-0">
      <div class="status-block">
        <p class="status-title text-dance-text-1">ダンス</p>
        <input type="number" v-model.number="inputStatus.dance" class="status-input" />
        <div class="adjusted-value-box bg-dance-bg-3 text-dance-text-1">
          <p>{{ status.dance }}%</p>
        </div>
      </div>
    </v-col>

    <v-col cols="3" class="pa-0">
      <div class="status-block">
        <p class="status-title text-visual-text-1">ビジュアル</p>
        <input type="number" v-model.number="inputStatus.visual" class="status-input" />
        <div class="adjusted-value-box bg-visual-bg-3 text-visual-text-1">
          <p>{{ status.visual }}%</p>
        </div>
      </div>
    </v-col>

    <!-- 4列目: 体力 & サポートボーナス -->
    <v-col cols="3" class="pa-0">
      <div class="status-block">
        <p class="status-title green">体力</p>
        <input type="number" v-model.number="inputStatus.hp" class="status-input" />
        <input type="number" v-model.number="inputStatus.supportBonus" class="status-input" />
      </div>
    </v-col>
  </v-row>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { inputStatus, status, criteria, paramCalcType } from '@/store/store.js';
import ParameterCalculator from '#/game/calculator/ParameterCalculator.js';

onMounted(() => {
  const calc = () => {
    const adjustedStatus = ParameterCalculator.get(
      [inputStatus.value.vocal, inputStatus.value.dance, inputStatus.value.visual],
      [criteria.value.vocal, criteria.value.dance, criteria.value.visual],
      Number(inputStatus.value.supportBonus) / 100,
      paramCalcType.value
    );
    status.value.vocal = adjustedStatus[0];
    status.value.dance = adjustedStatus[1];
    status.value.visual = adjustedStatus[2];
    status.value.hp = inputStatus.value.hp;
  };
  calc();

  watch(
    () => [
      inputStatus.value.vocal,
      inputStatus.value.dance,
      inputStatus.value.visual,
      inputStatus.value.supportBonus,
      inputStatus.value.hp,
      criteria.value.vocal,
      criteria.value.dance,
      criteria.value.visual,
    ],
    calc
  );
});
</script>

<style scoped>
.status-block {
  text-align: center;
}

.status-block input::-webkit-outer-spin-button,
.status-block input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0 !important;
  -moz-appearance: textfield !important;
}

.status-title {
  font-size: 0.8rem;
  line-height: 1.2;
  white-space: nowrap;
}

.status-input {
  width: 80%;
  padding: 4px;
  font-size: 1rem;
  border: 1px solid rgb(var(--v-theme-border-1));
  border-radius: 4px;
  margin: 4px auto;
  text-align: center;
}

.status-input:focus {
  outline: 1px solid rgb(var(--v-theme-border-2));
}

.adjusted-value-box {
  padding: 4px;
  border-radius: 100px;
  font-size: 1rem;
  text-align: center;
  margin: 0px auto;
  width: 80%;
}

.green.status-title {
  color: #4caf50;
}
</style>
