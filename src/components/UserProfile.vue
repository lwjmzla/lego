<template>
  <a-button class="login-btn"
    @click="login"
    type="primary"
    v-if="!user.isLogin"
  >登录</a-button>

  <div v-else>
    <a-dropdown-button class="user-profile-component">
      <router-link to="/setting">{{ user.userName }}</router-link>
      <template #overlay>
        <a-menu class="user-profile-dropdown">
          <!-- <a-menu-item key="usercenter" @click="handleRouterGoCenter">
            个人中心
          </a-menu-item> -->
          <a-menu-item class="logout-btn" key="logout" @click="logout">登出</a-menu-item>
        </a-menu>
      </template>
    </a-dropdown-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { message as AntdMessage } from 'ant-design-vue';
import { GlobalDataProps } from '@/store/index';
export default defineComponent({
  props: {
    user: {
      isRequired: true,
      default: () => ({ isLogin: false, userName: '' })
    }
  },
  setup () {
    const router = useRouter();
    // #region 用户操作相关
    const store = useStore<GlobalDataProps>();
    //  登录
    const login = () => {
      // router.push('/login');
      store.commit('login', 'lwj');
      AntdMessage.success('登录成功.', 2);
    };
    //  登出
    const logout = () => {
      store.commit('logout');
      AntdMessage.success('登出操作成功.');
      setTimeout(() => {
        router.push('/');
      }, 1500);
    };
    //  用户中心页面路由
    const handleRouterGoCenter = () => {
      router.push('/mycenter');
    };
    // #endregion
    return {
      logout,
      handleRouterGoCenter,
      login
    };
  }
});
</script>
