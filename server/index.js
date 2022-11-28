const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const app = express();

const exchangeRouter = require('./routes/exchangeRoutes.js');
const userRoutes = require('./routes/userRoutes');

let port = 8080;
let host = 'localhost';

app.set('view engine', 'ejs');

//Connect to Database
mongoose.connect('mongodb://localhost:27017/college', 
                {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    //start app
    app.listen(port, host, ()=>{
        console.log('Server is running on port', port);
    });
})
.catch((err)=>console.log("**",err.message));

app.use((req, res, next) =>{
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "*");
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader("Access-Control-Allow-Methods", "GET,DELETE,OPTIONS,POST,PUT");
	res.setHeader("Access-Control-Request-Method", "GET,DELETE");
	next();
  });
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));


app.use('/exchange',exchangeRouter);
app.use('/users', userRoutes);


app.use((req,res,next)=>{
	let err = new Error('The Server cannot locate '+ req.url);
	err.status = 404;
	next(err)
});

app.use((err,req,res,next)=>{
	console.log(err);
	if(!err.status){
		err.status = "500";
		err.message = "Internal Server Error";
	}
	res.status = err.status;
});