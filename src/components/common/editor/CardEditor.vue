<template>
  <v-dialog
    v-model="isDialog"
    scrollable
    width="100%"
    max-width="800px"
    @click:outside="closeDialog"
  >
    <v-card>
      <v-card-title>
        <span class="text-h6">カード編集</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-col cols="12">
          <v-text-field label="カード名" v-model="editableEffect.name" />
          <div class="d-flex ga-2">
            <v-select
              style="width: 50%"
              label="カードタイプ"
              :items="cardTypeList"
              v-model="editableEffect.type"
            />
            <v-select
              style="width: 50%"
              label="プラン"
              :items="cardPlanList"
              v-model="editableEffect.plan"
            />
          </div>
          <v-text-field label="使用条件" v-model="editableEffect.condition" disabled />
          <div class="bordered-box">
            <div class="title">成長</div>
            <div class="content">
              {{ JSON.stringify(editableEffect.growths) }}
            </div>
          </div>
          <div class="bordered-box">
            <div class="title">開始効果</div>
            <div class="content">
              <PreEffectsEditor v-model:preEffects="editableEffect.pre_effects"></PreEffectsEditor>
            </div>
          </div>
          <div class="bordered-box">
            <div class="title">コスト</div>
            <div class="content">
              <EffectsEditor v-model:effects="cost"></EffectsEditor>
            </div>
          </div>
          <div class="bordered-box">
            <div class="title">効果</div>
            <div class="content">
              <EffectsEditor v-model:effects="editableEffect.effects" :isAdd="true"></EffectsEditor>
            </div>
          </div>
          <v-text-field label="使用回数制限" v-model.number="editableEffect.limit" type="number" />
          <div class="d-flex ga-2">
            <v-text-field
              label="カードコスト"
              v-model.number="editableEffect.card_cost"
              disabled
              type="number"
            ></v-text-field>
            <v-checkbox label="カード重複" v-model="editableEffect.allow_duplicate" disabled />
          </div>
        </v-col>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="text" @click="closeDialog">Cancel</v-btn>
        <v-btn color="primary" variant="text" @click="saveEffect">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { reactive, computed, watch, ref, onMounted } from 'vue';
import EffectsEditor from './EffectsEditor.vue';
import PreEffectsEditor from './PreEffectsEditor.vue';

const modelValue = defineModel('modelValue');
const isDialog = defineModel('isDialog');

const editableEffect = ref({ ...JSON.parse(JSON.stringify(modelValue.value)) });
if (editableEffect.value.pre_effects === undefined) {
  editableEffect.value.pre_effects = [];
}

const cost = computed(() => [editableEffect.value.cost]);

const cardTypeList = [
  { title: 'アクティブ', value: 'active' },
  { title: 'メンタル', value: 'mental' },
  { title: 'トラブル', value: 'trouble' },
];

const cardPlanList = [
  { title: 'フリー', value: 'free' },
  { title: 'センス', value: 'sense' },
  { title: 'ロジック', value: 'logic' },
  { title: 'アノマリー', value: 'anomaly' },
];

watch(
  () => modelValue.value,
  (newValue) => {
    editableEffect.value = { ...JSON.parse(JSON.stringify(modelValue.value)) };
    if (editableEffect.value.pre_effects === undefined) {
      editableEffect.value.pre_effects = [];
    }
  }
);

const closeDialog = () => {
  isDialog.value = false;
};

const saveEffect = () => {
  modelValue.value = { ...editableEffect.value };
  closeDialog();
};
</script>

<style scoped>
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
