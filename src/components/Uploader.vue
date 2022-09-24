<template>
  <div class="file-input">
    <div class="upload-area"
      :class="{'is-dragover': drag && isDragOver }"
      v-on="events"
    >
      <slot v-if="isUploading" name="loading">
        <button disabled>正在上传</button>
      </slot>
      <slot name="uploaded" v-else-if="lastFileData && lastFileData.loaded" :lastUploadedData="lastFileData.data">
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
    <ul v-if="showUploadList" :class="`upload-list upload-list-${listType}`">
      <li :class="`uploaded-file upload-${file.status}`"
        v-for="file in filesList"
        :key="file.uid"
      >
        <img
          v-if="file.url && listType === 'picture'"
          class="upload-list-thumbnail"
          :src="file.url"
          :alt="file.name"
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
  resp?: any; // !上传接口返回的数据
  url?: string; // !URL.createObjectURL(file);
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
  autoUpload: {
    type: Boolean,
    default: true
  },
  showUploadList: {
    type: Boolean,
    default: true
  },
  drag: {
    type: Boolean,
    default: false
  },
  listType: {
    type: String as PropType<FileListType>,
    defualt: 'text'
  }
});

const fileInput = ref<null | HTMLInputElement>(null);
const filesList = ref<UploadFile[]>([]);
const isDragOver = ref(false);
const isUploading = computed(() => {
  return filesList.value.some(file => file.status === 'loading');
});
const lastFileData = computed(() => {
  const lastFile = last(filesList.value);
  if (lastFile) {
    return {
      loaded: lastFile.status === 'success',
      data: lastFile.resp
    };
  }
  return false;
});

const postFile = async (fileObj: UploadFile) => {
  const formData = new FormData();
  formData.append('files', fileObj.raw);
  fileObj.status = 'loading';
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

const addFileToList = (file: File) => {
  const fileObj = reactive<UploadFile>({
    uid: uuidv4(),
    size: file.size,
    name: file.name,
    status: 'ready',
    raw: file
  });
  if (props.listType === 'picture') {
    try {
      fileObj.url = URL.createObjectURL(file); // !utf16格式
    } catch (err) {
      console.error('upload File error', err);
    }

    // FileReader to preview local image
    // const fileReader = new FileReader();
    // fileReader.readAsDataURL(file);
    // fileReader.addEventListener('load', () => {
    //   fileObj.url = fileReader.result as string; // !base64
    // });
  }
  filesList.value.push(fileObj);
  if (props.autoUpload) {
    postFile(fileObj);
  }
};

// !提供给父组件调用时使用的，eg: this.$refs.upload.submit();
const submit = () => {
  // !同时调相同接口，可能会cancel上一个接口，这个可能需要排序逐个上传。
  filesList.value.filter(file => file.status === 'ready').forEach(readyFile => postFile(readyFile));
};

const beforeUploadCheck = async (files: null | FileList) => {
  console.log(files);
  if (!files) { return; }
  const file = files[0]; // todo 目前只支持1个文件的情况，多个文件下一步支持
  try {
    if (props.beforeUpload) {
      const result = props.beforeUpload(file);
      if (typeof result === 'boolean') {
        console.log(result);
        result && addFileToList(file);
      } else {
        console.log(result);
        const processedFile = await result;
        // if (Object.prototype.toString.call(processedFile) !== '[object File]') { return; }
        if (processedFile instanceof File) {
          addFileToList(processedFile);
        } else {
          throw new Error('beforeUpload返回的promise不是文件类型');
        }
      }
    } else {
      addFileToList(file);
    }
  } catch (error) {
    console.log(error);
  }
};

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const files = target.files;
  beforeUploadCheck(files);
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
    beforeUploadCheck(e.dataTransfer.files);
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
  filesList.value = filesList.value.filter(file => file.uid !== id);
};

defineExpose({
  submit
});

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
