<template>
  <div class="system-role-modify">
    <el-form :model="roleForm" :rules="roleFormRules" ref="roleForm" label-width="100px" status-icon>
      <el-form-item label="角色名" prop="roleName">
        <el-input v-model="roleForm.roleName" class="input-width-200"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="des">
        <el-input type="textarea" v-model="roleForm.des" class="input-width-500"></el-input>
      </el-form-item>
      <el-form-item label="权限" prop="des">
        <el-tree
          ref="authTree"
          :data="authTree"
          show-checkbox
          node-key="id"
          :default-expanded-keys="defaultChecked"
          :default-checked-keys="defaultChecked"
          :props="defaultProps"
          :check-strictly="true"
        >
        </el-tree>
      </el-form-item>

      <el-form-item>
        <el-button @click="handleSubmit">确 定</el-button>
        <el-button>取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { apiDetail, apiAdd, apiUpdate } from '@/api/system/role'
import { apiAuthTree } from '@/api/system/auth'

export default {
  name: 'SystemRoleModify',
  data() {
    return {
      roleForm: {
        id: null,
        roleName: '',
        des: '',
        authIdList: [],
      },
      roleFormRules: {
        roleName: [{ required: true, trigger: 'blur', message: '请输入角色名' }],
      },
      authTree: [],
      defaultProps: {
        children: 'children',
        label: 'authName',
      },
      defaultChecked: [],
    }
  },
  created() {
    let id = this.$route.params.id
    if (id) {
      this.roleForm.id = id
      this.getRoleDetail()
    }
    this.getAuthTree()
  },
  methods: {
    async getRoleDetail() {
      let res = await apiDetail({
        id: this.roleForm.id,
      })
      if (res.success) {
        this.roleForm.roleName = res.data.roleName
        this.roleForm.des = res.data.des
        this.defaultChecked = res.data.authIdList
      }
    },
    async getAuthTree() {
      let res = await apiAuthTree()
      if (res.success) {
        this.authTree = res.data
      }
    },
    async handleSubmit() {
      let validateRes = await this.$refs.roleForm.validate().catch((err) => err)
      if (!validateRes) return
      this.roleForm.authIdList = this.$refs.authTree.getCheckedKeys()
      if (this.roleForm.id) {
        this.submitUpdate()
      } else {
        this.submitAdd()
      }
    },
    async submitUpdate() {
      let res = await apiUpdate(this.roleForm)
      if (res.success) {
        this.$message.success('修改成功')
        this.$router.go(-1)
      }
    },
    async submitAdd() {
      let res = await apiAdd(this.roleForm)
      if (res.success) {
        this.$message.success('添加成功')
        this.$router.go(-1)
      }
    },
  },
}
</script>

<style scoped lang="scss"></style>
