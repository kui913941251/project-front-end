<template>
  <div class="system-user">
    <el-form inline>
      <el-form-item label="用户名">
        <el-input v-model="queryParams.username" class="input-width-200" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getTableData">查询</el-button>
        <el-button type="primary" @click="handleAdd">添加用户</el-button>
      </el-form-item>
    </el-form>

    <TableCustomer :data="tableData" :pageSize="queryParams.pageSize" :pageNum="queryParams.pageNum" :total="total">
      <el-table-column prop="username" label="用户名" align="center"> </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center">
        <template v-slot="{ row }">
          <span>{{ row.createTime | formatTime }}</span>
        </template>
      </el-table-column>
    </TableCustomer>
  </div>
</template>

<script>
import { apiUserList } from '@/api/system/user'
import TableCustomer from '@/components/TableCustomer/TableCustomer'

export default {
  name: 'SystemUser',
  components: {
    TableCustomer,
  },
  data() {
    return {
      total: 0,
      queryParams: {
        username: "",
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
      let res = await apiUserList(this.queryParams)
      if (res.success) {
        this.tableData = res.data.list
        this.total = res.data.total
      }
    },
    handleAdd() {
      console.log("add")
    }
  },
}
</script>

<style scoped lang="scss"></style>
