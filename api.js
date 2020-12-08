var mongoose = require('mongoose'); 
var express = require('express'); 
var router = express.Router(); 
var TaskModel = require('./task_schema'); 
const env = require('node-env-file') ;
env(__dirname + '/.env');

// Connecting to database 
var query = "mongodb+srv://"+process.env.DBMONGOUSER+":"+process.env.DBMONGOPASS+"@"+process.env.DBMONGOSERV+"/"+process.env.DBMONGO+"?retryWrites=true&w=majority"

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
router.post('/save', function(req, res) {
    console.log(req);
    let newTask = new TaskModel();
    newTask.TaskId = req.body.id;
    newTask.Name = req.body.nombre;
    newTask.DeadLine = req.body.fecha_limite;    
    console.log(req)
    
    newTask.save(function(err, data) {
        if(err) {
            console.log(err);
        }
        else {
            res.send("Data inserted");
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
            datos = data;
        }
    });  
});    
     

 router.post('/obtenerUno', function(req, res) {
    TaskModel.findOne({TaskId: req.body.id}, function(err, data) {
        if(err){
            console.log(err);
        }
        else{
            res.send(data);
        }
    });  
 });
router.post('/update', function(req, res) {  
    TaskModel.updateOne({TaskId: req.body.id}, 
    {Name: req.body.nombre,
    DeadLine: req.body.fecha_limite
    },        
    function(err, data) {
        if(err){
            console.log(err);
        }
        else{            
            res.send(data);
            console.log("Data Updated!");
        }
    });  
});
router.delete('/delete', function(req, res) {    
    TaskModel.deleteOne({TaskId:req.body.id}, 
    function(err, data) {
        if(err){
            console.log(err);
        }
        else{
           res.send(data);
            console.log("Data Deleted!");
        }
    });  
});