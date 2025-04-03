const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    scrollBehavior(to, from, savedPosition) {
        return savedPosition || { top: 0 }
    },
    routes: [
    { 
        path: '/', 
        component: Land,
        beforeEnter: async (to, from, next) => {
            const auth = await store.dispatch('checkAuth');
            if (auth && auth.token) {
                next(auth.role === 'admin' ? '/admin/dash' : '/home');
            } else {
                next();
            }
        }
    },
    {
        path: '/admin',
        component: admin,
        name: 'admin',
        meta: { requiresAuth: true, role: 'admin' },
        children: [
            {
                path: 'dash',
                component: adash,
                name: 'adash'
               
            },
            {
                path: 'subjects',
                component: subjects,
                name: 'subjects'
            },
            {
                path : 'quizes',
                component: quizes,
                name: 'quizes'
            },
            {
                path : 'chapters',
                component: chapters,
                name: 'chapters'
            },
            {
                path : 'questions',
                component: questions,
                name: 'questions'
            },
            {
                path : 'tusers',
                component: track_users,
                name: 'track-users'
            },
        ]
    },
    { 
        path: '/quiz/:quizid(\\d+)', 
        component: QuizView,
        name: 'quiz',
        meta: { requiresAuth: true, role: 'user' } 
    },
    {
        path: '/scores/:Id(\\d+)',
        component: Scores,
        name: 'user_score',
        meta: { requiresAuth: true, role: 'user' } 
    },
    { 
        path: '/users', 
        component: usernavbar,
        name: 'usernavbar',
        meta: { requiresAuth: true, role: 'user' },
        children: [
            { 
                path: '/home', 
                component: Explore,
                name: 'explore',
                meta: { requiresAuth: true, role: 'user' } 
            },
            
            
            {
                path: '/summary',
                component: usummary,
                name: 'summary',
                meta: { requiresAuth: true, role: 'user' } 
            },
            {
                path: '/profile',
                component: profile,
                name: 'profile',
                meta: { requiresAuth: true, role: 'user' } 
            },
            {   path: '/report',
                component: report,
                name: 'report',
                meta: { requiresAuth: true, role: 'user' }
            },
        ]

    },
    
   
    { 
        path: '/login', 
        component: login,
        name: 'login',
        beforeEnter: async (to, from, next) => {
            const auth = await store.dispatch('checkAuth');
            if (auth && auth.token) {
                next(auth.role === 'admin' ? '/admin/dash' : '/home');
            } else {
                next();
            }
        }
    },
    { 
        path: '/signup', 
        component: signup,
        name: 'signup',
    },
    {
        path: '/:catchAll(.*)',
        component: handle_error,
        name: 'notfound'
    }
]
});

// Navigation guards
router.beforeEach(async (to, from, next) => {
    console.log(`Navigating from ${from.path} to ${to.path}`);

    if (to.matched.some(record => record.meta.requiresAuth)) {
        const auth = await store.dispatch('checkAuth');
        
        if (!auth || !auth.token) {
            next({ path: '/login', query: { redirect: to.fullPath } });
        } else {
            if (to.matched.some(record => record.meta.role === auth.role)) {
                next();
            } else {
                next(auth.role === 'admin' ? '/admin/dash' : '/home');
            }
        }
    } else {
        next();
    }
});

router.afterEach((to, from) => {
    console.log(`Navigation completed to ${to.path}`);
});