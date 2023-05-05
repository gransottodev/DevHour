require("dotenv").config();
const mongoose = require("mongoose");
const user = process.env.DATABASE_USER;
const password = process.env.DATABASE_PASSWORD;

const url = `mongodb+srv://${user}:${password}@api.elzhb3j.mongodb.net/`;

const connection = mongoose.connect(url)
  .then(() => {
    console.log('Conectado a database');
  })
  .catch(error => {
    console.log(error);
  })


module.exports = connection;

