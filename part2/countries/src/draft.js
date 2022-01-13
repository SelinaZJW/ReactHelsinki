`https://restcountries.com/v3.1/name/${newSearch}`

  const showMessage = countries.length > 10
  const showCountries = !showMessage && countries.length > 1 
  const showSingle = countries.length == 1 

const Message = ({showMessage}) => {
    return showMessage && (
        <div>
            <p>Too many matches, specify another filter</p>
        </div>
    )
}

const Button = () => {
 return (
   <div>
   </div>
 )
}


const CountryLine = ({country}) => {
 return (
   <div>
       {country} <Button />
   </div>
 )
}

<Message showMessage={showMessage}  />