const express = require('express')
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
const port = process.env.PORT || 5000;

// middleware
app.use(cors({
  origin: [
    // 'http://localhost:5173', 'http://localhost:5174'
    'https://web-library-772a4.web.app',
    
  ],
  credentials: true
}));
app.use(cors());
app.use(express.json())

// webLibrary
// SFlEbnE4CVF9YSVB


// console.log(process.env.DB_NAME);
// console.log(process.env.DB_PASS);

// const uri = "mongodb+srv://<username>:<password>@cluster0.i3hf6sp.mongodb.net/?retryWrites=true&w=majority";
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.i3hf6sp.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const dbConnect = async () => {
  try {
    client.connect()
    console.log('DB Connected Successfully✅')
  } catch (error) {
    console.log(error.name, error.message)
  }
}
dbConnect();

const bookCollection = client.db('bookLibrary').collection('books');
const borrowBooksCollection = client.db('bookLibrary').collection('borrowBooks');


app.get('/', (req, res) => {
  res.send('Server is running')
})



app.get('/books', async (req, res) => {
  try {
    const cursor = bookCollection.find();
    const result = await cursor.toArray();
    res.send(result);
  }
  catch (error) {
    console.log(error)
  }

})




app.post('/books', async (req, res) => {
  try {
    const newBook = req.body;
    console.log(newBook);
    const result = await bookCollection.insertOne(newBook);
    res.send(result);
  }
  catch (error) {
    console.log(error)
  }
})


app.get('/books/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await bookCollection.findOne(query);
    res.send(result)
  }
  catch (error) {
    console.log(error)
  }
})



app.patch('/books/:id', async (req, res) => {
  try {
    id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const options = { upsert: true };
    const updatedBook = req.body;
    const Book = {
      $set: {
        title: updatedBook.title,
        quantity: updatedBook.quantity,
        author: updatedBook.author,
        category: updatedBook.category,
        rating: updatedBook.rating,
        short_description: updatedBook.short_description,
        image: updatedBook.image,
        available: updatedBook.available
      }
    }
    const result = await bookCollection.updateOne(filter, Book, options)
    res.send(result);
  }
  catch (error) {
    console.log(error)
  }
})




// borrowBooks

app.get('/borrowBooks', async (req, res) => {
  try {
    const cursor = borrowBooksCollection.find();
    const result = await cursor.toArray();
    res.send(result);
  }
  catch (error) {
    console.log(error)
  }
})



app.post('/borrowBooks', async (req, res) => {
  try {
    const newBook = req.body;
    // console.log(newBook);
    const result = await borrowBooksCollection.insertOne(newBook);
    res.send(result);
  }
  catch (error) {
    console.log(error)
  }
})


app.listen(port, () => {
  console.log(`Web Library listening on port ${port}`)
})