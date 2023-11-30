require('dotenv').config();

const apiKey = process.env.API_KEY;
//hooks into html
var searchBtn = document.querySelector("#search-btn");
var citiesList = document.querySelector(".citiesBtn");
var showSection = document.querySelector(".show");
var list = document.querySelector(".list");
var list1 = document.querySelector(".list1");
var list2 = document.querySelector(".list2");
var list3 = document.querySelector(".list3");
var list4 = document.querySelector(".list4");
var searchValueHeader = document.querySelector(".searchValueHeader");
var date = document.querySelector(".date");
var uviContainer = document.querySelector(".uvi");
var dayContainer = document.querySelector(".dayContainer");
let dayHeaders = document.querySelectorAll(".dayHeader");
var dayOne = document.querySelector(".dayOne");
var day1Temp = document.querySelector(".day1Temp");
var day1Wind = document.querySelector(".day1Wind");
var day1Hum = document.querySelector(".day1Hum");
var dayTwo = document.querySelector(".dayTwo");
var day2Temp = document.querySelector(".day2Temp");
var day2Wind = document.querySelector(".day2Wind");
var day2Hum = document.querySelector(".day2Hum");
var dayThree = document.querySelector(".dayThree");
var day3Temp = document.querySelector(".day3Temp");
var day3Wind = document.querySelector(".day3Wind");
var day3Hum = document.querySelector(".day3Hum");
var dayFour = document.querySelector(".dayFour");
var day4Temp = document.querySelector(".day4Temp");
var day4Wind = document.querySelector(".day4Wind");
var day4Hum = document.querySelector(".day4Hum");
var dayFive = document.querySelector(".dayFive");
var day5Temp = document.querySelector(".day5Temp");
var day5Wind = document.querySelector(".day5Wind");
var day5Hum = document.querySelector(".day5Hum");
var day1Header = document.querySelector(".day1Header");
var day2Header = document.querySelector(".day2Header");
var day3Header = document.querySelector(".day3Header");
var day4Header = document.querySelector(".day4Header");
var day5Header = document.querySelector(".day5Header");
var headerHeader = document.querySelector(".headerHeader")
var icons = document.querySelector(".icon");
var headerContainer = document.querySelector(".headerContainer");

//empty array to add to later
var cities = [];

//searches value
function searchVal (){
    //lowercase trimmed search input value
    var searchValue = document.querySelector("#search-val").value.trim().toLowerCase();
    //calls other functions using input value
    var newButton = createCityButton(searchValue);
    citiesList.appendChild(newButton);
    saveSearchVal(searchValue);
    getCurrentWeather(searchValue);
}

//uses search term to get weather
function getCurrentWeather (searchValue){
    //dynamic url using search input and api key
    var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&appid=" + apiKey;

    //fetches from url
    fetch(queryUrl)
    .then(function(res) {
        //returns data in json format
        return res.json();
    })
    .then(function(data) {
     //grabs lattitude and longitude from data and sets to variable
    var lat = data.coord.lat;
    var lon = data.coord.lon;
    //uses lat and long variables to get coordinates of city
    getCoords(lat, lon, searchValue);
    })
    //catches error
    .catch (function(error) {
        //displays error on screen
        console.error(error)
    })
}

//uses lat and lon to get city from coords
function getCoords (lat, lon, searchValue){
    //dynamic url
        coordsUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude={part}&appid=" + apiKey;
        
        //fetches data from url
            fetch(coordsUrl)
            .then(function (res){
                //returns data in json format
                return res.json();
            })
            .then(function(data) {
                //if no data, alerts to no city found
              if(data[0] = null){
                  alert("Location not found");
                  //if location is found, do this
              }else{
                //adds borders to containers
                dayContainer.classList.add("borders");
                showSection.classList.add("borders");
                // 5 day forecast
                headerHeader.innerHTML = "5 Day Forecast: ";
                //sets date to day ahead
                day1Header.innerHTML = moment().add(1,"day").format("MM/DD/YY");
                var temp1 = JSON.parse(data.daily[0].temp.day);
                //converts K to F
                temp1 = (((temp1 - 273.15) * (9/5)) + 32).toFixed(1);
                var wind1 = JSON.parse(data.daily[0].wind_speed);
                var hum1 = JSON.parse(data.daily[0].humidity);
                day1Temp.innerHTML = "Temperature: " + temp1 + "°";
                day1Wind.innerHTML= "Wind: " + wind1 + " MPH";
                day1Hum.innerHTML = "Humidity: " + hum1 + " %";

                day2Header.innerHTML = moment().add(2,"day").format("MM/DD/YY");
                var temp2 = JSON.parse(data.daily[1].temp.day);
                //converts K to F
                temp2 = (((temp2 - 273.15) * (9/5)) + 32).toFixed(1);
                var wind2 = JSON.parse(data.daily[1].wind_speed);
                var hum2 = JSON.parse(data.daily[1].humidity);
                day2Temp.innerHTML = "Temperature: " + temp2 + "°";
                day2Wind.innerHTML= "Wind: " + wind2 + " MPH";
                day2Hum.innerHTML = "Humidity: " + hum2 + " %";

                day3Header.innerHTML = moment().add(3,"day").format("MM/DD/YY");
                var temp3 = JSON.parse(data.daily[2].temp.day);
                //converts K to F
                temp3 = (((temp3 - 273.15) * (9/5)) + 32).toFixed(1);
                var wind3 = JSON.parse(data.daily[2].wind_speed);
                var hum3 = JSON.parse(data.daily[2].humidity);
                day3Temp.innerHTML = "Temperature: " + temp3 + "°";
                day3Wind.innerHTML= "Wind: " + wind3 + " MPH";
                day3Hum.innerHTML = "Humidity: " + hum3 + " %";

                day4Header.innerHTML = moment().add(4,"day").format("MM/DD/YY");
                var temp4 = JSON.parse(data.daily[3].temp.day);
                //converts K to F
                temp4 = (((temp4 - 273.15) * (9/5)) + 32).toFixed(1);
                var wind4 = JSON.parse(data.daily[3].wind_speed);
                var hum4 = JSON.parse(data.daily[3].humidity);
                day4Temp.innerHTML = "Temperature: " + temp4 + "°";
                day4Wind.innerHTML= "Wind: " + wind4 + " MPH";
                day4Hum.innerHTML = "Humidity: " + hum4 + " %";

                day5Header.innerHTML = moment().add(5,"day").format("MM/DD/YY");
                var temp5 = JSON.parse(data.daily[4].temp.day);
                //converts K to F
                temp5 = (((temp5 - 273.15) * (9/5)) + 32).toFixed(1);
                var wind5 = JSON.parse(data.daily[4].wind_speed);
                var hum5 = JSON.parse(data.daily[4].humidity);
                day5Temp.innerHTML = "Temperature: " + temp5 + "°";
                day5Wind.innerHTML= "Wind: " + wind5 + " MPH";
                day5Hum.innerHTML = "Humidity: " + hum5 + " %";


                  //gets weather from api and sets to variables
                  var temp = JSON.parse(data.current.temp);
                  //converts K to F
                  temp = (((temp - 273.15) * (9/5)) + 32).toFixed(1);
                  var wind = JSON.parse(data.current.wind_speed);
                  var hum = JSON.parse(data.current.humidity);
                  var uvi = JSON.parse(data.current.uvi);
                  //appends to page

                  //adds search val and date to page
                  searchValueHeader.innerHTML = searchValue;
                  date.innerHTML = moment().format("MM/DD/YY");
                  console.log(data);
                  //adds weather and icon data to page
                  icons.setAttribute("src", "http://openweathermap.org/img/w/" + data.current.weather[0].icon + ".png");
                  list1.innerHTML = "Temperature: " + temp + "°";
                  list2.innerHTML = "Wind: " + wind + " MPH";
                  list3.innerHTML = "Humidity: " + hum + " %";
                  list4.innerHTML = "UV Index: " + uvi;


                  //sets colors to uv background and changes text color
                  if (uvi <= 2.5){
                   list4.style.backgroundColor = "green";
                   list4.style.color = "white";
                  }
                  else if (uvi > 2.5 && uvi <= 5.5){
                    list4.style.backgroundColor = "yellow";
                    list4.style.color = "black";
                }
                  else if (uvi > 5.5 && uvi <= 7.5){
                    list4.style.backgroundColor = "orange";
                    list4.style.color = "black";
                }
                  else {
                    list4.style.backgroundColor = "red";
                    list4.style.color = "white";
            }
              }
               })
               //catches errors
               .catch (function(error) {
                   console.error(error);
               })  
        }

function saveSearchVal (searchValue) {
    //pushes search value to cities array
    cities.push(searchValue);
    //saves to local storage
    localStorage.setItem("cities", cities);
 }

//creates button with search value
function createCityButton(name) {
    var newButton = document.createElement('button');
    //value and html set to input name
    newButton.value = name;
    newButton.innerHTML = name;
    //event listener to history buttons
    newButton.addEventListener('click', function(event){
        var cityName = event.target.value;
        //gets weather from button value
        getCurrentWeather(cityName);
    })
    //returns button
    return newButton;
}
          
//event listener to search click
searchBtn.addEventListener("click", function(event) {
    searchVal();
});

