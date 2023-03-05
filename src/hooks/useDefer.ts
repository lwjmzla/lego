import { ref } from 'vue';

/**
 *
 * @param maxFrameCount 表示最大检测的帧数，如果渲染的东西特别多可以调大，
 * 可以理解为总共要画的次数
 * @returns {function(*): boolean}
 */
export function useDefer (maxFrameCount = 1000) {
  // 记录目前画画画了多少次
  const frameCount = ref(0);
  // 当下一次该画画的时间点到来的时候，frameCount.value画的次数加一，表示画了一次
  const refreshFrameCount = () => {
    /**
     * 每一次requestAnimationFrame就把计数加一，表示当前渲染的帧数变多，
     * 只要没有达到最大帧数就持续的去调用refreshFrameCount
     */
    requestAnimationFrame(() => {
      frameCount.value++;
      console.log(frameCount.value++, '画了几次');
      // 没有达到最大次数就继续调用。不停的持续的画，默认达到1000次就不画了
      if (frameCount.value < maxFrameCount) {
        refreshFrameCount();
      }
    });
  };
  refreshFrameCount();
  // 有没有超过目前画的次数,比如传入一个2，目前画了3次，就会返回true
  return function (showInFrameCount: number) {
    // 判断当前渲染的帧数有没有大于传入的n
    console.log('当前渲染的帧数，即当前画的次数', frameCount.value);
    console.log('传入的帧数，即传入第几次要画', showInFrameCount);
    return frameCount.value >= showInFrameCount;
  };
}
