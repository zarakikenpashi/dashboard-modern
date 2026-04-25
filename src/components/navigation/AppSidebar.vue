<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, watch } from 'vue'

const props = defineProps({ open: Boolean })
const emit = defineEmits(['close'])

const route = useRoute()
const router = useRouter()

// ── NAVIGATION ───────────────────────────────────────────────────────────────
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
      { label: 'Plan comptable', to: '/app/plan-comptable', icon: 'list' },
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
      { label: 'Immobilisations', to: '/app/immobilisations/registre', icon: 'monitor' },
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

// ── ICONS SVG ────────────────────────────────────────────────────────────────
const icons = {
  dashboard: `<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>`,
  'file-text': `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>`,
  list: `<rect x="5" y="2" width="14" height="20" rx="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/>`,
  activity: `<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>`,
  table: `<path d="M3 3h18v18H3z M9 3v18 M3 9h6 M3 15h6 M15 9h6 M15 15h6"/>`,
  monitor: `<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>`,
  users: `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
  truck: `<rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>`,
  briefcase: `<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>`,
  user: `<circle cx="12" cy="8" r="4"/><path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>`,
  settings: `<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>`,
  chevron: `<path d="M6 9l6 6 6-6"/>`,
}

// ── HELPERS ──────────────────────────────────────────────────────────────────
const isActive = (to) => (to === '/app/dashboard' ? route.path === to : route.path.startsWith(to))
const openMenus = ref({})
const toggleMenu = (key) => {
  openMenus.value[key] = !openMenus.value[key]
}

const handleParentClick = (item) => {
  if (item.children) toggleMenu(item.to)
  else {
    router.push(item.to)
    emit('close')
  }
}

// Auto-ouvrir le menu du groupe actif
watch(
  () => route.path,
  () => {
    nav.forEach(({ items }) => {
      items.forEach((item) => {
        if (item.children?.some((c) => route.path.startsWith(c.to))) {
          openMenus.value[item.to] = true
        }
      })
    })
  },
  { immediate: true },
)

// Animation accordéon
const enter = (el) => {
  el.style.height = '0'
  el.style.opacity = '0'
  requestAnimationFrame(() => {
    el.style.transition = 'height 0.22s ease, opacity 0.18s ease'
    el.style.height = el.scrollHeight + 'px'
    el.style.opacity = '1'
  })
}
const leave = (el) => {
  el.style.height = el.scrollHeight + 'px'
  el.style.opacity = '1'
  requestAnimationFrame(() => {
    el.style.transition = 'height 0.22s ease, opacity 0.18s ease'
    el.style.height = '0'
    el.style.opacity = '0'
  })
}
</script>

<template>
  <!--
    ┌─────────────────────────────────────────────────────────────────────┐
    │  Design system Axelor                                               │
    │  • Fond sidebar  : var(--sidebar)         = #1a1a2e               │
    │  • Texte         : var(--sidebar-foreground) = #e8eaf0            │
    │  • Accent actif  : var(--sidebar-primary) = #3d5afe               │
    │  • Hover bg      : var(--sidebar-accent)  = #252540               │
    │  • Border        : var(--sidebar-border)  = rgba(255,255,255,.08) │
    └─────────────────────────────────────────────────────────────────────┘
  -->
  <aside
    class="fixed md:static z-50 inset-y-0 left-0 w-64 flex flex-col shrink-0 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out md:translate-x-0"
    :class="props.open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
  >
    <!-- ── LOGO ─────────────────────────────────────────────────────── -->
    <div class="flex h-12 items-center gap-3 px-4 border-b border-sidebar-border shrink-0">
      <!-- Logo mark indigo Axelor -->
      <div
        class="w-8 h-8 rounded-lg flex items-center justify-center bg-sidebar-primary text-sidebar-primary-foreground font-bold text-sm shrink-0"
      >
        F
      </div>
      <div class="min-w-0">
        <p class="text-sm font-semibold text-sidebar-foreground leading-none truncate">MLexpert</p>
        <p class="text-[10px] text-sidebar-foreground/40 mt-0.5">Comptabilité</p>
      </div>
      <!-- Fermer (mobile) -->
      <button
        class="ml-auto md:hidden w-7 h-7 flex items-center justify-center rounded-md text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
        @click="emit('close')"
      >
        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <!-- ── NAV ──────────────────────────────────────────────────────── -->
    <nav class="flex-1 overflow-y-auto py-2 sidebar-scroll">
      <template v-for="group in nav" :key="group.section">
        <!-- Section label -->
        <p
          class="px-4 pt-4 pb-1.5 text-[10px] font-semibold tracking-[0.12em] uppercase text-sidebar-foreground/30 select-none"
        >
          {{ group.section }}
        </p>

        <ul class="px-2 space-y-px">
          <li v-for="item in group.items" :key="item.to">
            <!-- Lien simple -->
            <router-link
              v-if="!item.children"
              :to="item.to"
              class="group/item flex items-center justify-between px-2.5 py-[7px] rounded-md text-[13px] transition-all duration-150"
              :class="
                isActive(item.to)
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground'
              "
              @click="emit('close')"
            >
              <span class="flex items-center gap-2.5">
                <svg
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
                {{ item.label }}
              </span>
              <!-- Indicateur actif -->
              <span v-if="isActive(item.to)" class="w-1.5 h-1.5 rounded-full bg-sidebar-primary" />
            </router-link>

            <!-- Menu parent (avec enfants) -->
            <div v-else>
              <button
                type="button"
                class="group/item w-full flex items-center justify-between px-2.5 py-[7px] rounded-md text-[13px] cursor-pointer transition-all duration-150"
                :class="
                  isActive(item.to)
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground'
                "
                @click="handleParentClick(item)"
              >
                <span class="flex items-center gap-2.5">
                  <svg
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
                  {{ item.label }}
                </span>

                <!-- Chevron -->
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="transition-transform duration-200 shrink-0"
                  :class="openMenus[item.to] ? 'rotate-180' : ''"
                  v-html="icons['chevron']"
                />
              </button>

              <!-- Sous-menu animé -->
              <transition @enter="enter" @leave="leave">
                <ul
                  v-if="openMenus[item.to]"
                  class="overflow-hidden ml-4 mt-0.5 mb-1 pl-3 border-l border-sidebar-border space-y-px"
                >
                  <li v-for="child in item.children" :key="child.to">
                    <router-link
                      :to="child.to"
                      class="group/child flex items-center gap-2.5 px-2 py-[6px] rounded-md text-[12px] transition-all duration-150"
                      :class="
                        isActive(child.to)
                          ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium'
                          : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
                      "
                      @click="emit('close')"
                    >
                      <!-- Dot -->
                      <span
                        class="w-1 h-1 rounded-full shrink-0 transition-colors"
                        :class="
                          isActive(child.to)
                            ? 'bg-sidebar-primary-foreground'
                            : 'bg-sidebar-foreground/70 group-hover/child:bg-sidebar-foreground'
                        "
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

    <!-- ── FOOTER UTILISATEUR ────────────────────────────────────────── -->
    <div class="px-3 py-3 border-t border-sidebar-border shrink-0">
      <div
        class="flex items-center gap-2.5 px-2 py-2 rounded-md hover:bg-sidebar-accent cursor-pointer transition-colors group/user"
      >
        <img src="https://i.pravatar.cc/30" class="w-7 h-7 rounded-full shrink-0" alt="avatar" />
        <div class="min-w-0 flex-1">
          <p class="text-[12px] font-medium text-sidebar-foreground leading-none truncate">
            David Dev
          </p>
          <p class="text-[10px] text-sidebar-foreground/40 mt-0.5 truncate">Admin Head</p>
        </div>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="opacity-30 group-hover/user:opacity-60 shrink-0"
        >
          <circle cx="12" cy="12" r="1" />
          <circle cx="12" cy="5" r="1" />
          <circle cx="12" cy="19" r="1" />
        </svg>
      </div>
    </div>
  </aside>
</template>

<style scoped>
/* Scrollbar sidebar */
.sidebar-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.12) transparent;
}
.sidebar-scroll::-webkit-scrollbar {
  width: 3px;
}
.sidebar-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.sidebar-scroll::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.12);
  border-radius: 10px;
}
.sidebar-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.25);
}
</style>
