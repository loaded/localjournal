var server = require('http').createServer(myApp);
var io = require('socket.io')(server);
var url = require('url')
//var sockets = require('./sockets.js')
var gallery = require('./gallery.js');
var editor = require('./editor.js');
var home = require('./index.js');
var video = require('./video.js')
//var redis = require('redis')
//var client = redis.createClient();
var login = require('./login.js')
var index = require('./home.js')   

let redis = require('redis');
let client = redis.createClient();
const {promisify} = require('util');

const getAsync = promisify(client.get).bind(client);
  /*--------------------------- Helper Functions -----------------------------------*/

  io.use((socket,next) =>{	  	
       let token = socket.handshake.query.token;
       
        checkUser(token,function(username){
            if(username){
              socket.username = username ;
              return next()            
            }else 
              return ;
        })
  }).on('connection',function(socket){
       socket.emit('id',{id:socket.id,username :  socket.username});    
      
      socket.on('disconnect',function(socket){
      	                  
      });    
      
      socket.on('start',video.start.bind(socket));
      socket.on('upload',video.upload.bind(socket))
      socket.on('getloc',index.getloc.bind(socket))  
      socket.on('video',video.video.bind(socket))
      socket.on('article',editor.article.bind(socket));
      socket.on('getgal',gallery.gallery.bind(socket)); 
      
      socket.on('g-start',gallery.start.bind(socket));
      socket.on('g-upload',gallery.upload.bind(socket))
      
      socket.on('a-start',editor.start.bind(socket))
      socket.on('a-upload',editor.upload.bind(socket))
  });
  
   
 gallery.to(io);
 editor.to(io)  
  
    
  async function checkUser(token,callback){
  	  let username = await getAsync(token);
  	  callback(username)
      
  }
   
 server.listen(3000);
 
 function myApp(req,res){ 	
   login.router(req,res,findRoute); 
 }


 function findRoute(request,response) {
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
 }
 
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






