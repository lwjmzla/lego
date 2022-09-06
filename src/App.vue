<template>
  <ElConfigProvider :locale="locale" size="small">
    <router-view v-slot="{ Component }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive>
          <component :is="Component" :key="refreshRouterViewKey" class="w100" />
        </keep-alive>
      </transition>
    </router-view>
  </ElConfigProvider>
</template>

<script>
import { defineComponent, ref, toRefs, watch, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { ElConfigProvider } from 'element-plus';
import zhLocale from 'element-plus/lib/locale/lang/zh-cn';
export default defineComponent({
  components: {
    [ElConfigProvider.name]: ElConfigProvider // 添加组件
  },
  setup () {
    const locale = ref(zhLocale);
    const state = reactive({
      refreshRouterViewKey: null
    });
    const route = useRoute();

    watch(() => route.fullPath, () => {
      state.refreshRouterViewKey = route.fullPath;
    }, { immediate: true });
    return {
      ...toRefs(state),
      locale
    };
  }
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

/* 页面切换动画
------------------------------- */
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  will-change: transform;
  transition: all 0.3s ease;
}
// slide-right
.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
// slide-left
.slide-left-enter-from {
  @extend .slide-right-leave-to;
}
.slide-left-leave-to {
  @extend .slide-right-enter-from;
}
// opacitys
.opacitys-enter-active,
.opacitys-leave-active {
  will-change: transform;
  transition: all 0.3s ease;
}
.opacitys-enter-from,
.opacitys-leave-to {
  opacity: 0;
}

.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all .2s;
}
.fade-transform-enter {
  opacity: 0;
  // transform: translateX(-30px);
}
.fade-transform-leave-to {
  opacity: 0;
  // transform: translateX(30px);
}

</style>
