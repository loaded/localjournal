var http = require('http');

//var io = require('socket.io')
var url = require('url')
var fs = require('fs')
var path  = require('path')
var formidable = require('formidable')
var addon = require("bindings")("process")
var database = require('mongodb').MongoClient;

let host = '46.100.63.117';
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

var TemplateEngine = function(tpl, data) {
    var re = /<%([^%>]+)?%>/g, match;
    while(match = re.exec(tpl)) {
        tpl = tpl.replace(match[0], data[match[1]])
    }
    return tpl;
}

function _index(req,res){
   fs.readFile(__dirname + "/views/this.html",'utf8',function(err,data){
       if(err){
         console.log('\nindex can not be loaded!' + err);
         }
       else {
       	res.setHeader("Content-Type","text/html");
       	let cookie = parseCookies(req);       
       	
       	res.end(	TemplateEngine(data,{host : host,token: cookie['cook'],username : req.username}));
       }   
   })
}

function parseCookies (req) {
    var list = {},
        rc = req.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}

return {
  public : _public,
  index : _index
}
})()

module.exports.public = index.public;
module.exports.home = index.index;