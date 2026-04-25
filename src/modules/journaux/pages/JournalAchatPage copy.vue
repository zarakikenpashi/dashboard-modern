<script setup>
import { ref, computed, reactive } from 'vue'

// ─── STATE ───────────────────────────────────────────────────────────────────
const searchQuery = ref('')
const filterStatut = ref('all')
const showModal = ref(false)
const showSaisieModal = ref(false)
const selectedEntry = ref(null)
const periodeLabel = ref('Janvier 2026')
const ancienSolde = ref(0)

// Formulaire de saisie
const form = reactive({
  jour: new Date().getDate(),
  numPiece: '',
  numFacture: '',
  numCompteGen: '',
  numCompteTiers: '',
  libelle: '',
  debit: '',
  credit: '',
  statut: 'En attente',
})

// ─── DONNÉES ─────────────────────────────────────────────────────────────────
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

// ─── COMPUTED ────────────────────────────────────────────────────────────────
const totalDebit = computed(() => ecritures.value.reduce((s, e) => s + e.debit, 0))
const totalCredit = computed(() => ecritures.value.reduce((s, e) => s + e.credit, 0))
const nouveauSolde = computed(() => ancienSolde.value + totalDebit.value - totalCredit.value)

const filteredEcritures = computed(() =>
  ecritures.value.filter((e) => {
    const q = searchQuery.value.toLowerCase()
    const matchQ =
      !q ||
      e.libelle.toLowerCase().includes(q) ||
      e.numPiece.toLowerCase().includes(q) ||
      e.numCompteGen.includes(q) ||
      e.numCompteTiers.includes(q) ||
      e.numFacture.toLowerCase().includes(q)
    const matchS = filterStatut.value === 'all' || e.statut === filterStatut.value
    return matchQ && matchS
  }),
)

const filteredDebit = computed(() => filteredEcritures.value.reduce((s, e) => s + e.debit, 0))
const filteredCredit = computed(() => filteredEcritures.value.reduce((s, e) => s + e.credit, 0))

// Alternance de couleur par pièce
const pieceGroups = computed(() => {
  const groups = {}
  let idx = 0
  ecritures.value.forEach((e) => {
    if (!(e.numPiece in groups)) groups[e.numPiece] = idx++ % 2
  })
  return groups
})

// Lignes de la pièce en cours de saisie
const lignesPiece = computed(() => ecritures.value.filter((e) => e.numPiece === form.numPiece))
const debitPiece = computed(() => lignesPiece.value.reduce((s, e) => s + e.debit, 0))
const creditPiece = computed(() => lignesPiece.value.reduce((s, e) => s + e.credit, 0))
const equilibre = computed(() => debitPiece.value - creditPiece.value)

// ─── MÉTHODES ────────────────────────────────────────────────────────────────
function fmt(n) {
  if (!n || n === 0) return '—'
  return new Intl.NumberFormat('fr-FR').format(Math.round(n))
}
function fmtFull(n) {
  return new Intl.NumberFormat('fr-FR').format(Math.round(n)) + ' FCFA'
}

function genNumPiece() {
  const pieces = [...new Set(ecritures.value.map((e) => e.numPiece))]
  return `ACH-${String(pieces.length + 1).padStart(3, '0')}`
}

function openSaisie() {
  Object.assign(form, {
    jour: new Date().getDate(),
    numPiece: genNumPiece(),
    numFacture: '',
    numCompteGen: '',
    numCompteTiers: '',
    libelle: '',
    debit: '',
    credit: '',
    statut: 'En attente',
  })
  showSaisieModal.value = true
}

function saveLigne() {
  if (!form.numCompteGen || !form.libelle) return
  ecritures.value.push({
    id: Date.now(),
    jour: Number(form.jour),
    numPiece: form.numPiece,
    numFacture: form.numFacture,
    numCompteGen: form.numCompteGen,
    numCompteTiers: form.numCompteTiers,
    libelle: form.libelle,
    debit: Number(form.debit) || 0,
    credit: Number(form.credit) || 0,
    statut: form.statut,
  })
  // Réinitialiser seulement la ligne, pas la pièce
  form.numCompteGen = ''
  form.numCompteTiers = ''
  form.libelle = ''
  form.debit = ''
  form.credit = ''
}

function openDetail(e) {
  selectedEntry.value = e
  showModal.value = true
}

function deleteEntry(id) {
  if (confirm("Supprimer cette ligne d'écriture ?")) {
    ecritures.value = ecritures.value.filter((e) => e.id !== id)
    showModal.value = false
  }
}

function changeStatut(entry, statut) {
  const piece = entry.numPiece
  ecritures.value.forEach((e) => {
    if (e.numPiece === piece) e.statut = statut
  })
  showModal.value = false
}

const statutColor = {
  Payé: 'text-emerald-600 bg-emerald-50',
  'En attente': 'text-amber-600 bg-amber-50',
  Annulé: 'text-red-500 bg-red-50',
}
const statutDot = {
  Payé: 'bg-emerald-500',
  'En attente': 'bg-amber-400',
  Annulé: 'bg-red-400',
}
</script>

<template>
  <div class="p-4 sm:p-6 space-y-4 sm:space-y-5">
    <!-- ── HEADER ───────────────────────────────────────────────────────── -->
    <div class="flex items-center justify-between gap-3">
      <div class="min-w-0">
        <h1 class="text-xl font-semibold text-gray-900 truncate">Journal des Achats</h1>
        <p class="text-sm text-gray-400 mt-0.5 hidden sm:block">
          Journal : ACHATS LOCAUX / {{ periodeLabel }}
        </p>
      </div>
      <button
        @click="openSaisie"
        class="flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors shrink-0"
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

    <!-- ── BANDEAU SOLDES ────────────────────────────────────────────────── -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm">
      <div
        class="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100"
      >
        <div class="flex items-center justify-between sm:block px-5 py-4 gap-3">
          <span class="text-xs font-medium text-gray-400 uppercase tracking-wide block mb-1"
            >Ancien solde</span
          >
          <div class="flex items-center gap-2">
            <input
              v-model.number="ancienSolde"
              type="number"
              class="w-36 text-right text-sm font-semibold text-gray-700 border-b border-dashed border-gray-300 focus:outline-none focus:border-gray-500 bg-transparent"
            />
            <span class="text-xs text-gray-400 shrink-0">FCFA</span>
          </div>
        </div>

        <div class="flex items-center justify-between sm:block px-5 py-4 gap-3">
          <span class="text-xs font-medium text-gray-400 uppercase tracking-wide block mb-1"
            >Totaux journal</span
          >
          <div class="flex items-center gap-5">
            <div>
              <p class="text-xs text-gray-400">Débit</p>
              <p class="text-sm font-semibold text-gray-800 font-mono">{{ fmtFull(totalDebit) }}</p>
            </div>
            <div class="w-px h-8 bg-gray-100 hidden sm:block"></div>
            <div>
              <p class="text-xs text-gray-400">Crédit</p>
              <p class="text-sm font-semibold text-gray-500 font-mono">
                {{ fmtFull(totalCredit) }}
              </p>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between sm:block px-5 py-4 gap-3">
          <span class="text-xs font-medium text-gray-400 uppercase tracking-wide block mb-1"
            >Nouveau solde</span
          >
          <p
            class="text-lg font-bold font-mono"
            :class="nouveauSolde >= 0 ? 'text-emerald-600' : 'text-red-500'"
          >
            {{ fmtFull(nouveauSolde) }}
          </p>
        </div>
      </div>
    </div>

    <!-- ── TABLEAU JOURNAL ───────────────────────────────────────────────── -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <!-- Toolbar -->
      <div class="px-4 sm:px-5 py-4 border-b border-gray-100 space-y-3">
        <div class="flex flex-col sm:flex-row gap-3">
          <!-- Période éditable -->
          <div class="flex items-center gap-2 text-sm text-gray-500 shrink-0">
            <svg
              class="w-4 h-4 text-gray-400"
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
              class="text-sm font-medium text-gray-700 border-b border-dashed border-gray-300 focus:outline-none focus:border-gray-500 bg-transparent w-36"
            />
          </div>

          <!-- Search -->
          <div class="relative flex-1">
            <svg
              class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
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
              placeholder="Libellé, N° pièce, N° compte..."
              class="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 bg-gray-50"
            />
          </div>

          <div class="flex gap-2">
            <select
              v-model="filterStatut"
              class="flex-1 sm:flex-none text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none text-gray-700"
            >
              <option value="all">Tous</option>
              <option value="Payé">Payé</option>
              <option value="En attente">En attente</option>
              <option value="Annulé">Annulé</option>
            </select>
            <button
              class="flex items-center gap-1.5 text-sm text-gray-500 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors shrink-0"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span class="hidden sm:inline">Exporter</span>
            </button>
          </div>
        </div>
      </div>

      <!-- ── TABLE DESKTOP ─────────────────────────────────────────────── -->
      <div class="hidden md:block overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200">
              <th
                class="text-center text-xs font-semibold text-gray-400 uppercase tracking-wide px-3 py-3 w-14"
              >
                Jour
              </th>
              <th
                class="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-3 py-3 w-28"
              >
                N°Pièce
              </th>
              <th
                class="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-3 py-3 w-28"
              >
                N°Facture
              </th>
              <th
                class="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-3 py-3 w-30"
              >
                N°Cpte Gén.
              </th>
              <th
                class="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-3 py-3 w-30"
              >
                N°Cpte Tiers
              </th>
              <th
                class="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-3 py-3"
              >
                Libellé écriture
              </th>
              <th
                class="text-right text-xs font-semibold text-gray-400 uppercase tracking-wide px-3 py-3 w-36"
              >
                Débit
              </th>
              <th
                class="text-right text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3 w-36"
              >
                Crédit
              </th>
              <th class="w-8 px-2 py-3"></th>
            </tr>
          </thead>
          <tbody>
            <template v-for="entry in filteredEcritures" :key="entry.id">
              <tr
                @click="openDetail(entry)"
                class="border-b border-gray-100 cursor-pointer transition-colors group"
                :class="[
                  pieceGroups[entry.numPiece] === 1 ? 'bg-gray-50/70' : 'bg-white',
                  'hover:bg-indigo-50/30',
                ]"
              >
                <td class="px-3 py-2.5 text-center">
                  <span class="text-xs font-mono font-semibold text-gray-600">{{
                    String(entry.jour).padStart(2, '0')
                  }}</span>
                </td>
                <td class="px-3 py-2.5">
                  <span
                    class="text-xs font-mono font-bold text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded"
                    >{{ entry.numPiece }}</span
                  >
                </td>
                <td class="px-3 py-2.5 text-xs font-mono text-gray-500">
                  {{ entry.numFacture || '—' }}
                </td>
                <td class="px-3 py-2.5">
                  <span
                    class="text-xs font-mono font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded"
                    >{{ entry.numCompteGen }}</span
                  >
                </td>
                <td class="px-3 py-2.5">
                  <span
                    v-if="entry.numCompteTiers"
                    class="text-xs font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded"
                    >{{ entry.numCompteTiers }}</span
                  >
                  <span v-else class="text-gray-300 text-xs">—</span>
                </td>
                <td class="px-3 py-2.5">
                  <div class="flex items-center gap-2">
                    <span class="text-sm text-gray-700 truncate max-w-xs">{{ entry.libelle }}</span>
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
                  <span v-if="entry.debit" class="font-mono font-semibold text-gray-900 text-sm">{{
                    fmt(entry.debit)
                  }}</span>
                  <span v-else class="text-gray-300 text-xs">—</span>
                </td>
                <td class="px-4 py-2.5 text-right">
                  <span v-if="entry.credit" class="font-mono text-gray-500 text-sm">{{
                    fmt(entry.credit)
                  }}</span>
                  <span v-else class="text-gray-300 text-xs">—</span>
                </td>
                <td class="px-2 py-2.5">
                  <button
                    class="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-200 transition-all"
                  >
                    <svg
                      class="w-3.5 h-3.5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            </template>

            <tr v-if="!filteredEcritures.length">
              <td colspan="9" class="text-center py-16 text-gray-400 text-sm">
                <svg
                  class="w-10 h-10 mx-auto mb-3 text-gray-200"
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

          <!-- TFOOT totaux -->
          <tfoot v-if="filteredEcritures.length">
            <tr class="bg-gray-900">
              <td
                colspan="5"
                class="px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide"
              >
                {{ filteredEcritures.length }} ligne(s)
              </td>
              <td class="px-3 py-3 text-xs text-gray-500">Total période</td>
              <td class="px-3 py-3 text-right font-mono font-bold text-white text-sm">
                {{ fmtFull(filteredDebit) }}
              </td>
              <td class="px-4 py-3 text-right font-mono font-semibold text-gray-400 text-sm">
                {{ fmtFull(filteredCredit) }}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- ── CARTES MOBILE ─────────────────────────────────────────────── -->
      <div class="md:hidden divide-y divide-gray-100">
        <div
          v-for="entry in filteredEcritures"
          :key="entry.id"
          @click="openDetail(entry)"
          class="px-4 py-3.5 cursor-pointer transition-colors active:bg-gray-50"
          :class="pieceGroups[entry.numPiece] === 1 ? 'bg-gray-50/60' : ''"
        >
          <!-- Ligne 1 : pièce + comptes + statut -->
          <div class="flex items-start justify-between gap-2 mb-1.5">
            <div class="flex items-center gap-2 flex-wrap min-w-0">
              <span
                class="text-xs font-mono font-bold text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded shrink-0"
                >{{ entry.numPiece }}</span
              >
              <span
                class="text-xs font-mono font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded shrink-0"
                >{{ entry.numCompteGen }}</span
              >
              <span
                v-if="entry.numCompteTiers"
                class="text-xs font-mono text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded shrink-0"
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
          <!-- Libellé -->
          <p class="text-sm text-gray-700 truncate mb-1">{{ entry.libelle }}</p>
          <!-- Jour + Facture + Montants -->
          <div class="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
            <div class="flex items-center gap-3 text-xs text-gray-400">
              <span
                >Jour
                <strong class="text-gray-600 font-mono">{{
                  String(entry.jour).padStart(2, '0')
                }}</strong></span
              >
              <span v-if="entry.numFacture"
                >Fact. <strong class="text-gray-600 font-mono">{{ entry.numFacture }}</strong></span
              >
            </div>
            <div class="flex gap-4">
              <div v-if="entry.debit" class="text-right">
                <p class="text-xs text-gray-400">Débit</p>
                <p class="text-sm font-mono font-bold text-gray-900">{{ fmt(entry.debit) }}</p>
              </div>
              <div v-if="entry.credit" class="text-right">
                <p class="text-xs text-gray-400">Crédit</p>
                <p class="text-sm font-mono font-semibold text-gray-500">{{ fmt(entry.credit) }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!filteredEcritures.length" class="text-center py-16 text-gray-400 text-sm">
          <svg
            class="w-10 h-10 mx-auto mb-3 text-gray-200"
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

        <!-- Totaux mobile -->
        <div
          v-if="filteredEcritures.length"
          class="bg-gray-900 px-4 py-3.5 flex justify-between items-center"
        >
          <div>
            <p class="text-xs text-gray-500 uppercase tracking-wide">Totaux</p>
            <p class="text-xs text-gray-500 mt-0.5">{{ filteredEcritures.length }} ligne(s)</p>
          </div>
          <div class="flex gap-6">
            <div class="text-right">
              <p class="text-xs text-gray-500 mb-0.5">Débit</p>
              <p class="text-sm font-mono font-bold text-white">{{ fmtFull(filteredDebit) }}</p>
            </div>
            <div class="text-right">
              <p class="text-xs text-gray-500 mb-0.5">Crédit</p>
              <p class="text-sm font-mono font-semibold text-gray-400">
                {{ fmtFull(filteredCredit) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ── MODAL SAISIE ──────────────────────────────────────────────────────── -->
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
        v-if="showSaisieModal"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/30 backdrop-blur-sm"
        @click.self="showSaisieModal = false"
      >
        <div
          class="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto"
        >
          <!-- Header -->
          <div
            class="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10"
          >
            <div>
              <h2 class="text-base font-semibold text-gray-900">Saisie d'écriture</h2>
              <p class="text-xs text-gray-400 mt-0.5">Journal ACHATS LOCAUX · {{ periodeLabel }}</p>
            </div>
            <button
              @click="showSaisieModal = false"
              class="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"
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
            <!-- En-tête pièce -->
            <div>
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                En-tête de pièce
              </p>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div class="space-y-1.5">
                  <label class="text-xs font-medium text-gray-500"
                    >Jour <span class="text-red-400">*</span></label
                  >
                  <input
                    v-model.number="form.jour"
                    type="number"
                    min="1"
                    max="31"
                    class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10 bg-gray-50 font-mono"
                    placeholder="01"
                  />
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-medium text-gray-500"
                    >N° Pièce <span class="text-red-400">*</span></label
                  >
                  <input
                    v-model="form.numPiece"
                    type="text"
                    class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10 bg-gray-50 font-mono"
                    placeholder="ACH-001"
                  />
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-medium text-gray-500">N° Facture</label>
                  <input
                    v-model="form.numFacture"
                    type="text"
                    class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10 bg-gray-50 font-mono"
                    placeholder="F-XXXX"
                  />
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-medium text-gray-500">Statut</label>
                  <select
                    v-model="form.statut"
                    class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10 bg-gray-50"
                  >
                    <option>En attente</option>
                    <option>Payé</option>
                    <option>Annulé</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="border-t border-gray-100"></div>

            <!-- Ligne comptable -->
            <div>
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Ligne d'écriture
              </p>
              <div class="grid grid-cols-2 gap-3 mb-3">
                <div class="space-y-1.5">
                  <label class="text-xs font-medium text-gray-500"
                    >N° Compte général <span class="text-red-400">*</span></label
                  >
                  <input
                    v-model="form.numCompteGen"
                    type="text"
                    class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 bg-gray-50 font-mono"
                    placeholder="601000"
                  />
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-medium text-gray-500">N° Compte tiers</label>
                  <input
                    v-model="form.numCompteTiers"
                    type="text"
                    class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10 bg-gray-50 font-mono"
                    placeholder="401001"
                  />
                </div>
              </div>
              <div class="space-y-1.5 mb-3">
                <label class="text-xs font-medium text-gray-500"
                  >Libellé écriture <span class="text-red-400">*</span></label
                >
                <input
                  v-model="form.libelle"
                  type="text"
                  class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10 bg-gray-50"
                  placeholder="Achat marchandises - Fournisseur X"
                />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div class="space-y-1.5">
                  <label class="text-xs font-medium text-gray-500">Débit (FCFA)</label>
                  <input
                    v-model.number="form.debit"
                    type="number"
                    min="0"
                    class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10 bg-gray-50 font-mono text-right"
                    placeholder="0"
                  />
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-medium text-gray-500">Crédit (FCFA)</label>
                  <input
                    v-model.number="form.credit"
                    type="number"
                    min="0"
                    class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10 bg-gray-50 font-mono text-right"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <!-- Récap pièce en cours -->
            <div
              v-if="lignesPiece.length"
              class="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden"
            >
              <div class="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between">
                <p class="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Pièce {{ form.numPiece }}
                </p>
                <div class="flex items-center gap-3 text-xs font-mono">
                  <span class="text-gray-800 font-semibold">D: {{ fmt(debitPiece) || '0' }}</span>
                  <span class="text-gray-400">C: {{ fmt(creditPiece) || '0' }}</span>
                  <span
                    class="px-2 py-0.5 rounded-full font-semibold"
                    :class="
                      equilibre === 0
                        ? 'text-emerald-600 bg-emerald-50'
                        : 'text-amber-600 bg-amber-50'
                    "
                  >
                    {{ equilibre === 0 ? '✓ Équilibrée' : `Écart: ${fmt(Math.abs(equilibre))}` }}
                  </span>
                </div>
              </div>
              <div
                v-for="l in lignesPiece"
                :key="l.id"
                class="px-4 py-2 flex items-center gap-3 text-xs border-b border-gray-100 last:border-0"
              >
                <span class="font-mono text-indigo-600 w-16 shrink-0">{{ l.numCompteGen }}</span>
                <span class="text-gray-600 flex-1 truncate">{{ l.libelle }}</span>
                <span
                  v-if="l.debit"
                  class="font-mono font-semibold text-gray-800 shrink-0 w-24 text-right"
                  >{{ fmt(l.debit) }}</span
                >
                <span v-if="l.credit" class="font-mono text-gray-400 shrink-0 w-24 text-right">{{
                  fmt(l.credit)
                }}</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-col-reverse sm:flex-row gap-2 pt-1">
              <button
                @click="showSaisieModal = false"
                class="w-full sm:w-auto text-sm text-gray-500 border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors"
              >
                Fermer
              </button>
              <button
                @click="saveLigne"
                :disabled="!form.numCompteGen || !form.libelle"
                class="w-full sm:flex-1 text-sm font-medium bg-gray-900 text-white rounded-lg px-6 py-2 hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Ajouter la ligne
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- ── MODAL DÉTAIL LIGNE ────────────────────────────────────────────────── -->
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
        v-if="showModal && selectedEntry"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/30 backdrop-blur-sm"
        @click.self="showModal = false"
      >
        <div
          class="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md p-6 space-y-4 max-h-[85vh] overflow-y-auto"
        >
          <div class="flex items-start justify-between">
            <div class="min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span
                  class="text-sm font-mono font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded"
                  >{{ selectedEntry.numPiece }}</span
                >
                <span class="text-sm font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{{
                  selectedEntry.numCompteGen
                }}</span>
              </div>
              <p class="text-sm text-gray-500 mt-1 truncate">{{ selectedEntry.libelle }}</p>
            </div>
            <button
              @click="showModal = false"
              class="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 ml-2 shrink-0"
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

          <div class="space-y-2.5 bg-gray-50 rounded-xl p-4">
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p class="text-xs text-gray-400 mb-0.5">Jour</p>
                <p class="font-mono font-semibold text-gray-700">
                  {{ String(selectedEntry.jour).padStart(2, '0') }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-400 mb-0.5">N° Facture</p>
                <p class="font-mono text-gray-700">{{ selectedEntry.numFacture || '—' }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-400 mb-0.5">Cpte général</p>
                <p class="font-mono font-semibold text-indigo-600">
                  {{ selectedEntry.numCompteGen }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-400 mb-0.5">Cpte tiers</p>
                <p class="font-mono text-gray-500">{{ selectedEntry.numCompteTiers || '—' }}</p>
              </div>
            </div>
            <div class="border-t border-gray-200 pt-3 grid grid-cols-2 gap-3">
              <div>
                <p class="text-xs text-gray-400 mb-0.5">Débit</p>
                <p class="font-mono font-bold text-gray-900">
                  {{ selectedEntry.debit ? fmt(selectedEntry.debit) + ' FCFA' : '—' }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-400 mb-0.5">Crédit</p>
                <p class="font-mono font-semibold text-gray-500">
                  {{ selectedEntry.credit ? fmt(selectedEntry.credit) + ' FCFA' : '—' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Changer statut de toute la pièce -->
          <div>
            <p class="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
              Statut de la pièce {{ selectedEntry.numPiece }}
            </p>
            <div class="flex gap-2">
              <button
                v-for="s in ['Payé', 'En attente', 'Annulé']"
                :key="s"
                @click="changeStatut(selectedEntry, s)"
                class="flex-1 text-xs font-medium py-2 rounded-lg border transition-colors"
                :class="
                  selectedEntry.statut === s
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'text-gray-500 border-gray-200 hover:bg-gray-50'
                "
              >
                {{ s }}
              </button>
            </div>
          </div>

          <button
            @click="deleteEntry(selectedEntry.id)"
            class="w-full text-sm text-red-400 border border-red-100 rounded-lg py-2 hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Supprimer cette ligne
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
