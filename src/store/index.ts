import { InjectionKey } from 'vue';
import { createStore, createLogger, Store, useStore as baseUseStore } from 'vuex';
import editor, { EditorProps } from './editor';
import template, { TemplateProps } from './template';

// 全局state类型数据
export interface GlobalDataProps {
  editor: EditorProps
  template: TemplateProps
}

export const key: InjectionKey<Store<GlobalDataProps>> = Symbol('InjectionKey');

const IS_PROD = process.env.NODE_ENV === 'production';

export function useStore () {
  return baseUseStore(key);
}

export default createStore({
  modules: {
    editor,
    template
  },
  strict: !IS_PROD,
  plugins: IS_PROD ? [] : [createLogger()]
});
