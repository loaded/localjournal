const crypto = require('crypto')
const database = require('mongodb').MongoClient
const url = require('url')
var fs = require('fs')
  
   const option = {
     db : 'mongodb://localhost:27017/users'   
   }  
  
  function router(req,res,next){
  	
  	  if(validCookie(req,res)) return next(req,res);
  	  
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
        case 'register':
           break;
        case 'login' : 
          _loginHtml(req,res);
          break;        
        default : 
          _sendIndex(req,res);
          break;     
     }     
  }

function hashPassword(password) {
    var salt = crypto.randomBytes(128).toString('base64');
    var iterations = 10000;
    var hash = crypto.pbkdf2(password, salt, iterations);

    return {
        salt: salt,
        hash: hash,
        iterations: iterations
    };
}

function isPasswordCorrect(savedHash, savedSalt, savedIterations, passwordAttempt) {
    return savedHash == pbkdf2(passwordAttempt, savedSalt, savedIterations);
}


function validToken(token){
  
}


function login(username,password){
   
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
     
     if(register(username,password,email))
       _sendIndex(req,res);
     else 
       _loginHtml(req,res)   
        
  })
}

function register(user,pass,mail){
    if(checkUser(user) && checkMail(mail)){
       let hashObject = hashPassword(pass);
       let saveObject = {username : user,email : mail,password : hashObject,date : Date.now()};       
       return saveUser(saveObject);         
    }
}

function saveUser(obj){
  database.connect(config.db,function(err,db){
     if(err) return false;
     
     db.insert(obj,function(err,result){
         if(err) return false;
         
         db.close();
         return true;     
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
        
        db.collection('users').findOne({username : user }).toArray(function(err,data){
        	   db.close();
        	   
            if(data) return true;
            else return false;
                  
        });   
    })
}


function validCookie(req,res){
    let cookie = parseCookies(req);
    
    if(validToken(cookie['cook'])
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

function createCookie(){
    var current_date = (new Date()).valueOf().toString();
    var random = Math.random().toString();
   return crypto.createHash('sha1').update(current_date + random).digest('hex');
}

function _sendIndex(req,res){
  fs.readFile(__dirname + "/views/this.html",function(err,data){
     if(err)
       console.log('error')
     else {
        res.setHeader('Set-Cookie','cook='+createCookie());     	  
     	  res.setHeader('Content-Type','text/html');
     	  res.end(data)
     }  
  })
}

module.exports.router = router
