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
          <el-button type="warning" @click="handleOptionGroup">组合</el-button>
          <el-button type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </TableCustomer>
  </div>
</template>

<script>
import { apiGoodsList, apiDelete } from '@/api/mall/goods'
import TableCustomer from '@/components/TableCustomer/TableCustomer'

export default {
  name: 'MallGoods',
  components: {
    TableCustomer,
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
    handleOptionGroup() {
      
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

<style scoped lang="scss"></style>
