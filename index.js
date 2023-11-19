const express = require('express')
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
const port = process.env.PORT || 3000;

// middleware
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

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const bookCollection = client.db('bookLibrary').collection('books');

    app.get('/books', async (req, res) => {
      const cursor = bookCollection.find();
      const result = await cursor.toArray();
      res.send(result);

    })

    app.post('/books', async (req, res) => {
      const newBook = req.body;
      console.log(newBook);
      const result = await bookCollection.insertOne(newBook);
      res.send(result);
    })
    app.get('/books/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bookCollection.findOne(query);
      res.send(result)
    })

    app.patch('/books/:id', async (req, res) => {
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
  })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Server is running')
})

app.listen(port, () => {
  console.log(`Web Library listening on port ${port}`)
})