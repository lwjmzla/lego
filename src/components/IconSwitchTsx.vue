
<script lang="tsx">
import { defineComponent } from 'vue';
import { Tooltip as ATooltip } from 'ant-design-vue';

export default defineComponent({
  emits: ['change'],
  props: {
    value: {
      type: String
    },
    promptText: {
      type: String
    },
    text: { // !显示的文本
      type: String
    }
  },
  setup (props, { emit }) {
    const onChange = () => {
      emit('change', props.value === 'normal' ? 'actived' : 'normal');
    };
    const vslots = {
      title: () => (
        <span>{props.promptText}</span>
      )
    };
    // !注意下面的divProps里有响应式值props.value，按下面的写法会变成某个固定值，需要把props.value写在JSX里。
    // const divProps = {
    //   onClick: onChange,
    //   class: [props.value !== 'normal' ? 'actived control' : 'control']
    // };
    return () => (
      <div class="icon-switch">
        <ATooltip placement="top" v-slots={vslots}>
          <div
            onClick={onChange}
            class={[props.value !== 'normal' ? 'actived control' : 'control']}
          >
            { props.text }
          </div>
        </ATooltip>
      </div>
    );
  }
});
</script>


<style lang="scss" scoped>
.icon-switch {
  border-radius: 50%;
  width: 36px;
  height: 36px;
  overflow: hidden;
}
.icon-switch .control {
  width: 100%;
  height: 100%;
  font-weight: bold;
  background: #ffffff;
  display: flex;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.icon-switch .control.actived {
  background: #659fff;
  color: #fff;
}
</style>
