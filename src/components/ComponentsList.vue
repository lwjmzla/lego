<template>
  <div class="create-component-list">
    <div v-for="(item, index) in list"
      :key="index"
      class="component-item"
      @click="onItemClick(item)"
    >
      <l-text v-bind="item"></l-text>
    </div>
  </div>
  <StyledUploader @success="onImageUploaded"></StyledUploader>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import LText from './LText.vue';
import { TextComponentProps, imageDefaultProps } from '../defaultProps';
import StyledUploader from './StyledUploader.vue'; // todo
import { ComponentData } from '@/store/editor';
import { v4 as uuidv4 } from 'uuid';
import { UploadFile } from './Uploader.vue';
import { message } from 'ant-design-vue';
import { getImageDimensions } from '../helper';

interface DataInfo{
  url: string;
  // length: number;
}

interface UploadResp {
  code: string;
  message: string;
  data: DataInfo[];
  successful: boolean;
}

defineProps({
  list: {
    type: Array as PropType<Partial<TextComponentProps>[]>,
    required: true
  }
});
const emit = defineEmits(['on-item-click']);
const onItemClick = (item: Partial<TextComponentProps>) => {
  const componentData:ComponentData = {
    id: uuidv4(),
    name: 'LText',
    props: item
  };
  emit('on-item-click', componentData);
};

const onImageUploaded = (emitData: { resp: UploadResp; file: UploadFile }) => {
  const { resp, file } = emitData;
  const { successful, data = [] } = resp;
  const componentData: ComponentData = {
    name: 'LImage',
    id: uuidv4(),
    props: {
      ...imageDefaultProps
    }
  };
  message.success('上传成功');
  // componentData.props.src = URL.createObjectURL(file.raw);
  componentData.props.src = data[0].url || '';

  getImageDimensions(file.raw).then(({ width }) => {
    console.log(width);
    const maxWidth = 373;
    componentData.props.width = ((width > maxWidth) ? maxWidth : width) + 'px';
    emit('on-item-click', componentData);
  });
};

</script>
