<template>
  <div>
    <img :src="options.img" title="点击上传头像" class="img-circle img-lg" @click="editCropper()">
    <el-dialog :title="title" v-model:visible="open" width="800px" :close-on-click-modal="false">
      <el-row>
        <el-col :xs="24" :md="12" :style="{height: '350px'}">
          <VuePictureCropper
            :boxStyle="{
              width: '100%',
              height: '100%',
              backgroundColor: '#f8f8f8',
              margin: 'auto',
            }"
            :img="options.img"
            :options="{
              viewMode: 1,
              dragMode: 'crop',
              aspectRatio: 1,
            }"
            @ready="ready"
            @cropend="cropend"
          />
        </el-col>
        <el-col :xs="24" :md="12" :style="{height: '350px'}">
          <div class="avatar-upload-preview">
            <img v-if="previewUrl" :src="previewUrl" style="width: 200px; height: 200px; border-radius: 50%;">
          </div>
        </el-col>
      </el-row>
      <br>
      <el-row>
        <el-col :lg="2" :md="2">
          <el-upload action="#" :http-request="requestUpload" :show-file-list="false" :before-upload="beforeUpload">
            <el-button size="small">
              上传
              <el-icon><Upload /></el-icon>
            </el-button>
          </el-upload>
        </el-col>
        <el-col :lg="{span: 1, offset: 2}" :md="2">
          <el-button :icon="Plus" size="small" @click="zoom(0.1)" />
        </el-col>
        <el-col :lg="{span: 1, offset: 1}" :md="2">
          <el-button :icon="Minus" size="small" @click="zoom(-0.1)" />
        </el-col>
        <el-col :lg="{span: 1, offset: 1}" :md="2">
          <el-button :icon="RefreshLeft" size="small" @click="rotate(-90)" />
        </el-col>
        <el-col :lg="{span: 1, offset: 1}" :md="2">
          <el-button :icon="RefreshRight" size="small" @click="rotate(90)" />
        </el-col>
        <el-col :lg="{span: 2, offset: 6}" :md="2">
          <el-button type="primary" size="small" @click="uploadImg()">提 交</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Plus, RefreshLeft, RefreshRight, Minus, Upload } from '@element-plus/icons-vue'
import VuePictureCropper, { cropper } from 'vue-picture-cropper'
import { useUserStore } from '@/stores/modules/user'
import { uploadAvatar } from '@/api/admin/sys-user'
import { ElMessage } from 'element-plus'

const props = defineProps({
  user: { 
    type: Object,
    default: () => ({})
  }
})

const userStore = useUserStore()

// 响应式数据
const open = ref(false)
const title = ref('修改头像')
const previewUrl = ref('')

const options = reactive({
  img: userStore.avatar || '', // 裁剪图片的地址
})

// 方法
const editCropper = () => {
  open.value = true
}

const requestUpload = () => {
  // 覆盖默认的上传行为
}

const ready = () => {
  console.log('Cropper is ready.')
}

const cropend = () => {
  getPreviewUrl()
}

const getPreviewUrl = async () => {
  if (!cropper) return
  const base64 = cropper.getCroppedCanvas().toDataURL()
  previewUrl.value = base64
}

const zoom = (ratio) => {
  if (!cropper) return
  cropper.zoom(ratio)
}

const rotate = (degree) => {
  if (!cropper) return
  cropper.rotate(degree)
}

const beforeUpload = (file) => {
  if (file.type.indexOf('image/') === -1) {
    ElMessage.error('文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。')
    return false
  } else {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      options.img = reader.result
    }
  }
  return false
}

const uploadImg = async () => {
  if (!cropper) return
  
  const canvas = cropper.getCroppedCanvas()
  canvas.toBlob(async (blob) => {
    const formData = new FormData()
    formData.append('upload[]', blob)
    
    try {
      const response = await uploadAvatar(formData)
      if (response.code === 200) {
        open.value = false
        options.img = import.meta.env.VITE_APP_BASE_API + response.data
        ElMessage.success(response.msg)
        // 更新用户头像
        userStore.updateAvatar(options.img)
      } else {
        ElMessage.error(response.msg)
      }
    } catch (error) {
      ElMessage.error('上传失败')
    }
  })
}
</script>

<style scoped>
.img-circle {
  border-radius: 50%;
}

.img-lg {
  width: 120px;
  height: 120px;
  cursor: pointer;
}

.avatar-upload-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
