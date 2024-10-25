// login.js
export default {
    template: `
    <v-app class="grey lighten-1">
    <v-container>
    <template>
  <v-card class="mx-auto" max-width="500">
    <v-card-title class="text-h6 font-weight-regular justify-space-between">
      <span>Login</span>
    </v-card-title>

    <v-window v-model="step">
      <v-window-item :value="1">
        <v-card-text>
          <v-text-field
            v-model="email"
            label="Email"
            placeholder="email@example.com"
          ></v-text-field>
          <v-text-field
            v-model="password"
            label="Password"
            type="password"
          ></v-text-field>
        </v-card-text>
      </v-window-item>
    </v-window>

    <v-divider></v-divider>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" variant="flat" @click="login">
        Login
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
  </v-container>
  </v-app>
    `, 
    data() {
        return {
          email: '',
          password: '',
          step: 1
        };
      },
      methods: {
        login() {
          try{
              const response = fetch('/management-alfa/api/login.php', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ email: this.email, password: this.password })});
      
              const data = response.json();
      
              if (data && data.role && data.id_utente !== undefined) {
                  //set Cookie per il ruolo del user
                  Cookies.set('user_role', data.role);
                  Cookies.set('user_id', data.id_utente);
                  // Autenticazione riuscita, gestisci il ruolo
                  if (data.role === 1) {
                      window.location.href = '/admin'; // Reindirizza alla dashboard admin
                  } else if (data.role === 0) {
                      window.location.href = '/collaborator'; // Reindirizza alla dashboard collaborator
                  }
              } else {
                  alert('Credenziali non valide. Riprova.');
              }
          } catch (error){
              console.error('Errore durante il login:',error);
              alert('Si è verificato un errore. Riprova più tardi.');
          }
        }
      }
}; 