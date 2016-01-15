var usWeather = {
  
  // API url
  base_path : "http://s3-us-west-2.amazonaws.com/s.cdpn.io/266205/",
  
  // List of cities to find weather data for
  cities : [
    "San_Francisco",
    "Miami",
    "New_Orleans",
    "Chicago",
    "New_York_City"
  ],

  /*
   * Call the weather API when mapping through each city. Each city returns a promise.
   * Store each promise into an array.
   * When all promises resolves, create an object with specific weather data.
   * Render object onto the page.
  */
 
  init : function () {
    var cityData = usWeather.cities.map(usWeather.apiCall);
     
    Promise.all(cityData)
      .then(function(value) {
        var cityData = {
          cities : []
        } ;
        cityData.cities = value.map(usWeather.getSpecificCityWeatherData);
        usWeather.render(cityData);
      })
      .catch(function() {
        console.log("An error has occurred in retrieving the data from the API call.")
      });
  },
  
  /*
   * Call weather API. Returns a Promise.
   * Resolves to an array of weather data.
   *
  */

  apiCall : function (city) {

    var promise = new Promise (function (resolve, reject) {
      // Build complete api url
      var apiUrl = usWeather.base_path + city + ".json";
      
      var xhr = new XMLHttpRequest();
      xhr.open("GET", apiUrl);

      xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          var responseArray = JSON.parse(this.responseText);
          resolve(responseArray);
        }
      };
      
      xhr.send();
    });
    
    return promise;
  },
  
  // Convert from Meters Per Second to Miles Per Hour
  fromMPStoMPH : function (mps) {
    return (Math.round(10 * mps * 2.2369362920544) / 10) + " mph";
  },

  // Convert from Kelvins to Fahrenheit
  convertKtoF : function (kelvin) {
    return Math.round((kelvin - 273.15) * 1.8) + "&deg;";
  },

  // Get weather icon
  getIconURL : function (icon) {
    return "http://openweathermap.org/img/w/" + icon + ".png";
  },
  
  // Create weather data object. Returns the object to render.
  getSpecificCityWeatherData : function (data) {
    var weatherData = {};
    
    weatherData.city = data.name || "";
    weatherData.temp = usWeather.convertKtoF(data.main.temp) || "";
    weatherData.weather = data.weather[0].main || "";
    weatherData.wind = usWeather.fromMPStoMPH(data.wind.speed) || "";
    weatherData.icon = usWeather.getIconURL(data.weather[0].icon) || "";
    
    return weatherData;
  },
  
  // Render data onto page using Handlebars
  render : function (weatherData) {
    var source = $("#weather-template").html();
    var template = Handlebars.compile(source);
    var html = template(weatherData);
    $(".weather-cards").html(html);
  }
  
};

document.addEventListener("DOMContentLoaded", usWeather.init);