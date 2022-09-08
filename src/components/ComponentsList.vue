<template>
  <div class="create-component-list">
    <div v-for="(item, index) in list"
      :key="index"
      class="component-item"
      @click="onItemClick(item)"
    >
      <l-text v-bind="item"></l-text>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import LText from './LText.vue';
import { TextComponentProps } from '../defaultProps';

defineProps({
  list: {
    type: Array as PropType<Partial<TextComponentProps>[]>,
    required: true
  }
});
const emit = defineEmits(['on-item-click']);
const onItemClick = (item: Partial<TextComponentProps>) => {
  emit('on-item-click', item);
};
</script>
