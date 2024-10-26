// homeCollaboratori.js
export default {
  template: `
  <v-app class="grey lighten-1">
   <v-container >
    <v-row justify="center">
        <v-col cols="12">
        <v-card
            class="mx-auto my-3"
            color="#0097A7"
            height="200px"
        ><v-window
            v-model="activeWindow"
            class="custom-window"
            show-arrows
            >
            <!-- Prima finestra: Ripetizioni -->
            <v-window-item value="ripetizioni">
              <v-card-title class="white--text text-h5">Ripetizioni</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="3">
                    <v-card
                      class="mx-auto my-3 d-flex justify-center align-center"
                      @click="$router.push('/materia1')"
                      color="#00796B"
                      max-width="250px"
                    >
                      <v-card-title class="white--text text-h6">COLLABORATORI</v-card-title>
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-card
                      class="mx-auto my-3 d-flex justify-center align-center"
                      @click="$router.push('/materia2')"
                      color="#00796B"
                      max-width="250px"
                    >
                      <v-card-title class="white--text text-h6">CLIENTI</v-card-title>
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-card
                      class="mx-auto my-3 d-flex justify-center align-center"
                      @click="$router.push('/materia3')"
                      color="#00796B"
                      max-width="250px"
                    >
                      <v-card-title class="white--text text-h6">CONTABILITA'</v-card-title>
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-card
                      class="mx-auto my-3 d-flex justify-center align-center"
                      @click="$router.push('/materia4')"
                      color="#00796B"
                      max-width="250px"
                    >
                      <v-card-title class="white--text text-h6">ABBONAMENTI</v-card-title>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-window-item>

            <!-- Seconda finestra: Doposcuola -->
            <v-window-item value="doposcuola">
              <v-card-title class="white--text text-h5">Doposcuola</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="3">
                    <v-card
                      class="mx-auto my-3 d-flex justify-center align-center"
                      @click="$router.push('/doposcuola1')"
                      color="#8E24AA"
                      max-width="250px"
                    >
                      <v-card-title class="white--text text-h6">Doposcuola 1</v-card-title>
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-card
                      class="mx-auto my-3 d-flex justify-center align-center"
                      @click="$router.push('/doposcuola2')"
                      color="#8E24AA"
                      max-width="250px"
                    >
                      <v-card-title class="white--text text-h6">Doposcuola 2</v-card-title>
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-card
                      class="mx-auto my-3 d-flex justify-center align-center"
                      @click="$router.push('/doposcuola3')"
                      color="#8E24AA"
                      max-width="250px"
                    >
                      <v-card-title class="white--text text-h6">Doposcuola 3</v-card-title>
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-card
                      class="mx-auto my-3 d-flex justify-center align-center"
                      @click="$router.push('/doposcuola4')"
                      color="#8E24AA"
                      max-width="250px"
                    >
                      <v-card-title class="white--text text-h6">Doposcuola 4</v-card-title>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  </v-app>
  `,
data: () => ({
  activeWindow: 'ripetizioni',
    }),
methods: {
  }
};