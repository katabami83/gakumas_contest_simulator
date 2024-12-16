<template>
  <div class="log-text">{{ data.content }}</div>
</template>

<script setup>
const { data } = defineProps({
  data: {
    type: Object,
    require: true,
  },
});
</script>

<style scoped>
.log-text {
  padding: 2px 4px;
}
</style>
