<template>
  <div class="personal-center">
    <div class="base-info">
      <div class="avatar">
        <img :src="avatar" />
      </div>
      <span class="username">{{ userInfo.username }}</span>
    </div>
    <el-tabs class="tab-bar" tab-position="left">
      <el-tab-pane label="头像">
        <div class="avatar-container">
          <div class="cutting-box">
            <div class="image-choose" v-if="!avatarChange.imgUrl" @click="handleChooseImage">
              <i class="el-icon-upload"></i>
              选择图片上传
            </div>
            <div style="width: 300px;height: 200px" v-else>
              <VueCropper
                ref="cropper"
                :img="avatarChange.imgUrl"
                :autoCrop="true"
                :canScale="false"
                :centerBox="true"
                :fixed="true"
                :canMove="false"
                :infoTrue="true"
                @realTime="realTime"
              ></VueCropper>
            </div>
            <div class="btn" v-if="avatarChange.imgUrl">
              <el-button @click="handleChooseImage">更换图片</el-button>
              <el-button @click="handleSubmit">上传</el-button>
            </div>
          </div>
          <div class="show-preview" v-if="avatarChange.imgUrl">
            预览
            <div :style="{ ...avatarChange.previews.div, overflow: 'hidden' }">
              <img :src="avatarChange.previews.url" :style="{ ...avatarChange.previews.img }" />
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="基础信息"> </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { apiInfo, apiImport, apiChangeAvatar } from '@/api/public/personal'
import { VueCropper } from 'vue-cropper'
import CommonUtils from '@/utils/CommonUtils'

export default {
  name: 'PersonalCenter',
  components: {
    VueCropper,
  },
  data() {
    return {
      baseUrl: process.env.VUE_APP_BASE_STATIC,
      userInfo: {},
      avatarChange: {
        updateImageFile: {},
        imgUrl: '',
        previews: {},
      },
    }
  },
  created() {
    this.getUserInfo()
  },
  computed: {
    avatar() {
      return this.baseUrl + this.userInfo.avatar + '?s=' + new Date().getTime()
    },
  },
  methods: {
    async getUserInfo() {
      let res = await apiInfo()
      if (res.success) {
        this.userInfo = res.data
      }
    },
    handleChooseImage() {
      let accept = '.jpeg,.png,.jpg'
      let input = document.createElement('input')
      input.type = 'file'
      input.accept = accept
      input.addEventListener('change', (e) => {
        let file = e.target.files[0]
        let extName = CommonUtils.getExtname(file.name)
        if (accept.indexOf(extName) === -1) return this.$message.warning(`请传入${accept}格式的图片`)
        this.avatarChange.updateImageFile = file
        let url = URL.createObjectURL(file)
        this.avatarChange.imgUrl = url
        input = null
      })
      input.click()
    },
    handleSubmit() {
      this.$refs.cropper.getCropBlob(async (data) => {
        let form = new FormData()
        form.append('file', data)
        form.append('fileName', this.avatarChange.updateImageFile.name)
        let impRes = await apiImport(form)
        if (!impRes.success) return
        let res = await apiChangeAvatar({
          avatarPath: impRes.data,
        })
        if (res.success) {
          this.$message.success('修改成功')
          this.getUserInfo()
          this.$store.dispatch('user/updateInfo')
          Object.assign(this.avatarChange, this.$options.data().avatarChange)
        }
      })
    },
    realTime(data) {
      this.avatarChange.previews = data
    },
  },
}
</script>

<style scoped lang="scss">
.base-info {
  padding-left: 80px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  .avatar {
    width: 130px;
    height: 130px;
    border-radius: 10px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .username {
    font-size: 18px;
    padding-left: 15px;
    font-family: 'Hiragino Sans GB,Microsoft YaHei,Arial,sans-serif';
  }
}
.tab-bar {
  padding-top: 20px;
}

.el-tab-pane {
  padding: 10px;
}

.avatar-container {
  display: flex;
  .image-choose {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 300px;
    height: 200px;
    background-color: #f3f3f3;
    color: #c0c0c0;
    cursor: pointer;
    border-radius: 5px;
    i {
      font-size: 30px;
    }
  }
  .cutting-box {
    .btn {
      text-align: center;
      margin-top: 20px;
    }
  }
  .show-preview {
    margin-left: 50px;
  }
}
</style>
