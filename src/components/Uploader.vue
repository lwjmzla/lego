<template>
  <div class="file-input">
    <button @click="triggerUpload" :disabled="isUploading">
      <span v-if="isUploading">正在上传</span>
      <span v-else>点击上传</span>
    </button>
    <input ref="fileInput"
      type="file"
      :accept="props.accept"
      style="display: none;"
      @change="handleFileChange"
    />
    <ul>
      <li :class="`uploaded-file upload-${file.status}`"
        v-for="file in uploadedFiles"
        :key="file.uid"
      >
        <span class="filename">{{file.name}}</span>
        <span class="delete-icon" @click="removeFile(file.uid)">Del</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
type UploadStaus = 'ready' | 'loading' | 'success' | 'error'
type FileListType = 'picture' | 'text'
export interface UploadFile {
  uid: string;
  size: number;
  name: string;
  status: UploadStaus;
  raw: File;
  resp?: any;
  url?: string;
}
export default {

};
</script>
<script lang="ts" setup>
import { defineProps, reactive, ref, computed } from 'vue';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

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
const uploadedFiles = ref<UploadFile[]>([]);
const isUploading = computed(() => {
  return uploadedFiles.value.some(file => file.status === 'loading');
});

const handleFileChange = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  const files = target.files;
  console.log(files);
  if (!files) { return; }
  const uploadedFile = files[0];
  const formData = new FormData();
  formData.append('files', uploadedFile);
  const fileObj = reactive<UploadFile>({
    uid: uuidv4(),
    size: uploadedFile.size,
    name: uploadedFile.name,
    status: 'loading',
    raw: uploadedFile
  });
  uploadedFiles.value.push(fileObj);
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
    fileObj.status = 'success';
  } catch (err) {
    console.log(err);
    fileObj.status = 'error';
  } finally {
    fileInput.value!.value = '';
  }
};

const triggerUpload = () => {
  if (!fileInput.value) { return; }
  fileInput.value.click();
};

const removeFile = (id: string) => {
  uploadedFiles.value = uploadedFiles.value.filter(file => file.uid !== id);
};

</script>


<style lang="scss" scoped>
.upload-list {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
.upload-list li {
  transition: all .5s cubic-bezier(.55,0,.1,1);
  font-size: 14px;
  line-height: 1.8;
  margin-top: 5px;
  box-sizing: border-box;
  border-radius: 4px;
  min-width: 200px;
  position: relative;
  &:first-child {
    margin-top: 10px;
  }
  .upload-list-thumbnail {
    vertical-align: middle;
    display: inline-block;
    width: 70px;
    height: 70px;
    position: relative;
    z-index: 1;
    background-color: #fff;
    object-fit: cover;
  }
  .file-icon {
    svg {
      margin-right: 5px;
      color: rgba(0, 0, 0, 0.45);
    }
  }
  .filename {
    margin-left: 5px;
    margin-right: 40px;
  }
  &.upload-error {
    color: #f5222d;
    svg {
      color: #f5222d;
    }
  }
  .file-status {
    display: block;
    position: absolute;
    right: 5px;
    top: 0;
    line-height: inherit;
  }
  .delete-icon {
    display: none;
    position: absolute;
    right: 7px;
    top: 0;
    line-height: inherit;
    cursor: pointer;
  }
  &:hover {
    background-color: #efefef;
    .file-status {
      display: none;
    }
    .delete-icon {
      display: block;
    }
  }
}
</style>
