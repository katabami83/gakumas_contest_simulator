<template>
  <img
    :src="src"
    :alt="alt || 'icon'"
    :style="{ width: computedSize, height: computedSize }"
    class="custom-icon"
  />
</template>

<script setup>
const { src, alt, size } = defineProps(['src', 'alt', 'size']);

const computedSize = size || '22px';
</script>

<style scoped>
.custom-icon {
  display: inline-block;
  vertical-align: middle;
}
</style>
