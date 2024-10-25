// profilo.js
export default {
    template: `
    <v-app class="grey lighten-1">
    <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-card-title>
            Gestione del Profilo
          </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid">
              <!-- Nome -->
              <v-text-field
                v-model="user.name"
                label="Nome"
                :rules="nameRules"
                required
              ></v-text-field>

              <!-- Cognome -->
              <v-text-field
                v-model="user.surname"
                label="Cognome"
                :rules="surnameRules"
                required
              ></v-text-field>

              <!-- Email -->
              <v-text-field
                v-model="user.email"
                label="Email"
                :rules="emailRules"
                required
              ></v-text-field>

              <!-- Password -->
              <v-text-field
                v-model="user.password"
                label="Password"
                :rules="passwordRules"
                type="password"
                required
              ></v-text-field>

              <!-- Pulsante Salva -->
              <v-btn
                :disabled="!valid"
                color="primary"
              >
                Salva
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  </v-app>
    `, 
    data() {
        return {
          valid: false,
          user: {
            name: '',
            surname: '',
            email: '',
            password: ''
          }
        }
    }
}; 
