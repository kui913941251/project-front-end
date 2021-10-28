<template>
  <div class="table-customer">
    <el-table :data="data" border :row-key="rowKey" :tree-props="treeProps">
      <slot></slot>
    </el-table>

    <el-pagination
      v-if="!rowKey"
      :layout="layout"
      :current-page="pageNum"
      :page-size="pageSize"
      :page-sizes="pageSizes"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'TableCustomer',
  props: {
    data: {
      type: Array,
      default() {
        return []
      },
    },
    border: {
      type: Boolean,
      default: true,
    },
    rowKey: {
      type: String,
      default: '',
    },
    treeProps: {
      type: Object,
      default() {
        return { children: 'children', hasChildren: 'hasChildren' }
      },
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper',
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20]
      },
    },
    pageSize: {
      type: Number,
      default: 10
    },
    pageNum: {
      type: Number,
      default: 1
    },
    total: {
      type: Number,
      default: 0
    },
  },
  data() {
    return {}
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('change')
      this.$emit('update:pageSize', val)
    },
    handleCurrentChange(val) {
      this.$emit('change')
      this.$emit('update:pageNum', val)
    },
  },
}
</script>

<style scoped lang="scss">
.el-pagination {
  text-align: end;
  margin-top: 20px;
}
</style>
