<template>
  <div class="log-turn">
    <div class="log-turn-title" :data-turnType="data.turnType">
      <div>{{ data.turn }}ターン目</div>
      <div>
        <font-awesome-icon :icon="['fas', 'star']" style="color: rgb(var(--v-theme-yellow-1))" />{{
          data.score
        }}
        <font-awesome-icon :icon="['fas', 'heart']" style="color: rgb(var(--v-theme-green-1))" />{{
          data.hp
        }}
        <font-awesome-icon
          :icon="['fas', 'shield-halved']"
          style="color: rgb(var(--v-theme-blue-1))"
        />{{ data.genki }}
      </div>
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
const { data } = defineProps({
  data: {
    type: Object,
    require: true,
  },
});
</script>

<style scoped>
.log-turn-title {
  padding: 2px 8px;
  font-size: 1.1em;
  color: rgb(var(--v-theme-text-2));
  font-weight: bold;
  display: flex;
}
.log-turn-title > :first-child {
  margin-right: auto;
}

.log-turn-title[data-turnType='vocal'] {
  /* background: linear-gradient(to right, #f13584, #f461a1); */
  background: linear-gradient(
    to right,
    rgb(var(--v-theme-vocal-bg-1)),
    rgb(var(--v-theme-vocal-bg-2))
  );
}

.log-turn-title[data-turnType='dance'] {
  /* background: linear-gradient(to right, #1d84ed, #4b9ef0); */
  background: linear-gradient(
    to right,
    rgb(var(--v-theme-dance-bg-1)),
    rgb(var(--v-theme-dance-bg-2))
  );
}

.log-turn-title[data-turnType='visual'] {
  /* background: linear-gradient(to right, #f7b12f, #f8c25d); */
  background: linear-gradient(
    to right,
    rgb(var(--v-theme-visual-bg-1)),
    rgb(var(--v-theme-visual-bg-2))
  );
}
</style>
