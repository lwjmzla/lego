<template>
  <div class="edit-wrapper" @click="onItemClick" :class="{ 'active': active }">
    <slot></slot>
    <p class="icon" @click="removeClick" :style="{ display: active ? 'block' : 'none' }">
      <close-circle-filled style="background: #fff;border-radius: 50%;" />
    </p>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';
import { CloseCircleFilled } from '@ant-design/icons-vue';
const props = defineProps({
  id: String,
  active: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(['set-active', 'remove']);
const onItemClick = () => {
  emit('set-active', props.id);
};
const removeClick = () => {
  emit('remove');
};
</script>

  <style scoped>
  .edit-wrapper {
    position: relative;
    cursor: pointer;
    border: 1px solid transparent;
    user-select: none;
  }
  .edit-wrapper:hover {
    border: 1px dashed #999;
  }
  .edit-wrapper.active {
    border: 1px solid #1890ff;
  }
  .icon {
    position: absolute;
    right: -5px;
    top: -10px;
    margin: 0;
    display: none;
  }
  </style>
