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
          @change="getCountryData"
        ></v-autocomplete>
        <div v-if="this.country !== null & this.country !== undefined">
        <v-row class="px-2 text-center">
          <v-col class="d-flex align-center justify-center" cols="12"
                 md="6"
                 sm="6">
            <v-icon size="30">mdi-town-hall</v-icon>
            <v-col>
              <div>{{ countryData.data[0]? countryData.data[0].capital : ''}}</div>
              <div>Capital</div>
            </v-col>
          </v-col>
          <v-col class="d-flex align-center justify-center" cols="12"
                 md="6"
                 sm="6">
            <v-icon size="30">mdi-web</v-icon>
            <v-col>
              <div>{{ countryData.data[0] ? countryData.data[0].language.join(", ") : ''}}</div>
              <div>Language</div>
            </v-col>
          </v-col>
        </v-row>
        <v-row class="px-2 text-center">
          <v-col class="d-flex align-center justify-center" cols="12"
                 md="6"
                 sm="6">
            <v-icon size="30">mdi-account-group</v-icon>
            <v-col>
              <div>{{ countryData.data[0] ? countryData.data[0].population : ''}}</div>
              <div>Population</div>
            </v-col>
          </v-col>
          <v-col class="d-flex align-center justify-center" cols="12"
                 md="6"
                 sm="6">
            <v-icon size="30">mdi-map-search-outline</v-icon>
            <v-col>
              <div>{{ countryData.data[0] ? countryData.data[0].region : ''}}</div>
              <div>Region</div>
            </v-col>
          </v-col>
        </v-row>
        </div>
        <v-divider/>
        <!-- Bagin of informations about the selected country -->
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
import CountryService from "@/services/country.service";
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
    countryData: null,
    checkbox: false,
  }),
  async created() {
    this.loading = true;
    await this.getCountries();
    this.loading = false;
  },
  methods: {
    async getCountries() {
      const totalPages = 25;
      this.loading = true;

      for(let i = 1; i <= totalPages; i++) {
        try {
          const data = await CountryService.loadCountries(i);
          const countries = data.data.map(country => ({
            name: country.name,
            alpha2Code: country.alpha2Code
          }));
          this.countries = this.countries.concat(countries);
        } catch (error) {
          console.log(error);
        }
      }
      this.loading = false;

    },
    async getCountryData(){
      if (this.country !== null & this.country !== undefined) {
        try {
          const data = await CountryService.loadCountryData(this.country.name);
          this.countryData = data
        }catch (error) {
          console.log(error)
        }
        } else {
        return;
      }
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

