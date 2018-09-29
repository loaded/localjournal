
var io = require('socket.io')
var video = require('./video.js')

var clients = [];

function find(id){
  for(let i = 0 ; i < clients.length ; i++)
    if(clients[i].id == id) return clients[i];
    
    return -1;
}

function remove(socket){
  let index = clients.indexOf(socket);
  if(index > -1) clients.splice(index,1); 
}

function init (server) {
	io.listen(server).on('connection',function(socket){
      socket.emit('id',{id:socket.id});
      clients.push(socket);
      
      socket.on('disconnect',function(socket){
      	 remove(socket);                     
      });
      
      
      socket.on('start', video.start.bind(socket))
      socket.on('upload', video.upload.bind(socket))
      
      });
}

module.exports.init = init;
module.exports.remove = remove;
module.exports.find = find;