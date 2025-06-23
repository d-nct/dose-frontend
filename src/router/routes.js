const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'), // O layout principal com navbar, etc.
    children: [
      // Página Inicial
      { path: '', component: () => import('pages/IndexPage.vue'), name: 'home' },

      // Página de Login
      { path: '/login', component: () => import('pages/LoginPage.vue'), name: 'login' },
      
      // Página de Registro
      // { path: '/register', component: () => import('pages/RegisterPage.vue'), name: 'register' }
    ]
  },

  // Rota de fallback para página não encontrada
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes