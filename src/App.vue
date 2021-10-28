<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { addRouter } from '@/utils/auth'

export default {
  name: 'App',
  created() {
    this.$router.options.routes = addRouter(this)
  },
}
</script>
