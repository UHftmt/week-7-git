async function fetch_tool(link) {
    try {
        const response = await fetch(link);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        return null; 
    }
}

function clear_table() {
    const dataCells = document.querySelectorAll('.cell'); 
    dataCells.forEach(cell => {
        cell.textContent = '';
        if (cell.href) cell.removeAttribute('href');
    });
}

const select = document.getElementById('country-seleter');
const spinner = document.getElementById('loading-spinner');

select.addEventListener('change', async () => {
    const country_name = select.value;
    if (!country_name) return;

    try {
        clear_table();
        spinner.classList.remove('hidden');

        const link1 = `https://restcountries.com/v3.1/name/${country_name}`;
        const data1 = await fetch_tool(link1);

        if (!data1) throw new Error("Could not fetch country data.");
        
        const country_data = data1[0];
        const [latitude, longitude] = country_data.capitalInfo.latlng;

        const link2 = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,rain&forecast_days=1`;
        const data2 = await fetch_tool(link2);

        if (!data2) throw new Error("Could not fetch weather data.");

        document.getElementById("name").textContent = country_data.name.common;
        document.getElementById("official-name").textContent = country_data.name.official;
        document.getElementById("capital-city").textContent = country_data.capital[0];
        document.getElementById("language").textContent = Object.values(country_data.languages)[0];
        document.getElementById('population').textContent = country_data.population.toLocaleString();
        document.getElementById("flag").textContent = country_data.flag;
        document.getElementById("latitude-longitude").textContent = `${latitude}, ${longitude}`;
        
        const mapElement = document.getElementById("map");
        mapElement.textContent = "View Map";
        mapElement.href = country_data.maps.googleMaps;

        const total_rainfall = data2.hourly.rain.reduce((sum, current) => sum + current, 0);
        document.getElementById("rainfall").textContent = `${total_rainfall.toFixed(2)} mm`;

        const total_temps = data2.hourly.temperature_2m;
        const average_temp = total_temps.reduce((sum, current) => sum + current, 0) / total_temps.length;
        document.getElementById('average-temp').textContent = `${average_temp.toFixed(1)} °C`;

    } catch (error) {
        console.error("An error occurred:", error);
        document.getElementById("name").textContent = "Failed to load data.";
    } finally {
        spinner.classList.add('hidden');
    }
});

function hello() {
    return "hello";
}





