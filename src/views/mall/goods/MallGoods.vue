<template>
  <div class="mall-goods">
    <div class="filter-body">
      <el-form inline>
        <el-form-item label="商品名">
          <el-input v-model="queryParams.goodsName" class="input-width-200" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getTableData">查询</el-button>
          <el-button type="primary" @click="handleAdd">添加商品</el-button>
        </el-form-item>
      </el-form>
    </div>

    <TableCustomer
      v-loading="tableLoading"
      :data="tableData"
      :pageSize.sync="queryParams.pageSize"
      :pageNum.sync="queryParams.pageNum"
      :total="total"
      @change="getTableData"
    >
      <el-table-column prop="goodsName" label="商品名" align="center"></el-table-column>
      <el-table-column prop="goodsDesc" label="商品描述" align="center"></el-table-column>
      <el-table-column prop="updateTime" label="更新时间" align="center">
        <template v-slot="{ row }">
          <span>{{ row.updateTime | formatTime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center">
        <template v-slot="{ row }">
          <span>{{ row.createTime | formatTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template v-slot="{ row }">
          <el-button type="warning" @click="handleUpdate(row)">修改</el-button>
          <el-button type="warning" @click="handleOptionGroup(row)">组合</el-button>
          <el-button type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </TableCustomer>

    <DialogCustomer :visible.sync="groupOptionVisible" title="选项组合" width="1100px" :confirm="handleGroupSubmit">
      <el-button @click="handleAddGroup" style="margin-bottom: 10px">添加组合</el-button>
      <template v-for="(group, groupIndex) in groupOptionForm.groupList">
        <el-row :key="groupIndex" :gutter="10" style="margin-bottom: 10px">
          <template v-for="(option, optionIndex) in allOption">
            <div :key="option.id">
              <el-col :span="2" style="line-height: 28px;text-align:end;">
                <span>{{ option.optionName }}</span>
              </el-col>
              <el-col :span="4">
                <el-select v-model="group.compose[optionIndex]" placeholder="请选择">
                  <el-option
                    v-for="item in filterOption(option.children, optionIndex, group)"
                    :key="item.id"
                    :label="item.optionName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-col>
            </div>
          </template>
          <el-col :span="2.5"> 库存 <el-input v-model="group.stocks" class="input-width-50 input-padding"></el-input> </el-col>
          <el-col :span="2.5"> 价格 <el-input v-model="group.price" class="input-width-50 input-padding"></el-input> </el-col>
          <el-col :span="1" :key="groupIndex" style="line-height: 28px;color: #f56c6c;">
            <i class="el-icon-remove" style="cursor: pointer;" @click="handleRemoveOptionItem(groupIndex)"></i>
          </el-col>
        </el-row>
      </template>
    </DialogCustomer>
  </div>
</template>

<script>
import { apiGoodsList, apiDelete, apiAddGroup } from '@/api/mall/goods'
import TableCustomer from '@/components/TableCustomer/TableCustomer'
import DialogCustomer from '@/components/DialogCustomer/DialogCustomer'

export default {
  name: 'MallGoods',
  components: {
    TableCustomer,
    DialogCustomer,
  },
  data() {
    return {
      tableLoading: false,
      total: 0,
      queryParams: {
        goodsName: '',
        pageNum: 1,
        pageSize: 10,
      },
      tableData: [],
      // 组合选项
      groupOptionVisible: false,
      groupOptionForm: {
        id: null,
        groupList: [],
      },
      allOption: [],
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    async getTableData() {
      this.tableLoading = true
      let res = await apiGoodsList(this.queryParams).catch((err) => err)
      if (res.success) {
        this.tableData = res.data.list
        this.total = res.data.total
      }
      this.tableLoading = false
    },
    // 添加
    handleAdd() {
      this.$router.push('/mall/goods/modify')
    },
    // 修改
    handleUpdate(row) {
      this.$router.push('/mall/goods/modify/' + row.id)
    },
    // 修改组合
    handleOptionGroup(row) {
      this.groupOptionVisible = true
      this.groupOptionForm.id = row.id
      this.groupOptionForm.groupList = row.groupList
      this.allOption = row.options
    },
    // 添加组合
    handleAddGroup() {
      let optionNum = this.allOption.length
      let group = {
        price: 0,
        stocks: 0,
        compose: new Array(optionNum).fill(''),
      }
      this.groupOptionForm.groupList.push(group)
    },
    handleRemoveOptionItem(index) {
      this.groupOptionForm.groupList.splice(index, 1)
    },
    // 提交组合
    async handleGroupSubmit() {
      if (!this.validateFillDone()) return
      let res = await apiAddGroup(this.groupOptionForm).catch((err) => err)
      if (res.success) {
        this.$message.success("添加成功")
        this.getTableData()
        this.groupOptionVisible = false
      }
    },
    // 验证是否填写完整
    validateFillDone() {
      let groupList = this.groupOptionForm.groupList
      if (groupList.length < 1) {
        this.$message.warning('请添加至少一个组合')
        return false
      }
      for (let i = 0; i < groupList.length; i++) {
        let item = groupList[i]
        for (let j = 0; j < item.compose; j++) {
          if (item.compose[j]) {
            this.$message.warning('请将组合选择完整')
            return false
          }
        }
        if (!item.stocks) {
          this.$message.warning('请将库存填写完整')
          return false
        }
        if (!item.price) {
          this.$message.warning('请将单价填写完整')
          return false
        }
      }
      return true
    },
    // 过滤选项
    filterOption(optionList, optionIndex, group) {
      if (optionIndex === this.allOption.length - 1) {
        let allCompose = this.groupOptionForm.groupList.map((item) => item.compose.join(','))
        let filterOptionList = optionList.filter((option) => {
          // 预期组合结果
          let catchArr = [...group.compose]
          catchArr[optionIndex] = option.id
          let expectCompose = catchArr.join(',')
          return allCompose.indexOf(expectCompose) === -1 || group.compose[this.allOption.length - 1] === option.id
        })
        return filterOptionList
      } else if (this.allOption.length === 3 && optionIndex === 1) {
        // 存在三种选项，且为对第二个选项过滤
        // 所有组合
        let allCompose = this.groupOptionForm.groupList.map((item) => item.compose.join(','))
        // 第三种选项数量
        let thirdOptionNum = this.allOption[2].children.length
        let filterOptionList = optionList.filter((option) => {
          // 预期组合结果
          let catchArr = [group.compose[0], option.id]
          let expectCompose = catchArr.join(',')
          // 第一、第二选项相同的数量
          let sameNum = 0
          allCompose.forEach((item) => {
            if (item.indexOf(expectCompose) !== -1) {
              sameNum++
            }
          })
          return sameNum < thirdOptionNum  || group.compose[1] === option.id
        })
        return filterOptionList
      } else if (optionIndex === 0) {
        // 第一选项出现的最大次数
        let maxGroupNum = 1
        // 所有组合
        let allCompose = this.groupOptionForm.groupList.map((item) => item.compose.join(','))
        this.allOption.forEach((item, index) => {
          if (index !== 0) {
            maxGroupNum *= item.children.length
          }
        })

        let filterOptionList = optionList.filter((option) => {
          let firstSelectNum = 0
          allCompose.forEach((item) => {
            if (item.indexOf(option.id) !== -1) {
              firstSelectNum++
            }
          })
          return firstSelectNum < maxGroupNum || group.compose[0] === option.id
        })
        return filterOptionList
      } else {
        return optionList
      }
    },
    // 删除
    async handleDelete(row) {
      let confirmRes = await this.$confirm(`是否删除 ${row.goodsName} ?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)
      if (confirmRes !== 'confirm') return
      let res = await apiDelete({
        id: row.id,
      }).catch((err) => err)
      if (res.success) {
        this.$message.success('删除成功')
        this.getTableData()
      }
    },
  },
}
</script>

<style scoped lang="scss">
.input-padding {
  ::v-deep .el-input__inner {
    text-align: center;
    padding: 0 5px;
  }
}
</style>
