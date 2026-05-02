<script setup>
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import ComboboxBase from '@/components/ui/ComboboxBase.vue'

const router = useRouter()

// ── DONNÉES ───────────────────────────────────────────────────────────────────
const accounts = [
  { code: '401000', name: 'Fournisseurs', type: 'Passif' },
  { code: '401001', name: 'Acme Fournitures', type: 'Passif' },
  { code: '401002', name: 'Tech Solutions CI', type: 'Passif' },
  { code: '445660', name: 'TVA déductible', type: 'Actif' },
  { code: '601000', name: 'Achats marchandises', type: 'Charge' },
  { code: '602000', name: 'Achats matières prem.', type: 'Charge' },
  { code: '605000', name: 'Achats fournitures', type: 'Charge' },
  { code: '621000', name: 'Prestations de services', type: 'Charge' },
  { code: '218300', name: 'Équipements informatiques', type: 'Actif' },
]

const form = ref({
  date: new Date().toISOString().split('T')[0],
  numPiece: 'ACH-2026-001',
  statut: 'En attente',
  numFacture: '',
})

let nextId = 5
const journalEntries = ref([
  {
    id: 1,
    numFacture: 'F-081',
    numCompte: '601000',
    numCompteTiers: '401001',
    libelle: 'Achat fournitures bureau — Acme',
    debit: '85000',
    credit: '',
    type: 'debit',
    statut: 'En attente',
  },
  {
    id: 2,
    numFacture: 'F-081',
    numCompte: '445660',
    numCompteTiers: '',
    libelle: 'TVA déductible — Acme',
    debit: '15300',
    credit: '',
    type: 'debit',
    statut: 'En attente',
  },
  {
    id: 3,
    numFacture: 'F-081',
    numCompte: '401000',
    numCompteTiers: '401001',
    libelle: 'Fournisseur Acme Fournitures',
    debit: '',
    credit: '100300',
    type: 'credit',
    statut: 'En attente',
  },
])

// ── COMPUTED ──────────────────────────────────────────────────────────────────
const totalDebit = computed(() =>
  journalEntries.value.reduce((s, e) => s + (parseFloat(e.debit) || 0), 0),
)
const totalCredit = computed(() =>
  journalEntries.value.reduce((s, e) => s + (parseFloat(e.credit) || 0), 0),
)
const isBalanced = computed(
  () => totalDebit.value > 0 && Math.abs(totalDebit.value - totalCredit.value) < 0.01,
)

// ── MÉTHODES ──────────────────────────────────────────────────────────────────
const fmt = (n) => (n ? new Intl.NumberFormat('fr-FR').format(Math.round(n)) + ' FCFA' : '—')

const addRow = () => {
  journalEntries.value.push({
    id: nextId++,
    numFacture: '',
    numCompte: '',
    numCompteTiers: '',
    libelle: '',
    debit: '',
    credit: '',
    type: 'debit',
    statut: 'En attente',
  })
}

const removeSelected = () => {
  journalEntries.value = journalEntries.value.filter((e) => !e.selected)
}

const onDebitInput = (entry) => {
  if (entry.debit) entry.credit = ''
}
const onCreditInput = (entry) => {
  if (entry.credit) entry.debit = ''
}

// Sélection
const allSelected = computed({
  get: () => journalEntries.value.length > 0 && journalEntries.value.every((e) => e.selected),
  set: (v) => journalEntries.value.forEach((e) => (e.selected = v)),
})
const someSelected = computed(() => journalEntries.value.some((e) => e.selected))

const goToPage = () => router.push({ name: 'JournalCaisse' })

const framework = ref(null)

const frameworks = [
  { value: 'nuxt', label: 'Nuxt.js' },
  { value: 'vue', label: 'Vue Router' },
  { value: 'vite', label: 'Vite' },
]
</script>

<template>
  <div class="p-4 sm:p-6 space-y-5">
    <!-- ── PAGE HEADER ────────────────────────────────────────────── -->
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <div class="min-w-0">
        <h1 class="text-xl font-semibold text-foreground truncate">Saisie — Journal Caisse</h1>
        <p class="text-sm text-muted-foreground mt-0.5 hidden sm:block">
          Journal : CAISSE / {{ form.numPiece }}
        </p>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-2 flex-wrap">
        <!-- Voir plus (ghost) -->
        <button
          @click="goToPage"
          class="cursor-pointer flex items-center gap-1.5 text-sm font-medium text-muted-foreground border border-border rounded-lg px-3 py-2 hover:bg-muted hover:text-foreground transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 10h16M4 14h8"
            />
          </svg>
          <span class="hidden sm:inline">Voir journal</span>
        </button>

        <!-- Annuler (secondary) -->
        <button
          class="cursor-pointer flex items-center gap-1.5 text-sm font-medium text-foreground border border-border rounded-lg px-3 py-2 hover:bg-muted transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <span class="hidden sm:inline">Annuler</span>
        </button>

        <!-- Enregistrer (primary — indigo Axelor) -->
        <button
          class="cursor-pointer flex items-center gap-1.5 text-sm font-semibold text-white rounded-lg px-4 py-2 bg-primary hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="!isBalanced"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span class="hidden sm:inline">Enregistrer</span>
        </button>
      </div>
    </div>
    <!-- ── BASIC INFORMATION ───────────────────────────────────────── -->
    <div class="bg-card rounded-xl border border-border overflow-hidden">
      <!-- Header accordion -->
      <div class="flex items-center justify-between px-5 py-3.5 border-b border-border bg-muted/30">
        <h2 class="text-sm font-semibold text-foreground">Informations de base</h2>
      </div>

      <div class="p-5">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <!-- Date -->
          <div class="space-y-1.5">
            <label
              class="block text-xs font-semibold uppercase tracking-wide text-muted-foreground"
            >
              Date
            </label>
            <input
              v-model="form.date"
              type="date"
              class="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>

          <!-- N° Pièce -->
          <div class="space-y-1.5">
            <label
              class="block text-xs font-semibold uppercase tracking-wide text-muted-foreground"
            >
              N° Pièce
            </label>
            <input
              v-model="form.numPiece"
              type="text"
              placeholder="ACH-2026-001"
              class="w-full px-3 py-2 text-sm font-mono bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
          <!-- N° Facture -->
          <div class="space-y-1.5">
            <label
              class="block text-xs font-semibold uppercase tracking-wide text-muted-foreground"
            >
              N° Facture
            </label>
            <input
              v-model="form.numFacture"
              type="text"
              placeholder="F-XXX"
              class="w-full px-3 py-2 text-sm font-mono bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- ── JOURNAL ENTRIES ─────────────────────────────────────────── -->
    <div class="bg-card rounded-xl border border-border overflow-hidden">
      <!-- Header -->
      <div
        class="flex items-center justify-between px-5 py-3.5 border-b border-border bg-muted/30 flex-wrap gap-2"
      >
        <h2 class="text-sm font-semibold text-foreground">Lignes d'écriture</h2>
        <!-- ── TOTAUX ───────────────────────────────────────── -->
        <div class="hidden lg:grid grid-cols-1 sm:grid-cols-3 gap-4">
          <!-- Total Crédit -->
          <div class="space-y-1 flex items-center gap-1.5">
            <label class="text-xs font-semibold uppercase tracking-wide text-foreground">
              Total Crédit:
            </label>
            <div class="px-2 py-1 text-sm font-mono font-semibold text-muted-foreground text-right">
              {{ fmt(totalCredit) }}
            </div>
          </div>
          <!-- Total Débit -->
          <div class="space-y-1 flex items-center gap-1.5">
            <label class="text-xs font-semibold uppercase tracking-wide text-foreground">
              Total Débit:
            </label>
            <div class="px-2 py-1 text-sm font-mono font-semibold text-muted-foreground text-right">
              {{ fmt(totalDebit) }}
            </div>
          </div>
          <div
            v-if="totalDebit > 0 || totalCredit > 0"
            class="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-colors"
            :class="
              isBalanced
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            "
          >
            <svg
              v-if="isBalanced"
              class="w-3.5 h-3.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <svg
              v-else
              class="w-3.5 h-3.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span v-if="isBalanced">Écriture équilibrée ✓</span>
            <span v-else>
              Écart :
              <strong class="font-mono">
                {{ fmt(Math.abs(totalDebit - totalCredit)) }}
              </strong>
            </span>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button
            @click="addRow"
            class="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Ajouter
          </button>
          <button
            v-if="someSelected"
            @click="removeSelected"
            class="flex items-center gap-1.5 text-sm font-medium text-destructive hover:text-destructive/80 transition-colors"
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

      <div class="block overflow-auto" id="journal-table-wrapper">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-muted/40 border-b border-border">
              <th class="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  v-model="allSelected"
                  class="w-4 h-4 rounded border-border accent-primary cursor-pointer"
                />
              </th>
              <th
                class="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground w-32"
              >
                Statut
              </th>
              <th
                class="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground w-32"
              >
                N° Cpte Général
              </th>
              <th
                class="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground w-32"
              >
                N° Cpte Tiers
              </th>
              <th
                class="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                Libellé de l'écriture
              </th>
              <th
                class="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground w-36"
              >
                Débit
              </th>
              <th
                class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground w-36"
              >
                Crédit
              </th>
              <th class="w-8 px-2 py-3"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr
              v-for="entry in journalEntries"
              :key="entry.id"
              class="group hover:bg-muted/30 transition-colors"
              :class="entry.selected ? 'bg-primary/5' : ''"
            >
              <!-- Checkbox -->
              <td class="px-4 py-2.5">
                <input
                  type="checkbox"
                  v-model="entry.selected"
                  class="w-4 h-4 rounded border-border accent-primary cursor-pointer"
                />
              </td>
              <!-- Statut -->
              <td class="px-3 py-2.5">
                <div class="relative">
                  <select
                    v-model="entry.statut"
                    class="w-full appearance-none px-2 py-1.5 pr-7 text-xs font-mono bg-background border border-border rounded-md text-primary font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors cursor-pointer"
                  >
                    <option>En attente</option>
                    <option>Payé</option>
                    <option>Annulé</option>
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
              </td>

              <!-- N° Compte -->
              <td class="px-3 py-2.5">
                <div class="relative">
                  <select
                    v-model="entry.numCompte"
                    class="w-full appearance-none px-2 py-1.5 pr-7 text-xs font-mono bg-background border border-border rounded-md text-primary font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors cursor-pointer"
                  >
                    <option value="" disabled>— Compte —</option>
                    <option v-for="acc in accounts" :key="acc.code" :value="acc.code">
                      {{ acc.code }}
                    </option>
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
              </td>

              <!-- N° Compte Tiers -->
              <td class="px-3 py-2.5">
                <ComboboxBase
                  scroll-container="#journal-table-wrapper"
                  v-model="framework"
                  :items="frameworks"
                  placeholder="Sélectionner un framework…"
                  width="100%"
                />
              </td>

              <!-- Libellé -->
              <td class="px-3 py-2.5">
                <input
                  v-model="entry.libelle"
                  type="text"
                  placeholder="Libellé de l'écriture"
                  class="w-full px-2 py-1.5 text-sm bg-background border border-border rounded-md text-foreground placeholder-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </td>

              <!-- Débit -->
              <td class="px-3 py-2.5">
                <input
                  v-model="entry.debit"
                  @input="onDebitInput(entry)"
                  type="number"
                  min="0"
                  placeholder="—"
                  class="w-full px-2 py-1.5 text-sm font-mono text-right bg-background border border-border rounded-md text-foreground placeholder-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
                  :disabled="!!entry.credit"
                />
              </td>

              <!-- Crédit -->
              <td class="px-4 py-2.5">
                <input
                  v-model="entry.credit"
                  @input="onCreditInput(entry)"
                  type="number"
                  min="0"
                  placeholder="—"
                  class="w-full px-2 py-1.5 text-sm font-mono text-right bg-background border border-border rounded-md text-muted-foreground placeholder-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
                  :disabled="!!entry.debit"
                />
              </td>

              <!-- Menu ligne -->
              <td class="px-2 py-2.5">
                <button
                  @click="journalEntries.splice(journalEntries.indexOf(entry), 1)"
                  class="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground/30 hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="px-5 py-3 border-t border-border">
        <button
          @click="addRow"
          class="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Ajouter une ligne
        </button>
      </div>
    </div>

    <!-- ── FOOTER ACTIONS (fixe) ───────────────────────────────────── -->
    <div
      class="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-6 py-3.5 flex items-center justify-end gap-3 z-20 md:hidden"
    >
      <button
        class="text-sm font-medium text-muted-foreground border border-border rounded-lg px-4 py-2 hover:bg-muted transition-colors"
      >
        Annuler
      </button>
      <button
        class="text-sm font-semibold text-white bg-primary rounded-lg px-6 py-2 hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        :disabled="!isBalanced"
      >
        Enregistrer
      </button>
    </div>
  </div>
</template>
