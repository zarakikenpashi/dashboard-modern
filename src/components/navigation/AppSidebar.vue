<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ChevronDown } from '@lucide/vue'
import { ref, watch } from 'vue'

const props = defineProps({
  open: Boolean,
})

const emit = defineEmits(['close'])

const route = useRoute()
const router = useRouter()

const nav = [
  {
    section: 'Principal',
    items: [{ label: 'Tableau de bord', to: '/app/dashboard', icon: 'dashboard' }],
  },
  {
    section: 'Comptabilité',
    items: [
      {
        label: 'Journaux de saisie',
        to: '/app/journaux',
        icon: 'file-text',
        children: [
          { label: 'Journal banque (BQ)', to: '/app/journaux/banque' },
          { label: 'Journal caisse (CA)', to: '/app/journaux/caisse' },
          { label: 'Journal achat (AC)', to: '/app/journaux/achat' },
          { label: 'Journal vente (VT)', to: '/app/journaux/vente' },
          { label: 'Opérations diverses (OD)', to: '/app/journaux/od' },
          { label: 'Report à nouveau (RAN)', to: '/app/journaux/ran' },
        ],
      },
      {
        label: 'Plan comptable',
        to: '/app/plan-comptable',
        icon: 'list',
      },
      {
        label: 'Grand livre',
        to: '/app/grand-livre',
        icon: 'activity',
        children: [
          { label: 'Grand livre général', to: '/app/grand-livre/general' },
          { label: 'Grand livre auxiliaire', to: '/app/grand-livre/auxiliaire' },
          { label: 'Consultation par compte', to: '/app/grand-livre/consultation' },
        ],
      },
    ],
  },

  {
    section: 'États',
    items: [
      {
        label: 'Balance',
        to: '/app/balance',
        icon: 'table',
        children: [
          { label: 'Balance générale', to: '/app/balance/generale' },
          { label: 'Balance âgée clients', to: '/app/balance/agee-clients' },
          { label: 'Balance âgée fournisseurs', to: '/app/balance/agee-fournisseurs' },
          { label: 'Balance de vérification', to: '/app/balance/verification' },
        ],
      },
      {
        label: 'Immobilisations',
        to: '/app/immobilisations/registre',
        icon: 'monitor',
      },
    ],
  },

  {
    section: 'Tiers',
    items: [
      {
        label: 'Clients',
        to: '/app/clients',
        icon: 'users',
        children: [
          { label: 'Liste des clients', to: '/app/clients/list' },
          { label: 'Fiche client', to: '/app/clients/fiche' },
          { label: 'Relevé de compte client', to: '/app/clients/releve' },
          { label: 'Relances automatiques', to: '/app/clients/relances' },
          { label: 'Catégories clients', to: '/app/clients/categories' },
        ],
      },
      {
        label: 'Fournisseurs',
        to: '/app/fournisseurs',
        icon: 'truck',
        children: [
          { label: 'Liste des fournisseurs', to: '/app/fournisseurs/list' },
          { label: 'Fiche fournisseur', to: '/app/fournisseurs/fiche' },
          { label: 'Relevé de compte fourn.', to: '/app/fournisseurs/releve' },
          { label: 'Factures fournisseurs', to: '/app/fournisseurs/factures' },
        ],
      },
    ],
  },

  {
    section: 'Administration',
    items: [
      {
        label: 'Multi-sociétés',
        to: '/app/societes',
        icon: 'briefcase',
        children: [
          { label: 'Liste des sociétés', to: '/app/societes/list' },
          { label: 'Nouvelle société', to: '/app/societes/new' },
          { label: 'Exercices comptables', to: '/app/societes/exercices' },
          { label: "Clôture d'exercice", to: '/app/societes/cloture' },
          { label: 'Consolidation multi-sociétés', to: '/app/societes/consolidation' },
        ],
      },
      {
        label: 'Utilisateurs & Rôles',
        to: '/app/users',
        icon: 'user',
        children: [
          { label: 'Gestion des utilisateurs', to: '/app/users/list' },
          { label: 'Rôles & Permissions', to: '/app/users/roles' },
          { label: "Journal d'audit", to: '/app/users/audit' },
          { label: 'Sessions actives', to: '/app/users/sessions' },
        ],
      },
      {
        label: 'Paramètres',
        to: '/app/parametres',
        icon: 'settings',
        children: [
          { label: 'Informations société', to: '/app/parametres/societe' },
          { label: 'Devise & Fiscalité', to: '/app/parametres/devise' },
          { label: 'Modèles de documents', to: '/app/parametres/modeles' },
          { label: 'Intégrations & API', to: '/app/parametres/api' },
          { label: 'Sauvegarde & Sécurité', to: '/app/parametres/securite' },
        ],
      },
    ],
  },
]

// ── ICONS SVG (inline, pas de dépendance externe) ──
const icons = {
  dashboard: `<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>`,
  bell: `<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>`,
  'file-text': `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>`,
  list: `<rect x="5" y="2" width="14" height="20" rx="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/>`,
  activity: `<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>`,
  table: `<path d="M3 3h18v18H3z M9 3v18 M3 9h6 M3 15h6 M15 9h6 M15 15h6"/>`,
  layout: `<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>`,
  monitor: `<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>`,
  package: `<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>`,
  'dollar-sign': `<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>`,
  users: `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
  truck: `<rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>`,
  box: `<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>`,
  'bar-chart-2': `<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>`,
  briefcase: `<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>`,
  user: `<circle cx="12" cy="8" r="4"/><path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>`,
  settings: `<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>`,
}

const closeSidebar = () => emit('close')

// ── ACTIVE ──
const isActive = (to) => (to === '/app/dashboard' ? route.path === to : route.path.startsWith(to))

// ── OPEN STATE ──
const openMenus = ref({})

const toggleMenu = (key) => {
  openMenus.value[key] = !openMenus.value[key]
}

const handleParentClick = (item) => {
  if (item.children) toggleMenu(item.to)
  else {
    router.push(item.to)
    emit('close') // close mobile
  }
}
// ── AUTO-OPEN lorsque la route correspond à un enfant ──
watch(
  () => route.path,
  () => {
    nav.forEach(({ items }) => {
      items.forEach((item) => {
        if (item.children) {
          const childActive = item.children.some((c) => route.path.startsWith(c.to))
          if (childActive) openMenus.value[item.to] = true
        }
      })
    })
  },
  { immediate: true },
)

// ── ANIMATION ──
const enter = (el) => {
  el.style.height = '0'
  el.style.opacity = '0'
  requestAnimationFrame(() => {
    el.style.transition = 'height 0.25s ease, opacity 0.2s ease'
    el.style.height = el.scrollHeight + 'px'
    el.style.opacity = '1'
  })
}

const leave = (el) => {
  el.style.height = el.scrollHeight + 'px'
  el.style.opacity = '1'
  requestAnimationFrame(() => {
    el.style.transition = 'height 0.25s ease, opacity 0.2s ease'
    el.style.height = '0'
    el.style.opacity = '0'
  })
}
</script>

<template>
  <aside
    class="fixed md:static z-50 inset-y-0 left-0 w-65 bg-[#0f1a45] border-r border-white/5 flex flex-col transform transition-transform duration-300 ease-in-out md:translate-x-0"
    :class="props.open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
  >
    <!-- ── LOGO ── -->
    <div class="flex h-12 items-center px-4 border-b border-white/5 shrink-0">
      <img src="/Logo MLexpert.png" class="h-9" />

      <button class="ml-auto md:hidden text-white/60" @click="closeSidebar">✕</button>
    </div>

    <!-- ── SCROLLABLE NAV ── -->
    <nav
      class="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
    >
      <template v-for="group in nav" :key="group.section">
        <!-- Section label -->
        <p
          class="px-4 pt-4 pb-1.5 text-[.7rem] font-bold tracking-[0.12em] uppercase text-white/30 select-none"
        >
          {{ group.section }}
        </p>

        <ul class="px-2 space-y-0.5">
          <li v-for="item in group.items" :key="item.to">
            <!-- ✅ LIEN SIMPLE (pas d'enfants) -->
            <router-link
              v-if="!item.children"
              :to="item.to"
              class="flex items-center justify-between px-2.5 py-2 rounded-md text-[1rem] transition-all duration-150"
              :class="
                isActive(item.to)
                  ? 'bg-white/5 text-[#ced6df]'
                  : 'text-white/55 hover:text-[#ced6df] hover:bg-white/5'
              "
            >
              <span class="flex items-center gap-2.5">
                <!-- Icon SVG inline -->
                <svg
                  class="shrink-0"
                  :class="isActive(item.to) ? 'opacity-90' : 'opacity-60'"
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  v-html="icons[item.icon]"
                />
                <span>{{ item.label }}</span>
              </span>

              <!-- Badge count -->
              <span
                v-if="item.badge"
                class="text-[0.58rem] font-bold bg-red-500/80 px-1.5 py-px rounded-full leading-none"
              >
                {{ item.badge }}
              </span>
            </router-link>

            <!-- ✅ MENU PARENT (avec enfants) -->
            <div v-else>
              <button
                type="button"
                class="w-full flex items-center justify-between px-2.5 py-2 rounded-md text-[1rem] cursor-pointer transition-all duration-150"
                :class="
                  isActive(item.to)
                    ? 'bg-white/5 text-[#ced6df]'
                    : 'text-white/55 hover:text-[#ced6df] hover:bg-white/5'
                "
                @click="handleParentClick(item)"
              >
                <span class="flex items-center gap-2.5">
                  <svg
                    class="shrink-0"
                    :class="isActive(item.to) ? 'opacity-90' : 'opacity-60'"
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    v-html="icons[item.icon]"
                  />
                  <span>{{ item.label }}</span>
                </span>

                <span class="flex items-center gap-1.5">
                  <!-- Badge NEW -->
                  <span
                    v-if="item.badge_new"
                    class="text-[0.55rem] font-bold bg-green-500/20 text-green-300 border border-green-400/25 px-1.5 py-px rounded-full leading-none"
                  >
                    NEW
                  </span>

                  <!-- Chevron -->
                  <ChevronDown
                    :size="14"
                    class="transition-transform duration-250 opacity-50"
                    :class="{ 'rotate-180': openMenus[item.to] }"
                  />
                </span>
              </button>
              <!-- ✅ SOUS-MENU animé -->
              <transition @enter="enter" @leave="leave">
                <ul
                  v-if="openMenus[item.to]"
                  class="overflow-hidden ml-3.5 mt-0.5 mb-1 pl-3 border-l border-white/10 space-y-0.5"
                >
                  <li v-for="child in item.children" :key="child.to">
                    <router-link
                      :to="child.to"
                      class="flex items-center gap-2 px-2 py-1.25 rounded text-[0.9rem] transition-all duration-150"
                      :class="
                        isActive(child.to)
                          ? 'bg-white/5 text-[#ced6df]'
                          : 'text-white/40 hover:text-[#ced6df] hover:bg-white/5'
                      "
                    >
                      <!-- Dot actif -->
                      <span
                        class="w-1 h-1 rounded-full shrink-0 transition-colors"
                        :class="isActive(child.to) ? 'bg-white/50' : 'bg-white/20'"
                      />
                      {{ child.label }}
                    </router-link>
                  </li>
                </ul>
              </transition>
            </div>
          </li>
        </ul>
      </template>
    </nav>
  </aside>
</template>

<style>
/* largeur scrollbar */
nav::-webkit-scrollbar {
  width: 3px;
}

/* track */
nav::-webkit-scrollbar-track {
  background: transparent;
}

/* thumb */
nav::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
}

/* hover */
nav::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
