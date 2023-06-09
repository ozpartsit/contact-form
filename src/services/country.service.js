const CountryService= {
    loadCountries: async function (pageNumber) {
        let response = await fetch (`https://jsonmock.hackerrank.com/api/countries?page=${pageNumber}`);
        let data = await response.json();
        return data;
    },
    loadCountryData:  async function (countryName){
        let response = await fetch (`https://jsonmock.hackerrank.com/api/countries/search?name=${countryName}`);
        let data = await response.json();
        return data;
    }

};
export default CountryService;
