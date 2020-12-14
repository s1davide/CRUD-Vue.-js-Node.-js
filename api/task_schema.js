var mongoose=require('mongoose'); 

var TaskSchema = new mongoose.Schema({ 
	TaskId:Number, 
	Name:String, 	
	DeadLine:Date, 
	
}); 

module.exports = mongoose.model( 
	'task', TaskSchema, 'Tasks'); 
