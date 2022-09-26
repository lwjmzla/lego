<template>
  <a-row class="editor">
    <a-layout>
      <a-col :span="6">
        <a-layout-sider class="editor-col">
          <h1>组件列表</h1>
          <components-list :list="defaultTextTemplates" @onItemClick="addItem" />
        </a-layout-sider>
      </a-col>
      <a-col :span="12">
        <a-layout-sider class="editor-col center">
          <h1>画布区域</h1>
          <div class="preview-list">
            <edit-wrapper
              v-for="component in components"
              :key="component.id"
              :id="component.id"
              @setActive="setActive"
              @remove="removeComponent"
              :active="component.id === (currentElement && currentElement.id)"
            >
              <!-- :is="component.name"  直接这样渲染不了，奇怪-->
              <component
                :is="useComponentList[component.name]"
                v-bind="component.props"
              />
            </edit-wrapper>
          </div>
        </a-layout-sider>
      </a-col>
      <a-col :span="6">
        <a-layout-sider class="editor-col">
          <h1>组件属性</h1>
          <template v-if="currentElement && currentElement.props">
            <PropsTable :props="currentElement.props" @change="componentChange" />
          </template>
          <pre>{{ currentElement && currentElement.props }}</pre>
        </a-layout-sider>
      </a-col>
    </a-layout>
  </a-row>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import ComponentsList from '@/components/ComponentsList.vue';
import { defaultTextTemplates } from '../defaultTemplates';
import LText from '@/components/LText.vue';
import LImage from '@/components/LImage.vue';
import { useStore } from '@/store';
import { ComponentData } from '@/store/editor';
// import { TextComponentProps } from '../defaultProps';
import EditWrapper from '@/components/EditWrapper.vue';
import PropsTable from '@/components/PropsTable.vue'; // !2种方式都可以
// import PropsTable from '@/components/PropsTableTsx.vue'; // !2种方式都可以

const store = useStore();
const currentElement = computed<ComponentData | null>(() => store.getters.getCurrentElement);
const components = computed(() => store.state.editor.components);
const addItem = (componentData: ComponentData) => {
  store.commit('addComponent', componentData);
};

const setActive = (id: string) => {
  store.commit('setActive', id);
};
// const componentChange = (val: any) => {
//   store.commit('updateComponent', val)
// }
const removeComponent = () => {
  store.commit('removeComponent');
};
const useComponentList = {
  LText,
  LImage
};

const componentChange = (val: any) => {
  store.commit('updateComponent', val);
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
