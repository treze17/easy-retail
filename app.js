const { clear } = require('console');
const dns = require('dns')
dns.setServers['8.8.8.8','8.8.4.4']
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
require('dotenv').config();

const app = express();
const PORT = 3000
const authRoutes = require('./routes/authRoute');
const resetRoutez = require('./routes/resetRoutes')
const { checkUser } = require('./middleware/middleware');

// middleware
app.use(express.static('public'));
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))

// view engine
app.set('view engine', 'ejs');


// database connection
const startServer = async()=>{
  const dbURI = process.env.dbconnection
 try {
  await mongoose.connect(dbURI)
  console.log(`connected to ${mongoose.connection.name} at port: ${PORT}`)
  
 app.listen(PORT,()=>{
   console.log(`Db connection established at port:${PORT}`)
 })
} catch (error) {
  console.log(`Connection failed due to ${error}`)
}
}
startServer()


app.use(checkUser)
app.use(authRoutes)
app.use(resetRoutez)
// routes

app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', (req, res) => res.render('smoothies'));