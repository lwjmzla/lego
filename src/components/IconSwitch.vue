<template>
  <div class="icon-switch">
    <a-tooltip placement="top">
      <template #title>
        <span>{{ promptText }}</span>
      </template>
      <div
        @click="onChange"
        class="control"
        :class="[value !== 'normal' ? 'actived' : '']"
      >
        {{ text }}
      </div>
    </a-tooltip>
  </div>
</template>

<script lang="ts" setup>

const props = defineProps({
  value: {
    type: String
  },
  promptText: {
    type: String
  },
  text: { // !显示的文本
    type: String
  }
});
const emit = defineEmits(['change']);
const onChange = () => {
  emit('change', props.value === 'normal' ? 'actived' : 'normal');
};

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
