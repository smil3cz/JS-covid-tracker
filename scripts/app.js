const container = document.getElementById("container");
const API_LINK_COVID = `https://api.covid19api.com/summary`;
const API_LINK_COUNTRIES = `https://restcountries.eu/rest/v2/all`;
let DATA_COVID;
let DATA_COUNTRIES;
let DATA_RENDER = [];

// FETCH DATA FROM COVID API
const fetchDataCovid = async () => {
  try {
    const response = await fetch(API_LINK_COVID);
    const processedResponse = await response.json();
    DATA_COVID = processedResponse;
  } catch (error) {
    console.log(error.message);
  }
};

// FETCH DATA ABOUT COUNTRIES
const fetchDataCountry = async () => {
  try {
    const response = await fetch(API_LINK_COUNTRIES);
    const processedResponse = await response.json();
    DATA_COUNTRIES = processedResponse;
  } catch (error) {
    console.log(error.message);
  }
};

// FETCH DATA FROM BOTH RESPONSES IN ONE ARRAY - DATA_COUNTRIES
const countriesDataMerge = () => {
  let countryData = {};
  const countries = [];
  DATA_COVID.Countries.forEach((country) => {
    countryData.countryName = country.Country;
    countryData.countryCode = country.CountryCode;
    countryData.totalConfirmed = country.TotalConfirmed;
    countryData.totalRecovered = country.TotalRecovered;
    countryData.totalDeaths = country.TotalDeaths;
    countries.push(countryData);
    countryData = {};
  });
  DATA_COUNTRIES.forEach((country) => {
    countries.forEach((mainCountryData) => {
      // CHECK BOTH DATA OBJECTS IF COUNTRY CODE IS SAME TO AVOID LOOPING
      if (country.alpha2Code !== mainCountryData.countryCode) {
        return;
      }
      mainCountryData.countryPopulation = country.population;
      mainCountryData.countryRegion = country.region;
      mainCountryData.countryFlag = country.flag;
    });
  });
  return countries;
};

// FILL DATA_RENDER WITH OBJECTS WHICH CONTAINS ID, htmlElement
const dataToRender = (data) => {
  let htmlElement = {};
  data.forEach((item) => {
    htmlElement.id = item.countryCode;
    htmlElement.html = `
    <div class="country__container">
      <img class="country__flag" src="${item.countryFlag}">
      <div class="country__data">
        <h1 class="country__name">${item.countryName}</h1>
        <p class="country__population"><span class="title__bold">Population:</span><span class="country__text">${item.countryPopulation.toLocaleString()}</span></p>
        <p class="country__region"><span class="title__bold">Region:</span><span class="country__text">${item.countryRegion.toLocaleString()}</span></p>
        <p class="country__total-confirmed"><span class="title__bold">Total confirmed:</span><span class="country__text">${item.totalConfirmed.toLocaleString()}</span></p>
        <p class="country__total-recovered"><span class="title__bold">Total recovered:</span><span class="country__text">${item.totalRecovered.toLocaleString()}</span></p>
        <p class="country__total-deaths"><span class="title__bold">Total deaths:</span><span class="country__text">${item.totalDeaths.toLocaleString()}</span></p>
      </div>
    </div>
    `;
    DATA_RENDER.push(htmlElement);
    htmlElement = {};
  });
};

// RENDER ALL HTML ELEMENTS TO DISPLAY
const render = () => {
  DATA_RENDER.forEach((country) =>
    container.insertAdjacentHTML("beforeend", country.html)
  );
};

// MAIN APP FUNCTION
const App = async () => {
  await fetchDataCovid();
  await fetchDataCountry();
  const data = countriesDataMerge();
  dataToRender(data);
  render();
};

App();
