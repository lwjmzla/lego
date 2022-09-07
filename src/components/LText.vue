<template>
  <component
    :is="tag"
    :style="styleProps"
    class="l-text-component"
    @click="handleClick"
  >
    {{ text }}
  </component>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
// import { pick } from 'lodash-es';
import { transformToComponentProps, textDefaultProps, textStylePropNames } from '../defaultProps';
import useComponentCommon from '@/hooks/useComponentCommon';

const props = defineProps({
  // text: {
  //   type: String,
  //   default: ''
  // },
  // fontSize: {
  //   type: String
  // },
  ...transformToComponentProps(textDefaultProps) // !把props默认值转为props类型定义
  // tag: {
  //   type: String,
  //   default: 'div'
  // }
});
// const styleProps = computed(() => pick(props, textStylePropNames));
// console.log(props)

const { styleProps, handleClick } = useComponentCommon(props, textStylePropNames);
</script>


<style>
.l-text-component {
  position: relative !important;
}
</style>
