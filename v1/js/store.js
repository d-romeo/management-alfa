// js/store.js
const store = new Vuex.Store({
    state: {
        user: null // Stato dell'utente autenticato (null se non autenticato)
    },
    mutations: {
        setUser(state, user) {
            // Imposta i dettagli dell'utente autenticato
            state.user = user;
        },
        clearUser(state) {
            // Rimuove l'utente dallo stato per il logout
            state.user = null;
        }
    },
    actions: {
        login({ commit }, user) {
            // Esegue il login e salva l'utente nello stato
            commit('setUser', user);
        },
        logout({ commit }) {
            // Esegue il logout e cancella lo stato dell'utente
            commit('clearUser');
        }
    },
    getters: {
        isAuthenticated: state => !!state.user,
        getUserRole: state => state.user ? state.user.role : null
    }
});

// Esporta il modulo store
export default store;
