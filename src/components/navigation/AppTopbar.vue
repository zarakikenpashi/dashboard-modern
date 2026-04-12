<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Bell, ChevronDown } from '@lucide/vue'

const notifications = ref(5)

const userMenuOpen = ref(false)

/* ---------------- CLOSE ---------------- */
const closeMenus = () => {
  userMenuOpen.value = false
}

/* ---------------- CLICK OUTSIDE ---------------- */
const handleClickOutside = (e) => {
  const el = document.querySelector('#topbar')
  if (el && !el.contains(e.target)) {
    closeMenus()
  }
}

onMounted(() => window.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => window.removeEventListener('click', handleClickOutside))
</script>

<template>
  <header
    id="topbar"
    class="w-full h-11.5 bg-white border-b border-gray-100 flex items-center justify-between px-4 relative"
  >
    <div class="flex items-center gap-[6px] text-[13px] text-gray-400">
      <button class="md:hidden mr-2" @click="$emit('toggle-sidebar')">☰</button>
      <span>MLexpert</span>
      <span>›</span>
      <span>Comptabilité</span>
      <span>›</span>
      <span class="font-medium text-[#4c4c5c]">Tableau de bord</span>
    </div>
    <div class="flex items-center gap-4">
      <!-- NOTIFICATIONS -->
      <button class="relative text-gray-500 hover:text-gray-800 cursor-pointer">
        <Bell size="14" />

        <span
          v-if="notifications"
          class="absolute -top-2 -right-1 text-[9px] bg-[#f7577e] text-white w-4 h-4 rounded-full flex items-center justify-center"
        >
          {{ notifications }}
        </span>
      </button>

      <!-- USER -->
      <div class="relative">
        <button
          @click="userMenuOpen = !userMenuOpen"
          class="flex items-center gap-2 cursor-pointer"
        >
          <img src="https://i.pravatar.cc/30" class="w-6 h-6 rounded-full" />

          <div class="flex items-center gap-2">
            <div class="text-left leading-tight">
              <p class="text-[11px] font-medium text-gray-700">David Dev</p>
              <p class="text-[10px] text-gray-400">Admin Head</p>
            </div>

            <ChevronDown size="12" class="text-gray-400" />
          </div>
        </button>

        <!-- DROPDOWN -->
        <Transition name="dropdown">
          <div
            v-if="userMenuOpen"
            class="absolute -right-2 mt-2 w-[150px] bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden"
          >
            <!-- HEADER -->
            <div class="px-3 py-2 text-[11px] text-gray-400">Welcome back 👋</div>

            <div class="border-t border-gray-100"></div>

            <!-- ITEMS -->
            <div class="p-1">
              <div
                class="px-2 py-2 text-[12px] text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer"
              >
                Profile
              </div>

              <div
                class="px-2 py-2 text-[12px] text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer"
              >
                Notifications
              </div>

              <div
                class="px-2 py-2 text-[12px] text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer"
              >
                Settings
              </div>

              <div
                class="px-2 py-2 text-[12px] text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer"
              >
                Support
              </div>

              <div class="my-1 border-t border-gray-100"></div>

              <div
                class="px-2 py-2 text-[12px] text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
              >
                Log out
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<style>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 160ms cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: top;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}

.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
</style>
