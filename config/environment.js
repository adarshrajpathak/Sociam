const fs=require('fs'); //importing file stream module
const rfs=require('rotating-file-stream'); //importing rotating file stream module
const path=require('path');

const logDirectory=path.join(__dirname,'../production_logs');   //will store in this path
//if exists? or create Synchronously
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream=rfs.createStream('access.log',{ //options
    interval:'1d',
    path:logDirectory
})

const development={
    name:'development',
    asset_path:'/assets',
    session_cookie_secret_key:'ItIsAKeyToEncrptAndDecrypt',
    db_name:'sociam_development',
    smtp:{
        service: "gmail",
        host:'smtp.gmail.com',  //with Gmail SMTP server
        port: 587,  //default 25but for SSL/TLS working 587
        secure: false,  //two factor authentication
        auth: { //authentication object
          user: "adarsh.raj.pathak.001@gmail.com",
          pass: "sovr xavd enqx vamb",
        }
    },
    google_client_ID: "702679840438-e3i7l8mrj571lgcnu1on7avj49gbhhrq.apps.googleusercontent.com", //GOOGLE_CLIENT_ID
    google_client_Secret: "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",  //GOOGLE_CLIENT_SECRET
    google_callback_URL: "http://localhost:8000/users/auth/google/callback",
    jwt_secret_key:'sociam_arp',
    morgan:{
        mode:'dev',
        options:{stream: accessLogStream}
    }
}

const production = {
    name: process.env.SOCIAM_ENVIRONMENT,
    asset_path: process.env.SOCIAM_ASSET_PATH,
    session_cookie_secret_key: process.env.SOCIAM_SESSION_COOKIE_SECRET_KEY,
    db_name: process.env.SOCIAM_DB_NAME,
    smtp: {
        service: process.env.SOCIAM_SMTP_SERVICE,
        host: process.env.SOCIAM_SMTP_HOST,
        port: process.env.SOCIAM_SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.SOCIAM_SMTP_AUTH_USER,
            pass: process.env.SOCIAM_SMTP_AUTH_PASS,
        }
    },
    google_client_ID: process.env.SOCIAM_GOOGLE_CLIENT_ID,
    google_client_Secret: process.env.SOCIAM_GOOGLE_CLIENT_SECRET,
    google_callback_URL: process.env.SOCIAM_GOOGLE_CALLBACK_URL,
    jwt_secret_key: process.env.SOCIAM_JWT_SECRET_KEY,
    morgan:{
        mode:'combined',
        options:{stream: accessLogStream}
    }
}

// module.exports= process.env.SOCIAM_ENVIRONMENT || development;
module.exports=eval(process.env.SOCIAM_ENVIRONMENT)==undefined?development:eval(process.env.SOCIAM_ENVIRONMENT);  
// module.exports= development;