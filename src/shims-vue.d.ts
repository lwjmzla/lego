/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'element-plus'
declare module 'bb-ui-vue3'

declare module 'bb-ui-vue3/lib/index.js' {
  const instance: any
  export default instance
}

declare module '@/outputFile/lib/index.js' {
  const instance: any
  export default instance
}