import { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchCountries = async () => {
            if (searchTerm.trim() === '') {
                setCountries([]);
                setErrorMessage('');
                return;
            }
            try {
                const response = await axios.get(`https://restcountries.com/v3.1/name/${searchTerm}`);
                const data = response.data;
                if (data.length === 1) {
                    setCountry(data[0]);
                    setCountries([]);
                    setErrorMessage('');
                } else if (data.length > 10) {
                    setCountry(null);
                    setCountries([]);
                    setErrorMessage('Too many matches, specify another filter.');
                } else {
                    setCountry(null);
                    setCountries(data);
                    setErrorMessage('');
                }
            } catch (error) {
                setCountry(null);
                setCountries([]);
                setErrorMessage('Error fetching data.');
            }
        };

        fetchCountries();
    }, [searchTerm]);

    const handleInputChange = event => {
        setSearchTerm(event.target.value);
    };

    const handleSubmit = event => {
        event.preventDefault();
        // No need to fetch countries here, useEffect will handle it
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="search">find countries</label>
                <input
                    type="text"
                    id="search"
                    value={searchTerm}
                    onChange={handleInputChange}

                />
                <button type="submit">Search</button>
            </form>
            {errorMessage && <p>{errorMessage}</p>}
            {country && (
                <div>
                    <h2>{country.name.common}</h2>
                    <p>capital {country.capital}</p>
                    <p>area {country.area}</p>
                    <h3>languages:</h3>
                    <ul>
                        {Object.entries(country.languages).map(([key, value]) => (
                            <li key={key}>{value}</li>
                        ))}
                    </ul>
                    <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="150" />
                </div>
            )}
            {countries.length > 0 && (
                <div>
                    <ul>
                        {countries.map((country, index) => (
                            <li key={index}>{country.name.common}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default App;
