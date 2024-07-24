require("dotenv").config();
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const client =new MongoClient(process.env.URL)
client.connect((err) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log('Connected to MongoDB');
});

module.exports = client;