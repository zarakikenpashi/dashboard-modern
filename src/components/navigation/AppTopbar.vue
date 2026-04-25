<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'

defineEmits(['toggle-sidebar'])

const route = useRoute()

const notifications = ref(5)
const userMenuOpen  = ref(false)

// ── Breadcrumb dynamique ──────────────────────────────────────────────────────
const breadcrumbMap = {
  '/app/dashboard':                   ['Tableau de bord'],
  '/app/journaux':                    ['Comptabilité', 'Journaux de saisie'],
  '/app/journaux/banque':             ['Comptabilité', 'Journaux', 'Banque (BQ)'],
  '/app/journaux/caisse':             ['Comptabilité', 'Journaux', 'Caisse (CA)'],
  '/app/journaux/achat':              ['Comptabilité', 'Journaux', 'Achat (AC)'],
  '/app/journaux/vente':              ['Comptabilité', 'Journaux', 'Vente (VT)'],
  '/app/journaux/od':                 ['Comptabilité', 'Journaux', 'O.D.'],
  '/app/journaux/ran':                ['Comptabilité', 'Journaux', 'R.A.N.'],
  '/app/plan-comptable':              ['Comptabilité', 'Plan comptable'],
  '/app/grand-livre/general':         ['Comptabilité', 'Grand livre général'],
  '/app/grand-livre/auxiliaire':      ['Comptabilité', 'Grand livre auxiliaire'],
  '/app/balance/generale':            ['États', 'Balance générale'],
  '/app/balance/agee-clients':        ['États', 'Balance âgée clients'],
  '/app/balance/agee-fournisseurs':   ['États', 'Balance âgée fournisseurs'],
  '/app/immobilisations/registre':    ['États', 'Immobilisations'],
  '/app/clients/list':                ['Tiers', 'Clients'],
  '/app/fournisseurs/list':           ['Tiers', 'Fournisseurs'],
  '/app/societes/list':               ['Administration', 'Sociétés'],
  '/app/users/list':                  ['Administration', 'Utilisateurs'],
  '/app/parametres/societe':          ['Administration', 'Paramètres'],
}

const crumbs = () => {
  const parts = breadcrumbMap[route.path] ?? ['MLexpert']
  return [{ label: 'MLexpert', active: false }, ...parts.map((label, i) => ({ label, active: i === parts.length - 1 }))]
}

// ── Click outside ─────────────────────────────────────────────────────────────
const topbarRef = ref(null)
const handleClickOutside = (e) => {
  if (topbarRef.value && !topbarRef.value.contains(e.target)) {
    userMenuOpen.value = false
  }
}
onMounted(() => window.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => window.removeEventListener('click', handleClickOutside))
</script>

<template>
  <!--
    ┌─────────────────────────────────────────────────────────────────────┐
    │  Design system Axelor                                               │
    │  • Fond : bg-card = #ffffff                                        │
    │  • Bordure : border-border = #e4e7ef                               │
    │  • Texte muted : text-muted-foreground = #5f6b7c                   │
    │  • Notification badge : bg-destructive = #e74c3c                   │
    └─────────────────────────────────────────────────────────────────────┘
  -->
  <header
    ref="topbarRef"
    class="w-full h-12 bg-card border-b border-border
           flex items-center justify-between px-4 relative shrink-0 z-30"
  >

    <!-- ── GAUCHE : hamburger + breadcrumb ───────────────────────── -->
    <div class="flex items-center gap-2 min-w-0">

      <!-- Hamburger mobile -->
      <button
        class="md:hidden w-8 h-8 flex items-center justify-center rounded-md
               text-muted-foreground hover:bg-muted hover:text-foreground
               transition-colors mr-1 shrink-0"
        @click="$emit('toggle-sidebar')"
      >
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>

      <!-- Breadcrumb -->
      <nav class="flex items-center gap-1 text-[12px] min-w-0">
        <template v-for="(crumb, i) in crumbs()" :key="i">
          <span
            class="truncate transition-colors"
            :class="crumb.active
              ? 'text-foreground font-semibold'
              : 'text-muted-foreground hover:text-foreground cursor-pointer'"
          >
            {{ crumb.label }}
          </span>
          <span v-if="i < crumbs().length - 1" class="text-muted-foreground/40 text-[10px] shrink-0">›</span>
        </template>
      </nav>
    </div>

    <!-- ── DROITE : notifs + user ────────────────────────────────── -->
    <div class="flex items-center gap-1.5 shrink-0">

      <!-- Séparateur -->
      <div class="w-px h-4 bg-border mx-1 hidden sm:block"></div>

      <!-- Bouton notifications -->
      <button
        class="relative w-8 h-8 flex items-center justify-center rounded-md
               text-muted-foreground hover:bg-muted hover:text-foreground
               transition-colors"
      >
        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        <!-- Badge -->
        <span
          v-if="notifications"
          class="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive border-2 border-card"
        />
      </button>

      <!-- User dropdown -->
      <div class="relative">
        <button
          class="flex items-center gap-2 px-2 py-1.5 rounded-md
                 hover:bg-muted transition-colors cursor-pointer"
          @click.stop="userMenuOpen = !userMenuOpen"
        >
          <img src="https://i.pravatar.cc/30" class="w-6 h-6 rounded-full shrink-0" alt="avatar" />
          <div class="hidden sm:block text-left leading-tight">
            <p class="text-[11px] font-semibold text-foreground">David Dev</p>
            <p class="text-[10px] text-muted-foreground">Admin Head</p>
          </div>
          <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24"
               class="text-muted-foreground hidden sm:block transition-transform duration-200"
               :class="userMenuOpen ? 'rotate-180' : ''">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 9l6 6 6-6"/>
          </svg>
        </button>

        <!-- Dropdown menu -->
        <Transition name="dropdown">
          <div
            v-if="userMenuOpen"
            class="absolute right-0 top-full mt-2 w-44
                   bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50"
          >
            <!-- Header -->
            <div class="px-3 py-2.5 border-b border-border">
              <p class="text-[12px] font-semibold text-foreground">David Dev</p>
              <p class="text-[11px] text-muted-foreground mt-0.5">david@mlexpert.ci</p>
            </div>

            <!-- Items -->
            <div class="p-1">
              <button
                v-for="item in [
                  { label: 'Profil',         icon: 'user' },
                  { label: 'Notifications',  icon: 'bell' },
                  { label: 'Paramètres',     icon: 'settings' },
                  { label: 'Support',        icon: 'help' },
                ]"
                :key="item.label"
                class="w-full flex items-center gap-2.5 px-2.5 py-2
                       text-[12px] text-foreground rounded-lg
                       hover:bg-muted transition-colors"
              >
                <!-- Mini icône inline -->
                <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                     class="text-muted-foreground shrink-0">
                  <path v-if="item.icon === 'user'"     stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>
                  <path v-if="item.icon === 'bell'"     stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>
                  <path v-if="item.icon === 'settings'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                  <path v-if="item.icon === 'help'"     stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 9a3 3 0 0 1 6 0c0 2-3 3-3 3m0 4h.01"/>
                </svg>
                {{ item.label }}
              </button>

              <div class="my-1 border-t border-border"></div>

              <button
                class="w-full flex items-center gap-2.5 px-2.5 py-2
                       text-[12px] text-destructive rounded-lg
                       hover:bg-destructive/8 transition-colors"
              >
                <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                     class="shrink-0">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1"/>
                </svg>
                Déconnexion
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 160ms cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: top right;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}
.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
</style>
