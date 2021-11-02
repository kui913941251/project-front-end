<template>
  <div class="mall-goods-modify">
    <el-form :model="goodsForm" :rules="goodsFormRules" ref="goodsForm" label-width="100px" status-icon>
      <el-form-item label="商品名" prop="goodsName">
        <el-input v-model="goodsForm.goodsName" class="input-width-200"></el-input>
      </el-form-item>
      <el-form-item label="商品描述" prop="goodsDesc">
        <el-input type="textarea" v-model="goodsForm.goodsDesc" class="input-width-500"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button @click="handleSubmit">确 定</el-button>
        <el-button>取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { apiAdd, apiUpdate, apiDetail } from '@/api/mall/goods'

export default {
  name: 'MallGoodsModify',
  data() {
    return {
      goodsForm: {
        id: null,
        goodsName: '',
        goodsDesc: '',
      },
      goodsFormRules: {
        goodsName: [{ required: true, trigger: 'blur', message: '请输入商品名' }],
      },
    }
  },
  created() {
    let id = this.$route.params.id
    console.log(id)
    if (id) {
      this.goodsForm.id = id
      this.getGoodsDetail()
    }
  },
  methods: {
    async getGoodsDetail() {
      let res = await apiDetail({
        id: this.goodsForm.id,
      })
      if (res.success) {
        this.goodsForm.goodsName = res.data.goodsName
        this.goodsForm.goodsDesc = res.data.goodsDesc
        this.defaultChecked = res.data.authIdList
      }
    },
    async handleSubmit() {
      let validateRes = await this.$refs.goodsForm.validate().catch((err) => err)
      if (!validateRes) return
      if (this.goodsForm.id) {
        this.submitUpdate()
      } else {
        this.submitAdd()
      }
    },
    async submitUpdate() {
      let res = await apiUpdate(this.goodsForm)
      if (res.success) {
        this.$message.success('修改成功')
        this.$router.go(-1)
      }
    },
    async submitAdd() {
      let res = await apiAdd(this.goodsForm)
      if (res.success) {
        this.$message.success('添加成功')
        this.$router.go(-1)
      }
    },
  },
}
</script>

<style scoped lang="scss"></style>
