import { ChangeEvent } from 'ant-design-vue/lib/_util/EventInterface';
import { TextComponentProps } from './defaultProps';
export interface PropToForm { // !当前文件不需要
  component: string;
  subComponent?: string;
  extraProps?: { [key: string]: any };
  text?: string; // !文本描述
  options?: { text: string; value: any }[];
  initialTransForm?: (val: any) => any;
  afterTransForm?: (val: any) => any;
  valueProp?: string; // !自定义 传值的属性
  eventName?: string;
  events?: { [key: string]: (e: any) => void }; // ! 在PropsTable.vue文件赋值
  value?: string | number; // !值，  在PropsTable.vue文件赋值
}

export type PropsToForm = {
  [P in keyof TextComponentProps]?: PropToForm
}

export const mapPropsToForm: PropsToForm = {
  text: {
    text: '文本',
    component: 'a-textarea',
    extraProps: {
      minRows: 3,
      'auto-size': { minRows: 3, maxRows: 5 }
    },
    eventName: 'update:value'
  },
  fontSize: {
    text: '字号',
    component: 'a-input-number',
    initialTransForm: (val: string) => parseInt(val), // !20px => 20
    afterTransForm: (val: number) => val + 'px'
  },
  lineHeight: {
    text: '行高',
    component: 'a-slider',
    extraProps: {
      max: 3,
      min: 0,
      step: 0.1
    }
  },
  textAlign: {
    text: '对齐',
    component: 'a-radio-group',
    subComponent: 'a-radio-button',
    options: [
      { text: '左', value: 'left' },
      { text: '中', value: 'center' },
      { text: '右', value: 'right' }
    ],
    afterTransForm: (e: ChangeEvent) => e.target.value
  },
  fontFamily: {
    text: '字体',
    component: 'a-select',
    subComponent: 'a-select-option',
    extraProps: {
      style: { width: '150px' }
    },
    options: [
      { text: '无', value: '' },
      { text: '宋体', value: '"SimSun","STSong"' },
      { text: '黑体', value: '"SimHei","STHeiti"' },
      { text: '楷体', value: '"KaiTi","STKaiti"' },
      { text: '仿宋', value: '"FangSong","STFangsong"' },
      { text: 'Arial', value: '"Arial", sans-serif' },
      { text: 'Arial Black', value: '"Arial Black", sans-serif' },
      { text: 'Comic Sans MS', value: '"Comic Sans MS"' },
      { text: 'Courier New', value: '"Courier New", monospace' },
      { text: 'Georgia', value: '"Georgia", serif' },
      { text: 'Times New Roman', value: '"Times New Roman", serif' }
    ]
  }
};
