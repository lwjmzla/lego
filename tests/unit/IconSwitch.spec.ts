import { mount, VueWrapper } from '@vue/test-utils';
import IconSwitch from '@/components/IconSwitch.vue';

const mockComponent2 = {
  template: "<div><slot></slot><slot name='title'></slot></div>"
};

let wrapper: VueWrapper<any>;

// 模拟组件
const globalComponents = {
  'a-tooltip': mockComponent2 // !需要具名插槽
};

describe('测试 IconSwitch 组件', () => {
  beforeAll(() => {
    wrapper = mount(IconSwitch, {
      props: {
        value: 'normal',
        promptText: '加粗',
        text: 'B'
      },
      global: {
        //  使用全局组件
        components: globalComponents
      }
    });
  });

  it('初始渲染', () => {
    expect(wrapper.find('.control').text()).toBe('B');
    expect(wrapper.find('.control').classes()).not.toContain('actived');
  });

  it('点击', async () => {
    await wrapper.setProps({
      value: 'normal',
      promptText: '加粗',
      text: 'B'
    });
    await wrapper.find('.control').trigger('click');
    expect(wrapper.emitted()).toHaveProperty('change');
    /*
      {
        change: [ [ 'actived' ] ],
      }
    */
    const events = wrapper.emitted('change'); // !emit同样的事件，得到的结果会被累加的
    expect(events![0]).toEqual(['actived']);
  });
});
