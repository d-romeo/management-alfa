import Login from '/management-alfa/v1/js/components/login.js';
import AdminDashboard from '/management-alfa/v1/js/components/homeAdmin.js';
import Collaboratori from '/management-alfa/v1/js/components/collaboratori.js';



// Configurazione delle rotte
const routes = [
    { path: '/', component: Login },
    { path: '/admin', component: AdminDashboard, meta: { requiresAuth: true, role: 1 } },
    { path: '/collaborator', component: Collaboratori, meta: { requiresAuth: true, role: 2 } },
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
    vuetify: new Vuetify({
      defaultTheme: 'light', // Imposta la modalità chiara di default
      themes: {
        dark: {
          dark: true,
          colors:{
            primary: '#00838F',
            error: '#FF5252',
            info: '#2196F3',
            success: '#4CAF50',
            warning:'#FFC107',
            button: '#1976d2', 
          },
        },
        light: {
          dark: false,
          colors: {
            primary: '#00838F', // Cambia qui i colori per la modalità chiara
            error: '#FF5252',
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#FFC107',
            button: '#039BE5', // Colore per i bottoni
          },
        },
      },
    }),
    router,
    render: h => h('router-view'), 
    data() {
        return {
          menuItems: [
            { path: '/', component: Login }, // Imposta il Login come la schermata iniziale
            { text: 'Profilo', route: '/', icon: 'mdi-account' },  
            { text: 'Home', route: '/', icon: 'mdi-home' },
            { text: 'Collaboratori', route: '/collaboratori', icon: 'mdi-account-group'},
          ],
        };
      },
      methods: {
        goToPage(route) {
          this.$router.push(route);
        },
        toggleDrawer() {
          this.drawer = !this.drawer; // Inverte lo stato del drawer
        },
      },
template: 
      ` <v-app class="grey lighten-1">
      <v-navigation-drawer app class="cyan darken-3" permanent :width="200">
        <v-list color="transparent">
          <!-- Titolo del Gestionale -->
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="white--text">GESTIONALE ALFA</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          
          <v-divider></v-divider>
    
        <!-- Voci del menu con icone -->
        <v-list-item v-for="item in menuItems" :key="item.text" @click="goToPage(item.route)">
          <v-list-item-icon>
            <v-icon class="white--text">{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="white--text">{{ item.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list>
    
        <template v-slot:append>
          <div class="pa-2">
            <v-btn block>
              Logout
            </v-btn>
          </div>
        </template>
      </v-navigation-drawer>
    
      <v-main>
        <v-container fluid>
          <router-view></router-view>
        </v-container>
      </v-main>
    </v-app>`,
});
