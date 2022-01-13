import React, { useState, useEffect } from 'react'
import personService from './services/persons'

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

const DisplayLine = ({name, number, deletePerson, id}) => {
  return (
    <div>
      <li>{name}: {number}  <button onClick={deletePerson} value={id}>delete</button></li>
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

const Display = ({persons, deletePerson}) => {
    return (
      <div>
        {/* <Alert alert={alert} existingName={newName}/>  */}
        <ul>
          {persons.map(p => <DisplayLine key={p.id} name={p.name} number={p.number} 
            id={p.id} deletePerson={deletePerson} />)}
        </ul>
      </div>
    )
  } 

const Notification = ({message, color}) => {

 return message !== null &&  (
   <div>
     <p className='notification' style={{color: color}}>{message}</p>
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
  const [message, setNewMessage] = useState(null) 
  const [color, setNewColor] = useState('green')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons =>{
        setPersons(initialPersons)
      })
  }, []
  )
  console.log(persons.length)

  const exist = persons.map(p => p.name).includes(newName)

  const addPerson = (event) => {
    event.preventDefault()

    if (!exist) {
      const personsObject = {
        name: newName, 
        number: newNumber
      }
      personService
        .create(personsObject)
        .then(newPerson => {
          setPersons(persons.concat(newPerson))
          setNewName('')
          setNewNumber('')
          
          setNewMessage(`Added ${newName}`)
          setTimeout(() => {
            setNewMessage(null)
          }, 5000)
        })
    } else {
      //setAlert(true)         //      how to change status?? not (alert === false) -> set(false/true)
      if (window.confirm(`${newName} is already in the phonebook. Replace the old number with a new one?`)) {
        const existedPerson = persons.find(p => p.name == newName)
        const changedPerson = {...existedPerson, number: newNumber}
        console.log(changedPerson)

        personService
          .update(existedPerson.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.name == newName? returnedPerson : p) )
            
            setNewMessage(`Changed ${newName}'s number`)
            setTimeout(() => {
              setNewMessage(null)
            }, 5000)
          })
          .catch(error => {
            console.log('failure')
            setPersons(persons.filter(p => p.name !== newName))

            setNewMessage(`Information of ${newName} has already been removed`)
            setNewColor('red')
            setTimeout(() => {
              setNewMessage(null)
              setNewColor('green')
            }, 5000)
          })

      }
    }
  }

  const deletePerson = (event) => {
    const selectedPersonId = event.target.value
    const selectedPersonIndex = persons.indexOf(persons.find(p => p.id == selectedPersonId))
    
    const array1 = persons.slice(0, selectedPersonIndex)
    const array2 = persons.slice(selectedPersonIndex+1)
    
    console.log(array1.concat(array2))
    console.log(selectedPersonIndex)
    console.log(selectedPersonId)

    if (window.confirm(`Delete ${persons[selectedPersonIndex].name}?`)) {
      personService
        .remove(selectedPersonId)
        .then(()=> {
          console.log('deleted')
          setPersons(array1.concat(array2))
          
          setNewMessage(`Deleted ${persons.find(p => p.id == selectedPersonId).name}`)
          setTimeout(() => {
            setNewMessage(null)
          }, 5000)
        }
        )
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
      <Notification message={message} color={color}/>
      
      <Filter newSearch={newSearch} handleSearchChange={handleSearchChange} />
      
      <h3>Add a new</h3>
      <Form addPerson={addPerson} 
      newName={newName} handleNameChange={handleNameChange} 
      newNumber={newNumber} handleNumberChange={handleNumberChange}
      />
      
      <h3>Numbers</h3>
      <Display persons={personsToShow} newName={newName} deletePerson={deletePerson}/>
    </div>
  )
}

export default App