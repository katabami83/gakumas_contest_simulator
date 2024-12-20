<template>
  <v-row>
    <v-col>
      <div>
        <table class="result-table">
          <tbody>
            <tr>
              <th>平均値</th>
              <th>中央値</th>
              <th>最頻値</th>
            </tr>
            <tr>
              <td id="result-score-mean">-</td>
              <td id="result-score-median">-</td>
              <td id="result-score-mode">-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <v-card class="custom-window">
        <v-card-item class="pa-0">
          <v-btn-toggle v-model="selectedBox" mandatory class="w-100 custom-btn-toggle">
            <v-btn value="1" class="flex-grow-1">ヒストグラム</v-btn>
          </v-btn-toggle>
        </v-card-item>

        <v-card-text class="custom-content pa-1">
          <div v-show="selectedBox === '1'">
            <canvas id="chart-histgram"></canvas>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <v-card class="custom-window">
        <v-card-item class="pa-0">
          <v-btn-toggle
            v-model="selectedLog"
            mandatory
            color="surface"
            class="w-100 custom-btn-toggle"
          >
            <v-btn value="1" class="flex-grow-1">最低値</v-btn>
            <v-btn value="2" class="flex-grow-1">ランダム</v-btn>
            <v-btn value="3" class="flex-grow-1">最大値</v-btn>
          </v-btn-toggle>
        </v-card-item>

        <v-card-text class="custom-content pa-1">
          <div class="contest-log" v-show="selectedLog === '1'">
            <GameLog :data="logRowData.min"></GameLog>
          </div>
          <div class="contest-log" v-show="selectedLog === '2'">
            <GameLog :data="logRowData.rnd"></GameLog>
          </div>
          <div class="contest-log" v-show="selectedLog === '3'">
            <GameLog :data="logRowData.max"></GameLog>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import Chart from 'chart.js/auto';
import GameLog from './gamelog/GameLog.vue';
import { useTheme } from 'vuetify';

const vTheme = useTheme();

// use property
// const primaryColor = vTheme.current.value.colors.primary;

const props = defineProps({ resultData: { type: Object } });
const selectedBox = ref('1');
const selectedLog = ref('1');
const logRowData = ref({
  min: [],
  rnd: [],
  max: [],
});

let histgram;

watch(
  () => props.resultData,
  (resultData) => {
    const scoreList = resultData.scoreList;
    scoreList.sort((a, b) => a - b);

    const aryMax = function (a, b) {
      return Math.max(a, b);
    };
    const aryMin = function (a, b) {
      return Math.min(a, b);
    };

    const minScore = scoreList.reduce(aryMin);
    const maxScore = scoreList.reduce(aryMax);

    const binStep = (() => {
      const scoreRange = maxScore - minScore;
      const digit = Number(
        Number(scoreRange / 25)
          .toExponential(0)
          .split('e')[1]
      );
      const baseNumber = 10 ** digit;
      return Math.max(1000, baseNumber);
    })();
    const minBin = Math.floor(minScore / binStep);
    const maxBin = Math.floor(maxScore / binStep);

    const binCount = Math.floor(maxBin - minBin) + 1;
    const data = new Array(binCount).fill(0);
    for (let i = 0; i < scoreList.length; i++) {
      const kaikyu = Math.floor(scoreList[i] / binStep) - minBin;
      data[kaikyu]++;
    }

    const mean = Math.floor(scoreList.reduce((pre, crt) => pre + crt, 0) / scoreList.length);
    const median =
      scoreList.length % 2
        ? scoreList[Math.floor(scoreList.length / 2)]
        : Math.floor((scoreList[scoreList.length / 2 - 1] + scoreList[scoreList.length / 2]) / 2);
    const mode =
      (minBin + data.reduce((pre, crt, i) => (pre[0] < crt ? [crt, i] : pre), [-1, 0])[1]) *
      binStep;

    document.getElementById('result-score-mean').textContent = `${mean}`;
    document.getElementById('result-score-median').textContent = `${median}`;
    document.getElementById('result-score-mode').textContent = `${mode}`;

    if (histgram) {
      histgram.data = {
        labels: new Array(binCount).fill(0).map((_, i) => (i + minBin) * binStep),
        datasets: [
          {
            label: `スコア(N=${scoreList.length})`,
            data: data,
            borderColor: vTheme.current.value.colors.dance,
            backgroundColor: vTheme.current.value.colors.dance,
          },
        ],
      };
      histgram.update();
    }

    // こっからログ

    logRowData.value.min = resultData.minLog.log;
    logRowData.value.rnd = resultData.rndLog.log;
    logRowData.value.max = resultData.maxLog.log;
  }
);

onMounted(() => {
  // @ts-ignore
  histgram = new Chart(document.getElementById('chart-histgram'), {
    type: 'bar',
  });
  const changeChartJSColor = () => {
    const text = vTheme.current.value.colors['text-1'];
    const border = vTheme.current.value.colors['border-1'];
    Chart.defaults.color = text;
    Chart.defaults.borderColor = border;
    if (histgram.options.scales.x) {
      histgram.options.scales.x.grid.color = border;
      histgram.options.scales.x.border.color = border;
      histgram.options.scales.x.ticks.color = text;
      histgram.options.scales.x.grid.tickColor = border;
      histgram.options.scales.y.grid.color = border;
      histgram.options.scales.y.border.color = border;
      histgram.options.scales.y.ticks.color = text;
      histgram.options.scales.y.grid.tickColor = border;
      histgram.update();
    }
  };

  watch(
    () => vTheme.global.current.value.dark,
    (isDark) => {
      changeChartJSColor();
    }
  );
  changeChartJSColor();
});
</script>

<style scoped>
.result-table {
  width: 100%;
  text-align: center;
  border-collapse: collapse;
  border-spacing: 0;
}
.result-table th {
  padding: 3px;
  background: rgb(var(--v-theme-bg-2));
  border: solid 1px rgb(var(--v-theme-border-1));
}
.result-table td {
  padding: 3px;
  background: rgb(var(--v-theme-surface));
  border: solid 1px rgb(var(--v-theme-border-1));
}

.custom-window {
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(var(--v-theme-text-1), 0.1);
}

.custom-btn-toggle .v-btn {
  font-weight: 500;
  text-transform: none;
  letter-spacing: normal;
  height: 48px;
  border-radius: 0;
}
.custom-content {
  min-height: 200px;
}
</style>
