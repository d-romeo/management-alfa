import Login from '/management-alfa/v1/js/components/login.js';
import Home from '/management-alfa/v1/js/components/home.js';
import AdminDashboard from '/management-alfa/v1/js/components/admin.js';
import CollaboratorDashboard from '/management-alfa/v1/js/components/collaboratore.js';



// Configurazione delle rotte
const routes = [
    { path: '/', component: Home },
    { path: '/admin', component: AdminDashboard, meta: { requiresAuth: true, role: 1 } },
    { path: '/collaborator', component: CollaboratorDashboard, meta: { requiresAuth: true, role: 2 } },
    { path: '/login', component: Login },
  ];
  
  // Creazione del router
  const router = new VueRouter({
    routes,
  });

router.beforeEach((to, from, next) => {
    const userRole = Cookies.get('user_role'); // Ottieni il ruolo dell'utente dai cookie
    const isAuthenticated = !!userRole; // Verifica se l'utente è autenticato

    if (to.meta.requiresAuth && !isAuthenticated) {
        next({ path: '/' }); // Reindirizza se non autenticato
    } else if (to.meta.role && to.meta.role !== userRole) {
        next({ path: '/' }); // Reindirizza se il ruolo non corrisponde
    } else {
        next(); // Permetti l'accesso alla rotta
    }
});

// Creazione dell'istanza Vue con `new Vue`
new Vue({
    el: '#app',
    router,
    render: h => h('router-view')
});