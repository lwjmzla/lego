import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store, { key } from './store';
import ElementPlus from 'element-plus';
import axios from 'axios';
import 'element-plus/dist/index.css';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
// import './test.js';

// !<el-icon><plus :size="80" /></el-icon> //icon组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

const app = createApp(App);

app.use(store, key).use(router);
app.use(ElementPlus as any);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(Antd);
app.config.globalProperties.$http = axios;
app.mount('#app');
