<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-gray-200 fixed h-full overflow-y-auto">
      <div class="p-4">
        <div class="flex items-center gap-2 mb-6">
          <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              ></path>
            </svg>
          </div>
          <span class="text-gray-700 font-semibold">Accounting</span>
        </div>

        <div class="mb-2">
          <p class="text-xs text-gray-500 font-medium mb-3 px-3">SUB MENU</p>
          <nav class="space-y-1">
            <a
              href="#"
              class="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                ></path>
              </svg>
              <span class="text-sm">Charts of Account</span>
            </a>
            <a
              href="#"
              class="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
                ></path>
              </svg>
              <span class="text-sm">Income & Expenses</span>
            </a>
            <a
              href="#"
              class="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
              <span class="text-sm">Balance Sheet</span>
            </a>
            <a
              href="#"
              class="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                ></path>
              </svg>
              <span class="text-sm">Trial Balance</span>
            </a>
            <a
              href="#"
              class="flex items-center gap-3 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
              <span class="text-sm font-medium">Journal Entries</span>
            </a>
            <a
              href="#"
              class="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
              <span class="text-sm">General Ledger Report</span>
            </a>
            <a
              href="#"
              class="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
              <span class="text-sm">Provisional Report</span>
            </a>
          </nav>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 ml-64 p-8">
      <!-- Breadcrumb -->
      <nav class="mb-6">
        <ol class="flex items-center gap-2 text-sm">
          <li>
            <a href="#" class="flex items-center gap-2 text-gray-500 hover:text-gray-700">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                ></path>
              </svg>
              Back
            </a>
          </li>
          <li class="text-gray-400">/</li>
          <li><a href="#" class="text-gray-500 hover:text-gray-700">Dashboard</a></li>
          <li class="text-gray-400">/</li>
          <li><a href="#" class="text-gray-500 hover:text-gray-700">Accounting</a></li>
          <li class="text-gray-400">/</li>
          <li><a href="#" class="text-gray-500 hover:text-gray-700">Journal Entry</a></li>
          <li class="text-gray-400">/</li>
          <li><a href="#" class="text-gray-500 hover:text-gray-700">Standard Bookings</a></li>
          <li class="text-gray-400">/</li>
          <li><span class="text-gray-900 font-medium">Contribution</span></li>
        </ol>
      </nav>

      <!-- Page Title -->
      <h1 class="text-2xl font-semibold text-gray-900 mb-6">Edit Standard Bookings</h1>

      <!-- Basic Information Section -->
      <div class="bg-white rounded-xl border border-gray-200 mb-6">
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 class="font-medium text-gray-900">Basic Information</h2>
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
        <div class="p-4">
          <div class="max-w-md">
            <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              placeholder="Enter Name"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      </div>

      <!-- Journal Entries Section -->
      <div class="bg-white rounded-xl border border-gray-200 mb-6">
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 class="font-medium text-gray-900">Journal Entries</h2>
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  No
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Account
                </th>
                <th
                  class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Debit
                </th>
                <th
                  class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Credit
                </th>
                <th
                  class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                ></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="(entry, index) in journalEntries" :key="entry.id" class="hover:bg-gray-50">
                <td class="px-4 py-3">
                  <input
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td class="px-4 py-3 text-sm text-gray-900">{{ index + 1 }}</td>
                <td class="px-4 py-3">
                  <select
                    v-model="entry.account"
                    class="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                  >
                    <option v-for="account in accounts" :key="account.code" :value="account.code">
                      {{ account.code }} - {{ account.name }} - {{ account.type }}
                    </option>
                  </select>
                </td>
                <td class="px-4 py-3 text-right">
                  <input
                    v-model="entry.debit"
                    type="text"
                    class="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-right"
                    :readonly="entry.type === 'credit'"
                  />
                </td>
                <td class="px-4 py-3 text-right">
                  <input
                    v-model="entry.credit"
                    type="text"
                    class="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-right"
                    :readonly="entry.type === 'debit'"
                  />
                </td>
                <td class="px-4 py-3 text-center">
                  <button class="text-gray-400 hover:text-gray-600">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
                      ></path>
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="p-4">
          <button
            @click="addRow"
            class="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
            Add Row+
          </button>

          <!-- Totals -->
          <div class="flex justify-end mt-4 space-y-3">
            <div class="w-64 space-y-3">
              <div>
                <label class="block text-xs text-gray-500 mb-1">Total Debit</label>
                <div
                  class="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-900 text-right"
                >
                  {{ formatCurrency(totalDebit) }}
                </div>
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-1">Total Credit</label>
                <div
                  class="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-900 text-right"
                >
                  {{ formatCurrency(totalCredit) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Link to Section -->
      <div class="bg-white rounded-xl border border-gray-200 mb-6">
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 class="font-medium text-gray-900">Link to</h2>
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
        <div class="p-4">
          <div class="grid grid-cols-2 gap-4 max-w-md">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
              >
                <option value="">Select</option>
                <option value="1">Type 1</option>
                <option value="2">Type 2</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Level</label>
              <select
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
              >
                <option value="">Select</option>
                <option value="1">Level 1</option>
                <option value="2">Level 2</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end gap-3">
        <button
          class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          class="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Save
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Sample accounts data
const accounts = [
  { code: '2004100', name: 'Contribution', type: 'Liability' },
  { code: '1001100', name: 'Wema Bank', type: 'Asset' },
  { code: '1001110', name: 'Access Bank', type: 'Asset' },
  { code: '1001120', name: 'Kuda Bank', type: 'Asset' },
  { code: '1001130', name: 'GTBank', type: 'Asset' },
  { code: '2004200', name: 'Capital', type: 'Liability' },
]

// Journal entries data
const journalEntries = ref([
  { id: 1, account: '2004100', debit: '$40,000,000', credit: '-', type: 'debit' },
  { id: 2, account: '1001100', debit: '-', credit: '$40,000,000', type: 'credit' },
  { id: 3, account: '1001110', debit: '-', credit: '$40,000,000', type: 'credit' },
  { id: 4, account: '1001120', debit: '-', credit: '$40,000,000', type: 'credit' },
])

// Computed totals
const totalDebit = computed(() => {
  return journalEntries.value.reduce((sum, entry) => {
    if (entry.debit !== '-' && entry.debit !== '') {
      return sum + parseFloat(entry.debit.replace(/[$,]/g, ''))
    }
    return sum
  }, 0)
})

const totalCredit = computed(() => {
  return journalEntries.value.reduce((sum, entry) => {
    if (entry.credit !== '-' && entry.credit !== '') {
      return sum + parseFloat(entry.credit.replace(/[$,]/g, ''))
    }
    return sum
  }, 0)
})

// Format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

// Add new row
const addRow = () => {
  const newId =
    journalEntries.value.length > 0 ? Math.max(...journalEntries.value.map((e) => e.id)) + 1 : 1

  journalEntries.value.push({
    id: newId,
    account: '',
    debit: '-',
    credit: '-',
    type: 'debit',
  })
}
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>
