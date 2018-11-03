

var clients = [];

function find(id){
  for(let i = 0 ; i < clients.length ; i++)
    if(clients[i].id == id) return clients[i];
    console.log('it is not found\n');
    console.log('clients length is  :' + clients.length + '\n')
    return -1;
}

function remove(socket){
  let index = clients.indexOf(socket);
  if(index > -1) clients.splice(index,1); 
}



function add(socket){
  clients.push(socket)
}


module.exports.add = add;
module.exports.remove = remove;
module.exports.find = find;