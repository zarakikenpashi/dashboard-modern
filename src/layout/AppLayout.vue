<script setup>
import { ref } from 'vue'
import AppSidebar from '@/components/navigation/AppSidebar.vue'
import AppTopbar from '@/components/navigation/AppTopbar.vue'

const sidebarOpen = ref(false)
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-[#f6f7fb]">
    <!-- MOBILE OVERLAY -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black/40 z-40 md:hidden"
      @click="sidebarOpen = false"
    />

    <!-- SIDEBAR -->
    <AppSidebar :open="sidebarOpen" @close="sidebarOpen = false" />

    <!-- MAIN -->
    <div class="flex flex-1 flex-col overflow-hidden">
      <AppTopbar @toggle-sidebar="sidebarOpen = !sidebarOpen" />

      <main
        class="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
      >
        <router-view />
      </main>
    </div>
  </div>
</template>
