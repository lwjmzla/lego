import { TextComponentProps } from './defaultProps';
// 右侧组件列表数据
export const defaultTextTemplates: Partial<TextComponentProps>[] = [
  {
    text: '大标题',
    fontSize: '30px',
    fontWeight: 'bold',
    tag: 'h2'
  },
  {
    text: '正文内容',
    tag: 'p'
  },
  {
    text: '链接内容',
    color: '#1890ff',
    textDecoration: 'underline',
    tag: 'p',
    actionType: 'url',
    url: 'https://www.baidu.com',
    isEditing: true
  },
  {
    text: '按钮内容',
    color: '#1890ff',
    backgroundColor: 'red',
    width: '80px',
    height: '40px',
    tag: 'button'
  }
];
