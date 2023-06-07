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
            color="blue"
        ></v-text-field>
        <v-text-field
            v-model="lastname"
            :rules="nameRules"
            label="Last Name"
            required
            clearable
            color="blue"
        ></v-text-field>
        <v-text-field
            prepend-icon="mdi-email"
            v-model="email"
            :rules="emailRules"
            label="Contact e-mail"
            required
            clearable
            color="blue"
        ></v-text-field>
        <v-autocomplete
            v-model="country"
            :items="countries"
            item-title="name"
            item-value="alpha2Code"
            :rules="[(v) => !!v || 'field is required']"
            label="Purpose of the trip"
            return-object
            required
            append-icon="mdi-airplane-search"
            hide-no-data
            :loading="loading"
            clearable
            color="blue"
        ></v-autocomplete>
        <!-- Begin of informations about the selected country -->
        <v-container  v-if="country">
          <v-row>
            <v-col class="v-col-12 v-col-sm-6">
              <v-row class="align-center">
                <v-col class="v-col-3">
                  <v-icon color="blue" size="large"> mdi-town-hall</v-icon>
                </v-col>
                <v-col class="v-col-9">
                  <p class="text-subtitle-1">{{ country.capital }}</p>
                  <p class="text-body-2 text-grey-darken-1">Capital</p>
                </v-col>
              </v-row>
            </v-col>

            <v-col class="v-col-12 v-col-sm-6">
              <v-row class="align-center">
                <v-col class="v-col-3">
                  <v-icon color="blue" size="large"> mdi-web </v-icon>
                </v-col>
                <v-col class="v-col-9">
                  <p class="text-subtitle-1">{{ country.language[0] }}</p>
                  <p class="text-body-2 text-grey-darken-1">Language</p>
                </v-col>
              </v-row>
            </v-col>

            <v-col class="v-col-12 v-col-sm-6">
              <v-row class="align-center">
                <v-col class="v-col-3">
                  <v-icon color="blue" size="large">mdi-account-group</v-icon>
                </v-col>
                <v-col class="v-col-9">
                  <p class="text-subtitle-1">{{ country.population }}</p>
                  <p class="text-body-2 text-grey-darken-1">Population</p>
                </v-col>
              </v-row>
            </v-col>

            <v-col class="v-col-12 v-col-sm-6">
              <v-row class="align-center">
                <v-col class="v-col-3">
                  <v-icon color="blue" size="large"> mdi-map-search-outline</v-icon>
                </v-col>
                <v-col class="v-col-9">
                  <p class="text-subtitle-1">{{ country.region }}</p>
                  <p class="text-body-2 text-grey-darken-1">Region</p>
                </v-col>
              </v-row>

            </v-col>
          </v-row>

        </v-container>
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
        <v-btn class="mt20" :disabled="!valid" color="primary" @click="send" block>
          Send an inquiry
        </v-btn>
      </v-card-actions>
      <v-divider></v-divider>
      <v-btn color="light-green-darken-1" small text @click="reset" block> reset</v-btn>
    </v-card>
  </v-form>
</template>

<script>
import axios from 'axios';

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
  async created() {
    this.loading = true
    this.countries = await this.getCountries()
    this.loading = false
  },
  methods: {
    async getCountries() {
      try {
        const totalPagesResponse = await axios.get(
            'https://jsonmock.hackerrank.com/api/countries'
        );
        const totalPagesData = totalPagesResponse.data;
        const totalPages = totalPagesData.total_pages;

        let countries = [];

        for (let i = 1; i <= totalPages; i++) {
          const response = await axios.get(
              `https://jsonmock.hackerrank.com/api/countries?page=${i}`
          );
          const data = response.data;
          countries = countries.concat(data.data);
        }

        return countries;
      } catch (error) {
        console.error('Failed to fetch countries:', error);
        return [];
      }
    },
    send() {
      this.valid = this.validation()
      if (this.valid) alert("The application has been sent!")
    },
    reset() {
      this.$refs.form.reset()
    },
    validation() {
      return this.$refs.form.validate()
    },
  },
}
</script>