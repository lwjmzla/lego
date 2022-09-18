<template>
  <div class="file-input">
    <button @click="triggerUpload">
      <span v-if="fileStatus === 'loading'">正在上传</span>
      <span v-else-if="fileStatus === 'success'">上传成功</span>
      <span v-else-if="fileStatus === 'error'">上传失败</span>
      <span v-else>点击上传</span>
    </button>
    <input ref="fileInput"
      type="file"
      :accept="props.accept"
      style="display: none;"
      @change="handleFileChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref } from 'vue';
import axios from 'axios';

type UploadStaus = 'ready' | 'loading' | 'success' | 'error'
type FileListType = 'picture' | 'text'

const props = defineProps({
  action: {
    type: String,
    default: 'https://uat-openapi.ibaibu.com/api/file/upload'
  },
  accept: {
    type: String,
    default: 'image/png,image/jpeg'
  }
});

const fileInput = ref<null | HTMLInputElement>(null);
const fileStatus = ref<UploadStaus>('ready');

const handleFileChange = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  const files = target.files;
  console.log(files);
  if (!files) { return; }
  const formData = new FormData();
  formData.append('files', files[0]);
  fileStatus.value = 'loading';
  try {
    const res = await axios({
      url: props.action,
      method: 'post',
      data: formData,
      params: {},
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    // const res = await axios.post(props.action, formData, {
    //   headers: {
    //     'Content-Type': 'multipart/form-data'
    //   }
    // });
    console.log(res);
    fileStatus.value = 'success';
  } catch (err) {
    console.log(err);
    fileStatus.value = 'error';
  }
};

const triggerUpload = () => {
  if (!fileInput.value) { return; }
  fileInput.value.click();
};


</script>


<style lang="scss" scoped>

</style>
