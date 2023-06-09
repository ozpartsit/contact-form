const CountryService= {
    load: async function (pageNumber) {
        let response = await fetch (`https://jsonmock.hackerrank.com/api/countries?page=${pageNumber}`);
        let data = await response.json();
        return data;
    },
};
export default CountryService;
