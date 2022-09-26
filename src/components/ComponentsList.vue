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
  <!-- <StyledUploader @success="onImageUploaded"></StyledUploader> -->
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import LText from './LText.vue';
import { TextComponentProps } from '../defaultProps';
import StyledUploader from './StyledUploader.vue'; // todo
import { ComponentData } from '@/store/editor';
import { v4 as uuidv4 } from 'uuid';

defineProps({
  list: {
    type: Array as PropType<Partial<TextComponentProps>[]>,
    required: true
  }
});
const emit = defineEmits(['on-item-click']);
const onItemClick = (item: Partial<TextComponentProps>) => {
  const componentData:ComponentData = {
    id: uuidv4(),
    name: 'LText',
    props: item
  };
  emit('on-item-click', componentData);
};

</script>
