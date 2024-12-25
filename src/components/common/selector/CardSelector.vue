<template>
  <div>
    <v-card
      v-if="selectedCard"
      :class="['card-box', { disable: !availableSelectedCard }]"
      variant="text"
      @click="dialog = true"
    >
      <v-tooltip location="top">
        <template v-slot:activator="{ props }">
          <v-img v-bind="props" :src="`${baseImageURL}/cards/card_${selectedCard.id}.webp`" contain
            ><template v-slot:error>
              <v-img
                v-bind="props"
                :src="`${baseImageURL}/pItems/error.webp`"
                class="pItem-image"
                contain
              ></v-img> </template
          ></v-img>
        </template>
        <CardDescription :card="selectedCard" />
      </v-tooltip>
    </v-card>
    <v-card v-else class="card-box placeholder" variant="text" @click="dialog = true">
      <v-icon size="32">mdi-plus</v-icon>
    </v-card>
    <v-btn
      v-if="selectedCard"
      density="compact"
      block
      variant="flat"
      color="bg-2"
      class="mt-1"
      @click="isEdit = true"
      ><v-icon>mdi-pencil</v-icon></v-btn
    >
    <CardEditor v-model:modelValue="selectedCard" v-model:isDialog="isEdit" />
    <CardDialog
      :autoSelect="autoSelect"
      :itemList="cardList"
      v-model:selectedItem="selectedCard"
      v-model:dialog="dialog"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { baseImageURL } from '@/store/constant.js';
import CardDescription from '../description/CardDescription.vue';
import CardDialog from '../dialog/CardDialog.vue';
import CardEditor from '../editor/CardEditor.vue';

const props = defineProps({
  availableSelectedCard: { type: Boolean },
  autoSelect: { type: Boolean },
  cardList: { type: Array, require: true },
});

const selectedCard = defineModel('selectedCard');

const dialog = ref(false);
const isEdit = ref(false);

const editItem = () => {};

onMounted(() => {
  const cardListWatch = () => {
    if (selectedCard.value) {
      if (!props.cardList.some((item) => selectedCard.value.id == item?.id)) {
        selectedCard.value = null;
      } else {
        return;
      }
    }
    if (props.autoSelect && props.cardList && props.cardList.length > 0) {
      selectedCard.value = props.cardList[props.cardList.length > 1 ? 1 : 0];
    }
  };
  watch(() => props.cardList, cardListWatch);
  cardListWatch();
});
</script>

<style scoped>
.v-tooltip :deep(.v-overlay__content) {
  background-color: rgba(var(--v-theme-bg-1), 0.85) !important;
  border: solid 1px rgb(var(--v-theme-border-2));
  color: rgb(var(--v-theme-text-1));
}

.card-box {
  aspect-ratio: 1;
  border-radius: 6px;
  cursor: pointer;
}

.placeholder {
  border: solid 2px rgb(var(--v-theme-border-2));
  display: flex;
  justify-content: center;
  align-items: center;
}

.disable .v-img {
  filter: brightness(50%);
}
</style>
