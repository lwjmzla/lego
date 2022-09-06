<template>
  <div class="create-component-list">
    <l-text v-for="(item, index) in list" :key="index" v-bind="item"></l-text>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
import LText from './LText.vue';

defineProps({
  list: {
    type: Array,
    required: true
  }
});
</script>
