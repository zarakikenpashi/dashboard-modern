<script setup>
import { ref } from 'vue'
import AppSidebar from '@/components/navigation/AppSidebar.vue'
import AppTopbar from '@/components/navigation/AppTopbar.vue'

const sidebarOpen = ref(false)
</script>

<template>
  <!--
    bg-background = var(--background) = #f4f5f9  (Axelor DS)
    Toutes les couleurs viennent du nouveau index.css
  -->
  <div class="flex h-screen overflow-hidden bg-background">
    <!-- MOBILE OVERLAY -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
      @click="sidebarOpen = false"
    />

    <!-- SIDEBAR -->
    <AppSidebar :open="sidebarOpen" @close="sidebarOpen = false" />

    <!-- MAIN -->
    <div class="flex flex-1 flex-col overflow-hidden min-w-0">
      <AppTopbar @toggle-sidebar="sidebarOpen = !sidebarOpen" />

      <main
        class="flex-1 overflow-y-auto p-4 sm:p-6 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full"
      >
        <router-view />
      </main>
    </div>
  </div>
</template>
