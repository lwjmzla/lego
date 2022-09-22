import { shallowMount, VueWrapper, mount } from '@vue/test-utils';
import Uploader from '@/components/Uploader.vue';
import axios from 'axios';
import flushPromises from 'flush-promises';
jest.mock('axios');
// const mockAxios = axios as jest.Mocked<typeof axios>; // !mockAxios.post、get之类才用这种
const mockAxios = axios as unknown as jest.Mock;

let wrapper: VueWrapper<any>;
const testFile = new File(['xyz'], 'test.png', { type: 'image/png' });

const mockComponent = {
  template: '<div><slot></slot></div>'
};
const mockComponents = {
  DeleteOutlined: mockComponent,
  LoadingOutlined: mockComponent,
  FileOutlined: mockComponent
};

const setInputValue = (input: HTMLInputElement, file = testFile) => {
  const files = [file] as any;
  Object.defineProperty(input, 'files', {
    value: files,
    writable: false
  });
};

describe('Uploader Component', () => {
  beforeAll(() => {
    wrapper = shallowMount(Uploader, {
      props: {
        action: 'test.url'
      },
      global: {
        //  使用全局组件
        // components: mockComponents,
        stubs: mockComponents // !stubs:当前引入的组件的意思
      }
    });
  });
  it('basic layout before uploading', () => {
    expect(wrapper.find('button').exists()).toBeTruthy();
    // expect(wrapper.find('button').element.textContent).toBe('点击上传');
    expect(wrapper.find('button').text()).toBe('点击上传');
    expect(wrapper.find('input').isVisible()).toBeFalsy();
  });

  it('upload process should works fine', async () => {
    // mockAxios.post.mockResolvedValueOnce({ status: 'success' });
    mockAxios.mockResolvedValueOnce({ status: 'success' });
    const fileInput = wrapper.get('input').element as HTMLInputElement;
    // const files = [testFile];
    // fileInput.files = files; // !ts报错：类型 "File[]" 中缺少属性 "item"，但类型 "FileList" 中需要该属性--其实就是说fileInput.files不是普通的file数组
    // Object.defineProperty(fileInput, 'files', {
    //   value: files,
    //   writable: false
    // });
    setInputValue(fileInput);
    await wrapper.get('input').trigger('change');
    // expect(mockAxios.post).toHaveBeenCalledTimes(1);
    expect(mockAxios).toHaveBeenCalledTimes(1);
    expect(wrapper.find('button').text()).toBe('正在上传');
    console.log(wrapper.find('button').attributes()); //! { disabled: '' } 并不是true
    // expect(wrapper.find('button').attributes('disabled')).toBeTruthy();
    expect(wrapper.find('button').attributes()).toHaveProperty('disabled');
    expect(wrapper.findAll('li').length).toBe(1);
    const firstItem = wrapper.get('li:first-child');
    expect(firstItem.classes()).toContain('upload-loading');

    await flushPromises(); // !使用flushPromises将所有Promise pending状态都改为完成
    expect(wrapper.find('button').text()).toBe('点击上传');
    expect(firstItem.classes()).toContain('upload-success');
    expect(firstItem.get('.filename').text()).toBe(testFile.name);
  });

  it('should return error text when post is rejected', async () => {
    mockAxios.mockRejectedValueOnce({ status: 'error' });
    // !ps:fileInput的'files'属性，已在上面被 Object.defineProperty处理过了，不需要重复处理，否则会报错
    // const fileInput = wrapper.get('input').element as HTMLInputElement;
    // setInputValue(fileInput)
    await wrapper.get('input').trigger('change');
    expect(mockAxios).toHaveBeenCalledTimes(1);
    expect(wrapper.find('button').text()).toBe('正在上传');
    expect(wrapper.find('button').attributes()).toHaveProperty('disabled');
    expect(wrapper.findAll('li').length).toBe(2);
    const lastItem = wrapper.get('li:last-child');
    expect(lastItem.classes()).toContain('upload-loading');

    await flushPromises(); // !使用flushPromises将所有Promise pending状态都改为完成
    expect(wrapper.find('button').text()).toBe('点击上传');
    expect(lastItem.classes()).toContain('upload-error');
    await lastItem.find('.delete-icon').trigger('click');
    expect(wrapper.findAll('li').length).toBe(1);
  });

  it('should show the correct interface when using custom slot', async () => {
    mockAxios.mockResolvedValueOnce({ data: { url: 'dummy.url' } });
    mockAxios.mockResolvedValueOnce({ data: { url: 'xyz.url' } });
    const wrapper = mount(Uploader, {
      props: {
        action: 'test.url'
      },
      slots: { // !这里相当于父组件调用Uploader.vue传的slots
        // default: '<button>Custom button</button>',
        // loading: '<div class="loading">custom loading</div>',
        default: `<template #default>
          <button>Custom button</button>
        </template>`,
        loading: `<template #loading>
        <div class="loading">custom loading</div>
        </template>`,
        // !作用域插槽 scoped slot
        uploaded: `<template #uploaded="{ uploadedData }">
          <div class="custom-loaded">{{uploadedData.url}}</div>
        </template>`
      },
      global: {
        stubs: mockComponents
      }
    });
    expect(wrapper.get('button').text()).toBe('Custom button');
    const fileInput = wrapper.get('input').element as HTMLInputElement;
    setInputValue(fileInput);
    await wrapper.get('input').trigger('change');
    expect(wrapper.get('.loading').text()).toBe('custom loading');
    await flushPromises();
    expect(wrapper.get('.custom-loaded').text()).toBe('dummy.url');

    await wrapper.get('input').trigger('change'); // !再选一次文件
    expect(wrapper.get('.loading').text()).toBe('custom loading');
    await flushPromises();
    expect(wrapper.get('.custom-loaded').text()).toBe('xyz.url');
  });

  it('before upload check', async () => {
    const callback = jest.fn();
    mockAxios.mockResolvedValueOnce({ data: { url: 'dummy.url' } });
    const checkFileSize = (file: File) => {
      console.log(file.size);
      if (file.size > 2) {
        callback();
        return false;
      }
      return true;
    };
    const wrapper = shallowMount(Uploader, {
      props: {
        action: 'test.url',
        beforeUpload: checkFileSize
      }
    });
    const fileInput = wrapper.get('input').element as HTMLInputElement;
    setInputValue(fileInput);
    await wrapper.get('input').trigger('change');
    expect(mockAxios).not.toHaveBeenCalled();
    expect(wrapper.findAll('li').length).toBe(0);
    expect(callback).toHaveBeenCalled();
  });

  it('before upload check using Promise -- successPromise', async () => {
    mockAxios.mockResolvedValueOnce({ data: { url: 'dummy.url' } });
    const successPromise = (file: File) => {
      const newFile = new File([file], 'new_name.docx', { type: file.type });
      return Promise.resolve(newFile);
    };

    const wrapper = shallowMount(Uploader, {
      props: {
        action: 'test.url',
        beforeUpload: successPromise
      }
    });
    const fileInput = wrapper.get('input').element as HTMLInputElement;
    setInputValue(fileInput);
    await wrapper.get('input').trigger('change');
    await flushPromises();
    expect(mockAxios).toHaveBeenCalled();
    expect(wrapper.findAll('li').length).toBe(1);
    const firstItem = wrapper.get('li:first-child');
    expect(firstItem.classes()).toContain('upload-success');
    expect(firstItem.get('li:first-child .filename').text()).toBe('new_name.docx');
  });

  it('before upload check using Promise -- successPromiseWithWrongType', async () => {
    mockAxios.mockResolvedValueOnce({ data: { url: 'dummy.url' } });
    const successPromiseWithWrongType = () => {
      return Promise.resolve('abcd');
    };

    const wrapper = shallowMount(Uploader, {
      props: {
        action: 'test.url',
        beforeUpload: successPromiseWithWrongType
      }
    });
    const fileInput = wrapper.get('input').element as HTMLInputElement;
    setInputValue(fileInput);
    await wrapper.get('input').trigger('change');
    await flushPromises();
    expect(mockAxios).not.toHaveBeenCalled();
    expect(wrapper.findAll('li').length).toBe(0);
  });

  it('before upload check using Promise -- failedPromise', async () => {
    mockAxios.mockResolvedValueOnce({ data: { url: 'dummy.url' } });
    const failedPromise = (file: File) => {
      return Promise.reject('wrong type');
    };

    const wrapper = shallowMount(Uploader, {
      props: {
        action: 'test.url',
        beforeUpload: failedPromise
      }
    });
    const fileInput = wrapper.get('input').element as HTMLInputElement;
    setInputValue(fileInput);
    await wrapper.get('input').trigger('change');
    await flushPromises();
    expect(mockAxios).not.toHaveBeenCalled();
    expect(wrapper.findAll('li').length).toBe(0);
  });

  it.only('testing drag and drop function', async () => {
    mockAxios.mockResolvedValueOnce({ data: { url: 'dummy.url' } });
    const wrapper = shallowMount(Uploader, {
      props: {
        action: 'test.url',
        drag: true
      }
    });
    const uploadArea = wrapper.get('.upload-area');
    await uploadArea.trigger('dragover');
    expect(uploadArea.classes()).toContain('is-dragover');
    await uploadArea.trigger('dragleave');
    expect(uploadArea.classes()).not.toContain('is-dragover');
    await uploadArea.trigger('drop', { dataTransfer: { files: [testFile] } });
    /*
      await wrapper.get('input').trigger('change', { target: { files: [testFile] } }); // !这种不行，you cannot set the target value of an event
      !只能像setInputValue(fileInput)的方式给元素添加files,类似wrapper.get('input').element.files = [testFile];
    */
    expect(mockAxios).toHaveBeenCalled();
    await flushPromises();
    expect(wrapper.findAll('li').length).toBe(1);
  });

  afterEach(() => {
    mockAxios.mockReset();
    // mockAxios.post.mockReset();
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
