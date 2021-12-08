<template>
  <div class="mall-goods-modify">
    <el-form :model="goodsForm" :rules="goodsFormRules" ref="goodsForm" label-width="100px" status-icon>
      <el-form-item label="商品名" prop="goodsName">
        <el-input v-model="goodsForm.goodsName" class="input-width-200"></el-input>
      </el-form-item>
      <el-form-item label="商品描述" prop="goodsDesc">
        <el-input type="textarea" v-model="goodsForm.goodsDesc" class="input-width-500"></el-input>
      </el-form-item>
      <el-form-item label="商品选项">
        <div class="goods-option" v-for="(option, index) in goodsForm.options" :key="index">
          <div class="option-info">
            选项类别{{ index + 1 }}: <el-input class="input-width-200" v-model="option.optionName" maxlength="4"></el-input>
            <el-button @click="handleAddOptionItem(option)" style="margin-left: 10px">添加子选项</el-button>
            <i class="el-icon-remove" @click="handleRemoveOption(index)"></i>
          </div>
          <div class="option-item" v-for="(optionItem, index2) in option.children" :key="index2">
            <el-form-item :label="`子选项${index2 + 1}`">
              <el-input v-model="optionItem.optionName" class="input-width-200"></el-input>
              <i class="el-icon-remove" @click="handleRemoveOptionItem(option, index2)"></i>
            </el-form-item>
          </div>
        </div>
        <el-button v-if="goodsForm.options.length < 3" @click="handleAddOption">添加父选项</el-button>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="$router.go(-1)">取 消</el-button>
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
        options: [],
      },
      goodsFormRules: {
        goodsName: [{ required: true, trigger: 'blur', message: '请输入商品名' }],
      },
    }
  },
  created() {
    let id = this.$route.params.id
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
        this.goodsForm.options = res.data.options
        this.defaultChecked = res.data.authIdList
      }
    },
    handleAddOption() {
      let option = {
        id: null,
        optionName: '类别' + (this.goodsForm.options.length + 1),
        children: [],
      }
      this.goodsForm.options.push(option)
    },
    handleAddOptionItem(option) {
      let optionItem = {
        id: null,
        optionName: '新选项',
      }
      option.children.push(optionItem)
    },
    handleRemoveOption(index) {
      this.goodsForm.options.splice(index, 1)
    },
    handleRemoveOptionItem(parent, index) {
      parent.children.splice(index, 1)
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

<style scoped lang="scss">
@import '~@/styles/variables.scss';
.mall-goods-modify {
  .goods-option {
    .option-info {
      margin-bottom: 10px;
      i {
        cursor: pointer;
        margin-left: 10px;
        color: $color-danger;
      }
    }
    .option-item {
      i {
        cursor: pointer;
        margin-left: 10px;
        color: $color-danger;
      }
    }
  }
}
</style>
