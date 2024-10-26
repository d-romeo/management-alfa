// forgot.js
export default {
    template: `
  <v-app class="grey lighten-1">
    <v-container fluid fill-height>
      <v-row align="center" justify="center">
        <v-col cols="12" md="6">
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
                </v-card-text>
              </v-window-item>
            </v-window>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" variant="flat" @click="reset">
                Reset
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
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
        reset() {
          try{
              fetch('/management-alfa/v1/api/reset.php', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ email: this.email})
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
                      setTimeout(() => {
                            this.$router.push('/');
                    }, 100);
                  } else {
                      alert('Credenziali non modificate. Riprova.');
                  }
                }); 
          } catch (error){
              console.error('Errore durante cambiamento della password:',error);
              alert('Si è verificato un errore. Riprova più tardi.');
          }
        }
      }
}; 