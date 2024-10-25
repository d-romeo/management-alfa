// collaboratori.js
export default {
  template: `
    <div>
          <v-app class="grey lighten-1">
            <v-container>
                <v-row>
                    <v-col cols="10">
                        <!-- Search Bar -->
                        <v-text-field 
                            v-model="search" 
                            label="Cerca un collaboratore, nome, cognome, materia" 
                            solo 
                            prepend-inner-icon="mdi-magnify"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="2">
                        <!-- New Button -->
                        <v-btn @click="openNewUserDialog" color="button" ligth>Nuovo</v-btn>
                    </v-col>
                </v-row>

                <!-- User Table -->
                <v-data-table
                    v-if="filteredUsers.length"
                    :headers="headers"
                    :items="filteredUsers"
                    class="elevation-1"
                    @click:row="openDetails" 
                >
                    <!-- Icone personalizzate -->
                    <template v-slot:item.doposcuola="{ item }">
                        <v-icon v-if="item.doposcuola"  color="green" @click.stop="toggleDoposcuola(item.id_collaboratore)">mdi-check-circle</v-icon>
                        <v-icon v-else  color="red" @click.stop="toggleDoposcuola(item.id_collaboratore)">mdi-close-circle</v-icon>
                    </template>
                    <template v-slot:item.stato_pagamento="{ item }">
                        <v-icon v-if="item.stato_pagamento"  color="green">mdi-check-circle</v-icon>
                        <v-icon v-else  color="red">mdi-close-circle</v-icon>
                    </template>
                    <!-- Etichette Materia-->
                    <template v-slot:item.materie="{ item }">
                        <div>
                          <!-- Verifica se l'utente ha materie -->
                          <template v-if="item.materie && item.materie.trim()">
                            <v-chip
                              v-for="(materie, index) in item.materie.split(',')"
                              :key="index"
                              :color="getColor(materie.trim())"
                              class="ma-1"
                              @click.stop="addToSearch(materie.trim())" 
                            >
                              {{ materie.trim() }}
                            </v-chip>
                          </template>
                          <template v-else>
                            <!-- Messaggio per utenti senza materie -->
                            <span>No Materie</span>
                          </template>
                        </div>
                      </template>

            </v-data-table>
                <!-- Empty State -->
                <v-alert v-else type="warning">
                    Nessun utente trovato. Aggiungi un nuovo collaboratore per visualizzarlo.
                </v-alert>

                <!-- User Exist-->
                <v-alert v-if="userExist" type="error" dismissible>
                    Utente già registrato.
                </v-alert>

                <!-- completed-->
                <v-alert v-if="completed" type="success" dismissible>
                    Operazione completata.
                </v-alert>

                <v-dialog v-model="dialog" max-width="600px">
                    <v-card>
                      <!-- Intestazione della finestra di dialogo -->
                      <v-card-title class="headline grey lighten-2">
                        <v-icon left>mdi-account-plus</v-icon> Crea un nuovo collaboratore!
                      </v-card-title>
                      <!-- Corpo della finestra di dialogo -->
                      <v-card-text>
                        <v-form ref="form" v-model="valid">
                          <v-container>
                            <!-- Campi di input organizzati su due colonne -->
                            <v-row>
                              <v-col cols="12" md="6">
                                <v-text-field 
                                  v-model="newUser.mail" 
                                  label="Mail"
                                  prepend-inner-icon="mdi-email-outline" 
                                  dense
                                  class="mb-n3"
                                  :rules="[rules.required, rules.mail]" 
                                  required
                                ></v-text-field>
                              </v-col>
                              <v-col cols="12" md="6">
                                <v-text-field 
                                  v-model="newUser.nome" 
                                  label="Nome"
                                  prepend-inner-icon="mdi-account" 
                                  dense
                                  class="mb-n3"
                                  :rules="[rules.required, rules.noSpecialChars]" 
                                  required
                                ></v-text-field>
                              </v-col>
                            </v-row>
                            
                            <v-row>
                              <v-col cols="12" md="6">
                                <v-text-field 
                                  v-model="newUser.cognome" 
                                  label="Cognome"
                                  prepend-inner-icon="mdi-account" 
                                  dense
                                  class="mb-n3"
                                  :rules="[rules.required, rules.noSpecialChars]" 
                                  required
                                ></v-text-field>
                              </v-col>
                              <v-col cols="12" md="6">
                                <v-text-field 
                                  v-model="newUser.telefono" 
                                  label="+39 Telefono"
                                  prepend-inner-icon="mdi-phone" 
                                  dense
                                  class="mb-n3"
                                  maxlength="10"
                                  type="tel"
                                  :rules="[rules.required, rules.isNumber, rules.phoneLengthMin]"
                                  required
                                ></v-text-field>
                              </v-col>
                            </v-row>
                  
                            <v-row>
                              <v-col cols="12" md="6">
                                <v-text-field 
                                  v-model="newUser.compenso" 
                                  label="Tariffa"
                                  prepend-inner-icon="mdi-currency-eur" 
                                  dense
                                  class="mb-n3"
                                  type="number" 
                                  :rules="[rules.required]" 
                                  required
                                ></v-text-field>
                              </v-col>
                            </v-row>
                  
                            <!-- Checkbox per doposcuola e ruolo -->
                            <v-row>
                              <v-col cols="12">
                                <v-checkbox
                                  v-model="newUser.doposcuola" 
                                  label="Utente Doposcuola"
                                  prepend-icon="mdi-school"
                                ></v-checkbox>
                                <v-checkbox
                                  v-model="newUser.ruolo" 
                                  label="Utente Amministratore"
                                  prepend-icon="mdi-shield-account-outline"
                                ></v-checkbox>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-form>
                      </v-card-text>
                  
                      <!-- Footer della finestra di dialogo -->
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="dialog = false">Annulla</v-btn>
                        <v-btn color="primary" text @click="saveUser">Crea</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>                  

                <!-- Finestra Modale Modifica utente-->
                <template>
                  <v-dialog v-model="userDetailsDialog" max-width="800px">
                    <v-card>
                      <!-- Intestazione della finestra di dialogo -->
                      <v-card-title class="headline grey lighten-2">
                        <v-icon left>mdi-account</v-icon> Dettagli Utente
                      </v-card-title>
                
                      <!-- Corpo della finestra di dialogo -->
                      <v-card-text>
                        <v-form ref="form" v-model="valid">
                          <v-container>
                            <!-- Campi in sola lettura -->
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-list-item>
                                    <v-list-item-icon>
                                        <v-icon>mdi-identifier</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>collaboratore</v-list-item-title>
                                        <v-list-item-subtitle>{{ selectedUser.id_collaboratore }}</v-list-item-subtitle>
                                    </v-list-item-content>
                                    </v-list-item>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-list-item>
                                    <v-list-item-icon>
                                        <v-icon>mdi-email-outline</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>Email</v-list-item-title>
                                        <v-list-item-subtitle>{{ selectedUser.mail }}</v-list-item-subtitle>
                                    </v-list-item-content>
                                    </v-list-item>
                                </v-col>
                                </v-row>
                  
                              <!-- Divider per separare i campi di sola lettura dai campi modificabili -->
                              <v-divider class="my-4"></v-divider>
                  
                              <!-- Campi modificabili -->
                              <v-row>
                                    <v-col cols="12" md="6">
                                      <v-text-field 
                                        v-model="selectedUser.nome" 
                                        label="Nome"
                                        dense
                                        class="mb-n2"
                                        :rules="[rules.required, rules.noSpecialChars]"
                                        required
                                      ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                      <v-text-field 
                                        v-model="selectedUser.cognome" 
                                        label="Cognome"
                                        dense
                                        class="mb-n2"
                                        :rules="[rules.required, rules.noSpecialChars]"
                                        required
                                      ></v-text-field>
                                    </v-col>
                                  </v-row>
                                  <v-row>
                                    <v-col cols="12" md="6">
                                      <v-text-field 
                                        v-model="selectedUser.telefono" 
                                        label="Telefono" 
                                        dense
                                        class="mb-n2"
                                        type="tel"
                                        :rules="[rules.required, rules.isNumber, rules.phoneLengthMin]"
                                        required
                                      ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                      <v-text-field 
                                        v-model="selectedUser.materie" 
                                        label="Materie"
                                        dense
                                        class="mb-n2"
                                      ></v-text-field>
                                    </v-col>
                                <v-col cols="12" md="6">
                                  <v-checkbox v-model="selectedUser.doposcuola" label="Doposcuola"></v-checkbox>
                                </v-col>
                              </v-row>
                            </v-container>
                          </v-form>
                        </v-card-text>
                  
                        <!-- Footer della finestra di dialogo -->
                        <v-card-actions>
                          <v-btn text @click="userDetailsDialog = false">Chiudi</v-btn>
                          <v-btn color="primary" @click="saveChanges">Salva Modifiche</v-btn>
                          <v-btn color="red" @click="deleteUser">Elimina Utente</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </template>
            </v-container>
        </v-app>
    </div>
  `, 

  data() {
    return {
      search: '',
      userExist: false,
      completed: false, 
      dialog: false, // Variabile per gestire lo stato del dialogo
      userDetailsDialog: false, 
      selectedUser: {}, 
      valid: false, // Variabile per validare il modulo
      newUser: { // Oggetto per il nuovo utente
          nome: '',
          cognome: '',
          telefono: '',
          compenso: '',
          pagato: true,
          mail: '',
          password:'alfapassword', 
          doposcuola: false,
          ruolo: false
      },
        users: [],
        headers: [
            { text: 'Nome', value: 'nome' },
            { text: 'Cognome', value: 'cognome' },
            { text: 'Tariffa (ora)', value: 'compenso' },
            { text: 'Materie' , value: 'materie'},
            { text: 'Pagato', value: 'stato_pagamento' },
            { text: 'Dopo Scuola', value: 'doposcuola' }
        ],
        rules: {
            required: value => !!value || 'Obbligatorio.',
            isNumber: value => /^\d+$/.test(value) || 'Inserisci solo numeri.',
            mail: value => {
              const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              return pattern.test(value) || 'Inserisci un’email valida.';
            }, 
            noSpecialChars: value => {
              const pattern = /^[a-zA-Z\s\-]+$/;
              return pattern.test(value) || 'Non inserire caratteri speciali.';
            },
            phoneLengthMin: value => {
              return value.length >= 10 || 'Il numero di telefono deve avere almeno 10 cifre.';
            }
        }
    };
},
computed: {
  filteredUsers() {
    if (!this.search) return this.users;
    return this.users.filter(user =>
        user.nome.toLowerCase().includes(this.search.toLowerCase()) ||
          user.cognome.toLowerCase().includes(this.search.toLowerCase()) ||
          (user.materie && user.materie.toLowerCase().includes(this.search.toLowerCase()))
      );
  }
},
created() {
  this.fetchUsers(); // Carica gli utenti quando l'app viene creata
}, 
methods: {
  fetchUsers() {
    fetch('/test/db.php?azione=getUtenti')
    .then(response => {
      console.log('Codice di stato:', response.status); // Stampa il codice di stato
      if (!response.ok) {
          const errorMessage = `Errore ${response.status}: ${response.statusText}`;
          console.error(errorMessage); // Stampa il messaggio di errore nel console log
          throw new Error(errorMessage); // Genera un errore con il messaggio personalizzato
      }
      return response.json();
    })
    .then(data => {
      console.log('Dati ricevuti:', data);
      // Itera attraverso gli utenti e formatta i nomi e i cognomi
      this.users = data.map(user => ({
        ...user,
        nome: this.capitalizeFirstLetter(user.nome),
        cognome: this.capitalizeFirstLetter(user.cognome)
      })); 
    })
    .catch(error => {
      console.error('Errore nel recuperare gli utenti:', error);
    });
  },
  
  capitalizeFirstLetter(string) {
    if (!string) return string; // Controlla se la stringa è vuota
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  },

  // etichette materie 
  getColor(materie) {
    switch (materie) {
      case 'informatica':
        return '#ff7f7f'; // Rosso scuro
      case 'matematica':
        return '#87ceeb'; // Blu scuro
      case 'fisica':
        return '#66cdaa'; // Verde scuro
      default:
        return '#a9a9a9'; // Grigio scuro
    }
  },
  addToSearch(materie) { 
    this.search = materie;  // Imposta il campo di ricerca sulla materia selezionata
  }, 

  // finestra di dialogo
  openNewUserDialog() {
      this.dialog = true; // Apri il dialogo
      this.newUser = { // Resetta il nuovo utente
          mail: '',  
          nome: '',
          cognome: '',
          telefono: '',
          compenso: '',
          pagato: true ,
          userExist: false, 
          password: ''
      };
  },
  //apertura dei dettagli utente con rispettive modifiche elementi
  openDetails(item) {
    this.selectedUser = { ...item }; // Copia dei dati dell'utente selezionato
    this.userDetailsDialog = true; // Apri la finestra modale
  },
  
  async toggleDoposcuola(id) {
        // Trova l'elemento corrispondente
        this.completed = false; 
        const user = this.users.find(user => user.id_collaboratore === id);
        console.log('ID passato:', id);


        // Invia la richiesta per aggiornare il database
         fetch('/test/db.php?azione=toggleDoposcuola',{
          method: 'POST', // O 'POST', a seconda della tua API
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ doposcuola: user.doposcuola, id_collaboratore: user.id_collaboratore }), // Passa il nuovo stato
        }).then(response => {
          console.log('Codice di stato:', response.status); // Stampa il codice di stato
          console.log('Stato doposcuola aggiornato nel database');
          this.fetchUsers();
          this.completed = true; // mostra allert
          return response.json();
        })

        // Aggiorna lo stato locale per riflettere il cambiamento
        this.fetchUsers(); // Ricarica la lista utenti
    }, 

  saveChanges() {
    // Logica per salvare le modifiche dell'utente
    this.userDetailsDialog= false; // Chiudi la finestra modale
    // Puoi aggiungere la logica per aggiornare i dati nel database o nell'elenco items
  }, 

  deleteUser() {
        const confirmation = confirm("Sei sicuro di voler eliminare questo utente?");
        this.completed = false; 
        if (!confirmation) return; // Esci se l'utente annulla

        try { 
            fetch('/test/db.php?azione=deleteUser', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
                body: JSON.stringify({id_utente: this.selectedUser.id_utente, id_collaboratore: this.selectedUser.id_collaboratore}),
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
              // Assicurati che l'operazione sia riuscita prima di fare il fetch degli utenti
              if (data.success) {
                this.completed = true; // mostra allert
                this.fetchUsers(); // Ricarica la lista utenti
                this.userDetailsDialog = false; // Chiudi la finestra di dialogo
              } else {
                alert(data.message); // Mostra messaggio di errore se non è andato a buon fine
              }
            });
          }catch (error) {
            console.error("Errore durante la richiesta:", error);
            alert("Si è verificato un errore durante l'eliminazione dell'utente.");
        }
    },
  
  updateUser() {},

  // nuovo utente
  saveUser() {
    if (this.$refs.form.validate()) {
      this.completed = false; 
      console.log('Dati inviati:', this.newUser); // Controlla se il campo mail è presente
      fetch('/test/db.php?azione=addUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Assicurati di avere il corretto header
        },
        body: JSON.stringify(this.newUser), // Assicurati che il corpo venga inviato correttamente
      })
      .then(response => response.json()) // Verifica che 'response' venga gestito correttamente
      .then(data => {
        console.log('Dati ricevuti:', data);
        if (data.success) {
          this.fetchUsers(); // Aggiorna la lista degli utenti
          this.dialog = false; // Apri il dialogo
          this.completed = true; 
        } else {
          console.error('Errore:', data.message);
          this.dialog = false; // Apri il dialogo
          this.userExist = true; // Mostra l'alert
        }
      })
      .catch(error => {
        console.error('Errore:', error);
      });
    }
  }
 }
};