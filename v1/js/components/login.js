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
          // Sostituisci con la tua logica di autenticazione, ad esempio una chiamata API
          if (this.email && this.password) {
            // Simulazione login
            if (this.email === 'daniele@gmail.com' && this.password === 'password') {
              // Redirigi alla pagina desiderata dopo il login
              this.$router.push('/collaboratore');
            } else {
              alert("Credenziali errate, riprova.");
            }
          }
        }
      }
    };
