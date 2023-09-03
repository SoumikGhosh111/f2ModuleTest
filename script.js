let container1 = document.querySelector(".container-1");
let container2 = document.querySelector(".container-2");
let fetchDataButton = container1.querySelector("#container-1-button");
let long = container2.querySelector(".long span");
let lat = container2.querySelector(".lat span");
let mapDiv = container2.querySelector(".map"); 


let loc = container2.querySelector(".location span"); 
let windspeed = container2.querySelector(".wind-spedd span"); 
let humi = container2.querySelector(".Humidity span"); 
let timeZone = container2.querySelector(".Time-Zone span"); 
let press = container2.querySelector(".Pressure span"); 
let windDir = container2.querySelector(".Wind-direction span"); 
let UVindex = container2.querySelector(".UV-index span"); 
let feels = container2.querySelector(".feels-like span"); 




fetchDataButton.addEventListener("click", () => {
  fetchGeolocation();
  container1.classList.add("d");
  container2.classList.remove("show-container-2");
})



const apiKey = "cb51427ff69958e095b6ad1f702b2499";
// const apiKey = "0d37d999b4705308cc960c47e35d754d"; 
const baseUrl = "https://api.openweathermap.org/data/2.5/";
 

// fetching geo location
function fetchGeolocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function (position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      
      lat.innerHTML = `Lat: ${latitude}`
      long.innerHTML = `Long: ${longitude}`;    

      fetchWeatherData(latitude, longitude);
      fetchUVindex(latitude, longitude); 
      createMap(latitude, longitude); 

    },function (error) {
      // Handle geolocation error
      switch (error.code) {
        case error.PERMISSION_DENIED:
          console.log("User denied the request for geolocation.");
          break;
        case error.POSITION_UNAVAILABLE:
          console.log("Location information is unavailable.");
          break;
        case error.TIMEOUT:
          console.log("The request to get user location timed out.");
          break;
        case error.UNKNOWN_ERROR:
          console.log("An unknown error occurred.");
          break;
      } 

    });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}


// Data Inserting
function printWeatherData(data){ 
  const location = data.name;
  const windSpeed = Math.ceil(data.wind.speed); 
  const humidity = data.main.humidity;
  const timezone = convertTimezoneOffsetToGMT(data.timezone);
  const pressure = pascalsToAtmospheres(data.main.pressure);
  const windDirection = degreesToWindDirection(data.wind.deg); 
  // const uvIndex = data.uv || 'Not available'; // UV index may not always be present
  const feelsLike = Math.ceil(kelvinToCelsius(data.main.feels_like));

  loc.innerHTML = `Location: ${location}`; 
  windspeed.innerHTML = `Wind Speed: ${windSpeed * 3.6}kmph`; 
  humi.innerHTML = `Humidity: ${humidity}`; 
  timeZone.innerHTML = `Time Zone: ${timezone}`; 
  press.innerHTML = `Pressure: ${pressure}atm`; 
  windDir.innerHTML = `Wind Direction: ${windDirection}`; 
  feels.innerHTML = `Feels Like: ${feelsLike}°`; 
}

function printUvIndex(data){ 
  const UV = data.value; 
  UVindex.innerHTML = `UV Index: ${UV}`; 
}

// data fetching...
async function fetchWeatherData(a, b) {
  const endPoint = `${baseUrl}/weather?lat=${a}&lon=${b}&appid=${apiKey}`;
  try {
    const response = await fetch(endPoint);
    const result = await response.json();
    console.log(result); 
    printWeatherData(result);
  }
  catch (error) {
    console.error(error);
  }

}
async function fetchUVindex(a, b){ 
  const endPoint = `${baseUrl}/uvi?lat=${a}&lon=${b}&appid=${apiKey}`;
  try{ 
    const response = await fetch(endPoint); 
    const result = await response.json(); 
    printUvIndex(result); 
  }
  catch(e){ 
    console.error(e); 
  }
}



// convert raw data to readable data


function degreesToWindDirection(degrees) {
  if (degrees >= 337.5 || degrees < 22.5) {
    return 'North';
  } else if (degrees >= 22.5 && degrees < 67.5) {
    return 'Northeast';
  } else if (degrees >= 67.5 && degrees < 112.5) {
    return 'East';
  } else if (degrees >= 112.5 && degrees < 157.5) {
    return 'Southeast';
  } else if (degrees >= 157.5 && degrees < 202.5) {
    return 'South';
  } else if (degrees >= 202.5 && degrees < 247.5) {
    return 'Southwest';
  } else if (degrees >= 247.5 && degrees < 292.5) {
    return 'West';
  } else if (degrees >= 292.5 && degrees < 337.5) {
    return 'Northwest';
  } else {
    return 'Unknown';
  }
}

function convertTimezoneOffsetToGMT(offsetSeconds) {
  const offsetHours = Math.floor(Math.abs(offsetSeconds) / 3600);
  const offsetMinutes = Math.floor((Math.abs(offsetSeconds) % 3600) / 60);
  const sign = offsetSeconds >= 0 ? '+' : '-';

  const gmtFormat = `GMT ${sign}${String(offsetHours).padStart(2, '0')}:${String(offsetMinutes).padStart(2, '0')}`;
  return gmtFormat;
}

function pascalsToAtmospheres(milibars) {
  const atm = milibars / 1013.25;
  return atm;
}

function kelvinToCelsius(kelvin) {
  const celsius = kelvin - 273.15;
  return celsius;
}



function createMap(lat, long){  
  const latitude = lat; 
  const longitude = long; 
  const url = `https://maps.google.com/maps/?q=${latitude},${longitude}&output=embed`; 
  mapDiv.innerHTML = `<iframe src=${url} width="100%" height="100%" frameborder="0" style="border:0"></iframe>`;
}
