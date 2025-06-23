// src/router/routes.js

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue'), name: 'home', meta: { requiresAuth: true } },
      { path: 'review/new', component: () => import('pages/NewReviewPage.vue'), name: 'new-review', meta: { requiresAuth: true } }
    ]
  },
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
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes