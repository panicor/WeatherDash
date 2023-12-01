import { API_KEY } from "../config.js";

let els = {};

for (let i = 1; i <= 5; i++) {
    els[`day${i}Header`] = document.querySelector(`.day${i}Header`);
    els[`day${i}Temp`] = document.querySelector(`.day${i}Temp`);
    els[`day${i}Wind`] = document.querySelector(`.day${i}Wind`);
    els[`day${i}Hum`] = document.querySelector(`.day${i}Hum`);
}

var searchBtn = document.querySelector("#search-btn");
var citiesList = document.querySelector(".citiesBtn");
var showSection = document.querySelector(".show");
var todayTemp = document.querySelector(".todayTemp");
var todayWind = document.querySelector(".todayWind");
var todayHum = document.querySelector(".todayHum");
var todayUVI = document.querySelector(".todayUVI");
var searchValueHeader = document.querySelector(".searchValueHeader");
var date = document.querySelector(".date");
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
  //dynamic url using search input and api key
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
      //grabs lattitude and longitude from data and sets to variable
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

function KelvinToFahrenheit(K) {
  return ((K - 273.15) * (9 / 5) + 32).toFixed(1);
}

function getDayData(data, dayNumber) {
  const dayData = data.daily[dayNumber];
  return {
    date: moment().add(dayNumber, "day").format("MM/DD/YY"),
    temp: JSON.parse(dayData.temp.day),
    wind: JSON.parse(dayData.wind_speed),
    hum: JSON.parse(dayData.humidity),
  };
}

function formatDivs(data, dayNum) {
  let newData = getDayData(data, dayNum);
  console.log(newData);
  els[`day${dayNum}Header`].innerHTML = newData.date;
  els[`day${dayNum}Temp`].innerHTML = "Temperature: " + KelvinToFahrenheit(newData.temp) + "°";
  els[`day${dayNum}Wind`].innerHTML = "Wind: " + newData.wind + " MPH";
  els[`day${dayNum}Hum`].innerHTML = "Humidity: " + newData.hum + " %";
}

function toProperCase(str){
    return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
}

//uses lat and lon to get city from coords
function getCoords(lat, lon, searchValue) {
  //dynamic url
  let coordsUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&exclude={part}&appid=" +
    API_KEY;

  //fetches data from url
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
        
        for (let i = 1; i <= 5; i++) {
          formatDivs(data, i);
        }

        //gets weather from api and sets to variables
        var temp = KelvinToFahrenheit(JSON.parse(data.current.temp));
        var wind = JSON.parse(data.current.wind_speed);
        var hum = JSON.parse(data.current.humidity);
        var uvi = JSON.parse(data.current.uvi);
        //appends to page

        //adds search val and date to page
        searchValueHeader.innerHTML = toProperCase(searchValue);
        date.innerHTML = moment().format("MM/DD/YY");
        //adds weather and icon data to page
        icons.setAttribute(
          "src",
          "http://openweathermap.org/img/w/" +
            data.current.weather[0].icon +
            ".png"
        );
        todayTemp.innerHTML = "Temperature: " + temp + "°";
        todayWind.innerHTML = "Wind: " + wind + " MPH";
        todayHum.innerHTML = "Humidity: " + hum + " %";
        todayUVI.innerHTML = "UV Index: " + uvi;

        //sets colors to uv background and changes text color
        if (uvi <= 2.5) {
          todayUVI.classList.add("green");
        } else if (uvi > 2.5 && uvi <= 5.5) {
          todayUVI.classList.add("yellow");
        } else if (uvi > 5.5 && uvi <= 7.5) {
          todayUVI.classList.add("orange");
        } else {
          todayUVI.classList.add("red");
        }
      }
    })
    //catches errors
    .catch(function (error) {
      console.error(error);
    });
}

function saveSearchVal(searchValue) {
  //pushes search value to cities array
  cities.push(toProperCase(searchValue));
  //saves to local storage
  localStorage.setItem("cities", cities);
}

//creates button with search value
function createCityButton(name) {
  var newButton = document.createElement("button");
  //value and html set to input name
  newButton.value = name;
  newButton.innerHTML = name;
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
