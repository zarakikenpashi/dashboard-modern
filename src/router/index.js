import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layout/AppLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/app',
      component: AppLayout,

      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('@/modules/dashboard/pages/DashboardPage.vue'),
        },

        {
          path: 'journaux/banque',
          name: 'JournalBanque',
          component: () => import('@/modules/journaux/pages/JournalBanquePage.vue'),
        },
        {
          path: 'journaux/naw-banque',
          name: 'NewJournalBanque',
          component: () => import('@/modules/journaux/pages/NewJournalBQPage.vue'),
        },

        {
          path: 'journaux/caisse',
          name: 'JournalCaisse',
          component: () => import('@/modules/journaux/pages/JournalCaissePage.vue'),
        },
        {
          path: 'journaux/naw-caisse',
          name: 'NewJournalCaisse',
          component: () => import('@/modules/journaux/pages/NewJournalCAPage.vue'),
        },
        {
          path: 'journaux/achat',
          name: 'JournalAchat',
          component: () => import('@/modules/journaux/pages/JournalAchatPage.vue'),
        },
        {
          path: 'journaux/naw-achat',
          name: 'NewJournalAchat',
          component: () => import('@/modules/journaux/pages/NewJournalACPage.vue'),
        },
        {
          path: 'journaux/vente',
          name: 'JournalVente',
          component: () => import('@/modules/journaux/pages/JournalVentePage.vue'),
        },
        {
          path: 'journaux/naw-vente',
          name: 'NewJournalVente',
          component: () => import('@/modules/journaux/pages/NewJournalVTPage.vue'),
        },
        {
          path: 'journaux/od',
          name: 'JournalOD',
          component: () => import('@/modules/journaux/pages/JournalODPage.vue'),
        },
        {
          path: 'journaux/naw-operations-diverses',
          name: 'NewJournalOperationsDiverses',
          component: () => import('@/modules/journaux/pages/NewJournalODPage.vue'),
        },
        {
          path: 'journaux/ran',
          name: 'JournalRAN',
          component: () => import('@/modules/journaux/pages/JournalRANPage.vue'),
        },

        {
          path: 'plan-comptable',
          name: 'PlanComptable',
          component: () => import('@/modules/plan/pages/PlanComptablePage.vue'),
        },

        {
          path: 'grand-livre/general',
          name: 'GrandLivreGeneral',
          component: () => import('@/modules/grandlivre/pages/GrandLivreGeneralPage.vue'),
        },
        {
          path: 'grand-livre/auxiliaire',
          name: 'GrandLivreAuxiliaire',
          component: () => import('@/modules/grandlivre/pages/GrandLivreAuxiliairePage.vue'),
        },
        {
          path: 'grand-livre/consultation',
          name: 'GrandLivreConsultation',
          component: () => import('@/modules/grandlivre/pages/GrandLivreConsultationPage.vue'),
        },

        {
          path: 'balance/generale',
          name: 'BalanceGenerale',
          component: () => import('@/modules/balance/pages/BalanceGeneralePage.vue'),
        },
        {
          path: 'balance/agee-clients',
          name: 'BalanceAgeeClients',
          component: () => import('@/modules/balance/pages/BalanceAgeeClientsPage.vue'),
        },
        {
          path: 'balance/agee-fournisseurs',
          name: 'BalanceAgeeFournisseurs',
          component: () => import('@/modules/balance/pages/BalanceAgeeFournisseursPage.vue'),
        },
        {
          path: 'balance/verification',
          name: 'BalanceVerification',
          component: () => import('@/modules/balance/pages/BalanceVerificationPage.vue'),
        },

        {
          path: 'etats/bilan',
          name: 'Bilan',
          component: () => import('@/modules/etats/pages/BilanPage.vue'),
        },
        {
          path: 'etats/resultat',
          name: 'CompteResultat',
          component: () => import('@/modules/etats/pages/CompteResultatPage.vue'),
        },
        {
          path: 'etats/flux',
          name: 'FluxTresorerie',
          component: () => import('@/modules/etats/pages/FluxTresoreriePage.vue'),
        },
        {
          path: 'etats/tafire',
          name: 'Tafire',
          component: () => import('@/modules/etats/pages/TafirePage.vue'),
        },
        {
          path: 'etats/annexes',
          name: 'NotesAnnexes',
          component: () => import('@/modules/etats/pages/NotesAnnexesPage.vue'),
        },
        {
          path: 'immobilisations/registre',
          name: 'ImmobilisationRegistre',
          component: () => import('@/modules/etats/pages/ImmobilisationRegistrePage.vue'),
        },
        {
          path: 'stock/articles',
          name: 'StockArticles',
          component: () => import('@/modules/stock/pages/StockArticlesPage.vue'),
        },
        {
          path: 'stock/entrees',
          name: 'StockEntrees',
          component: () => import('@/modules/stock/pages/StockEntreesPage.vue'),
        },
        {
          path: 'stock/sorties',
          name: 'StockSorties',
          component: () => import('@/modules/stock/pages/StockSortiesPage.vue'),
        },
        {
          path: 'stock/inventaire',
          name: 'StockInventaire',
          component: () => import('@/modules/stock/pages/StockInventairePage.vue'),
        },
        {
          path: '',
          redirect: '/app/dashboard',
        },
      ],
    },
  ],
})

export default router
