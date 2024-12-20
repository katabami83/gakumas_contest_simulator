<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6" md="5" lg="5" xl="5" xxl="5">
        <SimulatorInput
          @run-simulation="simulate"
          :simulationLoading="simulationLoading"
          :simulationDone="simulationDone"
          :simulationTotal="simulationTotal"
        />
        <div class="link-container mt-2">
          <v-btn
            target="_blank"
            href="https://wikiwiki.jp/gakumas/%E3%82%B3%E3%83%B3%E3%83%86%E3%82%B9%E3%83%88%E3%82%B7%E3%83%9F%E3%83%A5%E3%83%AC%E3%83%BC%E3%82%BF%E3%83%BC%E6%9B%B4%E6%96%B0%E5%B1%A5%E6%AD%B4"
          >
            更新履歴
          </v-btn>
          <v-btn target="_blank" href="https://gkcontest.ris.moe/"> @risりす </v-btn>
        </div>
      </v-col>
      <v-col cols="12" sm="6" md="7" lg="7" xl="7" xxl="7">
        <SimulatorOutput :resultData="simulationResult" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import SimulatorInput from '@/components/common/SimulatorInput.vue';
import SimulatorOutput from '@/components/common/SimulatorOutput.vue';
import { ref } from 'vue';
import { getData, totalRunCount } from '@/store/store.js';

const simulationResult = ref(null);
const simulationLoading = ref(false);
const simulationDone = ref(0);
const simulationTotal = ref(1);

// シミュレーション開始
const simulate = async () => {
  if (simulationLoading.value) {
    return;
  }
  //
  const run_data = getData();
  console.log(run_data);
  if (!run_data) {
    alert('アイドルを選択してください');
    return;
  }
  simulationLoading.value = true;
  console.time('run');
  const result = await runWebWorker(run_data).catch((error) =>
    alert(`Worker error: ${error.message} in ${error.filename} at line ${error.lineno}`)
  );
  console.timeEnd('run');
  //
  simulationLoading.value = false;
  simulationDone.value = 0;
  if (result) {
    simulationResult.value = result;
  }
};

//
async function runWebWorker(data) {
  return new Promise((resolve, reject) => {
    let numWorkers = 1;
    if (navigator.hardwareConcurrency) {
      numWorkers = Math.min(navigator.hardwareConcurrency, 16);
    }
    const runsPerWorker = Math.ceil(totalRunCount.value / numWorkers);
    const totalRuns = runsPerWorker * numWorkers;
    simulationTotal.value = totalRuns;
    const rndLogNumber = Math.floor(Math.random() * numWorkers);

    let completedWorkers = 0;
    let results = {
      scoreList: [],
      minLog: null,
      maxLog: null,
      rndLog: null,
    };
    for (let i = 0; i < numWorkers; i++) {
      const worker = new Worker(new URL('/src/worker.js', import.meta.url), {
        type: 'module',
      });
      data.seed += totalRuns * 2;
      worker.postMessage({ runs: runsPerWorker, data: data });

      worker.onmessage = (e) => {
        const result = e.data;

        if (e.data.type == 'log') {
          simulationDone.value++;
          return;
        }

        results.scoreList = results.scoreList.concat(result.scoreList);
        if (!results.minLog || results.minLog.finalScore > result.minLog.finalScore) {
          results.minLog = result.minLog;
        }
        if (!results.maxLog || results.maxLog.finalScore < result.maxLog.finalScore) {
          results.maxLog = result.maxLog;
        }
        if (completedWorkers == rndLogNumber) {
          results.rndLog = result.rndLog;
        }
        if (++completedWorkers == numWorkers) {
          resolve(results);
        }

        worker.terminate();
      };

      worker.onerror = (error) => {
        console.log(`Worker error: ${error.message} in ${error.filename} at line ${error.lineno}`);
        worker.terminate();
        reject(error);
      };
    }
  });
}
</script>

<style scoped>
@media (max-width: 1280px) {
  .sp-pa-0 {
    padding: 0;
  }
}

.link-container > *:not(:first-child) {
  margin-left: 5px;
}
</style>

<style>
.v-container {
  background-color: rgb(var(--v-theme-bg-1));
}
.v-container,
.v-card,
.v-field__input,
input {
  color: rgb(var(--v-theme-text-1));
}
.v-theme--dark img {
  filter: saturate(90%) brightness(75%) contrast(135%);
}
</style>
