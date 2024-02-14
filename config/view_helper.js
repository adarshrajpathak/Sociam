const env=require('./environment');
const fs=require('fs');
const path=require('path');
//defining gloabl function which will be available in app
module.exports=(app)=>{     //it will receive express app instance
    app.locals.assetPath=function(filePath){    //initial file path
        if(env.name=='development'){
            return '/'+filePath;    //if developement -> from "/asset"
        }
        //else production->if production from "/public/assets"
                        //synchronous reading manifest
        return '/'+JSON.parse(fs.readFileSync(path.join(__dirname,"../public/rev-manifest.json")))[filePath]; //because no / in mainfest
    }
}