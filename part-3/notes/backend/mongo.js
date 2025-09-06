const mongoose = require('mongoose')

//asks you to enter password
if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
  }
  
  //extracts the password you gave in the parameter
  const password = process.argv[2]
  
  const url = `mongodb+srv://fullstack:${password}@cluster0.n83rn2v.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`
  
  //Allows query filters not delcared as a schema field
  mongoose.set('strictQuery',false)
  
  mongoose.connect(url)
  
  const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
  })
  
  //Creating a new model with 2 parameters, name and scheme
  const Note = mongoose.model('Note', noteSchema)
  
  // //Creating a single note
  // const note = new Note({
  //   content: 'HTML is easy',
  //   important: true,
  // })
  
  // //Saving a single note
  // note.save().then(result => {
  //   console.log('note saved!')
  //   mongoose.connection.close()
  // })


  //Fetching objects from the database
  Note.find({}).then(result => {
    result.forEach(note =>{
      console.log(note)
    })
    mongoose.connection.close()
  })