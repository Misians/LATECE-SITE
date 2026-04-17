<template lang="pug">
  .app-layout
    // Skip link for accessibility
    a.skip-link(href="#main-content") {{ $t('accessibility.skipToContent') }}
    
    // Header
    AppHeader
    
    // Main content
    main#main-content
      slot
    
    // Footer
    AppFooter
    
    // Accessibility controls
    AppAccessibilityControls
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
// Initialize auth on app start
const authStore = useAuthStore()

onMounted(async () => {
  await authStore.initializeAuth()
})
</script>

<style scoped lang="scss">
.app-layout {
  min-height: 100vh;
  background-color: #f9fafb;
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: $primary-blue;
  color: white;
  padding: 8px;
  text-decoration: none;
  z-index: 1000;
  border-radius: 4px;
  
  &:focus {
    top: 6px;
  }
}
</style>
