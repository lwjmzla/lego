
<script lang="tsx">
import { PropType, computed, defineComponent, resolveComponent, h } from 'vue';
import { TextComponentProps } from '@/defaultProps';
import { mapPropsToForm, PropToForm, PropsToForm } from '@/propsMap';
import { reduce } from 'lodash-es';
// import RenderVnode from '@/components/renderVnode';
import { Input, InputNumber, Slider, Radio, Select } from 'ant-design-vue';
import ColorPicker from '@/components/ColorPicker.vue';
import IconSwitch from '@/components/IconSwitchTsx.vue';
const mapToComponent = {
  'a-textarea': Input.TextArea,
  'a-input-number': InputNumber,
  'a-slider': Slider,
  'a-radio-group': Radio.Group,
  'a-radio-button': Radio.Button,
  'a-select': Select,
  'a-select-option': Select.Option,
  ColorPicker,
  IconSwitch
} as any;

function capitalizeFirstLetter (string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default defineComponent({
  props: {
    props: {
      type: Object as PropType<Partial<TextComponentProps>>,
      required: true
    }
  },
  emits: ['change'],
  setup (props, { emit }) {
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
            ['on' + capitalizeFirstLetter(obj.eventName)]: (e:string) => { // !JSX这里修改成 onXXX的形式
              console.log(key, e);
              emit('change', { key, value: obj.afterTransForm ? obj.afterTransForm(e) : e });
            }
          };
          result[newKey] = obj;
        }
        return result;
      }, {} as PropsToForm);
    });
    return () => (
      <div class="props-table">
        <div style="max-height: 200px;overflow: auto;">{JSON.stringify(finalProps.value)}</div>
        {
          Object.keys(finalProps.value).map((key) => {
            const newKey = key as keyof TextComponentProps;
            const item = finalProps.value[newKey];
            // const ComponentName = resolveComponent(item!.component); // !这样渲染{ h(ComponentName) }
            const ComponentName = mapToComponent[item!.component];
            const SubComponent = item?.subComponent ? mapToComponent[item.subComponent] : null;
            const componentProps = {
              [item!.valueProp as string]: item!.value,
              ...item!.extraProps,
              ...item!.events
            };
            return (
              <div class="prop-item">
                { (item?.text) ? <span class="label">{item.text}:</span> : null }
                <div class="prop-component">
                  <ComponentName {...componentProps} >
                    {item?.options && item?.options.map((option) => {
                      const subComponentProps = {
                        value: option.value
                        // style: newKey === 'fontFamily' ? { fontFamily: option.value } : {}
                      };
                      return (
                        // !option.text为string | VNode，JSX里可以渲染VNode
                        <SubComponent {...subComponentProps}>{option.text}</SubComponent>
                      );
                    })}
                  </ComponentName>
                </div>
              </div>
            );
          })
        }
      </div>
    );
  }
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
