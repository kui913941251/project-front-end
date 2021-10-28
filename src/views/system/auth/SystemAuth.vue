<template>
  <div class="system-auth">
    <div class="filter-body">
      <el-button type="primary" @click="handleAddAuth({ level: 0 })">添加一级权限</el-button>
    </div>
    <TableCustomer v-loading="tableLoading" :data="tableData" rowKey="id" :treeProps="{ children: 'children' }">
      <el-table-column prop="authName" label="权限名" header-align="center"></el-table-column>
      <el-table-column prop="authCode" label="权限标识" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="240">
        <template v-slot="{ row }">
          <el-button type="primary" @click="handleAddAuth(row)" v-if="row.level !== 3">添加</el-button>
          <el-button type="warning" @click="handleUpdateAuth(row)">编辑</el-button>
          <el-button type="danger" @click="handleDeleteAuth(row)" v-if="row.children.length === 0">删除</el-button>
        </template>
      </el-table-column>
    </TableCustomer>

    <DialogCustomer :visible.sync="authFormVisible" width="500px" :title="authForm.id ? '修改权限' : '添加权限'" :confirm="handleSubmit">
      <el-form ref="authForm" :model="authForm" :rules="authFormRules" label-width="80px">
        <el-form-item prop="authName" label="权限名">
          <el-input class="input-width-300" v-model="authForm.authName"></el-input>
        </el-form-item>
        <el-form-item prop="authCode" label="权限标识">
          <el-input class="input-width-300" v-model="authForm.authCode"></el-input>
        </el-form-item>
      </el-form>
    </DialogCustomer>
  </div>
</template>

<script>
import { apiAuthTree, apiAdd, apiUpdate, apiDelete } from '@/api/system/auth'
import TableCustomer from '@/components/TableCustomer/TableCustomer'
import DialogCustomer from '@/components/DialogCustomer/DialogCustomer.vue'
export default {
  name: 'SystemAuth',
  components: {
    TableCustomer,
    DialogCustomer,
  },
  data() {
    return {
      tableLoading: false,
      tableData: [],
      authForm: {
        id: null,
        level: null,
        authName: '',
        authCode: '',
      },
      authFormRules: {
        authName: [{ required: true, trigger: 'blur', message: '请输入权限名' }],
        authCode: [{ required: true, trigger: 'blur', message: '请输入权限标识' }],
      },
      authFormVisible: false,
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    async getTableData() {
      this.tableLoading = true
      let res = await apiAuthTree().catch((err) => err)
      if (res.success) {
        this.tableData = res.data
      }
      this.tableLoading = false
    },
    handleAddAuth(row) {
      this.authForm = {
        id: null,
        level: row.level + 1,
        authName: '',
        authCode: '',
        pid: row.id,
      }
      console.log(row)
      this.authFormVisible = true
    },
    handleUpdateAuth(row) {
      this.authForm = {
        id: row.id,
        authName: row.authName,
        authCode: row.authCode,
      }
      this.authFormVisible = true
    },
    async handleSubmit(closeDialog) {
      let validateRes = await this.$refs.authForm.validate().catch((err) => err)
      if (!validateRes) return
      if (this.authForm.id) {
        this.submitUpdate(closeDialog)
      } else {
        this.submitAdd(closeDialog)
      }
    },
    async submitAdd(closeDialog) {
      let res = await apiAdd(this.authForm).catch((err) => err)
      if (res.success) {
        this.$message.success('添加成功')
        this.getTableData()
        closeDialog()
      }
    },
    async submitUpdate(closeDialog) {
      let res = await apiUpdate(this.authForm).catch((err) => err)
      if (res.success) {
        this.$message.success('修改成功')
        this.getTableData()
        closeDialog()
      }
    },
    async handleDeleteAuth(row) {
      let confirmRes = await this.$confirm(`是否删除 ${row.authName} ?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)
      if (confirmRes !== 'confirm') return
      let res = await apiDelete({
        id: row.id,
      })
      if (res.success) {
        this.$message.success('删除成功')
        this.getTableData()
      }
    },
  },
}
</script>

<style scoped lang="scss"></style>
