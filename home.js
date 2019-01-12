var database = require('mongodb').MongoClient;
 
  const options = {   
     db : 'mongodb://localhost:27017/cg'
 }
 
  function getloc(data){ 
  
     let that = this;
  	  let coor= JSON.parse(data);
  	
  	  
     database.connect(options.db,function(err,db){
         if(err) throw err;
         
         db.collection('video').find({
         getloc: { $geoWithin: { $box:  [ [ coor.bottom.lng, coor.bottom.lat ], [ coor.upper.lng, coor.upper.lat ] ] } }
         }).toArray(function(err,vid){
         	
         	if(err) throw err;
           db.collection('article').find({
              getloc: { $geoWithin: { $box:  [ [ coor.bottom.lng, coor.bottom.lat ], [ coor.upper.lng, coor.upper.lat ] ] } }
           }).toArray(function (err,art) {
           	  if(err) throw err;
           	    let arr = vid.concat(art);
           	    
           	    db.collection('hash').find({
           	      getloc: { $geoWithin: { $box:  [ [ coor.bottom.lng, coor.bottom.lat ], [ coor.upper.lng, coor.upper.lat ] ] } }
           	    }).toArray(function(err,gal){
           	       if(err) throw err;
           	       
           	       that.emit('home',JSON.stringify(arr.concat(gal)));
           	       db.close();
           	    })
           	    
               
           })
                     
         })     
     })  
  }
  
  
 
  
  
  module.exports.getloc = getloc
  