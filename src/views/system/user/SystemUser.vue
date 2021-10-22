<template>
  <div class="system-user">
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
  },
}
</script>

<style scoped lang="scss"></style>
