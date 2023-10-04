//importing the express module
const express=require('express');
//asssinging the port number
const port=8000;

//creating the instance of the express
const app=express();

//firing up the server
app.listen(port, function(err){
    if(err){
        console.log(`Error in firing the server ${err}`);
    }
    console.log(`Server is up at port: ${port}`);
})