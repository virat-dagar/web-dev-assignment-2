const API_KEY = "0b8237594f53cf34dc63e58cbeeaa613";
        
        const weatherBox = document.getElementById("weather");
        const historyBox = document.getElementById("history");

        /* ---------- WEATHER FETCH ---------- */
        async function getWeather(city) {

            

            const res = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
            );
            if (!res.ok) {
                alert("city not found");
                throw new Error("City not found");
            }
            const data = await res.json();
            return data;
        }

         /* ---------- BUTTON CLICK ---------- */
        document.getElementById("searchBtn").onclick = () => {
            const city = cityInput.value.trim();
            if (city) {
                search(city);
            }
        };

       
       function renderWeather(d) {
    const icon = d.weather[0].icon;

    weatherBox.innerHTML = `
        <div style="text-align:center; margin-bottom:20px;">
            <h2>${d.name}, ${d.sys.country}</h2>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png">
            <h1>${d.main.temp}°C</h1>
            <p>${d.weather[0].description}</p>
        </div>

        <div class="weather-item">
            <span>💧 Humidity</span>
            <span>${d.main.humidity}%</span>
        </div>

        <div class="weather-item">
            <span>🌬 Wind</span>
            <span>${d.wind.speed} m/s</span>
        </div>

        <div class="weather-item">
            <span>🌡 Feels Like</span>
            <span>${d.main.feels_like} °C</span>
        </div>
    `;
}   
          

        /* ---------- SEARCH FUNCTION ---------- */
        async function search(city) {
            weatherBox.innerHTML = "";
            try {
                const data = await getWeather(city);
                renderWeather(data);
                saveHistory(data.name); 
            } catch (error) {
                weatherBox.innerHTML = `<p style="color:red">${error.message}</p>`;
            }
        }
       
        /* ---------- ENTER KEY SEARCH ---------- */
        cityInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                const city = cityInput.value.trim();
                if (city) {
                    search(city);
                }
            }
        });
        /* ---------- INITIAL LOAD ---------- */
        showHistory();  

        /* ---------- SAVE SEARCH HISTORY ---------- */
        function saveHistory(city) {
           let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];

   
        if (!history.includes(city)) {
            history.unshift(city); 
    }

    history = history.slice(0, 5);

    localStorage.setItem("weatherHistory", JSON.stringify(history));
    showHistory();
}

/* ---------- SHOW HISTORY ---------- */
       function showHistory() {
           const history = JSON.parse(localStorage.getItem("weatherHistory")) || [];

        historyBox.innerHTML = "";

         history.forEach(city => {
            const btn = document.createElement("button");
        btn.textContent = city;
        btn.onclick = () => search(city);
        historyBox.appendChild(btn);
    });
}

/* ---------- GET WEATHER BY COORDINATES ---------- */
async function getWeatherByCoords(lat, lon) {
    const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    if (!res.ok) {
        throw new Error("Location weather not found");
    }

    const data = await res.json();
    return data;
}

/* ---------- LOCATION BUTTON CLICK ---------- */
document.getElementById("locationBtn").onclick = () => {
    if (!navigator.geolocation) {
        alert("Geolocation not supported");
        return;
    }

    weatherBox.innerHTML = "<p>📍 Fetching your location...</p>";

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            try {
                const { latitude, longitude } = position.coords;

                const data = await getWeatherByCoords(latitude, longitude);
                renderWeather(data);

                saveHistory(data.name); // save location city also
            } catch (err) {
                weatherBox.innerHTML = `<p style="color:red">${err.message}</p>`;
            }
        },
        () => {
            alert("Location access denied");
        }
    );
};