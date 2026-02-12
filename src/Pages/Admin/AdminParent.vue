<template>
  <div class="admin-parent">
    <Topbar class="sticky-topbar" />
    <div class="admin-content">
      <router-view />
    </div>
  </div>
</template>

<script>
import Topbar from '@/components/Topbar.vue'

export default {
  name: 'AdminParent',
  components: {
    Topbar
  }
}
</script>

<style scoped>
.admin-parent {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.sticky-topbar {
  position: sticky;
  top: 0;
  z-index: 10;
}

.admin-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}
</style>
