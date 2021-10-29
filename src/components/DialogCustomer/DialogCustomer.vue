<template>
  <div class="dialog-customer">
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :width="width"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <slot></slot>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">{{ cancelLable }}</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'DialogCustomer',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '提示',
    },
    width: {
      type: String,
      default: '30%',
    },
    cancelLable: {
      type: String,
      default: '取 消',
    },
    cancel: {
      type: Function,
      default: null,
    },
    confirmLable: {
      type: String,
      default: '确 定',
    },
    confirm: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      dialogVisible: false,
    }
  },
  watch: {
    visible(newValue) {
      this.dialogVisible = newValue
    },
  },
  methods: {
    handleCancel() {
      if (this.cancel) {
        this.cancel(this.closeDialog.bind(this))
      } else {
        this.closeDialog()
      }
    },
    handleConfirm() {
      if (this.confirm) {
        this.confirm(this.closeDialog.bind(this))
      } else {
        this.closeDialog()
      }
    },
    closeDialog() {
      this.$emit('update:visible', false)
    },
  },
}
</script>

<style scoped lang="scss"></style>
