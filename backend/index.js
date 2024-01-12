const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors');

connectToMongo()
const app = express();
const port = 8000

app.use(cors());
app.use(express.json())

//Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.get('/api/someEndpoint', (req, res) => {
  // Handle the request
  res.send('Hello from /api/someEndpoint');
});

// Not good as a good coder to maintain code so build folder as expert difficult when file get long

// app.get('/api/vl/login', (req, res) => {
//   res.send('Hello login!')
// })

// app.get('/api/vl/signup', (req, res) => {
//   res.send('Hello signup!')
// })

app.listen(port, () => {
  console.log(`MyNotebook backend listening on port at http://localhost:${port}`)
})
