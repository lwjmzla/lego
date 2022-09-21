<template>
  <div class="file-input">
    <!-- <button @click="triggerUpload" :disabled="isUploading">
      <span v-if="isUploading">正在上传</span>
      <span v-else>点击上传</span>
    </button> -->
    <div class="upload-area" @click="triggerUpload">
      <slot v-if="isUploading" name="loading">
        <button disabled>正在上传</button>
      </slot>
      <slot name="uploaded" v-else-if="lastFileData && lastFileData.loaded" :uploadedData="lastFileData.data">
        <button>点击上传</button>
      </slot>
      <slot v-else name="default">
        <button>点击上传</button>
      </slot>
    </div>
    <input ref="fileInput"
      type="file"
      :accept="props.accept"
      style="display: none;"
      @change="handleFileChange"
    />
    <ul v-if="showUploadList">
      <li :class="`uploaded-file upload-${file.status}`"
        v-for="file in uploadedFiles"
        :key="file.uid"
      >
        <span v-if="file.status === 'loading'" class="file-icon"><LoadingOutlined /></span>
        <span v-else class="file-icon"><FileOutlined /></span>
        <span class="filename">{{file.name}}</span>
        <span class="delete-icon" @click="removeFile(file.uid)"><DeleteOutlined /></span>
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
import { defineProps, reactive, ref, computed, PropType } from 'vue';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { DeleteOutlined, LoadingOutlined, FileOutlined } from '@ant-design/icons-vue';
import { last } from 'lodash-es';
type CheckUpload = (file: File) => boolean | Promise<File>

const props = defineProps({
  action: {
    type: String,
    default: 'https://uat-openapi.ibaibu.com/api/file/upload'
  },
  accept: {
    type: String,
    default: 'image/png,image/jpeg'
  },
  beforeUpload: {
    type: Function as PropType<CheckUpload>
  },
  showUploadList: {
    type: Boolean,
    default: true
  }
});

const fileInput = ref<null | HTMLInputElement>(null);
const uploadedFiles = ref<UploadFile[]>([]);
const isUploading = computed(() => {
  return uploadedFiles.value.some(file => file.status === 'loading');
});
const lastFileData = computed(() => {
  const lastFile = last(uploadedFiles.value);
  if (lastFile) {
    return {
      loaded: lastFile.status === 'success',
      data: lastFile.resp
    };
  }
  return false;
});

const postFile = async (file: File) => {
  const formData = new FormData();
  formData.append('files', file);
  const fileObj = reactive<UploadFile>({
    uid: uuidv4(),
    size: file.size,
    name: file.name,
    status: 'loading',
    raw: file
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
    fileObj.resp = res.data;
  } catch (err) {
    console.log(err);
    fileObj.status = 'error';
  } finally {
    fileInput.value!.value = '';
  }
};

const handleFileChange = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  const files = target.files;
  console.log(files);
  if (!files) { return; }
  const file = files[0];
  try {
    if (props.beforeUpload) {
      const result = props.beforeUpload(file);
      if (typeof result === 'boolean') {
        console.log(result);
        result && postFile(file);
      } else {
        console.log(result);
        const processedFile = await result;
        // if (Object.prototype.toString.call(processedFile) !== '[object File]') { return; }
        if (processedFile instanceof File) {
          postFile(processedFile);
        } else {
          throw new Error('beforeUpload返回的promise不是文件类型');
        }
      }
    } else {
      postFile(file);
    }
  } catch (error) {
    console.log(error);
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
