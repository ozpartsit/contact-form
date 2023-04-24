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
        ></v-autocomplete>
        <!-- Bagin of informations about the selected country -->

        <v-list v-if="country !== null" two-line>
          <v-list-item>
            <v-list-item-avatar>
              <v-icon> mdi-town-hall </v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title v-text="country.capital"></v-list-item-title>
              <v-list-item-subtitle>Capital</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-avatar>
              <v-icon> mdi-web </v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title v-text="country.language[0]"></v-list-item-title>
              <v-list-item-subtitle>Language</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-avatar>
              <v-icon> mdi-account-group </v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title v-text="country.population"></v-list-item-title>
              <v-list-item-subtitle>Population</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-avatar>
              <v-icon> mdi-map-search-outline </v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title v-text="country.region"></v-list-item-title>
              <v-list-item-subtitle>Region</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <!-- End of informations about the selected country -->
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
  }),
  async created () {
    this.loading = true
    this.countries = await this.getCountries()
    this.loading = false
  },
  methods: {
    async getCountries () {
      let totalPages
      let countries = []

      // Getting total number of pages
      const totalPagesResponse = await fetch("https://jsonmock.hackerrank.com/api/countries")
      const totalPagesData = await totalPagesResponse.json()
      totalPages = totalPagesData.total_pages

      // Fetching list of all countries
      for (let i = 1; i <= totalPages; i++) {
        const response = await fetch(`https://jsonmock.hackerrank.com/api/countries?page=${i}`)
        const data = await response.json()
        countries = countries.concat(data.data)
      }
      return countries
    },
    send () {
      this.valid = this.validation()
      if (this.valid) alert("The application has been sent!")
    },
    reset () {
      this.$refs.form.reset()
    },
    validation () {
      return this.$refs.form.validate()
    },
  },
}
</script>