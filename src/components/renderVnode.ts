import { defineComponent } from 'vue';

const renderVnode = defineComponent({
  props: {
    vNode: {
      type: [String, Object],
      required: true
    }
  },
  render () {
    return this.vNode;
  }
  // setup (props) {
  //   return () => (
  //     props.vNode
  //   );
  // }
});

export default renderVnode;
