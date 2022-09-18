import { shallowMount, VueWrapper, mount } from '@vue/test-utils';
import Uploader from '@/components/Uploader.vue';
import axios from 'axios';
import flushPromises from 'flush-promises';
jest.mock('axios');
// todo 添加mockAxios自身对jest.Mock 的支持。
const mockAxios = axios as jest.Mocked<typeof axios>;
let wrapper: VueWrapper<any>;
const testFile = new File(['xyz'], 'test.png', { type: 'image/png' });

describe('Uploader Component', () => {
  beforeAll(() => {
    wrapper = shallowMount(Uploader, {
      props: {
        action: 'test.url'
      }
    });
  });
  it('basic layout before uploading', () => {
    expect(wrapper.find('button').exists()).toBeTruthy();
    // expect(wrapper.find('button span').element.textContent).toBe('点击上传');
    expect(wrapper.find('button span').text()).toBe('点击上传');
    expect(wrapper.find('input').isVisible()).toBeFalsy();
  });

  it('upload process should works fine', async () => {
    // mockAxios.post.mockResolvedValueOnce({ status: 'success' });
    // @ts-ignore
    mockAxios.mockResolvedValueOnce({ status: 'success' });
    const fileInput = wrapper.get('input').element as HTMLInputElement;
    const files = [testFile];
    // fileInput.files = files; // !ts报错：类型 "File[]" 中缺少属性 "item"，但类型 "FileList" 中需要该属性--其实就是说fileInput.files不是普通的file数组
    Object.defineProperty(fileInput, 'files', {
      value: files,
      writable: false
    });
    await wrapper.get('input').trigger('change');
    // expect(mockAxios.post).toHaveBeenCalledTimes(1);
    expect(mockAxios).toHaveBeenCalledTimes(1);
    expect(wrapper.find('button span').text()).toBe('正在上传');
    await flushPromises(); // !使用flushPromises将所有Promise pending状态都改为完成
    expect(wrapper.find('button span').text()).toBe('上传成功');
  });

  it('should return error text when post is rejected', async () => {
    // @ts-ignore
    mockAxios.mockRejectedValueOnce({ status: 'error' });
    // !ps:fileInput的'files'属性，已在上面被 Object.defineProperty处理过了，不需要重复处理，否则会报错
    // const fileInput = wrapper.get('input').element as HTMLInputElement;
    // const files = [testFile];
    // Object.defineProperty(fileInput, 'files', {
    //   value: files,
    //   writable: false
    // });
    await wrapper.get('input').trigger('change');
    expect(mockAxios).toHaveBeenCalledTimes(1);
    expect(wrapper.find('button span').text()).toBe('正在上传');
    await flushPromises(); // !使用flushPromises将所有Promise pending状态都改为完成
    expect(wrapper.find('button span').text()).toBe('上传失败');
  });

  afterEach(() => {
    // @ts-ignore
    mockAxios.mockReset();
    mockAxios.post.mockReset();
  });
});

interface A {
  name: string;
  age: number
}
export interface AInstance extends A {
  (config: string): string;
}

let a: AInstance;

type B = typeof a
type Beautify<T> = {
  [P in keyof T]: T[P]
}

type C = Beautify<B> // ! AInstance的函数类型被无视掉了。。。
