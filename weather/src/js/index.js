const APP_ID = "0ba09f5e565d7b2d91bddfe64b137e9c";

let current_location = {};
let address = "";
let weather = {};
let units = "metric";

//Get location on page load
document.addEventListener("DOMContentLoaded", () => {
    navigator.geolocation.getCurrentPosition((loc_data) => {
        current_location = loc_data;
        getAllWeather(current_location.coords.latitude, current_location.coords.longitude);
    }, () => {
        console.log("Could not get location");
    });
});




// get the weather for a location
const getAllWeather = (latt, long) => {
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${latt}&lon=${long}&appid=${APP_ID}&units=${units}`;
    fetch(url)
    .then((res) => {
        return res.json();
        
    })
    .then((rjson) => {
        weather = rjson;
        console.log(weather);
        convertCoordsToCity(latt, long);
        displayOnScreen(weather);
    })
    .catch((err) => {
        console.log(err);
    })
}


// get city name from coords
const convertCoordsToCity = (latt, long) => {
    const limit = 1;
    const url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latt}&lon=${long}&limit=${limit}&appid=${APP_ID}`;

    fetch(url)
    .then((res) => {
        return res.json();
    })
    .then((rjson) => {
        console.log(rjson[0]);
        address = rjson[0].name  + ", " + rjson[0].country;
        document.getElementById("address").innerHTML = address;
    })
    .catch((err) => {
        console.log(err);
    })
}


// display weather on screen
const displayOnScreen = (weather) => {

    //current weather
    let current = weather.current;
    document.getElementById("main-icon").innerHTML = `<img src="http://openweathermap.org/img/wn/${current.weather[0].icon}@4x.png" class="weather-icon" alt="${current.weather[0].description}" />`;
    document.getElementById("main-desc").innerHTML = `${current.weather[0].main}: ${current.weather[0].description}`;
    
    let d = new Date(current.dt * 1000);
    let formatted_data = d.toUTCString();
    
    document.getElementById("main-date").innerHTML = ` ${formatted_data}`;

    document.getElementById("cloud").innerHTML = ` ${current.clouds}%`;
    document.getElementById("temp").innerHTML = ` ${current.temp}`;
    document.getElementById("feels").innerHTML = ` ${current.feels_like}`;
    document.getElementById("humid").innerHTML = ` ${current.humidity}%`;
    document.getElementById("press").innerHTML = ` ${current.pressure}`;
    document.getElementById("uv").innerHTML = ` ${current.uvi}`;

    let rise = new Date(current.sunrise * 1000);
    let set = new Date(current.sunset * 1000);

    document.getElementById("rise").innerHTML = ` ${formatTime(rise)}`;
    document.getElementById("set").innerHTML = ` ${formatTime(set)}`;


    //todays forecast chart
    let hourly = weather.hourly;
    let chart_labels = [];
    let chart_temps = [];
    let chart_feels = [];
    let chart_humid = [];

    let rain_flag = false;
    let rain_time = null;

    for(let i = 0; i <= 24; i ++){
        let dt = new Date(hourly[i].dt * 1000);
        let time = formatTime(dt)
        chart_labels.push(time);

        chart_temps.push(hourly[i].temp);
        chart_feels.push(hourly[i].feels_like);
        chart_humid.push(hourly[i].humidity);

        let main_weather = hourly[i].weather[0].main;
        
        if(main_weather === "Rain" || main_weather === "Drizzle"){
            rain_flag = true;
            if(rain_time === null){
                rain_time = time;
            }
        }
    }

    if(rain_flag){
        document.getElementById("warning").innerHTML = `Warning: Take a brolly for ${rain_time}`;
    }
        

    const ctx = document.getElementById('todays-forecast').getContext('2d');
    let todaysChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chart_labels,
            datasets: [{
                label: "Temp",
                data: chart_temps,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            },
            {
                label: "Feels like",
                data: chart_feels,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }
            ]
        },
        options: {
            scales: {
                xAxes: [{
                    stacked: true
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
    

}



const formatTime = (dt) => {
    let hours = dt.getHours();
    let mins = dt.getMinutes();

    if(hours < 10){
        hours = "0" + hours
    }

    if(mins < 10){
        mins = "0" + mins
    }

    return hours + ":" + mins;
}