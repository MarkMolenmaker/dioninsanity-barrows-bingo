import { createRouter, createWebHashHistory } from 'vue-router'
import home from '../views/home.vue'

const routes = [
  {
    path: '/home',
    name: 'home',
    component: home,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/',
    name: 'login',
    component: () => import('../views/login.vue')
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../views/register.vue")
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
        path: "/"
      });
    } else {
      next();
    }
  } else {
    next();
  }
})

export default router
