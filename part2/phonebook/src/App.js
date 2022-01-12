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

const Form = ({addPerson, newName, handleNameChange, newNumber, handleNumberChange}) => {
 
  return (
    <div>
      <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handleNameChange}/>
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange}/>
      </div>
      <div>
        <button type="submit">
          add
        </button>
      </div>
    </form>
    </div>
  )
}

const DisplayLine = ({name, number}) => {
  return (
    <div>
      <li>{name}: {number}</li>
    </div>
  )
}

//const Alert = ({alert, existingName}) => {               
      //only alert after clicking 'add', not as soon as entered newName exists
      //how to reset after clicking confirm????
  //if (alert){
  //return (
    //window.alert(`${existingName} is already added to phonebook`)
  //)}
  //return null
//}

const Display = ({persons}) => {
    return (
      <div>
        {/* <Alert alert={alert} existingName={newName}/>  */}
        <ul>
          {persons.map(p => <DisplayLine key={p.id} name={p.name} number={p.number}/>)}
        </ul>
      </div>
    )
  } 



const App = () => {

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  // const [alert, setAlert] = useState(false)
  const [newSearch, setNewSearch] = useState('')
  //const [showAll, setShowAll] = useState(true)   

  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response =>{
        console.log('promised fulfilled')
        setPersons(response.data)
      })
  }, []
  )
  console.log(persons.length)

  const exist = persons.map(p => p.name).includes(newName)

  const addPerson = (event) => {
    event.preventDefault()

    if (!exist) {
      const personsObject = {
        id: persons.length +1,
        name: newName, 
        number: newNumber
      }
      setPersons(persons.concat(personsObject))
      setNewName('')
      setNewNumber('')
    } else {
      //setAlert(true)         //      how to change status?? not (alert === false) -> set(false/true)
      window.alert(`${newName} is already in the phonebook`)
    }
  }
  
  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }
  const handleSearchChange = (event) => {
    console.log(event.target.value)
    setNewSearch(event.target.value)
    //setShowAll(false)       
            //  why does this alternate true/false??? how to make it consistent
    //console.log(showAll)
  }

  //const showAll = false
  //const personsToShow = showAll
    //? persons
    //: persons.filter(persons => persons.name.toLowerCase().includes(newSearch.toLowerCase()) === true)

  const personsToShow = persons.filter(persons => persons.name.toLowerCase().includes(newSearch.toLowerCase()) === true)


  return (
    <div>
      <h2>Phonebook</h2>
      <Filter newSearch={newSearch} handleSearchChange={handleSearchChange} />
      
      <h3>Add a new</h3>
      <Form addPerson={addPerson} 
      newName={newName} handleNameChange={handleNameChange} 
      newNumber={newNumber} handleNumberChange={handleNumberChange}
      />
      
      <h3>Numbers</h3>
      <Display persons={personsToShow} newName={newName}/>
    </div>
  )
}

export default App