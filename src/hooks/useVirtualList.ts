import { reactive, ref, Ref } from 'vue';

export interface OptionType {
    itemHeight: number | ((index: number) => number);
    overscan?: number;
}

export const useVirtualList = <T = any>(state: T[], options: OptionType) => {
  let start = 0;
  let end = 10;
  const list = ref(state.slice(start, end)) as Ref<T[]>;

  const { itemHeight, overscan = 5 } = options;
  let containerDom:HTMLElement;

  const totalHeight: number = (() => {
    if (typeof itemHeight === 'number') {
      return state.length * itemHeight;
    }
    return state.reduce((sum, _, index) => sum + itemHeight(index), 0);
  })();

  // 计算当前视图展示数量
  const getViewCapacity = (containerHeight: number) => {
    if (typeof itemHeight === 'number') {
      return Math.ceil(containerHeight / itemHeight);
    }
    let sum = 0;
    let capacity = 0;
    for (let i = start; i < state.length; i++) {
      const height = (itemHeight as (index: number) => number)(i);
      sum += height;
      if (sum >= containerHeight) {
        capacity = i;
        break;
      }
    }
    return capacity - start;
  };

  // 获取当前索引
  const getOffset = (scrollTop: number) => {
    if (typeof itemHeight === 'number') {
      return Math.floor(scrollTop / itemHeight) + 1;
    }
    let sum = 0;
    let offset = 0;
    for (let i = 0; i < state.length; i++) {
      const height = (itemHeight as (index: number) => number)(i);
      sum += height;
      if (sum >= scrollTop) {
        offset = i;
        break;
      }
    }
    return offset + 1;
  };

  // 获取当前索引向上高度
  const getDistanceTop = (index: number) => {
    if (typeof itemHeight === 'number') {
      const height = index * itemHeight;
      return height;
    }
    const height = state.slice(0, index).reduce((sum, _, i) => sum + itemHeight(i), 0);
    return height;
  };

  let offsetTop = getDistanceTop(start);

  // 计算展示指定位置
  const calculateRange = () => {
    const element = containerDom;
    if (element) {
      console.log('scrollTop', element.scrollTop);
      const offset = getOffset(element.scrollTop); // !第offset个
      const viewCapacity = getViewCapacity(element.clientHeight); // 5

      const from = offset - overscan; // 4 - 10 = -6
      const to = offset + viewCapacity + overscan; // 4 + 5 + 10 = 19
      start = from < 0 ? 0 : from; // 0
      end = to > state.length ? state.length : to; // 19

      list.value = state.slice(start, end); // !根据start, end显示正确的数据

      // 实时计算
      offsetTop = getDistanceTop(start);
      wrapperStyle.marginTop = offsetTop + 'px'; // !随着滚动保持显示数据
      wrapperStyle.height = totalHeight - offsetTop + 'px'; // !控制滚动停止
    }
  };

  // 滚动容器的外层监听
  const containerProps = reactive({
    ref: (ele: any) => {
      containerDom = ele;
    },
    onScroll: (e: any) => {
      e.preventDefault();
      calculateRange();
    },
    style: { overflowY: 'auto' }
  });

  // children 外层包裹器 style
  const wrapperStyle = reactive({
    width: '100%',
    height: totalHeight - offsetTop + 'px',
    marginTop: offsetTop + 'px'
  });

  // 快速滚动到指定 index
  const scrollTo = (index: number) => {
    if (containerDom) {
      containerDom.scrollTop = getDistanceTop(index);
      calculateRange();
    }
  };

  return {
    list,
    wrapperStyle,
    containerProps,
    scrollTo
  };
};
