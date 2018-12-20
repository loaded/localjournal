
var url = require('url')
var fs = require('fs')
var path  = require('path')

var addon = require("bindings")("process")
var database = require('mongodb').MongoClient;
//var sockets = require('./sockets.js')
let socket = null;
 var files  = {}
  //this socket should be removed
  
// var sockets ;  
  var clients = [];  
  var options = {
  	 pathname: 'uploads/',
  	  temp : 'Temp/',
     route : {    
          base : '/gallery',
          regex : '^\/[a-z]+\/?'
     },
     
     db : {
          image : "mongodb://localhost:27017/cg" ,
          hash : "mongodb://localhost:27017/hash"
     },
     
     extentions :   {
          '.js':'text/javascript',
          '.json' : 'application/json',
          '.css' : 'text/css',
          '.png' : 'image/png',
          '.jpeg' : 'image/jpeg',
          '.jpg'  : 'image/jpeg'   
    },
    
    init : function(){  // no need for this
       database.connect(this.db.image,function(err,dtb){
          if(err) throw err;
          dtb.close(); 
       })    
    } 
   
  }
  
 
  
  function router(req,res){
     var reqUrl = req.url;
     pathname = url.parse(reqUrl).pathname;     
     
    // var route = options.route.regex.match(pathname)
     let newUrl = pathname.replace(options.route.base,'');
     let route = newUrl.match(/^\/[a-z]+\/?/)    
    
     if(route == null) 
       route = '';
     else route = route[0].replace(new RegExp('/','g'),'')
     
     switch(route){
       case 'public' :
         _public(req,res); 
         break;
       case 'image' : 
         _image(req,res);
         break;
       case  'delete' : 
         _delete(req,res);
         break;
       case 'upload' : 
         _upload(req,res);
         break;
       case 'index' : 
         _galleries(req,res);
         break;
       case 'text' :
         _text(req,res); 
        break;
        case 'save':
          _saveGallery(req,res);
          break;
       default : 
         _index(req,res);
         break;
     }
  } 
  
  
 /*------------------------- Router Functions ----------------------------------*/  
  
  function _public(req,res){
      if(!validExtention(req)) return;   // 404
      
      
      fs.exists(__dirname + req.url,function(exist){
       if(!exist){
         	 res.statusCode = 404;      	 
             res.end() ;                 // 404      
           return;
       }else
            fs.readFile(__dirname + req.url,function(err,data){
              if(err){
                throw err;
                res.statusCode = 500;
                res.end()        
              } else 
             {
              res.setHeader("Content-type" , options.extentions[getExtention(req)] || "text/plain");
              res.end(data)
             }
           });
    })  
  
   return;
      
  }
  
  
  function _image(req,res){
    var reqUrl = url.parse(req.url).pathname;
    var regex = /^\/image\//;
    var newUrl = '';
    
    if(reqUrl.match(regex)){      
      newUrl = reqUrl.replace(new RegExp(regex,''),'/uploads/')      
    }else {
    	res.statusCode = 404;
      res.end();         // error
      return;    
    }
      
    fs.exists(__dirname+newUrl,function(exists){
        if(exists){
            fs.readFile(__dirname+newUrl,function(err,data){
              if(err) throw err;         
              
             res.setHeader("Content-type" , options.extentions[getExtention(req)]);
             res.end(data)                          
            })
        }else return;                          //404  
    })
  }
  
  function _text(req,res) {  	  
  	  var txt = '';
  	  req.on('data',function(data){
         txt += data; 	  
  	  })
  	  
  	  
  	  req.on('end',function(){
       var dt	 = JSON.parse(txt);  	
       updateOne(dt,res);       
  	  })   	  
  }
  
  function _delete(req,res){
     var jsonString = '';
     var gallery = req.headers.gallery;
         
     req.on('data',function(data){
         jsonString += data;    
     })
    
     req.on('end',function(){
       var arr = JSON.parse(jsonString);
       for(var i = 0 ; i < arr.length ; i++){
          fs.unlinkSync(path.join(__dirname + '/uploads/'+req.username + '/galelry/'+gallery + '/',arr[i].src));
          fs.unlinkSync(path.join(__dirname + '/uploads/'+req.username + '/gallery/'+gallery + '/thumb/',arr[i].src));                 
       }
       
       remove(arr,gallery,res)     
     })
     
     return;
  }
  
  function _upload(req,res){

  }
  
  
  /*  ////////////////////////////////////// Upload Images /////////////////////////////////// */  
  
  function startUpload(data){ 
  	let that = this;
   let filename = data['name'];
   
     // check the extensiton
    //let extension = options.regex.exec(filename)[1];
    /*if(extension != options.ext) {
      that.emit('error',{error : 'invalid extension'})
    }*/
    
			files[that.id+filename] = { 
			   size : data['size'],
				uploaded : "",
				downloaded : 0,
				name : filename 
			}

			var place = 0;
			try{
				var stat = fs.statSync(options.temp +  filename);
				if(stat.isFile())
				{
					files[that.id+filename]['downloaded'] = stat.size;
					place = stat.size / 524288;
				}
			}
	  		catch(er){} 
			fs.open(options.temp + filename, 'a', 0755, function(err, fd){
				if(err)
				{
					console.log(err);
				}
				else
				{
					files[that.id+filename]['handler'] = fd; 
					that.emit('g-continue', { 'place' : place, percent : 0 ,name : filename});
				}
			});
  }
   
  
  function upload(data){ 
  	 let that = this;
    let filename = data['name'];
    let galleryName = data['gallery'];
    //let imageName = filename.replace(options.regex,'.png')
			files[that.id+filename]['downloaded'] += data['data'].length;
			files[that.id+filename]['uploaded'] += data['data'];
			if(files[that.id+filename]['downloaded'] == files[that.id+filename]['size'])
			{ 
				fs.write(files[that.id+filename]['handler'],files[that.id+filename]['uploaded'], null, 'Binary', function(err, w){
					var inp = fs.createReadStream(options.temp + filename);
			
					
					 var gallery = path.join(__dirname + "/uploads/"+ that.username +'/gallery/'+galleryName);
				 
                if(!fs.existsSync(gallery)){ 
                   fs.mkdirSync(gallery)       	
                }
       
       
               var imagePath = path.join(gallery,filename); 
					var out = fs.createWriteStream(imagePath);
					inp.pipe( out);
					inp.on('close',function(){                
					   addon.process(options.temp + filename,imagePath,function(im_width,im_height){                 
                     that.emit('thumb' , {
          	             src : filename,
          	             height : im_height,
          	             width : im_width,
          	             username : that.username,
          	             gallery : galleryName
                      })                            
                                                 
                    insert({username : that.username,gallery : galleryName,src : data['name'],width : im_width,height : im_height});                          
                                                                                              
        
				  });// end of addon
						});				//end of close	
					}) //end of fs
			
				
			}
			else if(files[that.id+filename]['uploaded'].length > 10485760){ 
				fs.write(files[that.id+filename]['handler'], files[that.id+filename]['uploaded'], null, 'Binary', function(err, w){
					files[that.id]['uploaded'] = ""; 
					var place = files[that.id+filename]['downloaded'] / 524288;
					var percent = (files[that.id+filename]['downloaded'] / files[that.id+filename]['size']) ;
					that.emit('g-continue', { 'place' : place, name : filename ,'percent' :  percent});
				});
			}
			else
			{
				var place = files[that.id+filename]['downloaded'] / 524288;
				var percent = (files[that.id+filename]['downloaded'] / files[that.id+filename]['size']) ;
				that.emit('g-continue', { 'place' : place, name : filename,'percent' :  percent});
			}
   	
  }

  
  function _index(req,res){
     fs.readFile(__dirname + "/views/this.html",function(err,data){
        if(err){
           console.log("\nthis err has occured " + err)     
        } else {
           res.setHeader("Content-Type","text/html");
           res.end(data);                   
        }
     }) 
  }
  
  function _galleries(req,res){
      let username = req.headers.username;
  
        database.connect(options.db.image,function(err,db){
         if(err) throw err ;
         
         db.collection('gallery').find({username : username}).toArray(function(err,data){                  
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');	
             res.write(JSON.stringify(data));             
             res.end();
             db.close();         
         })    
      
     
     })

  }
  
  function _gallery(data){
  	 let that = this;
  	 let galname = data.gal;
     database.connect(options.db.image,function(err,db){
        if(err) throw err;
        
        db.collection('gallery').find({
           gallery: galname , username : data.username      
        }).toArray(function(err,arr){
          if(err) throw err;
        
           that.emit('gal',{images :arr })
            db.close()
        })     
     })  
  }
  
  /*---------------------------     Socket      ------------------------------------*/

 /* function comunicate(server){
      io.listen(server).on('connection',function(socket){ 
      socket.emit('id',{id : socket.id})
      clients.push(socket)
  
      socket.on('disconnect',function(){
        var index = clients.indexOf(socket);
        if(index > -1) clients.splice(index,1)  
      })
    })      
  } */
   
  /*--------------------------- Helper Functions -----------------------------------*/
  
  
  function findClient(id){
    for(var i in clients)
      if(clients[i].id == id)
        return i;
    return -1;
  }
  
  
  //insert many element with the same name
  function insert(obj) {
     database.connect(options.db.image,function(err,db){
        if(err) throw err;
        
        db.collection('gallery').update(
            {gallery : obj.gallery,src : obj.src,username : obj.username},       
            obj,{'upsert':true},function(err,result){
            if(err) throw err;           
           
            db.close();        
        })     
     })
  }
  
  function _saveGallery(req,res){
     let json = '';
     
     req.on('data',function(data){
         json +=data;     
     })
     
     req.on('end',function(){
        let gal = JSON.parse(json);
        
        gal.username = req.username;
      
        database.connect(options.db.image,function(err,db){
           db.collection('hash').insert(gal,function(err,db){
               if(err) throw err;
               
               res.statusCode = 200;
               res.end('fuck you');           
           })        
        })     
     })
     
          
  }
  
  function updateOne(obj,res){
    database.connect(options.db.image,function(err,db){
       if(err) throw err;
       
       db.collection('gallery').updateOne(
          {gallery : obj.gallery,src : obj.src},     
          {$set : {"text": obj.text}},function(err,result){
               if(err) throw err;
               res.statusCode = 200;
               res.end();
               db.close();          
          }  
       )    
    })  
  }
  
  function remove(arr,gallery,res){  
    database.connect(options.db.image,function(err,db){
    	 if(err) throw err;
    	 var srcs = [];

    	 for(var i= 0 ; i < arr.length ; i++)
    	   srcs.push(arr[i].src);
    	 
       db.collection('gallery').deleteMany({gallery : gallery,src : {$in : srcs}},function(err,result){
           if(err) throw err;
           db.close()
           
           res.statusCode = 200;
           res.end();       
       })    
    })
  }
  
  function validExtention(req){
   var ext = getExtention(req);
   
   if(ext in options.extentions) 
     return 1;
   else 
     return 0;  
  }
  
  
  function getExtention(req){
     return path.parse(req.url).ext.toLowerCase();  
  }
  
 function io(io){
    socket = io; 
 }
 
module.exports.router = router;
module.exports.to = io
module.exports.gallery = _gallery
module.exports.upload = upload
module.exports.start = startUpload

