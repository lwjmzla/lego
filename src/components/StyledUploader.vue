<template>
  <!-- @success="(data) => {handleSuccess(data.resp, data.file.raw)}" -->
  <uploader
    class="styled-uploader"
    :action="action"
    :showUploadList="false"
    :beforeUpload="commonUploadCheck"
    :on-success="handleSuccess"
    :on-progress="handleProgress"
  >
    <div class="uploader-container">
      <FileImageOutlined />
      <h4>上传图片</h4>
    </div>
    <template #loading>
      <div class="uploader-container">
        <LoadingOutlined spin />
        <h4>上传中</h4>
      </div>
    </template>
    <template #uploaded>
      <div class="uploader-container">
        <FileImageOutlined />
        <h4>上传图片</h4>
      </div>
    </template>
  </uploader>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { FileImageOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { commonUploadCheck } from '../helper';
import Uploader, { UploadFile, UploadProgressEvent } from './Uploader.vue';
export default defineComponent({
  components: {
    Uploader,
    FileImageOutlined,
    LoadingOutlined
  },
  emits: ['success'],
  setup (props, { emit }) {
    // const handleSuccess = (resp: any, file: File) => {
    //   emit('success', { resp, file });
    // };
    const handleSuccess = (resp: any, file: UploadFile, fileList: UploadFile[]) => {
      emit('success', { resp, file, fileList });
    };
    const handleProgress = (uploadProgressEvent: UploadProgressEvent, file: UploadFile, fileList: UploadFile[]) => {
      console.log(uploadProgressEvent.percent);
    };
    const arr = ['i', 'b', 'a', 'i', 'b', 'u'];
    const action = 'https://uat-openapi.' + arr.join('') + '.com/api/file/upload';
    return {
      commonUploadCheck,
      handleSuccess,
      handleProgress,
      action
    };
  }
});
</script>

<style lang="scss">
.styled-uploader {
  .uploader-container {
    width: 100px;
    padding: 10px;
    color: #ffffff;
    background: #1890ff;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
  .uploader-container:hover {
    background: #40a9ff;
  }
  .uploader-container h4 {
    color: #ffffff;
    margin-bottom: 0;
    margin-left: 10px;
  }
}
</style>
