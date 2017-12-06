const yargs = require('yargs');
const axios = require('axios');
var tuc = require('temp-units-conv');

const argv = yargs
.options({
  a: {
    demand: true,
    alias: 'address',
    describe: 'Address to fetch weather for',
    string: true
  }
})
.help()
.alias('help', 'h')
.argv;

var encodedAddress = encodeURIComponent(argv.address);
var geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`;

axios.get(geocodeUrl)
.then((response) => {
  if (response.data.status === 'ZERO_RESULTS') {
      throw new Error('Unable to find that address.');
  }
  if (response.data.status === 'OVER_QUERY_LIMIT') {
      throw new Error('Quote exceeded. Try again later.');
  }
  var latitude = response.data.results[0].geometry.location.lat;
  var longitude = response.data.results[0].geometry.location.lng;
  var weatherUrl = `https://api.darksky.net/forecast/d327154ad44b41c11c44d66639f32bfa/${latitude},${longitude}`;
  console.log(response.data.results[0].formatted_address);
  return axios.get(weatherUrl);
}).then((response) => {
  var temperature = response.data.currently.temperature;
  var apparentTemperature = response.data.currently.apparentTemperature;
  var t1 = tuc.fahrenheitToCelsius(temperature).toFixed(2);
  var t2 = tuc.fahrenheitToCelsius(apparentTemperature).toFixed(2);
  console.log(`It's currently ${temperature} oF (${t1} oC). It feels like ${apparentTemperature} oF (${t2} oC).`);
}).catch((e) => {
  if (e.code === 'ENOTFOUND') {
    console.log('Unable to connect to API servers.');
  } else {
    console.log(e.message);
  }
});
