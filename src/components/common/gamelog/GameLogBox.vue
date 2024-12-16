<template>
  <div class="log-box">
    <div class="log-title">
      <FontAwesomeIcon
        v-if="data.icon.type === 'awesome'"
        :icon="['fas', data.icon.id]"
        :style="{ color: data.icon.color }"
      />
      <CustomIcon
        v-else-if="data.icon.type"
        :src="`${baseImageURL}/${data.icon.type}s/${data.icon.type}_${data.icon.id}.webp`"
      />
      {{ data.title }}
    </div>
    <div class="log-children">
      <component
        v-for="(child, index) in data.children"
        :key="index"
        :is="child.type"
        :data="child"
      />
    </div>
  </div>
</template>

<script setup>
import CustomIcon from '@/components/CustomIcon.vue';
import { baseImageURL } from '@/store/constant.js';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
const { data } = defineProps({
  data: {
    type: Object,
    require: true,
  },
});
</script>

<style scoped>
.log-box {
  margin: 2px 0;
  border: solid 1px rgb(var(--v-theme-border-2));
  border-radius: 5px;
  overflow: hidden;
}
.log-title {
  font-size: 1em;
  padding: 2px 5px;
  background-color: rgb(var(--v-theme-bg-2));
}
.log-children {
  padding: 2px 4px;
}
</style>
