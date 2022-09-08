<template>
  <div class="props-table">
    {{finalProps}}
    <div v-for="(item,key) in finalProps" :key="key" class="prop-item">
      <span class="label" v-if="item && item.text">{{ item.text }}:</span>
      <div class="prop-component">
        <component v-if="item"
          :is="item.component"
          :value="item.value"
          v-bind="item.extraProps"
        >
          <template v-if="item.options">
            <component
              :is="item.subComponent"
              v-for="(option,index) in item.options"
              :key="index"
              :value="option.value"
            >{{option.text}}</component>
          </template>
        </component>
      </div>
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
  // !demo: props.props => { text: 'hello', fontSize: '20px'}
  return reduce(props.props, (result, value, key) => { // !result, value, key => {} hello text 或 {} 20px fontSize
    // console.log(result, value, key);
    const newKey = key as keyof TextComponentProps;
    const item = mapPropsToForm[newKey]; // !匹配需要转换成组件形式的  mapPropsToForm['text']存在的话，就映射对应组件
    if (item) {
      const obj:PropToForm = { ...item };
      obj.value = obj.initialTransForm ? obj.initialTransForm(value) : value; // !obj.value可能是number类型之类的
      result[newKey] = obj;
    }
    return result;
  }, {} as PropsToForm);
});

</script>

<style scoped>

.prop-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.label {
  width: 28%;
}
.prop-component {
  width: 70%;
  text-align: left;
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
