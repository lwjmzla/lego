
<script lang="tsx">
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

    const inputProps = {
      // type: 'color',
      value: props.value,
      onInput: onChange
    };

    onMounted(() => {
      console.log(colorPicker.value);
    });

    return () => (
      <div class="color-picker">
        <input ref={colorPicker}
          type="color"
          {...inputProps}
        />
        <ul class="color-wrapper">
        {
          props.colors.map((item, index) => {
            const divProps = {
              onClick: () => onItemChange(item),
              style: { backgroundColor: item },
              class: [item ? 'color-item' : 'color-item transperent-back']
            };
            return (
              <li class={'item' + index}>
                <div {...divProps}></div>
              </li>
            );
          })
        }
        </ul>
      </div>
    );
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
