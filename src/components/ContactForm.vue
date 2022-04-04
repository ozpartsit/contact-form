<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-card>
      <v-card-text>
        <v-text-field
          v-model="name"
          :rules="nameRules"
          label="Name"
          required
          clearable
        ></v-text-field>
        <v-text-field
          v-model="lastname"
          :rules="nameRules"
          label="Last Name"
          required
          clearable
        ></v-text-field>
        <v-text-field
          prepend-icon="mdi-email"
          v-model="email"
          :rules="emailRules"
          label="Contact e-mail"
          required
          clearable
        ></v-text-field>
        <v-autocomplete
          v-model="country"
          :items="countries"
          item-text="name"
          item-value="alpha2Code"
          :rules="[(v) => !!v || 'field is required']"
          label="Purpose of the trip"
          return-object
          required
          append-icon="mdi-airplane-search"
          hide-no-data
          :loading="loading"
          clearable
          @change="getInfo(country)"
        ></v-autocomplete>
        <v-row v-if="country">
          <v-col>
            <v-list>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="#3498DB"> mdi-town-hall </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ capital }}</v-list-item-title>
                  <v-list-item-subtitle>Capital</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="#3498DB"> groups </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ population }}</v-list-item-title>
                  <v-list-item-subtitle>Population</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="#3498DB"> language </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ language }}</v-list-item-title>
                  <v-list-item-subtitle> Language </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="#3498DB"> mdi-map-search-outline </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ region }}</v-list-item-title>
                  <v-list-item-subtitle>Region</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

            </v-list>
          </v-col>
        </v-row>
        <!-- First version -->
        <!--
        <v-container>
          <v-icon style="color: #3498DB">apartment</v-icon>
          Capital: {{capital}}
        </v-container>
        <v-container>
          <v-icon style="color: #3498DB">groups</v-icon>
          Population: {{population}}
        </v-container>
        <v-container>
          <v-icon style="color: #3498DB">language</v-icon>
          Language: {{language}}
        </v-container>
        <v-container>
          <v-icon style="color: #3498DB">map</v-icon>
          Region: {{region}}
        </v-container>
        -->
        <v-checkbox
          v-model="checkbox"
          :rules="[(v) => !!v || 'You must agree to continue!']"
          label="I agree to the terms and conditions"
          required
          hide-details
        ></v-checkbox>
      </v-card-text>
      <v-card-actions>
        <v-btn :disabled="!valid" color="primary" @click="send" block>
          Send an inquiry
        </v-btn>
      </v-card-actions>
      <v-divider></v-divider>
      <v-btn color="info" small text @click="reset" block> reset </v-btn>
    </v-card>
  </v-form>
</template>

<script>
export default {
  name: "ContactForm",
  data: () => ({
    loading: false,
    valid: false,
    name: "",
    lastname: "",
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length >= 3) || "Name must be more than 2 characters",
    ],
    email: "",
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    country: null, //selected country
    countries: [], //list of available countries
    checkbox: false,
    capital: "",
    population: "",
    region: "",
    language: ""
  }),
  async created() {
    this.loading = true;
    this.countries = await this.getCountries();
    this.loading = false;
  },
  methods: {
    async getCountries() {
      let allCountries = [];
      let morePagesAvailable = true;
      let currentPage = 0;

      while(morePagesAvailable) {
        currentPage++;
        const response = await fetch(`https://jsonmock.hackerrank.com/api/countries?page=${currentPage}`)
        let { data, total_pages } = await response.json();
        data.forEach(e => allCountries.unshift(e));
        morePagesAvailable = currentPage < total_pages;
      }
      return allCountries;
    },
    async getInfo(country) {
      this.capital = `${country.country.capital}`;
      this.language = `${country.country.language.join(", ")}`;
      const pop = country.country.population.toString().match(/(\d+?)(?=(\d{3})+(?!\d)|$)/g);
      this.population = `${pop.join(" ")}`;
      this.region = `${country.country.region}`;
      return `${this.capital} ${this.language} ${this.population} ${this.region}`;
    },
    send() {
      this.valid = this.validation();
      if (this.valid) alert("The application has been sent!");
    },
    reset() {
      this.$refs.form.reset();
    },
    validation() {
      return this.$refs.form.validate();
    },
  },
};
</script>

