
const express=require('express');  
const api = require('./api'); 
const path = require('path');
var env;



const port= process.env.PORT ||  3000; 
const app=express(); 

// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
if (!process.env.ON_HEROKU) { 
    env = require('node-env-file') ;
    env(__dirname + '/.env');
    app.use('/',express.static(`${__dirname}/../tasks-app/dist/pwa/`));
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../tasks-app/dist/pwa/index.html'));
    });     
}else{
    app.use('/',express.static(`${__dirname}/front/`));
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '/front/index.html'));
    });     
}


app.listen(port, function() { 
    console.log("Server is listening at port:" + port); 
});  

  
// Parses the text as url encoded data 
app.use(express.urlencoded({extended: true}));  
  
// Parses the text as json 
app.use(express.json());  

app.use('/api', api);
