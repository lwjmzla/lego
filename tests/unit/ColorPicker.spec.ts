import { mount, VueWrapper } from '@vue/test-utils';
import rgbHex from 'rgb-hex';
import ColorPicker from '@/components/ColorPicker.vue';

const defaultColors = [
  '#ffffff',
  '#f5222d',
  '#fa541c',
  '#fadb14',
  '#52c41a',
  '#1890ff',
  '#722ed1',
  '#8c8c8c',
  '#000000',
  ''
];
let wrapper: VueWrapper<any>;

describe('测试 color-picker 组件', () => {
  beforeAll(() => {
    wrapper = mount(ColorPicker, {
      props: {
        value: '#ffffff'
      }
    });
  });

  it('初始渲染', () => {
    //  测试 input 渲染
    expect(wrapper.find('input').exists()).toBeTruthy();
    const inputEle = wrapper.find('input').element;
    expect(inputEle.type).toBe('color');
    expect(inputEle.value).toBe(defaultColors[0]);
    //  测试颜色列表渲染
    expect(wrapper.find('ul.color-wrapper').exists()).toBeTruthy();
    expect(wrapper.find('ul.color-wrapper li').exists()).toBeTruthy();
    expect(wrapper.findAll('ul.color-wrapper li').length).toBe(defaultColors.length);
    //  测试第一个色值是否正确, 最后一个li是否包含特殊类名 transparent-back
    const firstItem = wrapper.get('li:first-child div').element as HTMLElement;
    expect(`#${rgbHex(firstItem.style.backgroundColor)}`).toBe(defaultColors[0]); // !浏览器自动转换成rgb格式，rgbHex实现 bgColor: rgb(255, 255, 255) => fff
    const lastItem = wrapper.get('li:last-child div').element as HTMLElement;
    expect(lastItem.classList.contains('transperent-back')).toBeTruthy(); // !classList为 "[object DOMTokenList]"伪数组类型，所以不含数组方法includes
    const lastItemDiv = wrapper.get('li:last-child div');
    expect(lastItemDiv.classes()).toContain('transperent-back'); // !对class判断的另外方式
  });

  it('测试 input 值变更行为', async () => {
    //  修改 input 是否发送对应事件和值
    const blackHex = '#000000';
    await wrapper.get('input').setValue(blackHex);
    /*
      !textInput.setValue(value) 相当于下面2行
      textInput.element.value = value
      textInput.trigger('input')
    */
    expect(wrapper.emitted()).toHaveProperty('change');
    /*
      {
        change: [ [ '#000000' ] ],
      }
    */
    const events = wrapper.emitted('change'); // !emit同样的事件，得到的结果会被累加的
    expect(events![0]).toEqual([blackHex]);
  });

  it('测试色值 list 事件行为', async () => {
    const firstItem = wrapper.get('li:first-child div');
    await firstItem.trigger('click');
    expect(wrapper.emitted()).toHaveProperty('change');
    const events = wrapper.emitted('change'); // !emit同样的事件，得到的结果会被累加的
    console.log(events); // !所以这里是 [ [ '#000000' ], [ '#ffffff' ] ]
    expect(events![1]).toEqual([defaultColors[0]]);
  });
});
