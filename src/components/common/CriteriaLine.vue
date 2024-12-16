<template>
  <div class="parent">
    <div class="text-vocal-text-1" :style="`width: ${vocal}%;`">
      <div class="bg-vocal-bg-1 line"></div>
      <div>{{ vocal }}%</div>
    </div>
    <div class="text-dance-text-1" :style="`width: ${dance}%;`">
      <div class="bg-dance-bg-1 line"></div>
      <div>{{ dance }}%</div>
    </div>
    <div class="text-visual-text-1" :style="`width: ${visual}%;`">
      <div class="bg-visual-bg-1 line"></div>
      <div>{{ visual }}%</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['vocal', 'dance', 'visual']);
</script>

<style scoped>
.parent {
  width: calc(100% - 12px);
  margin: 0 auto;
  overflow: hidden;
  display: flex;
  text-align: center;
  font-size: 12px;
}
.line {
  height: 4px;
  background-color: gray;
}
</style>
