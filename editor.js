
var url = require('url')
var fs = require('fs')
var path  = require('path')
var formidable = require('formidable')
var addon = require("bindings")("process")
var database = require('mongodb').MongoClient;
//var sockets = require('./sockets.js')
let files = {}
let socket = null;   
   const options = {
     route : "/editor",
     db:"mongodb://localhost:27017/cg",
     dir : "/uploads",
     temp : 'Temp/'
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
     
    function _article(data){
        let id = data.id; console.log(id);
        let that = this;
        database.connect(options.db,function(err,db){
           if(err) throw err;
           
           db.collection('article').findOne({_id : new require('mongodb').ObjectID(id)},function(err,data){
              if(err) throw err;
              
              that.emit('article',{article : data});
              db.close() 
           })        
        })    
    }
   
   function _articles(req,res){
   	    let username = req.headers.username;
          database.connect(options.db,function(err,db){
         if(err) throw err ;
         
         db.collection('article').find({username : username}).toArray(function(err,data){                  
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
     	   if(!art[i].hasOwnProperty('getloc'))
         article[i] = art[i]; 
         else 
           article['getloc'] = art[i].getloc;
           
           if(art[i].hasOwnProperty('location'))
             article['location'] = art[i].location;
     }
     
     article['type'] = 'article';   
     article['username'] = req.username; 

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
       var uploadPath = path.join(__dirname +"/"+options.dir+'/' + req.username + '/article' , date.toString() ); 
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
					that.emit('a-continue', { 'place' : place, percent : 0 ,name : filename});
				}
			});
  }
   
  
  function upload(data){ 
  	 let that = this;
    let filename = data['name'];
    let date = Date.now()
    //let imageName = filename.replace(options.regex,'.png')
			files[that.id+filename]['downloaded'] += data['data'].length;
			files[that.id+filename]['uploaded'] += data['data'];
			if(files[that.id+filename]['downloaded'] == files[that.id+filename]['size'])
			{ 
				fs.write(files[that.id+filename]['handler'],files[that.id+filename]['uploaded'], null, 'Binary', function(err, w){
					var inp = fs.createReadStream(options.temp + filename);
			
					
					 var gallery = path.join(__dirname + "/uploads/"+ that.username +'/article/'+date.toString());
				 
                if(!fs.existsSync(gallery)){ 
                   fs.mkdirSync(gallery)       	
                }
       
       
               var imagePath = path.join(gallery,filename); 
					var out = fs.createWriteStream(imagePath);
					inp.pipe( out);
					inp.on('close',function(){                
					   addon.process(options.temp + filename,imagePath,function(im_width,im_height){                 
                 that.emit('eduprog',{name : filename,url : imagePath.replace(__dirname,'')})                 
                                            
                                                                                              
        
				  });
						});		
					}) 
			
				
			}
			else if(files[that.id+filename]['uploaded'].length > 10485760){ 
				fs.write(files[that.id+filename]['handler'], files[that.id+filename]['uploaded'], null, 'Binary', function(err, w){
					files[that.id]['uploaded'] = ""; 
					var place = files[that.id+filename]['downloaded'] / 524288;
					var percent = (files[that.id+filename]['downloaded'] / files[that.id+filename]['size']) ;
					that.emit('a-continue', { 'place' : place, name : filename ,'percent' :  data['data'].length});
				});
			}
			else
			{
				var place = files[that.id+filename]['downloaded'] / 524288;
				var percent = (files[that.id+filename]['downloaded'] / files[that.id+filename]['size']) ;
				that.emit('a-continue', { 'place' : place, name : filename,'percent' :  data['data'].length});
			}
   	
  }

   
   
  function io(io){
       socket = io;
  }
  
module.exports.router = router;
module.exports.to = io;
module.exports.article = _article
module.exports.upload = upload
module.exports.start = startUpload
