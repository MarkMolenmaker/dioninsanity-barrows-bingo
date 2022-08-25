const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config/db');

// Configure dotenv to load .env file
require('dotenv').config();

// Express app
const app = express();

// Connect to mongodb database
const uri = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@dioninsanity-barrows-bi.naldis3.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// Registering cors
app.use(cors());

// Configure BodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configure morgan
app.use(morgan("dev"));

// Define first route
app.get("/", (req, res) => {
    console.log("Hello World!");
});

// Define user route
const userRoutes = require("./api/user/route/user");
app.use("/user", userRoutes);
app.listen(process.env.PORT, () => {
    console.log(`App is running on ${process.env.PORT}`);
});