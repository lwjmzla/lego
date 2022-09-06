import { Module } from 'vuex';
import { GlobalDataProps } from './index';

export interface ConfigProps {
  id: number
  title: string
  coverImg: string
  author: string
  copiedCount: number
}
const testData: ConfigProps[] = [
  { id: 1, title: '1', coverImg: '1', author: '1', copiedCount: 1 },
  { id: 2, title: '2', coverImg: '2', author: '2', copiedCount: 2 },
  { id: 3, title: '3', coverImg: '3', author: '3', copiedCount: 3 },
  { id: 4, title: '4', coverImg: '4', author: '4', copiedCount: 4 },
  { id: 5, title: '5', coverImg: '5', author: '5', copiedCount: 5 },
  { id: 6, title: '6', coverImg: '6', author: '6', copiedCount: 6 }
];

// template ts type
export interface TemplateProps {
  templates: ConfigProps[]
}

const template: Module<TemplateProps, GlobalDataProps> = {
  state: {
    templates: testData
  },
  getters: {
    getTemplateById1: state => (id: number) =>
      state.templates.find(item => item.id === id),
    getTemplateById (state, getters, root) {
      return (id: number) => {
        return state.templates.find(item => item.id === id);
      };
    }
  }
};

export default template;
