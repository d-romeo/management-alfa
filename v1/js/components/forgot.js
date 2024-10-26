// forgot.js
export default {
    template: `
  <v-app class="grey lighten-1">
    <v-container fluid fill-height>
      <v-row align="center" justify="center">
        <v-col cols="12" md="6">
          <v-card class="mx-auto" max-width="500">
            <v-card-title class="text-h6 font-weight-regular justify-space-between d-flex align-center">
            <v-icon left color="primary">mdi-lock-reset</v-icon>
            <span>Non ricordi la password?</span>
          </v-card-title>

            <v-window v-model="step">
              <v-window-item :value="1">
                <v-card-text>
                <div style="margin-bottom: 8px;">
                  Inserisci l'email del tuo profilo:
                </div>
                  <v-text-field
                    v-model="email"
                    label="Email"
                    :rules="[rules.required, rules.mail]" 
                    placeholder="email@example.com"
                  ></v-text-field>
                </v-card-text>
              </v-window-item>
            </v-window>

            <v-card-actions>
              <v-btn text @click="goBack">
                INDIETRO
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn color="primary" variant="flat" @click="reset" :disabled="!email">
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
        La mail inserita non è esistente. Riprova o contatta l'assistenza.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="errorMail = false">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="successDialog" max-width="400">
    <v-card>
      <v-card-title class="headline">Controlla la tua email</v-card-title>
      <v-card-text>
        Abbiamo inviato un'email per il reset della password. Controlla la tua casella di posta per continuare.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="closeSuccessDialog">OK</v-btn>
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
          successDialog: false, 
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
        reset() {
          this.errorMail=false; 
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
                      this.successDialog = true;
                  } else {
                      this.showError();
                  }
                }); 
          } catch (error){
              console.error('Errore durante cambiamento della password:',error);
              alert('Si è verificato un errore. Riprova più tardi.');
          }
        }, 
        goBack(){
          this.$router.push('/');
        }, 
        showError() {
          this.errorMail = true; // Mostra il dialog quando si verifica un errore
        }, 
        closeSuccessDialog(){
          this.successDialog = false;
          this.$router.push('/');
        }
      }
}; 