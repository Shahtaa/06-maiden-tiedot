import { useState, useEffect } from 'react';
import axios from 'axios';

const Country = ({ country }) => {
    const [weather, setWeather] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const api_key = import.meta.env.VITE_SOME_KEY;
                const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&appid=${api_key}`);
                const weatherData = response.data;
                setWeather(weatherData);
                setErrorMessage('');
            } catch (error) {
                setWeather(null);
                setErrorMessage('Error fetching weather data.');
            }
        };

        fetchWeather();
    }, [country]);

    const getWeatherIconUrl = (iconCode) => `http://openweathermap.org/img/w/${iconCode}.png`;

    return (
        <div>
            <h2>{country.name.common}</h2>
            <p>capital {country.capital}</p>
            <p>area {country.area}</p>
            <h3>languages:</h3>
            <ul>
                {Object.values(country.languages).map((language, index) => (
                    <li key={index}>{language}</li>
                ))}
            </ul>
            <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="150" />
            {weather && (
                <div>
                    <h3>Weather in {country.capital}</h3>

                    {weather.weather[0].icon && (
                        <>
                            <p>temperature {(weather.main.temp - 273.15).toFixed(2)} Celcius</p>
                            <img src={getWeatherIconUrl(weather.weather[0].icon)} alt="Weather Icon" style={{ width: '100px', height: '100px' }} />
                        </>
                    )}
                    {weather.wind && <p>wind {weather.wind.speed} m/s</p>}
                </div>
            )}
            {errorMessage && <p>{errorMessage}</p>}
        </div>
    );
};

export default Country;
