const mongoose = require('mongoose'); 
mongoose.set('strictQuery', false);

const mongoURI = "mongodb://127.0.0.1:27017/mynotebook"

// const connectToMongo = ()=>{
//     mongoose.connect(mongoURI,  ()=>{
//         console.log("Connected to Mongo successfully")
//     })
// }

const connectToMongo = async () => {
    try {
        mongoose.set('strictQuery', false)
        mongoose.connect(mongoURI) 
        console.log('Mongo connected')
    }
    catch(error) {
        console.log(error)
        process.exit()
    }
    }

module.exports = connectToMongo;