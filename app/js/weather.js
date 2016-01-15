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
  
  // Map through each city calling the api, collect each promise and store in an array
  // Use Promise.all to create an object with the necessary data and then render onto the page
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
  
  // Create a new promise each time the API is called. End result is returning the promise
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
  
  // Create an object with only the weather data needed to render onto the page.
  getSpecificCityWeatherData : function (data) {
    var weatherData = {};
    
    weatherData.city = data.name;
    weatherData.temp = usWeather.convertKtoF(data.main.temp);
    weatherData.weather = data.weather[0].main;
    weatherData.wind = usWeather.fromMPStoMPH(data.wind.speed);
    weatherData.icon = usWeather.getIconURL(data.weather[0].icon);
    
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

$(usWeather.init);