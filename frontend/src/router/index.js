import { createRouter, createWebHashHistory } from 'vue-router'
import home from '../views/home.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: home
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login.vue')
  },
  // {
  //   path: "/register",
  //   name: "register",
  //   component: () => import("../views/register.vue")
  // },
  {
    path: "/bingo",
    name: "bingo",
    component: () => import("../views/bingo.vue")
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/admin.vue'),
    meta: {
      requiresAuth: true
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem("jwt") == null) {
      next({
        path: "/login"
      });
    } else {
      next();
    }
  } else {
    next();
  }
})

export default router
