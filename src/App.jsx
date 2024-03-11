import { useState, useEffect } from 'react';
import axios from 'axios';

const Country = ({ country }) => (
    <div>
        <h2>{country.name.common}</h2>
        <p>capital {country.capital}</p>
        <p>area {country.area} km²</p>
        <h3>languages:</h3>
        <ul>
            {Object.values(country.languages).map((language, index) => (
                <li key={index}>{language}</li>
            ))}
        </ul>
        <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="150" />
    </div>
);

const App = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchCountries = async () => {
            if (!searchTerm.trim()) {
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
    };

    const handleClickCountry = country => {
        setCountry(country);
        setCountries([]);
        setSearchTerm('');
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="search">Find countries</label>
                <input
                    type="text"
                    id="search"
                    value={searchTerm}
                    onChange={handleInputChange}
                />
                <button type="submit">Search</button>
            </form>
            {errorMessage && <p>{errorMessage}</p>}
            {country && <Country country={country} />}
            {countries.length > 0 && (
                <div>

                    <ul>
                        {countries.map((country, index) => (
                            <li key={index}>
                                {country.name.common}
                                <button onClick={() => handleClickCountry(country)}>show</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default App;
