<template>
  <v-expansion-panel-text>
    <v-select label="種類" :items="typeList" v-model="effect.type" />
    <v-select
      v-if="targetType == 'select'"
      label="対象"
      :items="targetList"
      v-model="effect.target"
    />
    <div class="d-flex ga-2">
      <v-text-field
        v-if="valueType == 'number'"
        label="効果量"
        v-model.number="effect.value"
        type="Number"
      />
      <v-select
        v-else-if="valueType == 'select'"
        label="効果量"
        :items="valueList"
        v-model="effect.value"
      />
      <v-text-field label="予約ターン数" v-model.number="effect.delay" type="Number" />
      <v-text-field
        v-if="effect.type == 'score'"
        label="発動回数"
        v-model.number="effect.times"
        type="Number"
      />
    </div>
    <div class="bordered-box" v-if="effect.options">
      <div class="title">オプション</div>
      <div class="content">
        <EffectOptionsEditor v-model:options="effect.options"></EffectOptionsEditor>
      </div>
    </div>
    <v-text-field label="使用条件" v-model="effect.condition" disabled />
  </v-expansion-panel-text>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import DataLoader from '#/game/data/DataLoader.js';
import EffectOptionsEditor from './EffectOptionsEditor.vue';

const effect = defineModel('effect');
if (!effect.value.options) {
  effect.value.options = [{ type: 'increase_by_percentage', target: 'score', value: 0 }];
}

watch(effect, () => {
  if (!effect.value.options) {
    effect.value.options = [{ type: 'increase_by_percentage', target: 'score', value: 0 }];
  }
});

const valueType = ref('number');
const valueList = ref([]);
const targetType = ref('None');
const targetList = ref([]);

const typeList = [
  { title: 'スコア', value: 'score' },
  { title: 'ステータス', value: 'status' },
  { title: '体力回復', value: 'heal' },
  { title: '体力消費', value: 'hp' },
  { title: '体力直接消費', value: 'direct_hp' },
  { title: '固定体力直接消費', value: 'fixed_direct_hp' },
  { title: '元気', value: 'genki' },
  { title: '固定元気', value: 'fixed_genki' },
  { title: 'ドロー', value: 'draw' },
  { title: '手札入れ替え', value: 'exchange' },
  { title: '手札強化', value: 'upgrade' },
  { title: '生成', value: 'generate' },
  { title: '保留', value: 'retain' },
  // { title: 'カード移動', value: 'move' },
  { title: 'カード強化', value: 'reinforcement' },
  { title: '追加ターン', value: 'extra_turn' },
];

const retainList = ['自身', '手札', '山札捨札', 'カード'];

const statusList = [
  '消費体力減少',
  '消費体力増加',
  '消費体力削減',
  '消費体力追加',
  '元気増加無効',
  '低下状態無効',
  'スキルカード使用数追加',
  '次に使用したスキルカードの消費体力を0にする',
  '好調',
  '不調',
  '集中',
  '絶好調',
  '好印象',
  'やる気',
  '指針',
  '指針固定',
  '全力値',
  '熱意',
  'パラメータ上昇量増加',
  '次に使用するスキルカードの効果を発動',
  '次に使用するアクティブスキルカードの効果を発動',
  'アクティブスキルカード使用時固定元気+2',
  'アクティブスキルカード使用時、パラメータ+4',
  'アクティブスキルカード使用時、パラメータ+5',
  'アクティブスキルカード使用時集中+1',
  'ターン終了時、集中が3以上の場合、集中+2',
  'ターン終了時スコア+4',
  '以降、ターン開始時、好調2ターン',
  'メンタルスキルカード使用時好印象+1',
  'メンタルスキルカード使用時やる気+1',
  'ターン終了時、好印象+1',
  'ターン終了時、好印象が3以上の場合、好印象+3',
  'スキルカード使用時、好印象の30%分パラメータ',
  'スキルカード使用時、好印象の50%分パラメータ',
  'スキルカード使用時、好印象の50%分パラメータ・好印象+1',
  '元気効果のスキルカード使用後、好印象+1',
  '好印象効果のスキルカード使用後、好印象の30%分のパラメータ',
  '好印象効果のスキルカード使用後、好印象の50%分のパラメータ',
  '以降、ターン開始時、いずれかの指針の場合、すべてのスキルカードのパラメータ値増加+4',
];

const reinforcementList = [
  '手札のパラメータ上昇回数増加',
  'すべてのパラメータ値増加',
  '手札のパラメータ値増加',
  '保留のパラメータ値増加',
];

const setRule = () => {
  if (effect.value.type == 'generate') {
    targetType.value = 'none';
    valueType.value = 'select';
    valueList.value = [{ title: 'ランダムな強化済みカード', value: 1 }];
    effect.value.value = valueList.value[0].value;
    return;
  }
  if (effect.value.type == 'status') {
    targetType.value = 'select';
    targetList.value = statusList;
    if (effect.value.target == '指針') {
      valueType.value = 'select';
      valueList.value = [
        { title: '無し', value: 0 },
        { title: '温存:段階1', value: 1 },
        { title: '温存:段階2', value: 2 },
        { title: '強気:段階1', value: 3 },
        { title: '強気:段階2', value: 4 },
        { title: '全力', value: 5 },
      ];
      return;
    }
    return;
  }
  if (effect.value.type == 'retain') {
    targetType.value = 'select';
    targetList.value = retainList;
    if (effect.value.target == 'カード') {
      valueType.value = 'select';
      valueList.value = Array.from(DataLoader.cardMap)
        .map((item) => item[1])
        .filter((item) => item.id % 2 == 0)
        .map((item) => {
          return { title: item.name, value: item.id };
        });
      effect.value.value = valueList.value[0].value;
      return;
    }
    valueType.value = 'None';
    valueList.value = [];
    return;
  }
  if (effect.value.type == 'reinforcement') {
    targetType.value = 'select';
    targetList.value = reinforcementList;
    return;
  }
  targetType.value = 'none';
  valueType.value = 'number';
  valueList.value = [];
};
setRule();
watch(
  () => effect.value.type,
  (newValue, oldValue) => {
    if (newValue == 'status') {
      effect.value.target = statusList[0];
    } else if (newValue == 'retain') {
    } else {
      effect.value.target = '';
    }
    setRule();
  }
);

watch(
  () => effect.value.target,
  (newValue, oldValue) => {
    setRule();
  }
);
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
.bordered-box {
  position: relative;
  border: 2px solid rgb(var(--v-theme-border-1));
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.title {
  position: absolute;
  top: -12px;
  left: 16px;
  background: rgb(var(--v-theme-surface));
  padding: 0 4px;
  font-weight: bold;
  color: rgb(var(--v-theme-text-1));
}
</style>
