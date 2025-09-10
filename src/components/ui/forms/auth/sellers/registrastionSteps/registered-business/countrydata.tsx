import { Country, State, City } from "country-state-city";

// ISO codes of African countries
const africanISOs = [
  "DZ", // Algeria
  "AO", // Angola
  "BJ", // Benin
  "BW", // Botswana
  "BF", // Burkina Faso
  "BI", // Burundi
  "CM", // Cameroon
  "CV", // Cape Verde
  "CF", // Central African Republic
  "TD", // Chad
  "KM", // Comoros
  "CG", // Congo (Brazzaville)
  "CD", // Congo (Kinshasa)
  "DJ", // Djibouti
  "EG", // Egypt
  "GQ", // Equatorial Guinea
  "ER", // Eritrea
  "SZ", // Eswatini
  "ET", // Ethiopia
  "GA", // Gabon
  "GM", // Gambia
  "GH", // Ghana
  "GN", // Guinea
  "GW", // Guinea-Bissau
  "KE", // Kenya
  "LS", // Lesotho
  "LR", // Liberia
  "LY", // Libya
  "MG", // Madagascar
  "MW", // Malawi
  "ML", // Mali
  "MR", // Mauritania
  "MU", // Mauritius
  "MA", // Morocco
  "MZ", // Mozambique
  "NA", // Namibia
  "NE", // Niger
  "NG", // Nigeria
  "RW", // Rwanda
  "ST", // Sao Tome and Principe
  "SN", // Senegal
  "SC", // Seychelles
  "SL", // Sierra Leone
  "SO", // Somalia
  "ZA", // South Africa
  "SS", // South Sudan
  "SD", // Sudan
  "TZ", // Tanzania
  "TG", // Togo
  "TN", // Tunisia
  "UG", // Uganda
  "ZM", // Zambia
  "ZW"  // Zimbabwe
];


// Filter countries using ISO codes
const africanCountries = Country.getAllCountries().filter(c =>
  africanISOs.includes(c.isoCode)
);

// Build location data
export const africaLocationData = africanCountries.reduce((acc, country) => {
  const states = State.getStatesOfCountry(country.isoCode);

  const statesObj = states.length
    ? states.reduce((sAcc, state) => {
        const cities = City.getCitiesOfState(country.isoCode, state.isoCode).map(
          (city) => city.name
        );
        sAcc[state.name] = cities.length ? cities : [""]; // fallback empty city
        return sAcc;
      }, {} as Record<string, string[]>)
    : { "": [""] }; // fallback empty state

  acc[country.name] = { states: statesObj };
  return acc;
}, {} as Record<string, { states: Record<string, string[]> }>);

console.log(Object.keys(africaLocationData)); // th