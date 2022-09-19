import { VNode, h } from 'vue';
import { ChangeEvent } from 'ant-design-vue/lib/_util/EventInterface';
import { TextComponentProps } from './defaultProps';
export interface PropToForm { // !当前文件不需要
  component: string;
  subComponent?: string;
  extraProps?: { [key: string]: any };
  text?: string; // !文本描述
  options?: { text: string | VNode; value: any }[];
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

const fontFamilyArr = [
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
];

const fontFamilyOptions = fontFamilyArr.map(({ text, value }) => {
  return {
    value,
    text: h('span', { style: { fontFamily: value } }, text)
  };
});
/*
  !实现 字体选项直接显示对应字体样式的方法
  !方法1.直接用fontFamilyArr,PropsTable.vue渲染options组件时，加上:style="key === 'fontFamily' ? {fontFamily: option.value} : {}"
  !  优点：简单粗暴   缺点：代码乱入，在共性代码上加了特殊处理，不美观
  !方法2.用fontFamilyOptions，text改造成VNode节点，另外通过renderVnode组件渲染VNode  ---  PropsTable.vue
  !  优点：这样可以统一在配置的地方配置，格式统一，美观   缺点：需要另外创建并引入renderVnode组件
  !方法3.用fontFamilyOptions，text改造成VNode节点，采用JSX方式渲染VNode ---- PropsTableTsx.vue
  !  优点：JSX比较灵活，可以统一在配置的地方配置，格式统一  缺点：可读性没template好
*/

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
  opacity: {
    text: '透明度',
    component: 'a-slider',
    extraProps: {
      max: 100,
      min: 0,
      step: 1,
      reverse: true
    },
    initialTransForm: (val: number) => val * 100,
    afterTransForm: (val: number) => val / 100
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
      ...fontFamilyOptions
      // ...fontFamilyArr
    ]
  },
  color: {
    text: '字体颜色',
    component: 'ColorPicker'
  },
  fontWeight: {
    text: '加粗',
    extraProps: {
      text: 'B',
      promptText: '加粗'
    },
    component: 'IconSwitch',
    initialTransForm: (val: string) => val === 'bold' ? '' : 'normal', // !只有匹配 bold 才高亮，其他都是normal
    afterTransForm: (val: string) => val === 'actived' ? 'bold' : 'normal'
  },
  fontStyle: {
    text: '斜体',
    extraProps: {
      text: '/',
      promptText: '斜体'
    },
    component: 'IconSwitch',
    initialTransForm: (val: string) => val === 'italic' ? '' : 'normal', // !只有匹配 italic 才高亮，其他都是normal
    afterTransForm: (val: string) => val === 'actived' ? 'italic' : 'normal'
  },
  textDecoration: {
    text: '下划线',
    extraProps: {
      text: '_',
      promptText: '下划线'
    },
    component: 'IconSwitch',
    initialTransForm: (val: string) => val === 'underline' ? '' : 'normal', // !只有匹配 underline 才高亮，其他都是normal
    afterTransForm: (val: string) => val === 'actived' ? 'underline' : 'none'
  }
};
