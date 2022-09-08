<template>
  <div class="props-table">
    {{finalProps}}
    <div v-for="(value,key) in finalProps" :key="key">
      <component v-if="value" :is="value.component" :value="value.value"></component>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType, computed } from 'vue';
import { TextComponentProps } from '@/defaultProps';
import { mapPropsToForm, PropToForm, PropsToForm } from '@/propsMap';
import { reduce } from 'lodash-es';
const props = defineProps({
  props: {
    type: Object as PropType<Partial<TextComponentProps>>,
    required: true
  }
});

// !最终得到过滤后的PropsToForm类型数据
const finalProps = computed(() => {
  return reduce(props.props, (result, value, key) => {
    // console.log(result, value, key);
    const newKey = key as keyof TextComponentProps;
    const item = mapPropsToForm[newKey]; // !匹配需要转换成组件形式的
    if (item) {
      const obj:PropToForm = { component: '' };
      obj.component = item.component;
      obj.value = value as string;
      result[newKey] = obj;
    }
    return result;
  }, {} as PropsToForm);
});

</script>

<style scoped>
.props-table {
  padding: 15px;
  text-align: left;
}
.form-label {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.form-label > span {
  width: 28%;
}
.form-component {
  width: 70%;
}
.form-label.no-text {
  display: inline-block;
  width: 32px;
  height: 32px;
  margin-right: 10px;
}
#item-fontWeight {
  margin-left: 28%;
}
</style>
