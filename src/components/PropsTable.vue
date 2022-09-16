<template>
  <div class="props-table">
    <div style="max-height: 200px;overflow: auto;">{{finalProps}}</div>
    <div v-for="(item,key) in finalProps" :key="key" class="prop-item">
      <span class="label" v-if="item && item.text">{{ item.text }}:</span>
      <div class="prop-component">
        <component v-if="item && item.valueProp"
          :is="item.component"
          :[item.valueProp]="item.value"
          v-bind="item.extraProps"
          v-on="item.events"
        >
          <template v-if="item.options">
            <component
              :is="item.subComponent"
              v-for="(option,index) in item.options"
              :key="index"
              :value="option.value"
            >
              <!-- {{option.text}} -->
              <RenderVnode :vNode="option.text"></RenderVnode>
            </component>
            <!-- :style="key === 'fontFamily' ? {fontFamily: option.value} : {}" -->
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
import RenderVnode from '@/components/renderVnode';
import ColorPicker from '@/components/ColorPicker.vue'; // !component的is为string的时候，组件需要显式注册

const props = defineProps({
  props: {
    type: Object as PropType<Partial<TextComponentProps>>,
    required: true
  }
});
const emit = defineEmits(['change']);

// !最终得到过滤后的PropsToForm类型数据
const finalProps = computed(() => {
  // !demo: props.props => { text: 'hello', fontSize: '20px'}
  return reduce(props.props, (result, value, key) => { // !result, value, key => {} hello text 或 {} 20px fontSize
    // console.log(result, value, key);
    const newKey = key as keyof TextComponentProps;
    const item = mapPropsToForm[newKey]; // !匹配需要转换成组件形式的  mapPropsToForm['text']存在的话，就映射对应组件
    if (item) {
      const obj = { ...item } as PropToForm;
      obj.value = obj.initialTransForm ? obj.initialTransForm(value) : value; // !obj.value可能是number类型之类的
      obj.valueProp = obj.valueProp ? obj.valueProp : 'value'; // !自定义 传值的属性
      obj.eventName = obj.eventName || 'change';
      obj.events = {
        [obj.eventName]: (e:string) => {
          console.log(key, e);
          emit('change', { key, value: obj.afterTransForm ? obj.afterTransForm(e) : e });
        }
      };
      /*
        TODO 开发展示和编辑的属性表单组件的真谛
        ! 1.必须提供一个属性传入需要编辑的值默认为value
        ? 2.必须提供一个事件发射出编辑后新的值默认为change
      */
      result[newKey] = obj;
    }
    return result;
  }, {} as PropsToForm);
});

</script>
<script lang="ts">
export default {
  components: { ColorPicker }
};
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
