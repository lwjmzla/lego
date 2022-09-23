<template>
  <div class="home">
    home
    <ColorPicker value="#000000" @change="colorChange"></ColorPicker>
    <Uploader drag :autoUpload="false" ref="uploader">
      <template #default>
        <button>Custom button</button>
      </template>
      <template #loading>
        <div class="loading">custom loading</div>
      </template>
      <template #uploaded="{ uploadedData }">
        <div class="custom-loaded">
          {{uploadedData.data}}
          <ul v-if="uploadedData.data && uploadedData.data.length">
            <li v-for="(item,index) in uploadedData.data" :key="index">
              <img :src="item.url" />
            </li>
          </ul>
        </div>
      </template>
    </Uploader>
    <el-button type="primary" @click="handleUpload">手动上传</el-button>
    <div>
      <form method="post" enctype="multipart/form-data" action="https://uat-openapi.ibaibu.com/api/file/upload">
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
import { defineComponent, ref } from 'vue';
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
        url: 'https://uat-openapi.ibaibu.com/api/file/upload',
        method: 'post',
        data: formData,
        params: {},
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    };

    const handleUpload = () => {
      uploader.value.uploadFiles();
    };
    return {
      uploader,
      colorChange,
      onFileChange,
      handleUpload
    };
  }
});
</script>
