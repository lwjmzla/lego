import { TextComponentProps } from './defaultProps';
export interface PropToForm {
  component: string;
  subComponent?: string;
  value?: string | number; // !其实有可能number之类
  extraProps?: { [key: string]: any };
  text?: string;
  options?: { text: string; value: any }[];
  initialTransForm?: (val: any) => any
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
    }
  },
  fontSize: {
    text: '字号',
    component: 'a-input-number',
    initialTransForm: (val: string) => parseInt(val) // !20px => 20
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
    ]
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
