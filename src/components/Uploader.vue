<template>
  <div class="file-input">
    <div class="upload-area"
      :class="{'is-dragover': drag && isDragOver }"
      v-on="events"
    >
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
  },
  drag: {
    type: Boolean,
    default: false
  }
});

const fileInput = ref<null | HTMLInputElement>(null);
const uploadedFiles = ref<UploadFile[]>([]);
const isDragOver = ref(false);
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

const uploadFiles = async (files: null | FileList) => {
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

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const files = target.files;
  uploadFiles(files);
};

const triggerUpload = () => {
  if (!fileInput.value) { return; }
  fileInput.value.click();
};

let events: { [key: string]: (e: any) => void } = {
  click: triggerUpload
};

const handleDrag = (e: DragEvent, over: boolean) => {
  e.preventDefault();
  isDragOver.value = over;
};
const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  isDragOver.value = false;
  if (e.dataTransfer) {
    uploadFiles(e.dataTransfer.files);
  }
};
if (props.drag) {
  events = {
    ...events,
    dragover: (e: DragEvent) => { handleDrag(e, true); },
    dragleave: (e: DragEvent) => { handleDrag(e, false); },
    drop: handleDrop
  };
}

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

.upload-file {
  position: relative;
  display: flex;
  align-items: center;
  list-style: none;
  cursor: pointer;
  padding: 0 20px 0 0 ;
}
.upload-file:hover {
  background-color: #eee;
}
.upload-file:hover .del-icon {
  display: block;
}
.upload-success span {
  color: #42b983;
}
.upload-fail span {
  color: crimson;
}
.upload-uploading span {
  color: sandybrown;
}
.icon {
  margin-right: 10px;
}
.del-icon {
  display: none;
  position: absolute;
  right: 0;
}
.file-upload {
  display: inline-block;
}
.drag-area {
  cursor: pointer;
  width: 300px;
  border: 1px dashed #999;
  height: 150px;
  background-color: #fafafa
}
.drag-area:hover {
  border: 1px dashed #1890ff;
}
.is-dragover {
  border: 1px dashed #1890ff;
  background-color: rgba(24, 144, 255, 0.2);
}
.upload-img-thumb {
  display: inline-block;
  width: 75px;
  height: 75px;
}
</style>
