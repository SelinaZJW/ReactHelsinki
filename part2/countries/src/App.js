import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({newSearch, handleSearchChange}) => {
  return (
    <div>
        <p>
         filter shown with  <input value={newSearch} onChange={handleSearchChange} />
       </p>
    </div>
  )
}

const Message = ({showMessage}) => {
  return (showMessage) && (
      <div>
          <p>Too many matches, specify another filter</p>
      </div>
  )
}

const CountryLine = ({country, showButton, countryIndex}) => {
  return (
    <div>
        <li>{country} <button onClick={showButton} value={countryIndex}>show</button>
        </li>
    </div>
  )
 }

const DisplayCountries = ({select, results, showCountries, showButton}) => {
  return (select==false && showCountries) && (
   <div>
     <ul>
       {results.map(c => 
          <CountryLine key={c.name.common} country={c.name.common} showButton={showButton} countryIndex={results.indexOf(c)}/>)}
     </ul>
   </div>
 )
}
// if not found (404), no display countries either, but how????

const LanguageLine = ({language}) => {
 return (
   <div>
     <li>{language} 
     </li>
   </div>
 )
}

const Weather = ({countrySingle, weather}) => {
  return weather !== [] && (
   <div>
     <h3>Weather in {countrySingle.capital}</h3>
     <p><span style={{fontWeight:'bold'}}>temperature: </span> {weather.main.temp} </p>
     <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}/>
     <p><span style={{fontWeight:'bold'}}>wind: </span> {weather.wind.speed} mph </p>
   </div>
 )
}

const DisplaySingle = ({select, showSingle, countrySingle, languages, weather}) => {
 return (select || showSingle) && (
   <div>
     <h2>{countrySingle.name.common}</h2>
     <p>capital: {countrySingle.capital}</p>
     <p>population: {countrySingle.population} </p>
     <h3>languages</h3>
     <ul>
       {languages.map(l => <LanguageLine key={l} language={l} />)}
     </ul>
     <img src={countrySingle.flags.png} alt="Logo" />
     <Weather countrySingle={countrySingle} weather={weather}/>
   </div>
 )
}

const App = () => {
  
  const [newSearch, setNewSearch] = useState('')
  const [results, setNewResults] = useState([])
  const [countrySingle, setNewSingle] = useState({})
  const [languages, setNewLanguages] = useState([])
  const [select, setNewSelect] = useState(false)
  const [weather, setNewWeather] = useState([])
  const [city, setNewCity] = useState('')
  

 const handleSearchChange = (event) => {
    console.log(event.target.value)
    setNewSearch(event.target.value)
  }

 useEffect(() => {
    console.log('results')
    axios
      .get(`https://restcountries.com/v3.1/name/${newSearch}`)
      .then(response =>{
        console.log(response)
        setNewResults(response.data)      
        setNewSingle(response.data[0])              //have to use reponse.data, not results, cos results is still previous state
        setNewCity(response.data[0].capital)
        setNewLanguages(Object.values(response.data[0].languages))
        setNewSelect(false)
      })
      .catch(error => 
        console.log('fail')
      )
  }, [newSearch]
  )

  // const countrySingle = results[0]
  // const languages = Object.values(countrySingle.languages)  --> can't put it here, bc initial state is null, can't read null value

  console.log(results.length)  // why logged 4 times?? in console

  const showMessage = results.length > 10
  const showCountries = !showMessage && results.length > 1 
  const showSingle = results.length == 1 
  
  const showButton = (event) => {
    const selectedCountry = event.target.value
    console.log(selectedCountry)
    setNewSingle(results[selectedCountry])
    setNewCity(results[selectedCountry].capital)
    setNewLanguages(Object.values(results[selectedCountry].languages))
    setNewSelect(true)
  }


  const api_key = process.env.REACT_APP_API_KEY
  useEffect(() => {
    console.log('weather')
    axios
      //.get(`https://openweathermap.org/data/2.5/weather?q=${countrySingle.capital}&appid=${api_key}`, { useCredentails: true })
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`)        
      .then(response =>{
        console.log(response.data)
        setNewWeather(response.data)
      })
  }, [city] //bit excessive?? everytime DisplaySingle?
  )


  return (
    <div>
      <Filter newSearch={newSearch} handleSearchChange={handleSearchChange} />
      <Message showMessage={showMessage}/>
      <DisplayCountries select= {select} showCountries={showCountries} results= {results} showButton={showButton}/> 
      <DisplaySingle select= {select} showSingle={showSingle} countrySingle={countrySingle} languages={languages} weather={weather}/>
     
      
      
    </div>
  )
}

export default App