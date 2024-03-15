import { useState, useEffect } from 'react';
import axios from 'axios';
import Country from './components/Country';

const App = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const fetchCountries = async () => {
        if (!searchTerm.trim()) {
            setCountries([]);
            setErrorMessage('');
            return;
        }
        try {
            const response = await axios.get('https://restcountries.com/v3.1/all');
            const data = response.data;
            const filteredCountries = data.filter(country =>
                country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setCountry(null);
            if (filteredCountries.length === 1) {
                setCountry(filteredCountries[0]);
                setCountries([]);
                setErrorMessage('');
            } else if (filteredCountries.length > 10) {
                setCountry(null);
                setCountries([]);
                setErrorMessage('Too many matches, specify another filter.');
            } else {
                setCountry(null);
                setCountries(filteredCountries);
                setErrorMessage('');
            }
        } catch (error) {
            setCountry(null);
            setCountries([]);
            setErrorMessage('Error fetching data.');
        }
    };

    useEffect(() => {
        fetchCountries();
    }, [searchTerm]);

    const handleInputChange = event => {
        setSearchTerm(event.target.value);
    };

    const handleShowCountry = selectedCountry => {
        setCountry(selectedCountry);
        setCountries([]); // Clear other countries
        setErrorMessage(''); // Clear error message
    };

    return (
        <div>
            <form onSubmit={e => e.preventDefault()}>
                <label htmlFor="search">Find countries</label>
                <input
                    type="text"
                    id="search"
                    value={searchTerm}
                    onChange={handleInputChange}
                />
                <button>Search</button>
            </form>
            {errorMessage && <p>{errorMessage}</p>}
            {country && <Country country={country} />}
            {countries.length > 0 && (
                <ul>
                    {countries.map((country, index) => (
                        <li key={index}>
                            {country.name.common}
                            <button onClick={() => handleShowCountry(country)}>Show</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default App;
