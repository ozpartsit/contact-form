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
        <v-container>
          <v-row>
            <v-col class="d-flex">
              <v-icon style="color: #3498db">account_balance</v-icon>
              <div class="d-flex flex-column pl-6">
                <div>{{ country.capital }}</div>
                <div class="text-caption">Capital</div>
              </div>
            </v-col>
            <v-col class="d-flex">
              <v-icon style="color: #3498db">language</v-icon>
              <div class="d-flex flex-column pl-6">
                <div>{{ country.language[0] }}</div>
                <div class="text-caption">Language</div>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex">
              <v-icon style="color: #3498db">groups_2</v-icon>
              <div class="d-flex flex-column pl-6">
                <div>{{ country.population.toLocaleString() }}</div>
                <div class="text-caption">Population</div>
              </div>
            </v-col>
            <v-col class="d-flex">
              <v-icon style="color: #3498db">map</v-icon>
              <div class="d-flex flex-column pl-6">
                <div>{{ country.region }}</div>
                <div class="text-caption">Region</div>
              </div>
            </v-col>
          </v-row>
        </v-container>
        <hr />
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
  async created() {
    this.loading = true;
    this.countries = await this.getCountries();
    this.loading = false;
  },
  methods: {
    async getCountries() {
      let countries = [];
      let page = 1;
      let isMore = true;
      while (isMore) {
        const res = await fetch(
            `https://jsonmock.hackerrank.com/api/countries?page=${page}`
        );
        const { total_pages, data } = await res.json();
        countries.push(...data);
        page++;
        isMore = page <= total_pages;
      }
      return countries;
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

