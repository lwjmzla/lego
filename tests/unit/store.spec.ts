import { clone, last } from 'lodash-es';
import { testComponents, ComponentData } from '@/store/editor';
import { TextComponentProps } from '@/defaultProps';
// import { testData } from '@/store/templates';
import store from '@/store';
// !没有wrapper(界面)的单元测试

// const cloneComponents = JSON.parse(JSON.stringify(testComponents)) as ComponentData[];
const cloneComponents = clone(testComponents);

describe('test vuex module', () => {
  it('测试需要的三个模块', () => {
    expect(store.state).toHaveProperty('user');
    expect(store.state).toHaveProperty('template');
    expect(store.state).toHaveProperty('editor');
  });

  describe('test user module', () => {
    it('测试登录', () => {
      store.commit('login', 'lwj');
      expect(store.state.user.isLogin).toBeTruthy();
    });
    it('测试登出', () => {
      store.commit('logout');
      expect(store.state.user.isLogin).toBeFalsy();
    });
  });

  describe('test templates module', () => {
    // it('测试默认渲染的模板', () => {
    //   expect(store.state.templates.list).toHaveLength(testData.length);
    // });
    // it('测试根据 id 获取模板', () => {
    //   const selectTemplate = store.getters.getTemplateById(1);
    //   expect(selectTemplate).toEqual({
    //     id: 1,
    //     title: 'first',
    //     cover: '',
    //     praise: 99,
    //     collect: 0
    //   });
    // });
  });

  describe('test editor module', () => {
    it('测试默认数据', () => {
      expect(store.state.editor.components).toHaveLength(cloneComponents.length);
    });
    it('测试画布中当前选择的元素节点', () => {
      store.commit('setActive', cloneComponents[0].id);
      expect(store.state.editor.currentId).toBe(cloneComponents[0].id);
      const currentElement = store.getters.getCurrentElement as ComponentData;
      expect(currentElement.id).toBe(cloneComponents[0].id);
    });
    it('测试画布中元素新增', () => {
      // const payload: Partial<TextComponentProps> = {
      //   text: 'test1'
      // };
      const componentData:ComponentData = {
        id: 'uuidv4',
        name: 'LText',
        props: {
          text: 'test1'
        }
      };
      store.commit('addComponent', componentData);
      expect(store.state.editor.components).toHaveLength(cloneComponents.length + 1);
      // const lastItem = store.state.editor.components[store.state.editor.components.length - 1];
      const lastItem = last(store.state.editor.components);
      expect(lastItem?.props.text).toBe('test1');
    });
    it('测试画布中元素属性更新', () => {
      const newProps = {
        key: 'text',
        value: 'update value'
      };
      store.commit('updateComponent', newProps); // !currentId为上面setActive的 Id
      const currentElement: ComponentData = store.getters.getCurrentElement;
      expect(currentElement.props.text).toBe('update value');
    });
  });
});
