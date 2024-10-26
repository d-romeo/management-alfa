// login.js
export default {
    template: `
<v-app class="grey lighten-1">
    <v-container fluid fill-height>
      <v-row align="center" justify="center">
        <v-col cols="12" md="6">
          <v-card class="mx-auto" max-width="500">
            <v-card-title class="text-h6 font-weight-regular justify-center">
              <v-icon left>mdi-application-settings</v-icon> <!-- Sostituisci con l'icona desiderata -->
              <span class="ml-2">Accesso Gestionale</span> <!-- Titolo -->
            </v-card-title>

            <v-window v-model="step">
              <v-window-item :value="1">
                <v-card-text>
                  <v-text-field
                    v-model="email"
                    label="Email"
                    :rules="[rules.required,rules.mail]" 
                    placeholder="email@example.com"
                  ></v-text-field>
                  <v-text-field
                    v-model="password"
                    label="Password"
                    type="password"
                    :rules="[rules.required]" 
                  ></v-text-field>
                </v-card-text>
              </v-window-item>
            </v-window>

            <v-card-actions>
              <v-btn text @click="resetPassword">
                Password dimenticata?
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn color="primary" variant="flat" @click="login" :disabled="!email || !password">
                Login
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="errorMail" max-width="400">
    <v-card>
      <v-card-title class="headline">Errore</v-card-title>
      <v-card-text>
        Credenziali errate. Riprova.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="errorMail = false">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  </v-app>
`,
    data() {
        return {
          email: '',
          password: '',
          step: 1, 
          errorMail: false, 

          rules: {
            required: value => !!value || 'Obbligatorio.',
            mail: value => {
              const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              return pattern.test(value) || 'Inserisci un’email valida.';
            }, 
        }
        };
      },
      methods: {
        login() {
          this.errorMail=false; 
          try{
              fetch('/management-alfa/v1/api/login.php', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ email: this.email, password: this.password })
                }).then(response => {
                  console.log('Codice di stato:', response.status); // Stampa il codice di stato
                  if (!response.ok) {
                    const errorMessage = `Errore ${response.status}: ${response.statusText}`;
                    console.error(errorMessage); // Stampa il messaggio di errore nel console log
                    throw new Error(errorMessage); // Genera un errore con il messaggio personalizzato
                  }
                  return response.json();
                })
                .then(data => {
                  if (data.success){
                      //set Cookie per il ruolo del user
                      Cookies.set('user_role', data.role, { sameSite: 'Lax' });
                      Cookies.set('user_id', data.id_utente, { sameSite: 'Lax' });
                      // Autenticazione riuscita, gestisci il ruolo
                      setTimeout(() => {
                        if (data.role === 1) {
                            this.$router.push('/adminDashboard');
                        } else if (data.role === 0) {
                            this.$router.push('/collaboratorDashboard');
                        }
                    }, 100);
                  } else {
                      this.showError(); 
                  }
                }); 
          } catch (error){
              console.error('Errore durante il login:',error);
              this.showError(); 
          }
        },
        resetPassword() {
          this.$router.push('/forgot-password');
        }, 
        showError() {
          this.errorMail = true; // Mostra il dialog quando si verifica un errore
        }
      }
}; 