<template>
  <div class="table-customer">
    <el-table :data="data" border>
      <slot></slot>
    </el-table>

    <el-pagination
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
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper',
    },
    pageSize: {
      type: Number,
      required: true,
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20]
      }
    },
    pageNum: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
    },
  },
  data() {
    return {}
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('change')
      this.$emit("update:pageSize", val)
    },
    handleCurrentChange(val) {
      this.$emit('change')
      this.$emit("update:pageNum", val)
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
