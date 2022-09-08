import { TextComponentProps } from './defaultProps';
export interface PropToForm {
  component: string;
  value?: string;
}

export type PropsToForm = {
  [P in keyof TextComponentProps]?: PropToForm
}

export const mapPropsToForm: PropsToForm = {
  text: {
    component: 'a-input'
  }
};
