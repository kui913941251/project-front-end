<template>
  <div class="system-role">
    <el-form inline>
      <el-form-item label="角色名">
        <el-input v-model="queryParams.roleName" class="input-width-200"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleAdd">添加角色</el-button>
      </el-form-item>
    </el-form>

    <TableCustomer
      v-loading="tableLoading"
      :data="tableData"
      :pageSize.sync="queryParams.pageSize"
      :pageNum.sync="queryParams.pageNum"
      :total="total"
      @change="getTableData"
    >
      <el-table-column prop="roleName" label="角色名" align="center"></el-table-column>
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
          <el-button type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </TableCustomer>

    <!-- 修改/添加角色 -->
    <el-dialog
      :title="roleForm.roleId ? '修改角色' : '添加角色'"
      :visible.sync="roleFormVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="500px"
    >
      <el-form :model="roleForm" :rules="roleFormRules" ref="roleForm" label-width="100px" status-icon>
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="roleForm.roleName" class="input-width-200"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="roleFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { apiRoleList, apiAdd, apiUpdate, apiDelete } from '@/api/system/role'
import TableCustomer from '@/components/TableCustomer/TableCustomer'

export default {
  name: 'SystemRole',
  components: {
    TableCustomer,
  },
  data() {
    return {
      tableLoading: false,
      total: 0,
      queryParams: {
        roleName: '',
        pageNum: 1,
        pageSize: 10,
      },
      tableData: [],
      // 角色添加/修改
      roleFormVisible: false,
      roleForm: {
        roleId: null,
        roleName: '',
      },
      roleFormRules: {
        roleName: [{ required: true, trigger: 'blur', message: '请输入角色名' }],
      },
    }
  },
  watch: {
    roleFormVisible(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.roleForm.clearValidate()
        })
      }
    },
  },
  created() {
    this.getTableData()
  },
  methods: {
    async getTableData() {
      this.tableLoading = true
      let res = await apiRoleList(this.queryParams).catch((err) => err)
      if (res.success) {
        this.tableData = res.data.list
        this.total = res.data.total
      }
      this.tableLoading = false
    },
    // 添加
    handleAdd() {
      this.roleFormVisible = true
      this.roleForm = {
        roleId: null,
        roleName: '',
      }
    },
    // 修改
    handleUpdate(row) {
      this.roleFormVisible = true
      this.roleForm = {
        roleId: row.id,
        roleName: row.roleName,
      }
    },
    // 提交添加\修改
    async handleSubmit() {
      let validateRes = await this.$refs.roleForm.validate().catch((err) => err)
      if (!validateRes) return
      if (this.roleForm.roleId) {
        this.submitUpdate()
      } else {
        this.submitAdd()
      }
    },
    async submitUpdate() {
      let res = await apiUpdate(this.roleForm)
      if (res.success) {
        this.$message.success('修改成功')
        this.getTableData()
        this.roleFormVisible = false
      }
    },
    async submitAdd() {
      let res = await apiAdd(this.roleForm)
      if (res.success) {
        this.$message.success('添加成功')
        this.getTableData()
        this.roleFormVisible = false
      }
    },
    // 删除
    async handleDelete(row) {
      let confirmRes = await this.$confirm(`是否删除 ${row.roleName} ?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)
      if (confirmRes !== 'confirm') return
      let res = await apiDelete({
        roleId: row.id,
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
