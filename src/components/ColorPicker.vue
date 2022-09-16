<template>
  <div class="color-picker">
    <input ref="colorPicker"
      type="color"
      :value="value"
      @input="onChange"
    />
    <ul class="color-wrapper">
      <li :class="'item' + index" v-for="(item, index) in colors" :key="index">
        <div
          @click="onItemChange(item)"
          :style="{ backgroundColor: item }"
          :class="[item ? 'color-item' : 'color-item transperent-back']"
        ></div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, onMounted, ref } from 'vue';
const defaultColors = [
  '#ffffff',
  '#f5222d',
  '#fa541c',
  '#fadb14',
  '#52c41a',
  '#1890ff',
  '#722ed1',
  '#8c8c8c',
  '#000000',
  ''
];
export default defineComponent({
  emits: ['change'],
  props: {
    value: {
      type: String
    },
    colors: {
      type: Array as PropType<string[]>,
      default: () => defaultColors
    }
  },
  setup (props, context) {
    const onChange = (event: any) => {
      context.emit('change', event.target.value);
    };
    const onItemChange = (color: string) => {
      context.emit('change', color);
    };

    const colorPicker = ref<HTMLElement | null>(null);
    // onMounted(() => {
    //   setTimeout(() => {
    //     colorPicker.value?.setAttribute('value', '#f5222d');
    //     context.emit('change', '#f5222d');
    //   }, 1000);
    // });
    return {
      onChange,
      onItemChange,
      colorPicker
    };
  }
});
</script>

<style scoped>
.color-picker {
  display: flex;
}
.color-picker input {
  flex: 0 0 48px;
  height: 48px;
}
ul {
  margin-left: 8px;
  padding-left: 0;
  flex: 1;
  display: flex;
  flex-wrap: wrap;
}
li {
  flex: 0 0 20%;
  padding: 2px;
  width: 22px;
  height: 22px;
  box-sizing: border-box;
  list-style: none;
  cursor: pointer;
}
li div {
  width: 100%;
  height: 100%;
}
li div.transperent-back {
  width: 100%;
  height: 100%;
  background: url("~@/assets/transparent.png") no-repeat;
}
</style>
