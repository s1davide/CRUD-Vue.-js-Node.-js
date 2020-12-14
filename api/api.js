var mongoose = require('mongoose'); 
var express = require('express'); 
var router = express.Router(); 
const multer = require('multer');
var TaskModel = require('./task_schema'); 
var env;


if (!process.env.ON_HEROKU) { 
    env = require('node-env-file');
    env(__dirname + '/.env');
    
}
// Connecting to database 
var query = "mongodb+srv://"+process.env.DBMONGOUSER+":"+process.env.DBMONGOPASS+"@"+process.env.DBMONGOSERV+"/"+process.env.DBMONGO+"?retryWrites=true&w=majority"
//Multer
const upload = multer();

const db = (query); 
mongoose.Promise = global.Promise; 
mongoose.set('useFindAndModify', false);
mongoose.connect(db, { useNewUrlParser : true, 
useUnifiedTopology: true }, function(error) { 
	if (error) { 
		console.log("Error!" + error); 
	} 
}); 


module.exports = router;
router.post('/save', upload.none(),function(req, res) {
    
    let newTask = new TaskModel();    
    //console.log(req.body)
    let fecha = new Date(req.body.DeadLine);    
    newTask.TaskId = req.body.TaskId;
    newTask.Name = req.body.Name;
    newTask.DeadLine = fecha;   
    
    newTask.save(function(err, data) {
        if(err) {
            console.log(err);
        }
        else {
            let respuesta = {"res" : "Agregado"};
            res.send(respuesta);
        }
    });
});


router.get('/obtenerTodos', function(req, res) {
    TaskModel.find(function(err, data) {
        if(err){
            console.log(err);
        }
        else{            
            res.send(data);
        }
    });  
});    
     

 router.post('/obtenerUno', function(req, res) {
    TaskModel.findOne({TaskId: req.body.TaskId}, function(err, data) {
        if(err){
            console.log(err);
        }
        else{
            res.send(data);
        }
    });  
 });
router.post('/update',upload.none(), function(req, res) {       
    TaskModel.updateOne({TaskId: req.body.TaskIdActual }, 
    {TaskId: req.body.TaskId,
    Name: req.body.Name,
    DeadLine: req.body.DeadLine
    },        
    function(err, data) {
        if(err){
            console.log(err);
        }
        else{            
            let respuesta = {"res" : "Modificado"};
            res.send(respuesta);
        }
    });  
});
router.delete('/delete',upload.none(), function(req, res) {   
    console.log(req.body) 
    TaskModel.deleteOne({TaskId: req.body.TaskId}, 
    function(err, data) {
        if(err){
            console.log(err);
        }
        else{
            let respuesta = {"res" : "Borrado"};
            res.send(respuesta); 
        }
    });  
});