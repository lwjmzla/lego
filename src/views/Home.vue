<template>
  <div class="home">
    home
    <ColorPicker value="#000000" @change="colorChange"></ColorPicker>
    <Uploader drag
      :autoUpload="false"
      listType="picture"
      ref="uploader"
    >
      <template #default>
        <button>Custom button</button>
      </template>
      <template #loading>
        <div class="loading">custom loading</div>
      </template>
      <template #uploaded="{ lastUploadedData }">
        <div class="custom-loaded">
          {{lastUploadedData.data}}
          <ul v-if="lastUploadedData.data && lastUploadedData.data.length">
            <li v-for="(item,index) in lastUploadedData.data" :key="index">
              <img :src="item.url" />
            </li>
          </ul>
        </div>
      </template>
    </Uploader>
    <el-button type="primary" @click="handleUpload">手动上传</el-button>
    <div>
      <form method="post" enctype="multipart/form-data" :action="action">
        <input type="file"
          name="files"
          multiple
          @change="onFileChange"
        />
        <input type="text" name="test" />
        <button type="submit">Submit</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, getCurrentInstance } from 'vue';
import ColorPicker from '@/components/ColorPicker.vue';
import axios from 'axios';
import Uploader from '@/components/Uploader.vue';

export default defineComponent({
  name: 'Home',
  components: {
    ColorPicker,
    Uploader
  },
  setup () {
    // const instance = getCurrentInstance()
    // instance?.proxy?.$refs.uploader
    const arr = ['i', 'b', 'a', 'i', 'b', 'u'];
    const action = 'https://uat-openapi.' + arr.join('') + '.com/api/file/upload';

    const uploader = ref<any>(null);
    const colorChange = (val: string) => {
      console.log(val);
    };
    const onFileChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const files = target.files;
      console.log(files);
      if (!files) { return; }
      const formData = new FormData();
      formData.append('files', files[0]);
      axios({
        url: action,
        method: 'post',
        data: formData,
        params: {},
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    };

    const handleUpload = () => {
      uploader.value.submit();
    };
    return {
      uploader,
      colorChange,
      onFileChange,
      handleUpload,
      action
    };
  }
});
</script>
