const mongoose = require('mongoose')

//Ask user to input password
if(process.argv.length < 3){
    console.log('Password required')
    process.exit(1)
}

//Extract password
const password = process.argv[2]
const url = `mongodb+srv://fullstack:${password}@cluster0.n83rn2v.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

//Allows query filters not delcared as a schema field
mongoose.set('strictQuery',false)

// mongoose.connect(url)

const name = process.argv[3]
const number = process.argv[4]

//Define the schema
const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

//Define model
const Person = mongoose.model('Person', personSchema)

if(name && number){

//Create contact
const person = new Person({
    name: `${name}`,
    number: `${number}`,
})

//Save contact 
person.save().then(result => {
    console.log(`${name} has been succesfully saved to contact list!`)
    mongoose.connection.close()
})
}


//Fetch data from database
Person.find({}).then(result =>{
    console.log("Phonebook:")
    result.forEach(n => {
        console.log(`${n.name} ${n.number}`)
    })
    mongoose.connection.close()
})