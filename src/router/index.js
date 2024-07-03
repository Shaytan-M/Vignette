import { createRouter, createWebHistory } from 'vue-router';
import AuthPage from '../views/AuthPage.vue';
import GamePage from '../views/GamePage.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'auth',
            component: AuthPage,
        },
        {
            path: '/game',
            name: 'game',
            component: GamePage,
        },
    ],
});

export default router;
