//importing the express module
const express=require('express');
//asssinging the port number
const port=8000;
//importing the path
const path=require('path');
//importing body-parser for decoding the form payload(POST data)
const bodyParser=require('body-parser');
//importing cookie-parser for using cookie
const cookieParser=require('cookie-parser');
//importing the node-sass-middleware
const sassMiddleware=require('node-sass-middleware');

//creating the instance of the express
const app=express();

//setting-up the chat server to be used with socket.io
const chatServer=require('http').Server(app);   //http built-in module
                                                //function in the config/chat_socket module
const chatSockets=require('./config/chat_socket').chatSockets(chatServer);
chatServer.listen(5000);
console.log('Chat Server is listening on port 5000');

//importing the mongoDB settings
const db=require('./config/mongoose');
//importing the session (encrypting the session cookie)
const session=require('express-session');
//importing passport and passport-local-startegy for the authentication use
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy');
//importing newly passport-jwt-startegy for the authentication use
const passportJWT=require('./config/passport-jwt-strategy');
//importing social/3rd-party passport-google-startegy for the authentication use
const passportGoogle=require('./config/passport-google-oauth2-strategy');
//importing the connect-mongo for persistent session cookie [mongo-store]
const MongoStore=require('connect-mongo');
//importing the flash-connect for sending flash msg to front-end
const flash=require('connect-flash');
//importing the custom Middlware made by us
const customMware=require('./config/middleware');

//importing the express-ejs-layout
const  expressLayouts=require('express-ejs-layouts');
// const { name } = require('ejs');
//tell express that we have a layout and views to be filled in there
app.use(expressLayouts);
//extract sytle and script from sub page into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//using the body-parser
app.use(bodyParser.urlencoded({extended:false}));
//using the cookie-parser
app.use(cookieParser());

//compiling the .scss file to .css
app.use(sassMiddleware({
    //options
    src:path.join(__dirname,'assets/scss'),
    dest:path.join(__dirname,'assets/css'),
    debug:false,
    outputStyle:'extended',
    prefix:'/css'
}))
//serving the static files using the app.use middleware
app.use(express.static('./assets'));
app.use('/lib', express.static('./node_modules/noty/lib'));
//making the upload path publically available
app.use('/uploads',express.static(__dirname+'/uploads'));

//setting up the views
app.set('view engine','ejs');
app.set('views','./views');

//add middleware that takes session cookie and encrypt it
app.use(session({
    //properties to be set
    name:'Sociam',
    secret:'ItIsAKeyToEncrptAndDecrypt',    //TODO i.e., change secret before deployment in the production
    saveUninitialized:false,
    resave:false,
    cookie:{
        //age to cookie how long it is valid
        maxAge:(1000*60*1000)
    },
    store:MongoStore.create(db)
}));
//along-side using passport for authentication and maintaining session
app.use(passport.initialize());
app.use(passport.session());    //inbuild function of passport
//just establish/set the user(who is visiting)
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash);

//Putting the middleware to transfer the request to the routes/index.js
app.use('/',require('./routes/index')); //('.routes) automatically fetches the index.js

//firing up the server
app.listen(port, function(err){
    if(err){
        console.log(`Error in firing the server ${err}`);
    }
    console.log(`Server is up at port: ${port}`);
})