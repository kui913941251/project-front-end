<template>
  <div class="system-user">
    <el-form inline>
      <el-form-item label="用户名">
        <el-input v-model="queryParams.username" class="input-width-200" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getTableData">查询</el-button>
        <el-button type="primary" @click="handleAddUser">添加用户</el-button>
      </el-form-item>
    </el-form>

    <TableCustomer
      v-loading="tableDataLoading"
      :data="tableData"
      :pageSize="queryParams.pageSize"
      :pageNum="queryParams.pageNum"
      :total="total"
    >
      <el-table-column prop="username" label="用户名" align="center"> </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center">
        <template v-slot="{ row }">
          <span>{{ row.createTime | formatTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template v-slot="{ row }">
          <el-button type="warning" @click="handleUpdateUser(row)">修改</el-button>
          <el-button type="danger" @click="handleDeleteUser(row)">删除</el-button>
        </template>
      </el-table-column>
    </TableCustomer>

    <!-- 用户添加、编辑 -->
    <DialogCustomer
      :title="userForm.id ? '修改用户' : '添加用户'"
      :visible.sync="userFormVisible"
      :cancel="handleCancel"
      :confirm="handleSubmit"
      width="500px"
    >
      <el-form :model="userForm" :rules="userFormRules" ref="userForm" label-width="100px" status-icon>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" class="input-width-200"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="userForm.password" class="input-width-200"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input type="password" v-model="userForm.confirmPassword" class="input-width-200"></el-input>
        </el-form-item>
      </el-form>
    </DialogCustomer>
  </div>
</template>

<script>
import { apiUserList, apiAdd, apiUpdate, apiDelete } from '@/api/system/user'
import TableCustomer from '@/components/TableCustomer/TableCustomer'
import DialogCustomer from '@/components/DialogCustomer/DialogCustomer.vue'

import { passwordValidate } from '@/utils/validate'
import CommomUtils from '@/utils/CommonUtils'

export default {
  name: 'SystemUser',
  components: {
    TableCustomer,
    DialogCustomer,
  },
  data() {
    // 密码验证
    const passowrdReg = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else if (value.length < 6 || value.length > 16) {
        callback(new Error('密码长度为6至16位'))
      } else if (!passwordValidate(value)) {
        callback(new Error('密码只能为英文、数字'))
      } else {
        callback()
      }
    }
    // 确认密码验证
    const confirmPswReg = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入密码'))
      } else if (this.userForm.password !== this.userForm.confirmPassword) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }

    return {
      tableDataLoading: false,
      total: 0,
      queryParams: {
        username: '',
        pageNum: 1,
        pageSize: 10,
      },
      tableData: [],
      // 用户添加、编辑
      userFormVisible: false,
      userForm: {
        id: null,
        username: '',
        password: '',
        confirmPassword: '',
      },
      confirmPassword: '',
      userFormRules: {
        username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
        password: [{ required: true, trigger: 'blur', validator: passowrdReg }],
        confirmPassword: [{ required: true, trigger: 'blur', validator: confirmPswReg }],
      },
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    async getTableData() {
      this.tableDataLoading = true
      let res = await apiUserList(this.queryParams).catch((err) => err)
      if (res.success) {
        this.tableData = res.data.list
        this.total = res.data.total
      }
      this.tableDataLoading = false
    },
    handleAddUser() {
      this.userFormVisible = true
      this.userForm = {
        id: null,
        username: '',
        password: '',
      }
      this.$nextTick(() => {
        this.$refs.userForm.clearValidate()
      })
    },
    handleUpdateUser(row) {
      this.userFormVisible = true
      this.userForm = {
        id: row.id,
        username: row.username,
        password: '',
      }
      this.$nextTick(() => {
        this.$refs.userForm.clearValidate()
      })
    },
    async handleSubmit(closeDialog) {
      let validateRes = await this.$refs.userForm.validate().catch((err) => err)
      if (!validateRes) return
      if (this.userForm.id) {
        this.submitUpdate(closeDialog)
      } else {
        this.submitAdd(closeDialog)
      }
    },
    async submitAdd(closeDialog) {
      let res = await apiAdd({
        username: this.userForm.username,
        password: CommomUtils.toSha256(this.userForm.password),
      })
      if (res.success) {
        this.$message.success('添加成功')
        this.getTableData()
        closeDialog()
      }
    },
    async submitUpdate(closeDialog) {
      let res = await apiUpdate({
        id: this.userForm.id,
        username: this.userForm.username,
        password: CommomUtils.toSha256(this.userForm.password),
      })
      if (res.success) {
        this.$message.success('修改成功')
        this.getTableData()
        closeDialog()
      }
    },
    handleCancel(closeDialog) {
      closeDialog()
    },
    async handleDeleteUser(row) {
      let validateRes = await this.$confirm(`是否删除 ${row.username} ?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)
      if (!validateRes) return

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
