//importing the express module
const express=require('express');
//asssinging the port number
const port=8000;

//creating the instance of the express
const app=express();

//importing the express-ejs-layout
const  expressLayouts=require('express-ejs-layouts');
//tell express that we have a layout and views to be filled in there
app.use(expressLayouts);
//extract sytle and script from sub page into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//serving the static files using the app.use middleware
app.use(express.static('./assets'));

//Putting the middleware to transfer the request to the routes/index.js
app.use('/',require('./routes/index')); //('.routes) automatically fetches the index.js

//setting up the views
app.set('view engine','ejs');
app.set('views','./views');

//firing up the server
app.listen(port, function(err){
    if(err){
        console.log(`Error in firing the server ${err}`);
    }
    console.log(`Server is up at port: ${port}`);
})