// src/router/routes.js

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    // páginas que usam o layout principal
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        name: 'home',
        meta: { requiresAuth: true }
      },
      {
        path: 'review/new',
        component: () => import('pages/NewReviewPage.vue'),
        name: 'new-review',
        meta: { requiresAuth: true }
      },
      {
        path: 'estabelecimentos/new',
        name: 'new-estabelecimento',
        component: () => import('pages/NewEstablishmentPage.vue'),
        meta: { requiresAuth: true } // requer login
      },
      {
        path: 'drinks/new',
        name: 'new-drink',
        component: () => import('pages/NewDrinkPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'categorias/new',
        name: 'new-categoria',
        component: () => import('pages/NewCategoryPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'profile', // O caminho base, ex: tudosebebe.com/perfil
        component: () => import('pages/profile/ProfilePage.vue'), // O componente PAI
        meta: { requiresAuth: true },
        // Rotas FILHAS que serão renderizadas dentro do ProfilePage
        children: [
          {
            path: '', // Caminho padrão (quando acessar /perfil)
            name: 'profile-reviews',
            component: () => import('pages/profile/ProfileReviews.vue')
          },
          {
            path: 'configuracoes', // Caminho para configurações, ex: tudosebebe.com/perfil/configuracoes
            name: 'profile-settings',
            component: () => import('pages/profile/ProfileSettings.vue')
          }
        ]
      }
    ]
  },

  // --- Rotas de Autenticação (fora do layout principal) ---
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue'),
    name: 'login'
  },
  {
    path: '/register',
    component: () => import('pages/RegisterPage.vue'),
    name: 'register'
  },
  {
    path: '/register-success',
    component: () => import('pages/RegisterSuccessPage.vue'),
    name: 'register-success'
  },

  // --- Rota 404 (Not Found)
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes