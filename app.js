var http = require('http');

var io = require('socket.io')
var url = require('url')
var fs = require('fs')
var path  = require('path')
var formidable = require('formidable')
var addon = require("bindings")("process")
var database = require('mongodb').MongoClient;

var sockets = require("./sockets.js")

var gallery = require('./gallery.js');
var editor = require('./editor.js');
var home = require('./index.js');
var video = require('./video.js');
  
  

   
  /*--------------------------- Helper Functions -----------------------------------*/
  
  

 var server = http.createServer(function(request,response){	
 	 
 	 let reqUrl = request.url;
 	 let pathname = url.parse(reqUrl).pathname;
 	 
 	 let route = pathname.match(/^\/[a-z]+\/?/);
 	 
 	 if(route == null)
 	   route = '';
 	 else 
 	   route = route[0].replace(new RegExp('/','g'),'');
 	  
 	 switch (route){
        case 'editor' : 
          editor.router(request,response);
          break;
        case 'video':
          video.router(request,response);
          break;
        case 'gallery' : 
          gallery.router(request,response);
          break;
        case 'public':
          home.public(request,response);
          break;
        case 'uploads' : 
          home.public(request,response);
          break;
        case 'image':
          home.public(request,response);
          break;
        default:
          home.home(request,response);
        break;
          	 
 	 }	   
 })
 
 sockets.init(server);
 //gallery.comunicate(server)
 server.listen(3000);


 
// url must check to not being too long
// requests should check to prevent sending big file to my darling server





/*
request.ond(data,function(data)....)
body += data;
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6) { 
                // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
                request.connection.destroy();
            }
*/




/*
  index should prevent flood attack by blocking them
  this is volunarbilty because it in default switch case it allways sends index
  which is loading many public file
*/






