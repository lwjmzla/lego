<template>
  <img
    :style="styleProps"
    class="l-image-component"
    @click.prevent="handleClick"
    :src="src"
  />
</template>
<script lang="ts">
import { defineComponent, StyleValue } from 'vue';
import useComponentCommon from '../hooks/useComponentCommon';
import { transformToComponentProps, imageDefaultProps, imageStylePropsNames } from '../defaultProps';
const defaultProps = transformToComponentProps(imageDefaultProps);

// array that contains style props
export default defineComponent({
  name: 'l-image',
  props: {
    ...defaultProps
  },
  setup (props) {
    const { styleProps, handleClick } = useComponentCommon(props, imageStylePropsNames);
    console.log(styleProps);
    return {
      // styleProps,
      styleProps: styleProps as unknown as StyleValue,
      handleClick
    };
  }
});
</script>

<style scoped>
.l-image-component {
  max-width: 100%;
  position: relative !important;
}
</style>
