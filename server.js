const express= require('express');
const connectDB = require('./config/db')
const bodyParser = require('body-parser');
const PORT=process.env.PORT||5000;

//instance of express
const app=express();

//connects monogo
connectDB();


app.get('/', (req, res) => {
  res.send('Hello World!')
})

//init middleware
app.use(bodyParser.json());
app.use(express.json());

//using the routes
//first param is path for this route and second is the module it is present in
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));









app.listen(PORT,()=>{console.log(`server listening at port ${PORT}`)})