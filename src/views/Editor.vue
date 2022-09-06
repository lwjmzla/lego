<template>
  <a-row class="editor">
    <a-layout>
      <a-col :span="6">
        <a-layout-sider class="editor-col">
          <h1>组件列表</h1>
          <components-list :list="defaultTextTemplates" />
        </a-layout-sider>
      </a-col>
      <a-col :span="12">
        <a-layout-sider class="editor-col center">
          <h1>画布区域</h1>
          <component
            :is="component.name"
            v-for="component in components"
            :key="component.id"
            v-bind="component.props"
          />
          <!-- <l-text
            v-for="component in components"
            :key="component.id"
            v-bind="component.props"
          ></l-text> -->
        </a-layout-sider>
      </a-col>
      <a-col :span="6">
        <a-layout-sider class="editor-col">
          <h1>组件属性</h1>
        </a-layout-sider>
      </a-col>
    </a-layout>
  </a-row>
</template>

<script lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import { GlobalDataProps } from '../store/index';
import ComponentsList from '@/components/ComponentsList.vue';
import { defaultTextTemplates } from '../defaultTemplates';
import LText from '@/components/LText.vue';

export default {
  components: {
    LText,
    ComponentsList
  },
  setup () {
    const store = useStore<GlobalDataProps>();
    const components = computed(() => store.state.editor.components);
    return {
      components,
      defaultTextTemplates
    };
  }
};
</script>

<style lang="scss" scoped>
.editor {
  width: 100%;
  height: 100%;
}
.editor-col {
  min-width: 100% !important;
  height: 100%;
  background-color: #eee;
}
.center {
  background-color: #fff;
}
</style>
