
var url = require('url')
var fs = require('fs')
var path  = require('path')
var formidable = require('formidable')
var addon = require("bindings")("process")
var database = require('mongodb').MongoClient;
//var sockets = require('./sockets.js')
let socket = null;   
   const options = {
     route : "/editor",
     db:"mongodb://localhost:27017/cg",
     dir : "/uploads/article"
   }
   
   function router(req,res){ 
     let reqUrl = req.url;
     let pathname = url.parse(reqUrl).pathname;
     let newUrl = pathname.replace(options.route,""); 
     let route = newUrl.match(/\/[a-z]+\/?/);
     
     if(route == null || route == "/")
       route = '';
     else 
       route = route[0].replace(new RegExp('/','g'),'');
         
     switch(route){
       case 'save' : 
         _saveToDb(req,res);
         break;
       case 'articles':
          _articles(req,res);
          break;
       case 'upload':
         _upload(req,res);
       default:
         _index(req,res);
        break;     
     }    
     
   } 
      
   function _index (req,res) {
   	fs.readFile(__dirname + "/views/this.html",function(err,data){
          if(err) throw err;else{
                res.setHeader("Content-Type","text/html");
                res.end(data);          
          }   	
   	} )
   }
   
   function _saveToDb(req,res){
       let jsonData='';
       req.on('data',function(data){
            jsonData +=data;      
       })
       
       req.on('end',function(){
          let article = JSON.parse(jsonData);
          saveArticle(req,res,article);       
       })
     }  
   
   function _articles(req,res){
          database.connect(options.db,function(err,db){
         if(err) throw err ;
         
         db.collection('article').find({}).toArray(function(err,data){                  
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');	
             res.write(JSON.stringify(data));             
             res.end();
             db.close();         
         })    
     })  
   }
   
   function saveArticle(req,res,art){
     
     art.sort(function(obj1,obj2){
     	  
          return parseInt(obj1.pos) - parseInt(obj2.pos);   
          
     })
     
     art.push({type : 'date' , date : Date.now()})
     var article = {};
     
     for(let i = 0 ; i < art.length ; i++){
         article[i] = art[i];     
     }

     database.connect(options.db,function(err,db){
          if(err) throw err;
          
          db.collection('article').insert(article,function (err,result) {
          	 if(err) throw err;else{
                console.log(result)          	 
          	 }
          	 res.statusCode = 200;
          	 res.setHeader('Content-Type','application/json');
          	 res.end(JSON.stringify(result))
          })      
       }) 
   }
   
   function _upload(req,res){ 
       var form = new formidable.IncomingForm();
       var socketId = req.headers.id;     
       let calculatedByte = 0;
       form.multiple = true;
       form.keepExtension = true;
       var date = Date.now()
       var uploadPath = path.join(__dirname +"/"+options.dir, date.toString() ); 
       form.uploadDir = uploadPath;
       
       if(!fs.existsSync(uploadPath))
         fs.mkdirSync(uploadPath)       
       
       form.on('progress',function(byteRecieved,byteExpected){ 
           //var client = sockets.find(socketId);          
           socket.to(socketId).emit('progresseditor',{recieved : byteRecieved,expected : byteExpected});
       })  
       
       form.on('file',function(name,file){
          var imagePath = path.join(uploadPath,file.name);
          let filename = file.name;
          addon.process(file.path,imagePath,function(im_width,im_height){        
              //let socket = sockets.find(socketId);                
              socket.to(socketId).emit('eduprog',{name : filename,url : imagePath.replace(__dirname,'')});                                                                 
          })
       })
       
       form.on('error',function(err){
           console.log('\n upload error' + '  ' + err);       
       })
       
       form.parse(req)
   }
   
   function saveImages(images){
      
   }
   
   
  function io(io){
       socket = io;
  }
  
module.exports.router = router;
module.exports.to = io;
