//uses the concealed API key in config.js
const API_KEY = process.env.API_KEY;

//initializes empty object for DOM elements
let els = {};

//creates keys and values dynamically based on the number assigned to each day  
for (let i = 0; i <= 5; i++) {
    els[`day${i}Header`] = document.querySelector(`.day${i}Header`);
    els[`day${i}Icon`] = document.querySelector(`.day${i}Icon`);
    els[`day${i}Temp`] = document.querySelector(`.day${i}Temp`);
    els[`day${i}Wind`] = document.querySelector(`.day${i}Wind`);
    els[`day${i}Hum`] = document.querySelector(`.day${i}Hum`);
    els[`day${i}UVI`] = document.querySelector(`.day${i}UVI`);
}

//selects HTML DOM elements
var searchBtn = document.querySelector("#search-btn");
var citiesList = document.querySelector(".citiesBtn");
var showSection = document.querySelector(".show");
var searchValueHeader = document.querySelector(".searchValueHeader");
var dayContainer = document.querySelector(".dayContainer");
var headerHeader = document.querySelector(".headerHeader");
var icons = document.querySelector(".icon");

//empty array to add to later
var cities = [];

//searches value
function searchVal() {
  //lowercase trimmed search input value
  var searchValue = document
    .querySelector("#search-val")
    .value.trim()
    .toLowerCase();
  //calls other functions using input value
  var newButton = createCityButton(searchValue);
  citiesList.appendChild(newButton);
  saveSearchVal(searchValue);
  getCurrentWeather(searchValue);
}

//uses search term to get weather
function getCurrentWeather(searchValue) {
  //dynamic url using search input and API key
  var queryUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    searchValue +
    "&appid=" +
    API_KEY;

  //fetches from url
  fetch(queryUrl)
    .then(function (res) {
      //returns data in json format
      return res.json();
    })
    .then(function (data) {
      //grabs lattitude and longitude from data and sets to variables
      var lat = data.coord.lat;
      var lon = data.coord.lon;
      //uses lat and long variables to get coordinates of city
      getCoords(lat, lon, searchValue);
    })
    //catches error
    .catch(function (error) {
      //displays error on screen
      console.error(error);
    });
}

//forumla for converting temperatures in Kelvin to Fahrenheit
function KelvinToFahrenheit(K) {
  return ((K - 273.15) * (9 / 5) + 32).toFixed(1);
}

//fatches 5 day forcast data based on the number assigned to the day
function getDayData(data, dayNumber) {
  const dayData = data.daily[dayNumber];
  return {
    date: moment().add(dayNumber, "day").format("MM/DD/YY"),
    temp: JSON.parse(dayData.temp.day),
    wind: JSON.parse(dayData.wind_speed),
    hum: JSON.parse(dayData.humidity),
    uvi : JSON.parse(dayData.uvi)
  };
}

//formats the 5 day forcast data 
function formatDivs(data, dayNum) {
  let newData = getDayData(data, dayNum);
  els[`day${dayNum}Header`].innerHTML = newData.date;
  els[`day${dayNum}Temp`].innerHTML = "Temperature: " + parseInt(KelvinToFahrenheit(newData.temp)) + "°";
  els[`day${dayNum}Wind`].innerHTML = "Wind: " + newData.wind + " MPH";
  els[`day${dayNum}Hum`].innerHTML = "Humidity: " + newData.hum + " %";
  els[`day${dayNum}UVI`].innerHTML = "UV Index: " + newData.uvi;

      //sets styles on UV index based on its value
      if (newData.uvi <= 2.5) {
        els[`day${dayNum}UVI`].classList.add("green");
      } else if (newData.uvi > 2.5 && newData.uvi <= 5.5) {
        els[`day${dayNum}UVI`].classList.add("yellow");
      } else if (newData.uvi > 5.5 && newData.uvi <= 7.5) {
        els[`day${dayNum}UVI`].classList.add("orange");
      } else {
        els[`day${dayNum}UVI`].classList.add("red");
      }
}

//returns input string with only first letter capitalized
function toProperCase(str){
    return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
}

//uses latitude and longitude to get city from coordinates
function getCoords(lat, lon) {
  //dynamic url using latitude, longitude, and API key
  let coordsUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&exclude={part}&appid=" +
    API_KEY;

  //fetches data from dynamic url
  fetch(coordsUrl)
    .then(function (res) {
      //returns data in json format
      return res.json();
    })
    .then(function (data) {
      //if no data, alerts to no city found
      if ((data[0] = null)) {
        alert("Location not found");
        //if location is found, do this
      } else {

        //adds borders to containers
        dayContainer.classList.add("borders");
        showSection.classList.add("borders");

        // 5 day forecast
        headerHeader.innerHTML = "5 Day Forecast: ";
        
        //iterates over days and displays weather
        for (let i = 0; i <= 5; i++) {
          formatDivs(data, i);
        }

        //sets the weather icon in today's weather
        icons.setAttribute(
          "src",
          "http://openweathermap.org/img/w/" +
            data.current.weather[0].icon +
            ".png"
        );
      }
    })
    //catches errors
    .catch(function (error) {
      console.error(error);
    });
}

function saveSearchVal(searchValue) {
  //pushes search value in proper casing to cities array
  cities.push(toProperCase(searchValue));
  //saves cities to local storage
  localStorage.setItem("cities", cities);
}

//creates button with search value
function createCityButton(name) {
  var newButton = document.createElement("button");
  //value and html set to input name
  newButton.value = toProperCase(name);
  newButton.innerHTML = toProperCase(name);
  //event listener to history buttons
  newButton.addEventListener("click", function (event) {
    var cityName = event.target.value;
    //gets weather from button value
    getCurrentWeather(cityName);
  });
  //returns button
  return newButton;
}

//event listener to search click
searchBtn.addEventListener("click", function (event) {
  searchVal();
});
