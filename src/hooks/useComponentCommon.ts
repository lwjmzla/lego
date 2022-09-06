import { computed } from 'vue';
import { pick } from 'lodash-es';

// 抽离公共方法
const useComponentCommon = <T extends { [key: string]: any }>(
  props: T,
  picks: string[]
) => {
  /**
   * 转成style样式
   * pick:
   *  {fontSize: '10px'}
   */
  const styleProps = computed(() => pick(props, picks));
  const handleClick = () => {
    if (props.actionType === 'url' && props.url) {
      window.location.href = props.url;
    }
  };

  return {
    styleProps,
    handleClick
  };
};

export default useComponentCommon;
