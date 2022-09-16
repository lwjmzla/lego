<template>
  <div class="home">
    home
    <ColorPicker value="#000000" @change="colorChange"></ColorPicker>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ColorPicker from '@/components/ColorPicker.vue';

export default defineComponent({
  name: 'Home',
  components: {
    ColorPicker
  },
  setup () {
    const colorChange = (val: string) => {
      console.log(val);
    };
    return {
      colorChange
    };
  }
});
</script>
