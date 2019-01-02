const crypto = require('crypto')
const database = require('mongodb').MongoClient
const url = require('url')
let fs = require('fs')
let redis = require('redis');
let client = redis.createClient();
const {promisify} = require('util');
var path = require('path');
const getAsync = promisify(client.get).bind(client);
  
   const options = {
     db : 'mongodb://localhost:27017/users',
     route : '/login',
     dir : '/uploads'
   }  
  
  function router(req,res,next){  	 
  	  middleware(req,res,next)     
  }
  
  
  async function middleware(req,res,next){
  	   let cookies = parseCookies(req);
  	   
  	   if(cookies['cook'] === undefined || cookies['cook'] == null) return route(req,res);
      let cook = await getAsync(cookies['cook']);    
      
      if(cook === undefined || cook == null) return route(req,res)  
      req.username = cook;
    
      return next(req,res);
  } 

function route(req,res){ 
      let action = req.headers.action;
    
     switch(action){     
        case 'register':
           registerPath(req,res);
           break;
        case 'login' : 
          loginPath(req,res);
          break;        
        default : 
          _loginHtml(req,res);
          break;     
     }     
}



function validToken(token){
	
	if(token === undefined || token == null) return false;
   client.get(token,function(err,value){
          if(value) isOk(true);
          else isOk(false)
   })    
}


function loginPath(req,res) {
	let json = '';
	
	req.on('data',function(data){
        json += data;	
	})
	
	req.on('end',function(){
      let obj = JSON.parse(json);
      
      let username = obj.user;
      let password = obj.pass;
      
      
      if(isValidUser(username)){
            database.connect(options.db,function(err,db){
               if(err) return null;
        
              db.collection('users').findOne({username : username},{username : 1,password:1,email : 1,date:1},function(err,data){
                 if(err ) throw err;
                 console.log(data)
                
                 if(data != null)
                   crypto.pbkdf2(password, data.password.salt, data.password.iterations,64,'sha512',(err,drivedkey)=>{
                      if(err) throw err;
                       
                      if(data.password.hash == drivedkey.toString('hex')){
                      	  req.username = obj.user;
                         _sendIndex(req,res);
                      }else {
                         _loginHtml(req,res);                          
                      }
                                       
                    }); 
                    
                    db.close()         
                })  
           })              
      }    
  
	})
}



function registerPath(req,res){
  let json = '';
  
  
  req.on('data',function(data){
     json += data;  
  })
  
  req.on('end',function(){
     let obj = JSON.parse(json);
     
     let username = obj.user;
     let password = obj.pass;
     let email = obj.mail;
     
     register(username,password,email,req,res)   
        
  })
}

function register(user,pass,mail,req,res){
    if(checkUser(user) && checkMail(mail)){       
        let salt = crypto.randomBytes(128).toString('base64');
        let iterations = 10000;     
    
        crypto.pbkdf2(pass,salt,iterations,64,'sha512',(err,key)=>{
           if(err) throw err;        
           
           let hashObject = {salt : salt,iterations : iterations,hash : key.toString('hex')}
           let saveObject = {username : user,email : mail,password : hashObject,date : Date.now()}; 
           let userDir = path.join(__dirname + '/uploads/' + user);
           if(!fs.existsSync(userDir)){
             fs.mkdirSync(userDir);
             fs.mkdirSync(userDir + '/video');
             fs.mkdirSync(userDir + '/gallery');
             fs.mkdirSync(userDir + '/article');
           }
           
           req.username = user;
           saveUser(saveObject,req,res);            
        })                
            
    }
}

function saveUser(obj,req,res){
  database.connect(options.db,function(err,db){
     if(err) throw err;
     
     db.collection('users').insert(obj,function(err,result){
         if(err) _loginHtml(req,res)
         
         db.close();        
         _sendIndex(req,res);        
     })
  })
}

function checkMail(mail){
    return true;
}

function checkUser(username){
  if(isValidUser(username))
    if(!existsUser(username))
      return true;
  return false;
}

function isValidUser(username){
  return true;
}

function existsUser(user){
    database.connect(options.db,function(err,db){
        if(err) throw err;
        
        db.collection('users').findOne({username : user },function(err,data){
        	   db.close();
        	   
            if(data) return true;
            else return false;
                  
        });   
    })
}


function validCookie(req,res){
    let cookie = parseCookies(req);   
    
    if(validToken(cookie['cook']))
      return true;
    else 
     return false; 
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

function _loginHtml(req,res){
   fs.readFile(__dirname + "/views/login.html",function(err,data){
       if(err){
         console.log('\nindex can not be loaded!' + err);
         }
       else {       	
       	res.setHeader("Content-Type","text/html");
       	res.end(data);
       }   
   })
}

async function createCookie(req,res){ 
    let now = (new Date()).valueOf().toString();
    let rand = Math.random().toString();
    let cook = crypto.createHash('sha256').update(now + rand).digest('hex');      
    await client.set(cook,req.username);    
    res.setHeader('Set-Cookie','cook='+cook +';user='+req.username+';Expires='+new Date(new Date().getTime() + 12*60 * 60 * 1000).toUTCString());   
    res.setHeader('Content-Type','text/html');    
    res.end('');    
}

function _sendIndex(req,res){ 
   createCookie(req,res); 
}

module.exports.router = router