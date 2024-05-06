const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

//ENV
dotenv.config({ path: `${__dirname}/env/.env.local` });
const PORT = process.env.PORT;
const MongoDBPath = process.env.MongoDBPath;

//Link DB
//Mongo
mongoose.connect(MongoDBPath)
  .then(() => {
    console.log("MongoDB Linking ....");
  })
  .catch(() => {
    console.log("MongoDB Linked Error ....");
  });

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.listen(PORT, () => {
  console.log("mern api is starting...");
})

