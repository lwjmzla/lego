import { Module } from 'vuex';
import { v4 as uuidv4 } from 'uuid';
import { GlobalDataProps } from './index';
import { TextComponentProps } from '../defaultProps';

type ComponentName = 'LText' | 'LImage'

export interface ComponentData {
  props: Partial<TextComponentProps> // 索引签名
  id: string
  name: ComponentName
}
// editor的state类型数据
export interface EditorProps {
  components: ComponentData[]
  currentId: string
}

export const testComponents: ComponentData[] = [
  {
    id: uuidv4(),
    name: 'LText',
    props: { text: 'hello', fontSize: '20px', color: 'red', lineHeight: 1, textAlign: 'left', fontFamily: '' }
  },
  {
    id: uuidv4(),
    name: 'LText',
    props: { text: 'hello2', fontSize: '30px', fontWeight: 'bold', lineHeight: 2, textAlign: 'center' }
  },
  {
    id: uuidv4(),
    name: 'LText',
    props: {
      text: 'hello3',
      fontSize: '40px'
      // actionType: 'url',
      // url: 'https://www.baidu.com'
    }
  }
];

const editor: Module<EditorProps, GlobalDataProps> = {
  state: {
    components: testComponents,
    currentId: ''
  },
  mutations: {
    addComponent (state, props: Partial<TextComponentProps>) {
      const newComponent:ComponentData = {
        id: uuidv4(),
        name: 'LText',
        props
      };
      state.components.push(newComponent);
    },
    setActive (state, currentId: string) {
      state.currentId = currentId;
    },
    removeComponent (state) {
      const currentIndex = state.components.findIndex(item => item.id === state.currentId);
      if (currentIndex || currentIndex === 0) {
        state.currentId = '';
        state.components.splice(currentIndex, 1);
      }
    }
  },
  getters: {
    getCurrentElement (state) {
      return state.components.find(item => item.id === state.currentId);
    }
  }
};

export default editor;
