const yargs = require('yargs');

const geocode = require('./geocode/geocode.js');
const weather = require('./weather/weather.js');

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

geocode.geocodeAddress(argv.address, (errorMessage, results) => {
  if (errorMessage) {
    console.log(errorMessage);
  } else {
    console.log(results.address);
    weather.getWeather(results.latitude,results.longitude, (errorWeatherMessage, weatherResults) => {
        if (errorWeatherMessage) {
          console.log(errorWeatherMessage);
        } else {
          var t1 = tuc.fahrenheitToCelsius(weatherResults.temperature).toFixed(2);
          var t2 = tuc.fahrenheitToCelsius(weatherResults.apparentTemperature).toFixed(2);
          console.log(`It's currently ${weatherResults.temperature} oF (${t1} oC). It feels like ${weatherResults.apparentTemperature} oF (${t2} oC).`);
        }
    });

  }
});
