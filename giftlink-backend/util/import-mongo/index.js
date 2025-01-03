require('dotenv').config();
const { MongoClient } = require('mongodb');
const fs = require('fs');

// MongoDB connection URL with authentication options
const url = `${process.env.MONGO_URL}`;
const filename = `${__dirname}/gifts.json`;
const dbName = 'giftdb';
const collectionName = 'gifts';

// notice you have to load the array of gifts into the data object
const data = JSON.parse(fs.readFileSync(filename, 'utf8')).docs;

// connect to database and insert data into the collection
async function loadData() {
  const client = new MongoClient(url);

  try {
    // Connect to the MongoDB client
    await client.connect();
    console.log('Connected successfully to server');

    // database will be created if it does not exist
    const db = client.db(dbName);

    // collection will be created if it does not exist
    const collection = db.collection(collectionName);
    const cursor = await collection.find({});
    const documents = await cursor.toArray();

    if (documents.length === 0) {
      // Insert data into the collection
      const insertResult = await collection.insertMany(data);
      console.log('Inserted documents:', insertResult.insertedCount);
    } else {
      console.log('Gifts already exists in DB');
    }
  } catch (err) {
    console.error(err);
  } finally {
    // Close the connection
    await client.close();
  }
}

loadData();

module.exports = {
  loadData
};
