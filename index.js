var http = require('http');

var io = require('socket.io')
var url = require('url')
var fs = require('fs')
var path  = require('path')
var formidable = require('formidable')
var addon = require("bindings")("process")
var database = require('mongodb').MongoClient;


var index = (function(){
	
const extentions =   {
          '.js':'text/javascript',
          '.json' : 'application/json',
          '.css' : 'text/css',
          '.png' : 'image/png',
          '.jpeg' : 'image/jpeg',
          '.jpg'  : 'image/jpeg',
          '.webm' : 'video/webm'  
}


function _public(req,res){
	
    let myurl = '';
 	 let reqUrl = req.url;
 	 let pathname = url.parse(reqUrl).pathname;
     	 
 	 let route = pathname.match(/^\/[a-z]+\/?/);
 	 
 	 if(route == null)
 	   route = '';
 	 else 
 	   route = route[0].replace(new RegExp('/','g'),'');	
 	   
 	 if(route == 'image')
 	   myurl = pathname.replace('/image/','/uploads/')
 	 else 
 	   myurl = pathname;
	
	
   let ext = path.parse(req.url).ext.toLowerCase();
   
   if(ext in extentions){
     fs.exists(__dirname + myurl,function(exist){
        if(exist){
            fs.readFile(__dirname + myurl,function (err,data) {
            	if(err){
                   throw err;
                   res.statusCode = 404;
                   res.end();            	
            	}else{ 
                  res.setHeader('Content-Type',extentions[ext]);
                  res.end(data);            	
            	}
            })
        }else{
           res.statusCode = 404;
           res.end();      
        }     
     })
   }else{
     res.statusCode = 404;
     res.end();
   }    
 }


function _index(req,res){
   fs.readFile(__dirname + "/views/this.html",function(err,data){
       if(err){
         console.log('\nindex can not be loaded!' + err);
         }
       else {
       	res.setHeader("Content-Type","text/html");
       	res.end(data);
       }   
   })
}


return {
  public : _public,
  index : _index
}
})()

module.exports.public = index.public;
module.exports.home = index.index;