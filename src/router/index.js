import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeViews.vue'),
    },
    {
      path: '/posts',
      name: 'post-list',
      component: () => import('../views/PostListView.vue'),
    },
    {
      path: '/posts/new',
      name: 'post-create',
      component: () => import('../views/PostFormatView.vue'),
    },
    {
      path: '/posts/:id',
      name: 'post-detail',
      component: () => import('../views/PostDetailView.vue'),
      props: true,
    },
    {
      path: '/posts/:id/edit',
      name: 'post-edit',
      component: () => import('../views/PostFormatView.vue'),
      props: true,
    },
    {
      path: '/rocket',
      name: 'rocket-dashboard',
      component: () => import('../views/RocketDashboardView.vue'),
    },
  ],
})

export default router