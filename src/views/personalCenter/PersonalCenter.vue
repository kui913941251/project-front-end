<template>
  <div class="personal-center">
    <div class="base-info">
      <div class="avatar">
        <el-avatar src="/123"></el-avatar>
        <span class="username">{{ userInfo.username }}</span>
      </div>
    </div>
    <el-tabs class="tab-bar" tab-position="left" style="height: 400px;">
      <el-tab-pane label="基础信息"> </el-tab-pane>
      <el-tab-pane label="头像">头像</el-tab-pane>
    </el-tabs>
    <div style="width: 200px;height: 200px">
      <el-button @click="handleChooseImage">选择图片</el-button>
      <el-button @click="handleSubmit">上传</el-button>
      <img :src="baseUrl + resultUrl" alt="" style="width: 100px;height:100px" />
      <VueCropper ref="cropper" :img="imgUrl" :autoCrop="true" :canScale="false" :centerBox="true"></VueCropper>
    </div>
  </div>
</template>

<script>
import { apiInfo, apiImport } from '@/api/public/personal'
import { VueCropper } from 'vue-cropper'

export default {
  name: 'PersonalCenter',
  components: {
    VueCropper,
  },
  data() {
    return {
      baseUrl: process.env.VUE_APP_BASE_STATIC,
      userInfo: {
        username: 'demo',
      },
      updateImage: {},
      imgUrl: '',
      resultUrl: '',
    }
  },
  created() {
    this.getUserInfo()
    console.log(process.env)
  },
  methods: {
    async getUserInfo() {
      let res = await apiInfo()
      if (res.success) {
        this.userInfo = res.data
      }
    },
    handleChooseImage() {
      let input = document.createElement('input')
      input.type = 'file'
      input.accept = '.jpeg,.png,.jpg'
      input.addEventListener('change', (e) => {
        let file = e.target.files[0]
        this.updateImage = file
        let url = URL.createObjectURL(file)

        this.imgUrl = url
        input = null
      })
      input.click()
    },
    handleSubmit() {
      this.$refs.cropper.getCropBlob(async (data) => {
        console.log(data)
        let form = new FormData()
        form.append('file', data)
        form.append('fileName', this.updateImage.name)
        let res = await apiImport(form)
        if (res.success) {
          this.resultUrl = res.data + "?" + `s=${new Date().getTime()}`
        }
      })
    },
  },
}
</script>

<style scoped lang="scss">
.base-info {
  padding-left: 80px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
  .avatar {
    display: flex;
    align-items: center;
    .username {
      padding-left: 15px;
    }
  }
}
.tab-bar {
  padding-top: 20px;
}
</style>
