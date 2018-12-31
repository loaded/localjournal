var database = require('mongodb').MongoClient;

 var fs = require('fs')
 var exec = require('child_process').exec
 var url = require('url');
 var path = require('path');
 var util = require('util')
 var files  = {}
 
 const options = {
   route : '/video',
   db : 'mongodb://localhost:27017/cg',
   temp : 'Temp/',
   pathname : 'uploads/',
   regex :  /(?:\.([^.]+))?$/,
   ext : 'webm'
 }
 
  function router(req,res){
     let reqUrl = req.url;
     let pathname = url.parse(reqUrl).pathname;
     let newUrl = pathname.replace(options.route,'');
     let route = newUrl.match(/\/[a-z]+\/?/)
     
     if(route == null || route == '/'){
       route = '';     
     }else {
       route = route[0].replace(new RegExp('/','g'),'')     
     }
     
     switch(route){
        case 'index':
          _videos(req,res);
          break;
        default : 
          break;     
     }     
  }
  
  function _videos(req,res){
     database.connect(options.db,function(err,db){
         if(err) throw err;
         
         db.collection('video').find({username : req.headers.username}).toArray(function(err,data){
         	if(err) throw err;
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.end(JSON.stringify(data));
            db.close();         
         })     
     })  
  }
  
  function video(data){
     let id = data.id;
     let that = this;
     database.connect(options.db,function (err,db) {
     	  if(err) throw err;
     	  
     	  db.collection('video').findOne({_id : new require('mongodb').ObjectID(id)},function (err,model) {
     	  	  if(err) throw err;    	  	  
     	  	 
     	  	  that.emit('video' ,{video : model})
     	  	  db.close()
     	  })
     })  
  }
  
  
  function saveVideo(socket,name,image){
     database.connect(options.db,function(err,db){
        if(err) throw err;          
        let video = {
           date : Date.now() ,
           image : options.pathname + socket.username + '/video/' + image,
           location :files[socket.id].args.location ,
           getloc : files[socket.id].args.getloc,
           tags : files[socket.id].args.tags,
           title : files[socket.id].args.title,
           url : options.pathname +socket.username +'/video/'+ files[socket.id].name ,
           username : socket.username      
        }
        
        
        db.collection('video').insert(video,function(err,result){
            if(err){
                socket.emit('error',{error : 'can not save in db'});
                throw err;            
            }        
            delete files[socket.id];
            socket.emit('done',video);
        })     
     })     
  }
  
  
  function startUpload(data){ console.log('start upload \n')
  	let that = this;
   let filename = data['name'];
   let args = data['args'];
   
    let extension = options.regex.exec(filename)[1];
    if(extension != options.ext) {
      that.emit('error',{error : 'invalid extension'})
    }
    
			files[that.id] = { 
			   size : data['size'],
				uploaded : "",
				downloaded : 0,
				name : filename ,
	         args : args		
			}

			var place = 0;
			try{
				var stat = fs.statSync(options.temp +  filename);
				if(stat.isFile())
				{
					files[that.id]['downloaded'] = stat.size;
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
					files[that.id]['handler'] = fd; 
					that.emit('continue', { 'place' : place, percent : 0 });
				}
			});
  }
   
  
  function upload(data){ console.log('upload ing \n')
  	 let that = this;
    let filename = data['name'];
    let imageName = filename.replace(options.regex,'.png')
			files[that.id]['downloaded'] += data['data'].length;
			files[that.id]['uploaded'] += data['data'];
			if(files[that.id]['downloaded'] == files[that.id]['size']) //If File is Fully Uploaded
			{
				fs.write(files[that.id]['handler'],files[that.id]['uploaded'], null, 'Binary', function(err, w){
					var inp = fs.createReadStream(options.temp + filename);
					var out = fs.createWriteStream(options.pathname + that.username + '/video/' + filename);
					inp.pipe( out);
					inp.on('close',function(){
						delete files[that.id];
                  fs.unlink(options.temp + filename, function () { //This Deletes The Temporary File
							exec("ffmpeg -i " + options.pathname  + that.username + '/video/'+ filename  + "  -vframes 1  -filter:v scale=150:-1 " + options.pathname + that.username + '/video/'+ imageName, function(err){
								//that.emit('done', {'url' : options.pathname + imageName});
								if(err) throw err;
								saveVideo(that,filename,imageName);
							});
						});					
					})
					});
				
			}
			else if(files[that.id]['uploaded'].length > 10485760){ //If the Data Buffer reaches 10MB
				fs.write(files[that.id]['handler'], files[that.id]['uploaded'], null, 'Binary', function(err, w){
					files[that.id]['uploaded'] = ""; 
					var place = files[that.id]['downloaded'] / 524288;
					var percent = (files[that.id]['downloaded'] / files[that.id]['size']) * 100;
					that.emit('continue', { 'place' : place, 'percent' :  percent});
				});
			}
			else
			{
				var place = files[that.id]['downloaded'] / 524288;
				var percent = (files[that.id]['downloaded'] / files[that.id]['size']) * 100;
				that.emit('continue', { 'place' : place, 'percent' :  percent});
			}
   	
  }
  

  
module.exports.start = startUpload
module.exports.upload = upload
module.exports.router = router
module.exports.video = video

