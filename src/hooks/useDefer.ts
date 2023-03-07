import { ref } from 'vue';
/**
 * @param maxFrameCount 表示最大检测的帧数，如果渲染的东西特别多可以调大，
 * 可以理解为总共要画的次数
 * @returns {function(*): boolean}
 */
export function useDefer (maxFrameCount = 20) {
  // 记录目前画画画了多少次
  const frameCount = ref(1);
  // 当下一次该画画的时间点到来的时候，frameCount.value画的次数加一，表示画了一次
  const refreshFrameCount = () => {
    /**
     * 每一次requestAnimationFrame就把计数加一，表示当前渲染的帧数变多，
     * 只要没有达到最大帧数就持续的去调用refreshFrameCount
     */
    requestAnimationFrame(() => {
      console.log(`第${frameCount.value}帧结束`);
      frameCount.value++;
      // 没有达到最大次数就继续调用。不停的持续的画，默认达到1000次就不画了
      if (frameCount.value <= maxFrameCount) {
        refreshFrameCount();
      }
    });
  };
  refreshFrameCount();
  return function (showInFrameCount: number) { // ! v-if="defer(n)"，frameCount.value值变了，就会重新执行v-if判断，所以执行了多次defer(xx)，defer(1),defer(2)...
    // 判断当前渲染的帧数有没有大于传入的n
    console.log(`当前执行第${frameCount.value}帧`);
    console.log(`v-for的n值:${showInFrameCount},当前帧大于等于当前值就会渲染--` + (frameCount.value >= showInFrameCount ? '渲染' : ''));
    return frameCount.value >= showInFrameCount;
  };
}
