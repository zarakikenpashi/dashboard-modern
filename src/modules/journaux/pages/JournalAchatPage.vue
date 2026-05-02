<script setup>
import { ref, computed, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// ─── STATE ────────────────────────────────────────────────────────────────────
const searchQuery = ref('')
const filterStatut = ref('all')
const periodeLabel = ref('Janvier 2026')

// Pagination
const pageSize = ref(8)
const currentPage = ref(1)

// Modals
const showDetailModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)

const selectedEntry = ref(null)
const entryToDelete = ref(null)

// Formulaire édition
const editForm = reactive({
  id: null,
  jour: '',
  numPiece: '',
  numFacture: '',
  numCompteGen: '',
  numCompteTiers: '',
  libelle: '',
  debit: '',
  credit: '',
  statut: '',
})

// ─── DONNÉES ──────────────────────────────────────────────────────────────────
const ecritures = ref([
  {
    id: 1,
    jour: 2,
    numPiece: 'ACH-001',
    numFacture: 'F-081',
    numCompteGen: '601000',
    numCompteTiers: '401001',
    libelle: 'Achat fournitures bureau - Acme Fournitures',
    debit: 85000,
    credit: 0,
    statut: 'Payé',
  },
  {
    id: 2,
    jour: 2,
    numPiece: 'ACH-001',
    numFacture: 'F-081',
    numCompteGen: '445660',
    numCompteTiers: '',
    libelle: 'TVA déductible - Acme Fournitures',
    debit: 15300,
    credit: 0,
    statut: 'Payé',
  },
  {
    id: 3,
    jour: 2,
    numPiece: 'ACH-001',
    numFacture: 'F-081',
    numCompteGen: '401000',
    numCompteTiers: '401001',
    libelle: 'Fournisseur Acme Fournitures',
    debit: 0,
    credit: 100300,
    statut: 'Payé',
  },
  {
    id: 4,
    jour: 5,
    numPiece: 'ACH-002',
    numFacture: 'TS-234',
    numCompteGen: '218300',
    numCompteTiers: '401002',
    libelle: 'Achat équipement informatique - Tech Solutions',
    debit: 420000,
    credit: 0,
    statut: 'En attente',
  },
  {
    id: 5,
    jour: 5,
    numPiece: 'ACH-002',
    numFacture: 'TS-234',
    numCompteGen: '445660',
    numCompteTiers: '',
    libelle: 'TVA déductible - Tech Solutions CI',
    debit: 75600,
    credit: 0,
    statut: 'En attente',
  },
  {
    id: 6,
    jour: 5,
    numPiece: 'ACH-002',
    numFacture: 'TS-234',
    numCompteGen: '401000',
    numCompteTiers: '401002',
    libelle: 'Fournisseur Tech Solutions CI',
    debit: 0,
    credit: 495600,
    statut: 'En attente',
  },
  {
    id: 7,
    jour: 10,
    numPiece: 'ACH-003',
    numFacture: 'GM-591',
    numCompteGen: '602000',
    numCompteTiers: '401003',
    libelle: 'Achat matières premières - Global Matières',
    debit: 210000,
    credit: 0,
    statut: 'Payé',
  },
  {
    id: 8,
    jour: 10,
    numPiece: 'ACH-003',
    numFacture: 'GM-591',
    numCompteGen: '445660',
    numCompteTiers: '',
    libelle: 'TVA déductible - Global Matières',
    debit: 37800,
    credit: 0,
    statut: 'Payé',
  },
  {
    id: 9,
    jour: 10,
    numPiece: 'ACH-003',
    numFacture: 'GM-591',
    numCompteGen: '401000',
    numCompteTiers: '401003',
    libelle: 'Fournisseur Global Matières',
    debit: 0,
    credit: 247800,
    statut: 'Payé',
  },
  {
    id: 10,
    jour: 15,
    numPiece: 'ACH-004',
    numFacture: 'SP-099',
    numCompteGen: '621000',
    numCompteTiers: '401004',
    libelle: 'Prestation de service - ServicePro SARL',
    debit: 55000,
    credit: 0,
    statut: 'En attente',
  },
  {
    id: 11,
    jour: 15,
    numPiece: 'ACH-004',
    numFacture: 'SP-099',
    numCompteGen: '445660',
    numCompteTiers: '',
    libelle: 'TVA déductible - ServicePro SARL',
    debit: 9900,
    credit: 0,
    statut: 'En attente',
  },
  {
    id: 12,
    jour: 15,
    numPiece: 'ACH-004',
    numFacture: 'SP-099',
    numCompteGen: '401000',
    numCompteTiers: '401004',
    libelle: 'Fournisseur ServicePro SARL',
    debit: 0,
    credit: 64900,
    statut: 'En attente',
  },
])

const stats = computed(() => {
  const pieces = [...new Set(ecritures.value.map((e) => e.numPiece))]
  const ttc = ecritures.value.filter((e) => e.debit > 0).reduce((s, e) => s + e.debit, 0)
  const mois = new Date().getMonth()
  const ceMois = ecritures.value.filter(() => new Date().getMonth() === mois).length
  return {
    totalAchats: ttc,
    nbPieces: pieces.length,
    enAttente: pieces.filter(
      (p) => ecritures.value.find((e) => e.numPiece === p)?.statut === 'En attente',
    ).length,
    payees: pieces.filter((p) => ecritures.value.find((e) => e.numPiece === p)?.statut === 'Payé')
      .length,
    ceMois,
  }
})

const filteredEcritures = computed(() => {
  return ecritures.value.filter((e) => {
    const q = searchQuery.value.toLowerCase()
    const matchQ =
      !q ||
      e.libelle.toLowerCase().includes(q) ||
      e.numPiece.toLowerCase().includes(q) ||
      e.numCompteGen.includes(q) ||
      e.numCompteTiers.includes(q) ||
      e.numFacture.toLowerCase().includes(q)
    return matchQ && (filterStatut.value === 'all' || e.statut === filterStatut.value)
  })
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredEcritures.value.length / pageSize.value)),
)

const pagedEcritures = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredEcritures.value.slice(start, start + pageSize.value)
})

const paginationLabel = computed(() => {
  const total = filteredEcritures.value.length
  const start = Math.min((currentPage.value - 1) * pageSize.value + 1, total)
  const end = Math.min(currentPage.value * pageSize.value, total)
  return total ? `${start} – ${end} sur ${total}` : '0 résultat'
})

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const pieceGroups = computed(() => {
  const groups = {}
  let idx = 0
  ecritures.value.forEach((e) => {
    if (!(e.numPiece in groups)) groups[e.numPiece] = idx++ % 2
  })
  return groups
})

// ─── UTILS ────────────────────────────────────────────────────────────────────
function fmt(n) {
  if (!n || n === 0) return '—'
  return new Intl.NumberFormat('fr-FR').format(Math.round(n))
}

function goToPage() {
  router.push({ name: 'NewJournalAchat' })
}

// ─── ACTIONS ──────────────────────────────────────────────────────────────────
function openDetail(entry) {
  selectedEntry.value = entry
  showDetailModal.value = true
}

function openEdit(entry, event) {
  event?.stopPropagation()
  Object.assign(editForm, { ...entry })
  showEditModal.value = true
}

function saveEdit() {
  const idx = ecritures.value.findIndex((e) => e.id === editForm.id)
  if (idx !== -1) {
    ecritures.value[idx] = {
      ...ecritures.value[idx],
      jour: Number(editForm.jour),
      numPiece: editForm.numPiece,
      numFacture: editForm.numFacture,
      numCompteGen: editForm.numCompteGen,
      numCompteTiers: editForm.numCompteTiers,
      libelle: editForm.libelle,
      debit: Number(editForm.debit) || 0,
      credit: Number(editForm.credit) || 0,
      statut: editForm.statut,
    }
  }
  showEditModal.value = false
}

function askDelete(entry, event) {
  event?.stopPropagation()
  entryToDelete.value = entry
  showDeleteModal.value = true
}

function confirmDelete() {
  if (!entryToDelete.value) return
  ecritures.value = ecritures.value.filter((e) => e.id !== entryToDelete.value.id)
  if (selectedEntry.value?.id === entryToDelete.value.id) {
    showDetailModal.value = false
    selectedEntry.value = null
  }
  entryToDelete.value = null
  showDeleteModal.value = false
}

function changeStatut(entry, statut) {
  const piece = entry.numPiece
  ecritures.value.forEach((e) => {
    if (e.numPiece === piece) e.statut = statut
  })
  showDetailModal.value = false
}

// ─── STATUT COLORS ────────────────────────────────────────────────────────────
const statutColor = {
  Payé: 'text-emerald-700 bg-emerald-50 border border-emerald-200',
  'En attente': 'text-amber-700   bg-amber-50   border border-amber-200',
  Annulé: 'text-red-600     bg-red-50     border border-red-200',
}
const statutDot = {
  Payé: 'bg-emerald-500',
  'En attente': 'bg-amber-400',
  Annulé: 'bg-red-400',
}

watch([searchQuery, filterStatut], () => {
  currentPage.value = 1
})
</script>

<template>
  <div class="p-4 sm:p-6 space-y-4 sm:space-y-5">
    <!-- ── PAGE HEADER ────────────────────────────────────────────────── -->
    <div class="flex items-center justify-between gap-3">
      <div class="min-w-0">
        <h1 class="text-xl font-semibold text-foreground truncate">Journal des Achats</h1>
        <p class="text-sm text-muted-foreground mt-0.5 hidden sm:block">
          Journal : ACHATS LOCAUX / {{ periodeLabel }}
        </p>
      </div>
      <button
        @click="goToPage"
        class="flex items-center gap-2 bg-primary text-white text-sm font-semibold px-3 sm:px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors shrink-0"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span class="hidden sm:inline">Saisir une écriture</span>
      </button>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <!-- Total Achats -->
      <div class="bg-card rounded-xl border border-border shadow-sm p-5">
        <div class="flex items-start justify-between mb-3">
          <span class="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Total Achats
          </span>
          <div class="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
            <svg
              class="w-4 h-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
        </div>
        <p
          class="text-2xl sm:text-3xl font-bold text-foreground tracking-tight font-mono leading-none"
        >
          {{ fmt(stats.totalAchats) || '0' }}
        </p>
        <p class="text-xs text-muted-foreground mt-2">FCFA · {{ stats.nbPieces }} écritures</p>
      </div>

      <!-- En attente -->
      <div class="bg-card rounded-xl border border-border shadow-sm p-5">
        <div class="flex items-start justify-between mb-3">
          <span class="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            En Attente
          </span>
          <div class="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
            <svg
              class="w-4 h-4 text-amber-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <p class="text-2xl sm:text-3xl font-bold text-amber-500 tracking-tight leading-none">
          {{ stats.enAttente }}
        </p>
        <p class="text-xs text-muted-foreground mt-2">Factures à régler</p>
      </div>

      <!-- Payées -->
      <div class="bg-card rounded-xl border border-border shadow-sm p-5">
        <div class="flex items-start justify-between mb-3">
          <span class="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Payées
          </span>
          <div class="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
            <svg
              class="w-4 h-4 text-emerald-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <p class="text-2xl sm:text-3xl font-bold text-emerald-500 tracking-tight leading-none">
          {{ stats.payees }}
        </p>
        <p class="text-xs text-muted-foreground mt-2">Factures soldées</p>
      </div>

      <!-- Ce mois -->
      <div class="bg-card rounded-xl border border-border shadow-sm p-5">
        <div class="flex items-start justify-between mb-3">
          <span class="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Ce Mois
          </span>
          <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <svg
              class="w-4 h-4 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
        <p class="text-2xl sm:text-3xl font-bold text-foreground tracking-tight leading-none">
          {{ stats.ceMois }}
        </p>
        <p class="text-xs text-muted-foreground mt-2">Nouvelles écritures</p>
      </div>
    </div>

    <!-- ── TABLEAU JOURNAL ─────────────────────────────────────────────── -->
    <div class="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <!-- ════ TOOLBAR — 2 colonnes : [Période + Recherche + Filtre] | [Pagination] ════ -->
      <div class="px-4 sm:px-5 py-3.5 border-b border-border">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <!-- Colonne gauche : période + recherche + filtre + export -->
          <div class="flex flex-wrap items-center gap-2">
            <!-- Période -->
            <div class="flex items-center gap-1.5 shrink-0">
              <svg
                class="w-3.5 h-3.5 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <input
                v-model="periodeLabel"
                class="text-sm font-medium text-foreground w-32 bg-transparent border-b border-dashed border-border focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div class="w-px h-5 bg-border hidden sm:block"></div>

            <!-- Recherche -->
            <div class="relative flex-1 min-w-[160px]">
              <svg
                class="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Libellé, N° pièce, compte..."
                class="w-full pl-8 pr-3 py-1.5 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>

            <!-- Filtre statut -->
            <div class="relative">
              <select
                v-model="filterStatut"
                class="appearance-none text-sm pl-3 pr-7 py-1.5 bg-background border border-border rounded-lg text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              >
                <option value="all">Tous</option>
                <option value="Payé">Payé</option>
                <option value="En attente">En attente</option>
                <option value="Annulé">Annulé</option>
              </select>
              <svg
                class="w-3 h-3 text-muted-foreground absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                  d="M6 9l6 6 6-6"
                />
              </svg>
            </div>

            <!-- Export -->
            <button
              class="flex items-center gap-1.5 text-sm text-muted-foreground border border-border rounded-lg px-2.5 py-1.5 hover:bg-muted hover:text-foreground transition-colors"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span class="hidden sm:inline text-xs">Exporter</span>
            </button>
          </div>

          <!-- Colonne droite : pagination -->
          <div class="flex items-center justify-start lg:justify-end gap-2">
            <!-- Label -->
            <span class="text-xs text-muted-foreground font-mono shrink-0">
              {{ paginationLabel }}
            </span>

            <!-- Lignes par page -->
            <div class="relative">
              <select
                v-model.number="pageSize"
                class="appearance-none text-xs pl-2.5 pr-6 py-1.5 bg-background border border-border rounded-lg text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              >
                <option :value="5">5 / page</option>
                <option :value="8">8 / page</option>
                <option :value="15">15 / page</option>
                <option :value="25">25 / page</option>
              </select>
              <svg
                class="w-3 h-3 text-muted-foreground absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                  d="M6 9l6 6 6-6"
                />
              </svg>
            </div>

            <!-- Boutons nav -->
            <div class="flex items-center gap-1">
              <!-- Première page -->
              <button
                @click="currentPage = 1"
                :disabled="currentPage === 1"
                class="w-7 h-7 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                  />
                </svg>
              </button>

              <!-- Précédent -->
              <button
                @click="prevPage"
                :disabled="currentPage === 1"
                class="w-7 h-7 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <!-- Numéros de pages -->
              <template v-for="p in totalPages" :key="p">
                <button
                  v-if="Math.abs(p - currentPage) <= 1 || p === 1 || p === totalPages"
                  @click="currentPage = p"
                  class="w-7 h-7 flex items-center justify-center rounded-md border text-xs font-medium transition-colors"
                  :class="
                    p === currentPage
                      ? 'bg-primary text-white border-primary'
                      : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground'
                  "
                >
                  {{ p }}
                </button>
                <span
                  v-else-if="
                    (p === 2 && currentPage > 3) ||
                    (p === totalPages - 1 && currentPage < totalPages - 2)
                  "
                  class="text-muted-foreground text-xs px-0.5"
                  >…</span
                >
              </template>

              <!-- Suivant -->
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="w-7 h-7 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              <!-- Dernière page -->
              <button
                @click="currentPage = totalPages"
                :disabled="currentPage === totalPages"
                class="w-7 h-7 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 5l7 7-7 7M5 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ── TABLE DESKTOP ───────────────────────────────────────────── -->
      <div class="hidden md:block overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-muted/40 border-b border-border">
              <th
                class="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3 py-3 w-14"
              >
                Jour
              </th>
              <th
                class="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3 py-3 w-28"
              >
                N°Pièce
              </th>
              <th
                class="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3 py-3 w-24"
              >
                N°Facture
              </th>
              <th
                class="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3 py-3 w-28"
              >
                N°Cpte Gén.
              </th>
              <th
                class="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3 py-3 w-28"
              >
                N°Cpte Tiers
              </th>
              <th
                class="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3 py-3"
              >
                Libellé écriture
              </th>
              <th
                class="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3 py-3 w-32"
              >
                Débit
              </th>
              <th
                class="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3 py-3 w-32"
              >
                Crédit
              </th>
              <th
                class="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3 py-3 w-28"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="entry in pagedEcritures" :key="entry.id">
              <tr
                class="border-b border-border transition-colors group"
                :class="[
                  pieceGroups[entry.numPiece] === 1 ? 'bg-muted/30' : 'bg-card',
                  'hover:bg-primary/5',
                ]"
              >
                <td class="px-3 py-2.5 text-center">
                  <span class="text-xs font-mono font-semibold text-muted-foreground">{{
                    String(entry.jour).padStart(2, '0')
                  }}</span>
                </td>
                <td class="px-3 py-2.5">
                  <span
                    class="text-xs font-mono font-bold text-foreground bg-muted px-1.5 py-0.5 rounded"
                    >{{ entry.numPiece }}</span
                  >
                </td>
                <td class="px-3 py-2.5 text-xs font-mono text-muted-foreground">
                  {{ entry.numFacture || '—' }}
                </td>
                <td class="px-3 py-2.5">
                  <span
                    class="text-xs font-mono font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded"
                    >{{ entry.numCompteGen }}</span
                  >
                </td>
                <td class="px-3 py-2.5">
                  <span
                    v-if="entry.numCompteTiers"
                    class="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded"
                    >{{ entry.numCompteTiers }}</span
                  >
                  <span v-else class="text-muted-foreground/30 text-xs">—</span>
                </td>
                <td class="px-3 py-2.5">
                  <div class="flex items-center gap-2">
                    <span class="text-sm text-foreground truncate max-w-[180px]">{{
                      entry.libelle
                    }}</span>
                    <span
                      class="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full shrink-0"
                      :class="statutColor[entry.statut]"
                    >
                      <span
                        class="w-1.5 h-1.5 rounded-full"
                        :class="statutDot[entry.statut]"
                      ></span>
                      {{ entry.statut }}
                    </span>
                  </div>
                </td>
                <td class="px-3 py-2.5 text-right">
                  <span
                    v-if="entry.debit"
                    class="font-mono font-semibold text-foreground text-sm"
                    >{{ fmt(entry.debit) }}</span
                  >
                  <span v-else class="text-muted-foreground/30 text-xs">—</span>
                </td>
                <td class="px-3 py-2.5 text-right">
                  <span v-if="entry.credit" class="font-mono text-muted-foreground text-sm">{{
                    fmt(entry.credit)
                  }}</span>
                  <span v-else class="text-muted-foreground/30 text-xs">—</span>
                </td>

                <!-- ACTIONS -->
                <td class="px-3 py-2.5">
                  <div class="flex items-center justify-center gap-1">
                    <!-- Voir -->
                    <button
                      @click.stop="openDetail(entry)"
                      title="Voir les détails"
                      class="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                    >
                      <svg
                        class="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                    <!-- Modifier -->
                    <button
                      @click.stop="openEdit(entry, $event)"
                      title="Modifier"
                      class="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-amber-600 hover:bg-amber-50 transition-all"
                    >
                      <svg
                        class="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <!-- Supprimer -->
                    <button
                      @click.stop="askDelete(entry, $event)"
                      title="Supprimer"
                      class="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                    >
                      <svg
                        class="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </template>

            <tr v-if="!pagedEcritures.length">
              <td colspan="9" class="text-center py-16 text-muted-foreground text-sm">
                <svg
                  class="w-10 h-10 mx-auto mb-3 text-border"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Aucune écriture pour cette période
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ── CARTES MOBILE ───────────────────────────────────────────── -->
      <div class="md:hidden divide-y divide-border">
        <div
          v-for="entry in pagedEcritures"
          :key="entry.id"
          class="px-4 py-3.5 transition-colors"
          :class="pieceGroups[entry.numPiece] === 1 ? 'bg-muted/30' : 'bg-card'"
        >
          <div class="flex items-start justify-between gap-2 mb-1.5">
            <div class="flex items-center gap-1.5 flex-wrap min-w-0">
              <span
                class="text-xs font-mono font-bold text-foreground bg-muted px-1.5 py-0.5 rounded shrink-0"
                >{{ entry.numPiece }}</span
              >
              <span
                class="text-xs font-mono font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded shrink-0"
                >{{ entry.numCompteGen }}</span
              >
              <span
                v-if="entry.numCompteTiers"
                class="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0"
                >{{ entry.numCompteTiers }}</span
              >
            </div>
            <span
              class="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full shrink-0"
              :class="statutColor[entry.statut]"
            >
              <span class="w-1.5 h-1.5 rounded-full" :class="statutDot[entry.statut]"></span>
              {{ entry.statut }}
            </span>
          </div>
          <p class="text-sm text-foreground truncate mb-2">{{ entry.libelle }}</p>
          <div class="flex items-center justify-between mt-2 pt-2 border-t border-border">
            <div class="flex gap-4">
              <div v-if="entry.debit">
                <p class="text-xs text-muted-foreground">Débit</p>
                <p class="text-sm font-mono font-bold text-foreground">{{ fmt(entry.debit) }}</p>
              </div>
              <div v-if="entry.credit">
                <p class="text-xs text-muted-foreground">Crédit</p>
                <p class="text-sm font-mono font-semibold text-muted-foreground">
                  {{ fmt(entry.credit) }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-1">
              <button
                @click="openDetail(entry)"
                class="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>
              <button
                @click="openEdit(entry, $event)"
                class="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-amber-600 hover:bg-amber-50 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                @click="askDelete(entry, $event)"
                class="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div v-if="!pagedEcritures.length" class="text-center py-16 text-muted-foreground text-sm">
          <svg
            class="w-10 h-10 mx-auto mb-3 text-border"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Aucune écriture pour cette période
        </div>
      </div>
    </div>
  </div>

  <!-- ══════════════════════════════════════════════════════════════════
       MODAL — VOIR DÉTAILS
  ══════════════════════════════════════════════════════════════════ -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showDetailModal && selectedEntry"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/40 backdrop-blur-sm"
        @click.self="showDetailModal = false"
      >
        <div
          class="bg-card rounded-t-2xl sm:rounded-2xl shadow-xl border border-border w-full sm:max-w-md p-6 space-y-4 max-h-[85vh] overflow-y-auto"
        >
          <div class="flex items-start justify-between">
            <div class="min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span
                  class="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full"
                  :class="statutColor[selectedEntry.statut]"
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full"
                    :class="statutDot[selectedEntry.statut]"
                  ></span>
                  {{ selectedEntry.statut }}
                </span>
                <span
                  class="text-sm font-mono font-bold text-foreground bg-muted px-2 py-0.5 rounded"
                  >{{ selectedEntry.numPiece }}</span
                >
              </div>
              <p class="text-sm text-muted-foreground mt-1.5 leading-snug">
                {{ selectedEntry.libelle }}
              </p>
            </div>
            <button
              @click="showDetailModal = false"
              class="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors ml-2 shrink-0"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div class="bg-muted/40 rounded-xl border border-border p-4 space-y-3">
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p class="text-xs text-muted-foreground mb-0.5">Jour</p>
                <p class="font-mono font-semibold text-foreground">
                  {{ String(selectedEntry.jour).padStart(2, '0') }}
                </p>
              </div>
              <div>
                <p class="text-xs text-muted-foreground mb-0.5">N° Facture</p>
                <p class="font-mono text-foreground">{{ selectedEntry.numFacture || '—' }}</p>
              </div>
              <div>
                <p class="text-xs text-muted-foreground mb-0.5">Cpte général</p>
                <p class="font-mono font-semibold text-primary">{{ selectedEntry.numCompteGen }}</p>
              </div>
              <div>
                <p class="text-xs text-muted-foreground mb-0.5">Cpte tiers</p>
                <p class="font-mono text-muted-foreground">
                  {{ selectedEntry.numCompteTiers || '—' }}
                </p>
              </div>
            </div>
            <div class="border-t border-border pt-3 grid grid-cols-2 gap-3">
              <div>
                <p class="text-xs text-muted-foreground mb-0.5">Débit</p>
                <p class="font-mono font-bold text-foreground text-base">
                  {{ selectedEntry.debit ? fmt(selectedEntry.debit) + ' FCFA' : '—' }}
                </p>
              </div>
              <div>
                <p class="text-xs text-muted-foreground mb-0.5">Crédit</p>
                <p class="font-mono font-semibold text-muted-foreground text-base">
                  {{ selectedEntry.credit ? fmt(selectedEntry.credit) + ' FCFA' : '—' }}
                </p>
              </div>
            </div>
          </div>
          <div>
            <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Statut de la pièce {{ selectedEntry.numPiece }}
            </p>
            <div class="flex gap-2">
              <button
                v-for="s in ['Payé', 'En attente', 'Annulé']"
                :key="s"
                @click="changeStatut(selectedEntry, s)"
                class="flex-1 text-xs font-semibold py-2 rounded-lg border transition-colors"
                :class="
                  selectedEntry.statut === s
                    ? 'bg-primary text-white border-primary'
                    : 'text-muted-foreground border-border hover:bg-muted'
                "
              >
                {{ s }}
              </button>
            </div>
          </div>
          <div class="flex gap-2 pt-1">
            <button
              @click="openEdit(selectedEntry, $event)"
              class="flex-1 flex items-center justify-center gap-2 text-sm font-medium border border-border rounded-lg py-2 text-foreground hover:bg-muted transition-colors"
            >
              <svg
                class="w-4 h-4 text-amber-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Modifier
            </button>
            <button
              @click="askDelete(selectedEntry, $event)"
              class="flex-1 flex items-center justify-center gap-2 text-sm font-medium border border-destructive/20 rounded-lg py-2 text-destructive hover:bg-destructive/5 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- ══════════════════════════════════════════════════════════════════
       MODAL — MODIFIER
  ══════════════════════════════════════════════════════════════════ -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div
        v-if="showEditModal"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/40 backdrop-blur-sm"
        @click.self="showEditModal = false"
      >
        <div
          class="bg-card rounded-t-2xl sm:rounded-2xl shadow-xl border border-border w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto"
        >
          <div
            class="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-card z-10"
          >
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <svg
                  class="w-4 h-4 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <div>
                <h2 class="text-base font-semibold text-foreground">Modifier l'écriture</h2>
                <p class="text-xs text-muted-foreground mt-0.5">
                  {{ editForm.numPiece }} · Ligne {{ editForm.id }}
                </p>
              </div>
            </div>
            <button
              @click="showEditModal = false"
              class="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div class="p-6 space-y-5">
            <div>
              <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                En-tête de pièce
              </p>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                    >Jour <span class="text-destructive">*</span></label
                  >
                  <input
                    v-model.number="editForm.jour"
                    type="number"
                    min="1"
                    max="31"
                    class="w-full text-sm border border-border rounded-lg px-3 py-2 font-mono bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                    >N° Pièce <span class="text-destructive">*</span></label
                  >
                  <input
                    v-model="editForm.numPiece"
                    type="text"
                    class="w-full text-sm border border-border rounded-lg px-3 py-2 font-mono bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                    >N° Facture</label
                  >
                  <input
                    v-model="editForm.numFacture"
                    type="text"
                    class="w-full text-sm border border-border rounded-lg px-3 py-2 font-mono bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                    >Statut</label
                  >
                  <div class="relative">
                    <select
                      v-model="editForm.statut"
                      class="w-full appearance-none text-sm border border-border rounded-lg px-3 py-2 pr-8 bg-background text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    >
                      <option>En attente</option>
                      <option>Payé</option>
                      <option>Annulé</option>
                    </select>
                    <svg
                      class="w-3.5 h-3.5 text-muted-foreground absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2.5"
                        d="M6 9l6 6 6-6"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div class="border-t border-border"></div>
            <div>
              <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Ligne d'écriture
              </p>
              <div class="grid grid-cols-2 gap-3 mb-3">
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                    >N° Compte général <span class="text-destructive">*</span></label
                  >
                  <input
                    v-model="editForm.numCompteGen"
                    type="text"
                    class="w-full text-sm border border-border rounded-lg px-3 py-2 font-mono bg-background text-primary font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                    >N° Compte tiers</label
                  >
                  <input
                    v-model="editForm.numCompteTiers"
                    type="text"
                    class="w-full text-sm border border-border rounded-lg px-3 py-2 font-mono bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                </div>
              </div>
              <div class="space-y-1.5 mb-3">
                <label class="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                  >Libellé écriture <span class="text-destructive">*</span></label
                >
                <input
                  v-model="editForm.libelle"
                  type="text"
                  class="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                    >Débit (FCFA)</label
                  >
                  <input
                    v-model.number="editForm.debit"
                    type="number"
                    min="0"
                    class="w-full text-sm border border-border rounded-lg px-3 py-2 font-mono text-right bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                    >Crédit (FCFA)</label
                  >
                  <input
                    v-model.number="editForm.credit"
                    type="number"
                    min="0"
                    class="w-full text-sm border border-border rounded-lg px-3 py-2 font-mono text-right bg-background text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                </div>
              </div>
            </div>
            <div class="flex flex-col-reverse sm:flex-row gap-2 pt-1">
              <button
                @click="showEditModal = false"
                class="w-full sm:w-auto text-sm text-muted-foreground border border-border rounded-lg px-4 py-2 hover:bg-muted hover:text-foreground transition-colors"
              >
                Annuler
              </button>
              <button
                @click="saveEdit"
                :disabled="!editForm.numCompteGen || !editForm.libelle"
                class="w-full sm:flex-1 text-sm font-semibold bg-primary text-white rounded-lg px-6 py-2 hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Enregistrer les modifications
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- ══════════════════════════════════════════════════════════════════
       MODAL — CONFIRMER SUPPRESSION
  ══════════════════════════════════════════════════════════════════ -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="showDeleteModal && entryToDelete"
        class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="showDeleteModal = false"
      >
        <div
          class="bg-card rounded-2xl shadow-xl border border-border w-full max-w-sm p-6 space-y-5"
        >
          <div class="flex flex-col items-center text-center gap-3">
            <div class="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <svg
                class="w-6 h-6 text-destructive"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-base font-semibold text-foreground">Supprimer cette ligne ?</h3>
              <p class="text-sm text-muted-foreground mt-1">Cette action est irréversible.</p>
            </div>
          </div>
          <div class="bg-muted/50 rounded-xl border border-border px-4 py-3 space-y-1.5">
            <div class="flex items-center gap-2">
              <span
                class="text-xs font-mono font-bold text-foreground bg-muted px-1.5 py-0.5 rounded"
                >{{ entryToDelete.numPiece }}</span
              >
              <span
                class="text-xs font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded font-semibold"
                >{{ entryToDelete.numCompteGen }}</span
              >
            </div>
            <p class="text-sm text-foreground truncate">{{ entryToDelete.libelle }}</p>
            <p class="text-xs text-muted-foreground font-mono">
              <span v-if="entryToDelete.debit">Débit : {{ fmt(entryToDelete.debit) }} FCFA</span>
              <span v-if="entryToDelete.credit">Crédit : {{ fmt(entryToDelete.credit) }} FCFA</span>
            </p>
          </div>
          <div class="flex gap-3">
            <button
              @click="showDeleteModal = false"
              class="flex-1 text-sm font-medium text-foreground border border-border rounded-lg py-2.5 hover:bg-muted transition-colors"
            >
              Annuler
            </button>
            <button
              @click="confirmDelete"
              class="flex-1 text-sm font-semibold text-white bg-destructive rounded-lg py-2.5 hover:bg-destructive/90 transition-colors flex items-center justify-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
