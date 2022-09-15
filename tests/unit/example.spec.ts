import { shallowMount, mount } from '@vue/test-utils';
import HelloWorld from '@/components/HelloWorld.vue';
import axios from 'axios';
import flushPromises from 'flush-promises';
jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>; //! 添加类型，提供代码快捷提示

/*
  !使用方式
  npm run test:unit:watch // or yarn test:unit:watch
  npm run test:unit:watch -- yourTest.spec.ts
*/

describe('HelloWorld.vue', () => {
  // !在每个测试用例之后执行一次
  afterEach(() => {
    mockAxios.get.mockReset(); // !可以使get请求次数重置到初始值 0
  });
  // it('renders props.msg when passed', () => {
  //   const msg = 'new message';
  //   const wrapper = mount(HelloWorld, { // !mount是完整加载(但是遇到异步的话，怎么处理？)， shallowMount是表层加载，如果HelloWorld组件里另外有别的组件引用，就不会加载
  //     props: { msg }
  //   });
  //   //console.log(wrapper.html()) // !html信息
  //   //console.log(wrapper.text()) // !只显示文本信息
  //   // console.log(wrapper.findAll('h1')) // !
  //   // expect(wrapper.findComponent({ name: 'HelloWorld' }).exists()).toBe(true)
  //   // !getComponent的意义:只要判断是否渲染了子组件，是否传递了正确的属性就可以了，这就是单元测试的意义
  //   expect(wrapper.findComponent({ name: 'Hello' }).exists()).toBe(true)
  //   console.log(wrapper.findComponent({ name: 'Hello' }).props())
  //   console.log(wrapper.findComponent({ name: 'Hello' }).html())
  //   // !通过name还可以找到子组件(也是wrapper)，wrapper用mount，显示<div class="hello"><h1>defaultMsg</h1></div>
  //   // !wrapper用shallowMount，显示<hello-stub msg="defaultMsg"></hello-stub>

  //   expect(wrapper.text()).toMatch(msg);
  //   console.log('-------------------------------')
  // });

  // it('click', async () => {
  //   const msg = 'new message';
  //   const wrapper = shallowMount(HelloWorld, {
  //     props: { msg }
  //   });
  //   await wrapper.get('button').trigger('click')
  //   expect(wrapper.get('button').text()).toBe('2')
  // })

  // it('click', (done) => {
  //   const msg = 'new message';
  //   const wrapper = shallowMount(HelloWorld, {
  //     props: { msg }
  //   });
  //   //await wrapper.get('button').trigger('click')
  //   wrapper.vm.setCount()
  //   setTimeout(() => {
  //     done()
  //     expect(wrapper.get('button').text()).toBe('2')
  //     console.log(wrapper.vm.count)
  //   },100)
  // })

  // it('click', async () => {
  //   const msg = 'new message';
  //   const wrapper = shallowMount(HelloWorld, {
  //     props: { msg }
  //   });
  //   //await wrapper.get('button').trigger('click')
  //   wrapper.vm.setCount()
  //   await wrapper.vm.$nextTick() // 等待事件处理完成
  //   expect(wrapper.get('button').text()).toBe('2')
  //   console.log(wrapper.vm.count)
  // })

  it('click && emitted', async () => {
    const todoContent = 'buy milk';
    const msg = 'new message';
    const wrapper = shallowMount(HelloWorld, {
      props: { msg }
    });
    await wrapper.get('input').setValue(todoContent);
    expect(wrapper.get('input').element.value).toBe(todoContent);
    await wrapper.get('.addTodo').trigger('click');
    // expect(wrapper.findAll('li').length).toBe(1)
    expect(wrapper.findAll('li')).toHaveLength(1);
    expect(wrapper.findAll('li')[0].text()).toBe(todoContent);
    console.log(wrapper.emitted());
    /*
      {
        send: [ [ 'buy milk' ] ],
      }
    */
    // 断言事件已经被触发
    expect(wrapper.emitted().send).toBeTruthy();
    expect(wrapper.emitted()).toHaveProperty('send');
    // 断言事件的数量
    expect(wrapper.emitted().send.length).toBe(1);
    // 断言事件的数量
    expect(wrapper.emitted().send[0]).toEqual([todoContent]); // !数组、对象等引用类型的比较 用toEqual

    console.log(wrapper.emitted('send')); // [ [ 'buy milk' ] ]
    expect(wrapper.emitted('send')![0]).toEqual([todoContent]);
  });

  // !比如有多个测试用例，only的意思是只进行当前测试用例
  it('ajax mockResolvedValueOnce', async () => { // !it.only
    const msg = 'new message';
    const wrapper = shallowMount(HelloWorld, {
      props: { msg }
    });
    mockAxios.get.mockResolvedValueOnce({ data: { username: 'j-king' } });
    await wrapper.get('.loadUser').trigger('click');
    expect(mockAxios.get).toHaveBeenCalled(); // 是否被调用
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
    expect(wrapper.find('.loading').exists()).toBeTruthy();
    expect(wrapper.get('.loading')).toBeTruthy();
    await flushPromises(); // !使用flushPromises将所有Promise pending状态都改为完成
    // !界面更新完毕
    expect(wrapper.find('.loading').exists()).toBeFalsy();
    expect(wrapper.find('.user-name').text()).toBe('j-king');
    expect(wrapper.find('.error').exists()).toBeFalsy();
  });

  it('ajax mockRejectedValueOnce', async () => {
    const msg = 'new message';
    const wrapper = shallowMount(HelloWorld, {
      props: { msg }
    });
    mockAxios.get.mockRejectedValueOnce({ data: null }); // !reject
    await wrapper.get('.loadUser').trigger('click');
    expect(mockAxios.get).toHaveBeenCalled(); // 是否被调用
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
    expect(wrapper.find('.loading').exists()).toBeTruthy();
    expect(wrapper.get('.loading')).toBeTruthy();
    await flushPromises(); // !使用flushPromises将所有Promise pending状态都改为完成
    // !界面更新完毕
    expect(wrapper.find('.loading').exists()).toBeFalsy();
    expect(wrapper.find('.error').exists()).toBeTruthy();
  });
});
