const express = require("express")
require('dotenv').config();
const port = process.env.APP_PORT;
const router = require('./routes/index')
const dbUrl = process.env.DB_URL;

const errorHandler = require("./middleware/errorHandler")


const mongoose = require("mongoose")
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error'));
db.once('open', () => {
    console.log("Connected successfully");
});



const app= express();

app.use(express.json())
app.use('/api',router);
  


app.use(errorHandler);

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})