  var Index = (function(){ 
     function connector(arg){
        View.insertImage.notify(arg);     
     }   
        
   function iMouseDown(e){
     window.addEventListener('mousemove', iDivMove, true);
       let editable = document.getElementsByClassName('ndrag');
               for(let ed of editable)
                 ed.removeAttribute('contenteditable');
    
   }
   
   function iMouseUp(e){
      window.removeEventListener('mousemove', iDivMove, true);
      document.getElementById('iheader').style.position = 'fixed';
        let editable = document.getElementsByClassName('ndrag');
               for(let ed of editable)
                 ed.setAttribute('contenteditable','true');
   }
   function iDivMove(e){
         let div = document.getElementById('iheader');
         div.style.position = 'absolute';
        div.style.top = e.clientY + 'px';
         div.style.left = e.clientX + 'px';   
   }
let View = {
           config : {
              m : {
                archive : {height : null}
              },  
              d : {
                 archive : {height : null}              
              },        	
              mainWidth : 900,
              mWidth : null,
              header : {
                m : 0,
                d : 150
              },
              dialog : {
                m : {width:300,height:200},
                d : {width : 600,height:300}                 
              },
            
              documentWidth : window.innerWidth, // i changed it if it didn't work i should change to previous value
              documentHeight : window.innerHeight,
              events : ['insertImage'],
              btns : ['header','location','reorder','caption','text','tags','description','save'],
              menubar : ['article','video','gallery','about'],
              redbtn : ['header','location','tags','description','save']
           },         
           
           currentContainer : null,           
           
           defineProp : function(obj,key,value){  
             var setting = {
               value : value,
               writable : true,
               enumerable : true,
               configurable : true      
              }             
               
             Object.defineProperty(obj,key,setting);
           },
           
           position : 0,  
           content : [],
           totalSize : 0,
           recieved : 0,
           completed : 0,
           elems : [],         
           files : [],
           greenbtns : [],
           
           _init : function(){
              for(let t = 0 ; t < this.config.btns.length ; t++)
           	     this.config.events.push(this.config.btns[t])
           	  for(var i= 0 ; i< this.config.events.length ; i++)
           	     this.defineProp(this,this.config.events[i],new Event(this))
           	     
           	   this.config.mWidth = window.innerWidth -5;
           },         
           
           _archiveEditor : function(articles){             
               this._styleEditorArchive();
               this._archiveEventListner();
               this._setArticles(articles);
           },
           
           
    _isLoggedIn : function(){
       return View.username == username;
    },
    
    _profilePic : function () { 
    	  let container = document.createElement('div');
    	  container.style.width = 200 + 'px';
    	  container.style.height = 30 + 'px';
    	  container.style.float = 'right';
    	  container.id = 'e-pp' 
    	  let span = document.createElement('span');
    	  span.innerHTML = this.username ; 
    	  span.style.float = 'right';   	  
    	  span.style.color = 'black';
    	  span.style.cursor = 'pointer';
    	  span.style.marginRight = 5 + 'px';
    	  span.style.marginTop = 7 + 'px';
    	  
    	  span.style.fontSize = 12 + 'px';
    	  let profile = new Image();
    	  profile.src = makeUrl('public/arrow/me.png');
    	  profile.style.width = 30 + 'px';
    	  profile.style.height = 30 + 'px';
    	  profile.style.float = 'right';
    	  profile.style.borderRadius = '50%';
    	  profile.style.objectFit = 'cover';
    	  container.appendChild(profile);
    	  container.appendChild(span);
    	  span.state = 'hide';
    	  span.addEventListener('click',this._hideOrShowMenu.bind(this))  
    	  
    	  
    	  return container;   	  
    	  
    },
    
      
    _hideOrShowMenu : function(e){ 
      let elem = e.target;
      
      if(elem.state == 'show'){ 
      	this._hideProfileMenu();
          elem.state = 'hide';      
      }        
      else { 
        
          this._showProfileMenu();   
           elem.state = 'show';
              
       }      
    
    },
    _hideProfileMenu : function(){  
      document.getElementById('e-menubar').remove()
      let canvas = document.getElementById('e-profile-menu')
    
      let radius = canvas.getAttribute('radius');
        radius -=1
      let context = canvas.getContext('2d');
      let x = canvas.width/2;
      let y = canvas.height/2;
      let id = window.setInterval(function(){
          if(radius < 10){
             clearInterval(id);
             canvas.remove();
          
          }
                     
      context.beginPath();
      context.arc(200,0,radius,0.5*Math.PI,Math.PI);
      context.lineWidth = 21;
      radius -= 15;      

      // line color
      context.strokeStyle = 'white';
      context.stroke();  
          
                
      },2)   
        },
    
    	   _showProfileMenu : function(){
	       let that = this;
          let left  ;
          let top = 40;	       
	       if(this._isMobile()){
             left = window.innerWidth - 200;
                
	       }else{
             left = 900 + (window.innerWidth - 900)/2 - 197;	   
          }
	       
	      let canvas = document.createElement('canvas');
	      canvas.width = 200;
	      canvas.height = 200;
	   
	      canvas.id = 'e-profile-menu'
	      let context = canvas.getContext('2d');
	      
	      let radius = 1;      
	      canvas.style.position = 'fixed';
	      
	      canvas.style.top = top;
	      canvas.style.left = left + 'px';
	      
	      canvas.style.zIndex = 100;     
	      
	      document.body.appendChild(canvas);         
	        
          let id = window.setInterval(function(){ 
            if(radius > 150){
               clearInterval(id);               
                  
               that._menubar()
               canvas.setAttribute('radius',radius)
               
               return;            
            }
            
         radius +=2;
	      context.beginPath();
	      context.arc(200,0,radius,0.5*Math.PI,Math.PI);
	      context.closePath();
	      context.fillStyle = 'lightblue';
	      context.fill();    

         },1)	  
	       
	   },   
    
    	_menubar : function () {    	    
          let left  ;
          let top = 60;	       
	       if(this._isMobile()){
             left = window.innerWidth - 10;
                
	       }else{
             left = 900 + (window.innerWidth - 900)/2 ;
          }
	   	let that = this;
	      let menubar = document.createElement('div');
	      for(let i = 0 ; i < this.config.menubar.length ; i++){
            let menu = document.createElement('div');
            menu.innerHTML = this.config.menubar[i];
            menu.classList.add('menubar-m');	    
            menu.style.height = 20 + 'px';
            menu.style.color = 'white';
            menu.addEventListener('click',function () { 
               that._hideProfileMenu();
               if(that.config.menubar[i] == 'article')
            	 app.router(that.username,'editor/archive')
            	else 
            	  app.router(that.username,that.config.menubar[i] + '/archive');
            })
            
            $(menu).hover(function(){
               this.innerHTML = that.config.menubar[i].toUpperCase() 
            },function(){
               this.innerHTML = that.config.menubar[i].toLowerCase()
            })
            menubar.appendChild(menu);  
	      }
	      
	      
	      menubar.classList.add('menubar-a');
	      menubar.id = 'e-menubar'
	      
	      menubar.style.top = top  + 'px';
	      menubar.style.left = (left -60) + 'px';
	      menubar.style.fontSize = 10 + 'px';   
	      
	      menubar.style.height = this.config.menubar.length * 20 + 'px';
	      document.body.appendChild(menubar) ;
	      
	      $(menubar).animate({opacity:1},300);
	      
	   },
           
    _styleEditorArchive : function(){                 	   
           	   let archive = document.getElementById('editor-archive');
           	   let viewPort = document.getElementById('a-archive-container');
           	   
           	            	   
           	   this.currentContainer = archive; 
               archive.style.display = 'block';
                archive.style.width = window.innerWidth + 'px';
               archive.style.height = window.innerHeight + 'px';                 
               let archiveContainer = document.getElementById('archive-container');
               
               let header = document.getElementById('e-header');
               let btn = document.getElementById('e-header-btn');
               
               if(!this._isLoggedIn()){
               	if(document.getElementById('e-pp'))
               	  document.getElementById('e-pp').remove();
               	  header.profile = 0; 
               	  btn.style.display = 'none';
                  if(header.profile != '1'){ 
                    header.appendChild(this._profilePic()) ; 
                    header.profile = '1'
                  }
                    
                            
               }else{
                 if(document.getElementById('e-pp')) 
                   document.getElementById('e-pp').remove();
                   btn.style.display = 'block';
               }
               
               if(this._isMobile()){
                  archiveContainer.style.width = window.innerWidth + 'px';
                 header.style.height = 30 + 'px';
                 header.style.width = this.config.mWidth +  'px';
                 btn.classList.add('me-header-btn');    
                 archiveContainer.style.width = this.config.mWidth  + 'px';     
                 viewPort.style.width = this.config.mWidth + 'px';
                 viewPort.style.top = 50 + 'px';         
                 viewPort.style.height = (window.innerHeight - 70) + 'px';   
                 header.style.width = this.config.mWidth + 'px';             
               }else{
                 archiveContainer.style.width = this.config.mainWidth + 'px';
                 header.style.height = 30 + 'px';
                 viewPort.style.width = this.config.mainWidth + 'px';
                 viewPort.style.height = (window.innerHeight - 70) + 'px';
                 viewPort.style.top = 50 + 'px';
                 btn.classList.add('de-header-btn');
                 header.style.width = this.config.mainWidth + 'px';
               }         
               
                   	 
    	 const ps = new PerfectScrollbar(viewPort,{
          suppressScrollX:true	 
    	 });        
               
           },
           
           _archiveEventListner : function(){
           	  if(this.btncreated == true) 
           	    return;
           	  this.btncreated = true;
              let btnArticle = document.getElementById('e-header-btn');
              btnArticle.addEventListener('click',this._createArticle.bind(this),false);
           },
           
           _setArticles : function(articles){ 
           	 let monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
           	 let archiveContainer = document.getElementById('a-archive-container')
           	 archiveContainer.innerHTML = '';
           	 
           	 String.prototype.replaceAt=function(index, replacement) {
                   return this.substr(0, index) + replacement+ this.substr(index ,this.length);
              }
           	 
             for (let elem of articles) { 
             	 let that = this;
             	 let articleContainer = document.createElement('div');
             	 articleContainer.classList.add('e-article-container');
             	 let pic ,location,date ,tags,description,header,height,width , newHeight,newWidth;
             	 
             	 for (let obj in elem) {
             	 	   if(elem[obj] == null ) continue;
                      switch(elem[obj]['type']){
                         case 'fit':
                         case 'full':
                         case 'medium':
                           if(!pic)
                             pic = elem[obj]['url'];
                             width = elem[obj]['width'];
                             height = elem[obj]['height'];
                           break;
                         case 'location':
                           location = elem[obj]['location'];
                           break;
                         case 'tag':
                           tags = elem[obj]['tag'];
                           break;
                         case 'header':
                           header = elem[obj]['html']
                           break;
                         case 'description':
                           description = elem[obj]['html'];
                           break;
                         case 'date':
                           date = elem[obj]['date'];
                           break;
                         default:
                          break;                        
                      }               
                           	 	 
             	 }
              
              if(!tags) continue;
              let dte = new Date(date);
              let archive = document.createElement('div');
              archive.classList.add('a-archive');
              archiveContainer.appendChild(archive);
              
              let timeContainer = document.createElement('div');
              timeContainer.classList.add('a-archive-timeContainer');
              
                 let yearContainer = document.createElement('span');
                 let monthContainer = document.createElement('span');
                 let dayContainer = document.createElement('span');
                 
                 yearContainer.innerHTML = dte.getFullYear();
                 monthContainer.innerHTML = monthShortNames[dte.getMonth()]
                 dayContainer.innerHTML = dte.getDate()
                 
                 
                 yearContainer.classList.add('a-archive-yearC');
                 monthContainer.classList.add('a-archive-monthC');
                 dayContainer.classList.add('a-archive-dayC');
                 
                 timeContainer.appendChild(yearContainer);
                 timeContainer.appendChild(monthContainer);
                 timeContainer.appendChild(dayContainer)
              
              let articleContent = document.createElement('div');
              articleContent.classList.add('a-archive-articleContent');
              
              archive.appendChild(timeContainer);
              archive.appendChild(articleContent);
              
              let thumbContainer = document.createElement('div');
              thumbContainer.classList.add('a-archive-thumbContainer');
                let img = document.createElement('img');
                img.src =this._returnUrl(pic.replaceAt(pic.lastIndexOf('/'),"/thumb/"));
                thumbContainer.appendChild(img)
              
              let headerDesc = document.createElement('div');
              headerDesc.classList.add('a-archive-headerDesc');
              
              articleContent.appendChild(thumbContainer);
              articleContent.appendChild(headerDesc);              
              
              let headerContainer = document.createElement('div');
              headerContainer.classList.add('a-archive-header');
              headerContainer.innerHTML ="<div>"+ header +"</div>";
        
              headerContainer.addEventListener('click',function(){
                          
                document.getElementById('a-archive-container').innerHTML = '';
                document.getElementById('editor-archive').style.display = 'none';  
                Router.route(elem.username,'show/' + elem._id);
              })
              
              let tagsContainer = document.createElement('div');
              tagsContainer.classList.add('a-archive-tagsContainer');
              
              for(let tg of tags){
                let span = document.createElement('span');
                span.classList.add('a-archive-tagstg');
                span.innerHTML = '#' + tg;
                
                tagsContainer.appendChild(span);              
              }
              
              let descContainer = document.createElement('div');
              descContainer.innerHTML = description;
              descContainer.classList.add('a-archive-descContainer');
              
              headerDesc.appendChild(headerContainer);
              headerDesc.appendChild(tagsContainer);
              headerDesc.appendChild(descContainer);              
             	 
              if(this._isMobile()){
                archive.style.height = 110 + 'px';
                archive.style.width = window.innerWidth + 'px';
                archive.style.top = 15 + 'px';
                timeContainer.style.width = 45 + 'px';
                timeContainer.style.height = 60  + 'px';   
                
                articleContent.style.height = 100 + 'px';
                articleContent.style.width = (window.innerWidth -60) + 'px';
                thumbContainer.style.width = 100 + 'px';
                thumbContainer.style.height = 100 + 'px';
                
                headerContainer.style.fontWeight = 600;
                headerContainer.style.fontSize = 12 + 'px';
                if(width > height){
                    newHeight = (height/width) * 100; 
                    newWidth = 100;
                    img.style.width = 100 + 'px';
                    img.style.height = newHeight + 'px';
                    //img.style.marginTop = (100 - newHeight)/2 + 'px';           
                }else {
                    newWidth = (width/height) * 100; 
                    newHeight = 100;
                    img.style.width = newWidth + 'px';
                    img.style.height = newHeight + 'px';
                    img.style.marginLeft = (100 - newWidth) + 'px';
                    timeContainer.style.top = 20+ 'px';
                }
                
               // headerContainer.style.fontSize = 12 + 'px';                
                tagsContainer.style.fontSize = 12 + 'px';
                descContainer.style.display = 'none'
                headerDesc.style.width = 155 + 'px';
                headerDesc.style.height = 100 + 'px';    
                headerDesc.style.paddingLeft = 5 + 'px';
                headerDesc.style.paddingRight = 5 + 'px';
                headerDesc.style.overflow = 'hidden';          
              }else{
                archive.style.height = 170 + 'px';
                archive.style.width = this.config.mainWidth + 'px';
                archive.style.top = 25 + 'px';
                timeContainer.style.width = 60 + 'px';
                timeContainer.style.height = 60  + 'px';   
               
                articleContent.style.height = 150 + 'px';
                articleContent.style.width = (this.config.mainWidth -60) + 'px';
                thumbContainer.style.width = 150 + 'px';
                thumbContainer.style.height = 150 + 'px';
                headerContainer.style.fontWeight = 600;
                headerContainer.style.fontSize = 14 + 'px';
                descContainer.style.fontSize = 12 + 'px';
                descContainer.style.paddingRight = 10 + 'px';
                if(width > height){
                    newHeight = (height/width) * 150; 
                    newWidth = 150;
                    //img.style.marginTop = (150 - newHeight)/2 + 'px';           
                }else {
                    newWidth = (width/height) * 150; 
                    newHeight = 150;
                    img.style.marginLeft = (150 - newWidth) + 'px';
                     timeContainer.style.top = 50+ 'px';
                }
                headerDesc.style.width = (this.config.mainWidth -210) + 'px';
                headerDesc.style.height = 150 + 'px';
                //articleContent.style.top = 15 + 'px';           
              }	             	 
             	 
             }
           },
           
           _createArticle : function(){
               document.getElementById('editor-archive').style.display = 'none';
               Router.route(username,'create'); 
           },
           
           _createEditor : function(){
           	  let container =  document.getElementById('indexContainer');
              document.getElementById('iheader').innerHTML = '';
              document.getElementById('contentArticle').innerHTML = '';
           	  container.style.display = 'block';            	  
           	  this.files.length = 0;
           	  this.greenbtns.length = 0;
           	  this.content.length = 0;
           	  this.currentContainer = container;
              this.config.documentWidth = window.innerWidth; /// this is wierd because in config is set to window.innerWidth
              this._eventBinding();
              this._styleElements();
           },
           
           _eventBinding : function(){	                  
             this.caption.attach(this._caption) ;
             this.text.attach(this._insertEditable);	 
             this.location.attach(this._addLocation.bind(this))
             this.tags.attach(this._addTags.bind(this));
             this.description.attach(this._addDescription.bind(this))
             this.header.attach(this._addHeader.bind(this));
             let that = this;
             Sortable.create(contentArticle,{    
                scroll : true,         
                scrollSensitivity: 30, 
	             scrollSpeed: 10 ,
	             onStart : function(){                   
         	                     
	             },
	             onEnd : function(e){
         	       let cy = e.originalEvent.clientY;
         	       let cx = e.originalEvent.clientX;
         	       
         	       let wh = window.innerHeight/2;
         	       let ww = window.innerWidth/2;                          	       
         	       
         	       if(cy < wh + 50 && cy > wh -50)
         	         if(cx < ww -50 && cx > ww - 150){
         	         	   if(e.item.classList.contains('fit')){
         	         	       let index = that.files.findIndex(function(elem){         	         	            	         	       
                               return elem['name'] == e.item['name']; 	   
              	             })
              	            
         	         	    that.files.splice(index,1)    
         	         	    that.content.splice(index,1)        	         	   
         	         	   }        
              	            if(e.item.querySelector('.description')) {
              	               let index = that.greenbtns.indexOf('description'); 
              	               if(index > -1){
              	                  that.greenbtns.splice(index,1);
              	                  document.getElementById('ei-description').classList.add('e-redbtn');
              	                  document.getElementById('ei-description').classList.remove('e-greenbtn');
              	               }
              	                
              	            }
              	            
              	            if(e.item.querySelector('.ei-header')){   
                              let index = that.greenbtns.indexOf('header');
                              if(index > -1 ){
                                  that.greenbtns.splice(index , -1);  
                                  document.getElementById('ei-header').classList.add('e-redbtn');
                                  document.getElementById('ei-header').classList.remove('e-greenbtn');
                              }
                                           	            
              	            }
              	              
              	            e.item.remove()     	         
         	         }
         	           
	             }        
             })           
           },        
           
           _fullScreen : function(e){          	 
             const im = e.target;
             let div = document.createElement('div');            
             
             div.classList.add('fullscreen');
             let clientW = document.documentElement.clientWidth ;
             let clientY = document.documentElement.clientHeight;
             
             div.style.width = clientW+ 'px';
             div.style.height = clientY + 'px';
             div.style.top = 0;
            
             document.body.appendChild(div);
             
             let height = im.height ;
             let width = im.width;
             
             let src = im.src;
             
             let image = new Image();
             image.src = src;
             image.height = height;
             image.width = width;
             image.classList.add('auto');
             image.style.cursor = 'pointer';
             if((clientY - height) > 0)
              image.style.marginTop = (clientY - height)/2 + 'px';
             
             image.addEventListener('click',function(){
                div.remove();   
             })
             div.appendChild(image);         
             
           },
           
           _returnUrl : function(url){
              return "http://"+localhost + url
           },
            
           _showArticle : function(arti){  
             let left  ;
             let top = 60;	       
	          if(this._isMobile()){
               left = window.innerWidth - 10;
                
	          }else{
               left = 900 + (window.innerWidth - 900)/2 ;             
             }
             
              let editor = document.getElementById('editor-article');
             let profile = this._profilePic();
             
             profile.style.position = 'absolute';
             profile.style.zIndex = 800;
             
             profile.style.top = 10 + 'px';
             profile.style.left = (left -200) + 'px';      
             
              document.getElementById('indexContainer').style.display = 'none';     
             
              editor.innerHTML = '';
                editor.appendChild(profile);
              let viewPort = document.createElement('div');
              viewPort.classList.add('editor-article-view');
              editor.style.display = 'block';
              var articleBody = document.createElement('div');
              
              articleBody.setAttribute('id','editor-article1');
             // document.body.append(articleBody)
              editor.appendChild(viewPort);
               viewPort.appendChild(articleBody)
              this.currentContainer = document.getElementById('editor-article')
              articleBody.style.display = 'block';
              
              
              let articles = [];
              let sorted  = []
              
              for(let t in arti){
                  articles.push(arti[t]);                               
              }
              
              let isorted = articles.filter(function(elem){
                 return elem.hasOwnProperty('pos');              
              })
              
              isorted.sort(function(obj1,obj2){
                     return parseInt(obj1.pos) - parseInt(obj2.pos);              
              })
             
              arti = isorted;
                          
              for (var i in arti)
                { 
                   if(arti[i].hasOwnProperty('type')){
                         switch(arti[i]['type']) {
                              case "fit" : 
                                 this._fitArticle(arti[i])
                               break;
                              case "medium":
                                 this._mediumArticle(arti[i]);
                               break;
                              case "text":
                                 this._textArticle(arti[i]);
                               break;
                              case "full":
                                this._fullArticle(arti[i]);
                               break;
                               case "caption" : 
                                 this._captionArticle(arti[i]);
                                 break;
                              default:
                               break;                         
                         }                   
                   }                
                }
              articleBody.style.display = 'block';
              if(this._isMobile()){
                 articleBody.style.width = window.innerWidth + 'px';   
                 viewPort.style.width = window.innerWidth+ 'px';
                 viewPort.style.height = (window.innerHeight -10) + 'px';           
              }else{
                 articleBody.style.width = window.innerWidth + 'px'; 
                 viewPort.style.width = window.innerWidth + 'px';
                 viewPort.style.height = (window.innerHeight - 10 ) + 'px';                              
              }                  
             
             
              const ps = new PerfectScrollbar(viewPort,{
                 suppressScrollX:true	 
    	        });
                     
            },          
            
            _fullArticle : function (full) {
            	const screenWidth = document.documentElement.clientWidth;
            	const height = full.height;
            	const width = full.width;
            	
            	const newHeight = parseInt((height/width) * screenWidth);
               
               var image = new Image();
               if(this._isMobile()){
                      image.src = this._returnUrl(full.url.replaceAt(full.url.lastIndexOf('/'),'/mobile'));
               }else{
                    image.src = this._returnUrl(full.url.replaceAt(full.url.lastIndexOf('/'),'/desktop'));  
               }
             
               image.width = screenWidth;
               image.height = newHeight;
               image.classList.add('full','fscreen');
               image.addEventListener('click',this._fullScreen.bind(this));
               document.getElementById('editor-article1').appendChild(image);
            	
            },
            
            _mediumArticle : function(medium){
               const screenWidth = document.documentElement.clientWidth;
               
               if(medium.width < screenWidth){
                  var image = new Image();
                       if(this._isMobile()){
                      image.src = this._returnUrl(medium.url.replaceAt(medium.url.lastIndexOf('/'),'/mobile'));
               }else{
                    image.src = this._returnUrl(medium.url.replaceAt(medium.url.lastIndexOf('/'),'/desktop'));  
               }
             
                  image.width = medium.width;
                  image.height = medium.width;
                  image.classList.add('medium','fscreen');
                   image.addEventListener('click',this._fullScreen.bind(this));
                  document.getElementById('editor-article1').appendChild(image);               
               }else 
                    this._fullArticle(medium);
            },
            
            _fitArticle : function(fit){
            	 let fitSize;
                if(this._isMobile()){
                    fitSize = this.config.mWidth-15;
                }else{
                    fitSize = this.config.mainWidth;                              
                }       
                
                let image = new Image();
                     if(this._isMobile()){
                      image.src = this._returnUrl(fit.url.replaceAt(fit.url.lastIndexOf('/'),'/mobile'));
               }else{
                    image.src = this._returnUrl(fit.url.replaceAt(fit.url.lastIndexOf('/'),'/desktop'));  
               }
             
                
                let width = fit.width;
                let height = fit.height;
                   
                const newHeight = parseInt((height/width) * fitSize);
                   
                image.width = fitSize;
                image.height = newHeight;
                image.classList.add('fit','fscreen');
                image.addEventListener('click',this._fullScreen.bind(this));
                document.getElementById('editor-article1').appendChild(image);      
            },
            
            _textArticle : function (text) {
            	 let width ;
            	  let container = document.createElement('div');
            	 if(this._isMobile()){
            	    width = this.config.mWidth-15;  
            	   
            	 }else{
            	    width = this.config.mainWidth;
            	 }         	 
            	
            	 container.innerHTML = text.html;
            	 container.classList.add('text','desktop');
            	 
            	 container.style.width = width + 'px';
                document.getElementById('editor-article1').appendChild(container);  
            },
            
            _captionArticle : function(caption){
                let width ;
            	 if(this._isMobile()){
            	    width = this.config.mWidth -15;  
            	 }else{
            	    width = this.config.mainWidth;
            	 }
            	
            	 
            	 let container = document.createElement('div');
            	 container.innerHTML = caption.html;
            	 container.classList.add('text','desktop');
            	 container.style.width = width + 'px';
                document.getElementById('editor-article1').appendChild(container);  
            },
            
            
           _styleElements : function(){
           	  var that = this;
              var main = document.getElementById('indexContainer');
              var header = document.getElementById('iheader');          
              var contentArticle = document.getElementById('contentArticle')               
              if(this._isMobile()){
                    
              }else{ 
            
              }               
              
            this._createMenuEditor();                        
           },
           
           _returnMenuContent : function(type){
             let html = '',
        		template = '<span class="xbt-edit"><code class="btn-xs %btnClass%" title="%desc%" onmousedown="event.preventDefault();" onclick="doCommand(\'%cmd%\')"><i class="%iconClass%"></i> %cmd%</code></span>';
   	      commands.forEach(function(command) {
   	        if(command.type != type) return;
		        commandRelation[command.cmd] = command;
		        let temp = template;
		        temp = temp.replace(/%iconClass%/gi, icon(command));
		        temp = temp.replace(/%desc%/gi, command.desc);
		        temp = temp.replace(/%btnClass%/gi, supported(command));
		        temp = temp.replace(/%cmd%/gi, command.cmd);
	     	     html+=temp;
	        });    
           
           return html;
           },
           
           _createMenuEditor : function () {
           	  let that = this;
           	  let header = document.getElementById('iheader');
           	  const menu = ['basic','insert','style','color','font','justify','strike','action'];
           	  let iheader = document.createElement('div');
           	  iheader.id = 'i-header';
           	  let move = document.createElement('img');
           	  move.src = this._returnUrl("/public/arrow/move.png");
           	  move.classList.add('i-menu-move');
           	  move.addEventListener('mousedown',iMouseDown,false);
           	   window.addEventListener('mouseup', iMouseUp, false);
           	  iheader.appendChild(move);
           	   let resize = document.createElement('span');
           	  resize.classList.add('i-menu-min');
           	  iheader.appendChild(resize);
           	  let downPng = document.createElement('img')
           	  downPng.src = this._returnUrl('/public/arrow/iup.png');
           	  downPng.classList.add('i-menu-down');
           	  downPng.addEventListener('click',function(){
                   $('.i-editItem').animate({top:"+=200"},300,function(){
                 document.getElementsByClassName('i-menu-down')[0].style.display = 'none';                     
               });          	  
           	  })
           	  iheader.appendChild(downPng);          	 
           	  
           	  iheader.classList.add('i-menu');
           	  header.appendChild(iheader);
           	  
           	  let menuContainer = document.createElement('div');
           	  menuContainer.classList.add('i-menu-container');
           	  
           	  let editItem = document.createElement('div');
           	  editItem.classList.add('i-editItem');
           	  let subItem = document.createElement('div');
           	  subItem.classList.add('i-subItem');
           	  
           	  menuContainer.appendChild(editItem);
           	  menuContainer.appendChild(subItem)
           	  
           	  menu.forEach(function(item){
                let menuItem = document.createElement('div');
                menuItem.classList.add('i-menu','i-menu-elems')
                let span = document.createElement('span');
                span.classList.add('i-menu-middle');
                span.innerHTML = item;
                if(item == 'action') span.style.color = 'red';
                menuItem.appendChild(span);
                span.addEventListener('click',function(e){
                   that._iMenu(this.innerHTML);             
                })             
                editItem.appendChild(menuItem);
                              
           	  })
              
              header.appendChild(menuContainer);  
           	  
           },
           
           _iMenu : function(act){
              let that = this;           	 
              let html =  this._returnMenuContent(act); 
              document.getElementsByClassName('i-subItem')[0].innerHTML = html;       	  
           	  
              $('.i-editItem').animate({top:"-=200"},300,function(){
                 document.getElementsByClassName('i-menu-down')[0].style.display = 'block';                     
              });
              
               if(act == "action")
           	    this.config.btns.forEach(function(item){
              that._createButton.call(that,item);           
             })
           },
           
           _createButton : function (btn) {
           	  let that = this;  	  
           	  let span = document.createElement('span');
           	  
           	  span.classList.add('xbt-edit');
           	  span.id = 'ei-' + btn;
           	  let code = "<code class='btn-xs'>" + btn + "</code>";
           	  span.innerHTML = code; 
           	  if(this.config.redbtn.includes(btn) && !this.greenbtns.includes(btn))
           	    span.classList.add('e-redbtn');
           	  else if(this.config.redbtn.includes(btn) && this.greenbtns.includes(btn))
           	    span.classList.add('e-greenbtn');
           	  document.getElementById('iheader').appendChild(span);
           	  document.getElementsByClassName('i-subItem')[0].appendChild(span)
           	  span.addEventListener('click',function(){
                  that[btn].notify('');          	  
           	  })         	  
           },
           _addHeader : function(){
              let tag = 'h3';
              var sel, range;
              let that = this;
              if (window.getSelection) {
                 sel = window.getSelection();
        
                 if (sel.rangeCount) {
                   range = sel.getRangeAt(0);
                   selectedText = range.toString();
                   if(selectedText == '') return;
                   range.deleteContents();
                   let span = document.createElement('h3')
                   span.innerHTML = selectedText;
                   span.classList.add('ei-header');
                   //span.classList.add('description')
                   range.insertNode(span);
                   let header = document.getElementById('ei-header');
                   if(header.classList.contains('e-redbtn')){
                      header.classList.remove('e-redbtn');
                      header.classList.add('e-greenbtn');
                      that.greenbtns.push('header');                   
                   }
                    
                 }
              }
              else if (document.selection && document.selection.createRange) {
                range = document.selection.createRange();
                selectedText = document.selection.createRange().text + "";
                if(selectedText == '') return;
                range.text = '[' + tag + "class='ei-header'"+ ']' + selectedText + '[/' + tag + ']';
                   let header = document.getElementById('e-header');
                   if(header.classList.contains('e-redbtn')){
                      header.classList.remove('e-redbtn');
                      header.classList.add('e-greenbtn');
                      that.greenbtns.push('header');                   
                   }
              }
           },
           
           _addDescription : function(e){ 
              let tag = 'span';
              var sel, range;
              let that= this;
    
              if (window.getSelection) {
                 sel = window.getSelection();
        
                 if (sel.rangeCount) {
                   range = sel.getRangeAt(0);
                   selectedText = range.toString();
                   if(selectedText == '') return;
                   range.deleteContents();
                   let span = document.createElement('span')
                   span.innerHTML = selectedText;
                   span.classList.add('description')
                   range.insertNode(span);
                   let header = document.getElementById('ei-description');
                   if(header.classList.contains('e-redbtn')){
                      header.classList.remove('e-redbtn');
                      header.classList.add('e-greenbtn');
                      that.greenbtns.push('description')                   
                   }
                 }
              }
              else if (document.selection && document.selection.createRange) {
                range = document.selection.createRange();
                selectedText = document.selection.createRange().text + "";
                if(selectedText == '') return;
                range.text = '[' + tag + ']' + selectedText + '[/' + tag + ']';
                   let header = document.getElementById('ei-description');
                   if(header.classList.contains('e-redbtn')){
                      header.classList.remove('e-redbtn');
                      header.classList.add('e-greenbtn');
                      that.greenbtns.push('description')                   
                   }
              }
           },
           
           _reorder : function(){ 
               let container = document.getElementById('contentArticle');
               let elems = container.children;
               document.getElementById('iheader').style.display = 'none';
               let editable = document.getElementsByClassName('ndrag');
               for(let ed of editable)
                 ed.removeAttribute('contenteditable');
               
               for(let elem of elems ){ 
                  if(elem.classList.contains('fit') || elem.classList.contains('full') || elem.classList.contains('medium')){
                      let style = window.getComputedStyle(elem,null);
                      let height = parseInt(style.getPropertyValue('height'),10);
                      let width = parseInt(style.getPropertyValue('width'),10);
                                           
                      elem['w'] = width ;
                      elem['h'] = height;
                      
                      let newHeight = (height/width) * 100;
                      
                      elem.style.width = 100 + 'px';
                      elem.style.height = newHeight + 'px';
                      //elem.style.marginTop = 20 + 'px';
                      let child = elem.children;
                      child[0].style.width = 100 + 'px';
                      child[0].style.height = newHeight + 'px';
                      elem.classList.add('reorder-move');
                                        
                  }else if(elem.classList.contains('caption')){
                     let style = window.getComputedStyle(elem,null);
                     // let height = style.getPropertyValue('height');
                      let width = parseInt(style.getPropertyValue('width'),10);
                      elem['mg'] = parseInt(style.getPropertyValue('marginTop'),10);
                      elem['w'] = width;
                      elem.style.fontSize = 10 + 'px';
                      elem.style.width = 100 + 'px';
                      elem.style.height = 20 + 'px';
                      elem.style.overflow = 'hidden';
                      elem.style.fontSize = 10 + 'px';
                      //elem.style.marginTop = 10 + 'px';
                      elem.classList.add('reorder-move');
                  }else if(elem.classList.contains('pureEditable')){
                     let style = window.getComputedStyle(elem,null);
                     let height = parseInt(style.getPropertyValue('height'),10);
                     let width = parseInt(style.getPropertyValue('width'),10);
                     elem['h'] = height;
                     elem['w'] = width;
                     
                     elem.style.fontSize= 10 + 'px';
                     elem.style.width =  100 + 'px';
                     elem.style.minHeight =  0;
                     elem.style.height = 40 + 'px';
                     //elem.style.marginTop = 20 + 'px';
                     elem.style.overflow = 'hidden';
                     elem.style.fontSize = 10 + 'px';
                     elem.classList.add('reorder-move');
                   }               
               } 
               
               this._createSvgCircle();
         
           },
           
                
           _reorderIt : function(){
                let container = document.getElementById('contentArticle');
               let elems = container.children;
               document.getElementById('iheader').style.display = 'block';
               let editable = document.getElementsByClassName('ndrag');
               for(let ed of editable)
                 ed.setAttribute('contenteditable','true');
                 
                 
                for(let elem of elems ){ 
                  if(elem.classList.contains('fit')){                                      
              
                      elem.style.width = elem['w'] + 'px';
                      elem.style.height = elem['h'] + 'px';
                    // elem.style.marginTop = 20 + 'px';
                      let child = elem.children;
                      child[0].style.width = elem['w'] + 'px';
                      child[0].style.height = elem['h'] + 'px';
                      elem.classList.remove('reorder-move');
                                        
                  }else if(elem.classList.contains('caption')){   
                      elem.style.fontSize= '';
                      elem.style.width = elem['w'] + 'px';
                      elem.style.height = 'auto';                     
                      elem.classList.remove('reorder-move');
                  }else if(elem.classList.contains('pureEditable')){                      
                      elem.style.width = elem['w'] + 'px';
                      elem.style.height = elem['h'] + 'px';
                      elem.style.fontSize = '';
                     elem.style.marginTop = elem['mg'] + 'px';
                     elem.style.overflow = 'none';
                   
                     elem.classList.remove('reorder-move');                      
                  }               
               } 
               
           },
           
           
           _createSvgCircle : function(){
              let svg =   "<svg id='deleter' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'><circle cx='50' cy='50' r='50'/></svg>";
              let that = this;
              let div = document.createElement('div');
              div.innerHTML = svg;
              div.classList.add('edit-deleter');
              div.style.top = (window.innerHeight/2 -50) +'px';
              div.style.height = 100 + 'px';
              div.style.width = 100 + 'px';
              div.style.left = (window.innerWidth/2 - 200) + 'px';
              div.classList.add('edit-deleter');
              
              document.getElementById("contentArticle").appendChild(div); 
              
              document.getElementById('deleter').addEventListener('mouseover',function(){
                 this.style.fill = 'red';           
              })
              
              document.getElementById('deleter').addEventListener('mouseleave',function(){
                  this.style.fill = 'black';              
              })        
              
              document.getElementById('deleter').addEventListener('click',function(){
              	   div.remove();
              	 
                  that._reorderIt();            
              })
     
           },      
           
           _isMobile : function(){
              return this.config.documentWidth > this.config.mainWidth ? 0 : 1;      
           },
           
           _insertImage : function(){
           	   var that = this;
           	   if(this.dialogs == 1) {
           	     this._showDialogBox();		
           	     return;
           	   } 
           	   this.dialogs = 1;
           	    
               var dialog = document.getElementById('dialogBox');
               dialog.style.display = 'block';
              
               var indexContainer = document.getElementById('indexContainer');          
               
               var fileselect = document.getElementById('selectfile');
               fileselect.addEventListener('change',that._readFile.bind(this),false)
              
               if(this._isMobile()){               
                  dialog.style.width = this.config.dialog.m.width + 'px';
                  dialog.style.height = this.config.dialog.m.height + 'px';
                  
                  var dialogs = document.getElementsByClassName('dialog');
                  for(var i = 0 ; i < dialogs.length ; i++){
                      dialogs[i].style.width = 100 + 'px';
                      dialogs[i].style.height = 200 + 'px';
                      dialogs[i].style.left = i*20 + 'px';
                      dialogs[i].setAttribute('index',i); 
                      dialogs[i].addEventListener('click',function(e){
                      	  var index = e.target.getAttribute('index');
                      	  that.index = index;                      	  
                          that._handleAddPicture(index);                      
                      })        
                  }       
                          
               }else{ 
                  dialog.style.width = this.config.dialog.d.width + 'px';
                  dialog.style.height = this.config.dialog.d.height + 'px';
                  
                  var dialogs = document.getElementsByClassName('dialog');
                  for(var i = 0 ; i < dialogs.length ; i++){
                      dialogs[i].style.width = 150 + 'px';
                      dialogs[i].style.height = 300 + 'px';
                      dialogs[i].style.left = i*50 + 'px';
                      dialogs[i].setAttribute('index',i); 
                      dialogs[i].addEventListener('click',function(e){
                      	  var index = e.target.getAttribute('index');
                      	  that.index = index;                      	  
                          that._handleAddPicture(index);                      
                      })        
                  }
                            
               }               
               
               this._showDialogBox()                                 
           },
           
           _showDialogBox : function(){           
               var dialog = document.getElementById('dialogBox');
               dialog.style.display = 'block';
              
               var indexContainer = document.getElementById('indexContainer');
               indexContainer.style.opacity = 0.2;
               
               dialog.style.top = ((window.innerHeight/2) - (dialog.offsetHeight/2))+'px';
               dialog.style.left = ((window.innerWidth/2) - (dialog.offsetWidth/2))+'px';      
           },
           
           _handleAddPicture : function(e){  
              $('#selectfile').trigger('click');
           },
           
           _readFile : function(e){
             var elem = e.target;
             var file = elem.files[0];
             
             var that = this;
             var reader = new FileReader();
             reader.addEventListener('load',function(e){
             	 that.files.push({name : file.name,file : file,size: file.size });
             	 var prop = {name : file.name,type : file.type , size : file.size};
             	 
                var image = new Image();
                image.src = reader.result;    
                image.addEventListener('load',function () { 
                	  switch(parseInt(that.index)){
                         case 0 : 
                           that._writeableImage(image,prop)
                           break;
                         case 1 :
                           that._mediumImage(image,prop);                           
                           break;
                          case 2 : 
                          that._fitImage(image,prop);
                            break;
                          default:
                            break;                 	  
                	  }
                    
                })           
             })
             
             reader.readAsDataURL(file);
            
           },
           
           
           _fitImage : function(im,prop){
           	  document.getElementById('dialogBox').style.display = 'none';
           	  document.getElementById('indexContainer').style.opacity = 1;
           	  let div = document.createElement('div');
           	  div.dragable = true;
           	  let that = this;
           	  let height = im.naturalHeight;
              let width = im.naturalWidth;
           	  //im.classList.add('fit');
           	  let mainWidth ;
           	  
           	  if(this._isMobile()){
           	     mainWidth = this.config.mWidth -10;
           	  }else{
           	    mainWidth = this.config.mainWidth;
           	  }
                             
                let newImageHeight = parseInt(height/width * mainWidth);
                im.width = mainWidth;
                im.height = newImageHeight;
              
                
                div.style.width = mainWidth + 'px';
                div.style.height = newImageHeight + 'px';
                div['name'] = prop.name;
                
                div.classList.add('fit')
                div.append(im)           
                div.addEventListener('dragend',function(e){
               
                })
            
                  	      
              document.getElementById('contentArticle').appendChild(div);          
              div.focus()         	
           	  
           	  this.content.push({width : width,height : height,type:'fit',name : prop.name,size : prop.size});            
                                
           },          
           
           _mediumImage : function(im,prop){
           	  document.getElementById('dialogBox').style.display = 'none';
           	  document.getElementById('indexContainer').style.opacity = 1;
           	  const mainWidth =  this.config.mainWidth;
           	  const documentWidth = document.documentElement.clientWidth;
           	  let div = document.createElement('div');
           	  let height = im.naturalHeight;
           	  let width = im.naturalWidth;
           	  //im.classList.add('medium');
           	  div['name'] = prop.name;
           	  div.dragable = true;
           	  let that = this;
           	 
           	  div.classList.add('medium')
           	  if(width > documentWidth){
                  let newImageHeight = parseInt(height/width * documentWidth);
                  im.height = newImageHeight;
                  div.style.height = newImageHeight + 'px';
                  div.style.width = documentWidth + 'px';
                  im.width = documentWidth;
                  div.appendChild(im)
                  document.getElementById('contentArticle').appendChild(div);      	  
           	  }else{
           	  	   div.style.width = width + 'px';
           	  	   div.style.height = height + 'px';
           	  	   
           	  	   div.append(im)          	       
   
           	      document.getElementById('contentArticle').appendChild(div);
           	      div.focus();
           	  }
           	  
           	  this.content.push({width : width,height:height, type : 'medium' ,name : prop.name,size:prop.size });            
           },
           
           _writeableImage : function(im,prop){ 
              document.getElementById('dialogBox').style.display = 'none';
              document.getElementById('indexContainer').style.opacity = 1;
              const documentWidth = document.documentElement.clientWidth;               
              
              let height = im.naturalHeight;
              let width = im.naturalWidth;
              let that = this;
              const newImageHeight = parseInt((height/width) * documentWidth);
              
              var container = document.createElement('div');
              var editable = document.createElement('div');
              editable.setAttribute('contenteditable','true');
              editable.classList.add('editable');                
              container['name'] = prop.name;
              container.dragable = true;
  
              im.width = documentWidth;
              im.height = newImageHeight;
              
              container.style.width = documentWidth + 'px';
              container.style.height = newImageHeight + 'px';
              
              editable.style.width = documentWidth + 'px';
              editable.style.height = newImageHeight + 'px';        
             
              container.appendChild(editable);
              container.appendChild(im);     
              container.style.overflow = 'hidden';            
              container.classList.add('full')
              
              document.getElementById('contentArticle').appendChild(container);
              container.focus();
              
              this.content.push({width : width,height : height,type:'full',name : prop.name , size: prop.size})            
           
           },   
           
           _caption : function(sender){           
                var that = this;           	    
           	    var contentArticle = document.getElementById('contentArticle');
                var nextEditable = document.createElement('div');               
                
                if(sender._isMobile()){
                   nextEditable.style.width = (sender.config.mWidth -10) + 'px';
                   nextEditable.style.minHeight = 20 + 'px';                 
                }else{
                   nextEditable.style.width = sender.config.mainWidth + 'px';
                   nextEditable.style.minHeight = 20 + 'px'; 
                }
               
                nextEditable.setAttribute('contenteditable','true');
          
                nextEditable.style.borderLeft = "1px solid lightblue";
                nextEditable.style.padding = 2 + 'px';         
                nextEditable.classList.add('caption','ndrag');
                
                contentArticle.appendChild(nextEditable);         
                nextEditable.focus();                 
           },
           
           _insertEditable : function(sender){
                var that = this;           	    
           	    var contentArticle = document.getElementById('contentArticle');
                var nextEditable = document.createElement('div');
                
                if(sender._isMobile()){
                  nextEditable.style.width = (sender.config.mWidth -10) + 'px';
                  nextEditable.style.minHeight = 100 + 'px';
                    nextEditable.style.marginTop = '5px';  
                }else{
                  nextEditable.style.width = sender.config.mainWidth + 'px';
                  nextEditable.style.minHeight = 150 + 'px';      
                    nextEditable.style.marginTop = '10px';            
                }

                nextEditable.setAttribute('contenteditable','true');
                
                nextEditable.style.borderLeft = "1px solid lightblue";
                nextEditable.style.padding = 2 + 'px';   
                  
                nextEditable.classList.add('pureEditable','ndrag');        
                             
                contentArticle.appendChild(nextEditable); 
               
                nextEditable.focus();
            },   
            
            _addLocation : function(){        
               let that = this;
               let contentArticle =  document.getElementById('contentArticle');
               let iheader =  document.getElementById('iheader');
               let  dialog=  document.createElement('div');
               dialog.innerHTML = lck;
               
               document.body.appendChild(dialog);
               
               if(contentArticle.hasOwnProperty('hidden')){              
                 contentArticle.style.display = 'none';
                 iheader.style.display = 'none';     
                 dialog.style.display = 'block';                     
               }       	       
                
                             
               contentArticle.style.display = 'none';
               iheader.style.display = 'none'; 
               dialog.style.display = 'block';
               
               dialog.style.width = window.innerWidth + 'px';
               dialog.style.height = window.innerHeight + 'px';   
                        
               let dialogContainer = document.getElementById('e-dialog-container');
               let header = document.getElementById('e-dialog-header');
               let btn = document.getElementById('e-dialog-headerbtn');
               let mymap = document.getElementById('mapSelect');
               let back = document.getElementById('e-dialog-back');
               back.src = this._returnUrl('/public/arrow/close.png') ;
               let location = document.createElement('div');
               let marker;
               
               
               back.style.width = 15 + 'px';
               back.style.height = 15 + 'px';
               back.style.position= 'relative';
               back.style.top = 10 + 'px';
               back.style.cursor = 'pointer';
               back.style.float = 'left';
               if(this._isMobile()){
                 dialogContainer.style.width = this.config.mWidth + 'px';
                 header.style.height = 30 + 'px';
                 mymap.style.width = this.config.mWidth + 'px';
                 mymap.style.height = (window.innerHeight -60) + 'px';
                 mymap.style.position = 'relative';
                 mymap.style.top = 20 + 'px';
                 mymap.style.backgroundColor = 'lightblue'
                 btn.classList.add('de-dialog-headerbtn');
                 //back.classList.add('e-dialog-back')  
                 location.classList.add('e-dialog-location')
                 location.style.left = ((this.config.mWidth)/2 -100) + 'px';                  
               }else{
                 dialogContainer.style.width = this.config.mainWidth + 'px';
                 header.style.height = 30 + 'px';
                 mymap.style.width = this.config.mainWidth + 'px';
                 mymap.style.height = (window.innerHeight -60) + 'px';
                 mymap.style.position = 'relative';
                 mymap.style.top = 20 + 'px';
                 mymap.style.backgroundColor = 'lightblue'
                 btn.classList.add('de-dialog-headerbtn');
                 //back.classList.add('e-dialog-back')  
                 location.classList.add('e-dialog-location')
                 location.style.left = ((this.config.mainWidth)/2 -100) + 'px';                            
               } 
               
              // header.appendChild(back) 
               header.appendChild(location)
               
                 let map=L.map('mapSelect').setView([51.505, -0.09], 13);
                 L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery ?? <a href="https://www.mapbox.com/">Mapbox</a>',
                    maxZoom: 18,
                    id: 'mapbox.streets',
                    accessToken: 'pk.eyJ1IjoiMWlvMWwiLCJhIjoiY2psNThyd3luMGVsMjN4bnR3bXc4MXV2cyJ9.ks2qVsrV6d1rXu54-CyqIw'
                   }).addTo(map);   
                   
                
                 map.on('click',function(e){
                   location.innerHTML = e.latlng.toString()
                   location.position = e.latlng;
                   if(marker){ 
                     map.removeLayer(marker);
                      marker = new L.Marker(e.latlng);
                       marker.addTo(map)
                   }else{ 
                   	  marker = new L.Marker(e.latlng);
                       marker.addTo(map)
                   } 
                  
                 }) 
                 

       
                 
                 back.addEventListener('click',function(){
                 	  dialog.style.display = 'none';  
                    contentArticle.style.display = 'block';
                    iheader.style.display = 'block';    
                    dialog.remove();                    
                 })     
                 
                 btn.addEventListener('click',function(){
                    if(location.hasOwnProperty('position')){
                       that.content.push({type : 'location', location : location.position})
                       that.content.push({getloc :  [location.position.lng,location.position.lat]})                                      
                    }
                    
                    
                   let locationButton = document.getElementById('ei-location');
                   if(locationButton.classList.contains('e-redbtn')){
                      locationButton.classList.remove('e-redbtn');
                      locationButton.classList.add('e-greenbtn');     
                      that.greenbtns.push('location');              
                   }                        
                    
                 	  dialog.remove();  
                    contentArticle.style.display = 'block';
                    iheader.style.display = 'block';         
                                     
                 })    
               
            },
           _addTags : function () {
           	   let that = this;
               let contentArticle =  document.getElementById('contentArticle');
               let iheader =  document.getElementById('iheader');
               let  tags=  document.createElement('div');
               tags.innerHTML = tgs;
               
               document.body.appendChild(tags)
               if(contentArticle.hasOwnProperty('hidden')){              
                 contentArticle.style.display = 'none';
                 iheader.style.display = 'none';     
                 tags.style.display = 'block';                        
               }       	                      
                             
               contentArticle.style.display = 'none';
               iheader.style.display = 'none'; 
               tags.style.display = 'block';
               
               tags.style.width = window.innerWidth + 'px';
               tags.style.height = window.innerHeight + 'px';   
                        
               let tagsContainer = document.getElementById('e-tags-container');
               let header = document.getElementById('e-tags-header');
               let btn = document.getElementById('e-tags-headerbtn');
               let mytags = document.getElementById('mytags');
               let back = document.getElementById('e-tags-back');
               back.src = this._returnUrl('/public/arrow/close.png') ;
               let location = document.createElement('div');
               let input = document.createElement('input');
               input.type = 'text';
               input.placeholder = 'tag'
               input.classList.add('e-tags-input')
               
               let hash = document.createElement('span');
               hash.innerHTML='#'
               hash.classList.add('e-tags-hash')
               location.appendChild(hash)
               location.appendChild(input)
               
               let current = document.getElementById('e-tags-current')
               let prev = document.getElementById('e-tags-prev')
               let prevhead = document.getElementById('e-tags-prevhead');
                              
               back.style.width = 15 + 'px';
               back.style.height = 15 + 'px';
               back.style.position= 'relative';
               back.style.top = 10 + 'px';
               back.style.cursor = 'pointer';
               back.style.float = 'left';               
               
               if(this._isMobile()){
                 tagsContainer.style.width = this.config.mWidth + 'px';
                 header.style.height = 30 + 'px';
                 mytags.style.width = this.config.mWidth + 'px';
                 mytags.style.height = (window.innerHeight -60) + 'px';
                 mytags.style.position = 'relative';
                 mytags.style.top = 20 + 'px';
             
                 btn.classList.add('de-tags-headerbtn');
               //  back.classList.add('e-tags-back');
                 location.classList.add('e-tags-location');
                 location.style.left = ((this.config.mWidth)/2 -100) + 'px';
                 
                 current.style.height = 50 + 'px';
                 current.style.width = this.config.mWidth + 'px';
                 
                 prev.style.height = (window.innerHeight - 110) + 'px';
                 prevhead.style.height = 30 + 'px'               
               }else{
                 tagsContainer.style.width = this.config.mainWidth + 'px';
                 header.style.height = 30 + 'px';
                 mytags.style.width = this.config.mainWidth + 'px';
                 mytags.style.height = (window.innerHeight -60) + 'px';
                 mytags.style.position = 'relative';
                 mytags.style.top = 20 + 'px';
             
                 btn.classList.add('de-tags-headerbtn');
                 //back.classList.add('e-tags-back');
                 location.classList.add('e-tags-location');
                 location.style.left = ((this.config.mainWidth)/2 -100) + 'px';
                 
                 current.style.height = 50 + 'px';
                 current.style.width = this.config.mainWidth + 'px';
                 
                 prev.style.height = (window.innerHeight - 110) + 'px';
                 prevhead.style.height = 30 + 'px'
                                             
               }         
         
               
               btn.addEventListener('click',function(){
               	 if(input.value =='') return;
                   let span = document.createElement('span');
                   span.innerHTML = input.value;
                   span.classList.add('e-tags-tagspan')
                   current.appendChild(span);               
               })
               
               back.addEventListener('click',function(){
                  let tgs = [];                
                
                  if(document.getElementsByClassName('e-tags-tagspan'))  {
                    for(let tag of document.getElementsByClassName('e-tags-tagspan')){
                        tgs.push(tag.innerHTML)                    
                    }
                    that.content.push({type : 'tag', tag : tgs});
                  }                  
                  
                  tags.remove(); 
                  let tagsBtn = document.getElementById('ei-tags');
                  
                  if(tgs.length !=0)
                    if(tagsBtn.classList.contains('e-redbtn')){
                      tagsBtn.classList.remove('e-redbtn');
                      tagsBtn.classList.add('e-greenbtn');       
                      that.greenbtns.push('tags');            
                    }
                  // document.getElementById('e-tags').style.display = 'none';      
                  contentArticle.style.display = 'block';
                  iheader.style.display = 'block';    
              
               })
              
               header.appendChild(location)              
           },
           
           _progress : function(progress){
           	  this.recieved += progress.percent;
              let canvas = document.getElementById('prgeditor');
              let x = Math.floor(canvas.width/2);
              let y = Math.floor(canvas.height/2);
              
              let context = canvas.getContext('2d');
              let prog = this.recieved/this.totalSize;
              const radius = 50 * Math.sqrt(prog);
              
              if(canvas.hasOwnProperty('progressing')){
                context.beginPath();
                context.arc(parseInt(x),parseInt(y),radius.toFixed(2),0,Math.PI*2,true);
                context.closePath();
                context.fillStyle = 'green';
                context.fill();
              }else {
              	 canvas['progressing'] = '1';
              	 context.beginPath();
              	 context.arc(parseInt(x),parseInt(y),50,0,Math.PI * 2,true);
              	 context.closePath();
              	 context.fillStyle = 'lightgray';
              	 context.fill();
              }
              
           },
           
           _dragEnd : function(e){ return;
              
               let elems =   document.getElementsByClassName('ndrag');               
               for (let i = 0 ; i < elems.length ; i++) {
              	 elems[i].setAttribute('contenteditable',true);
              }  
              
              document.removeEventListener('mousemove',this._mousemove)
           },
           
           _dragstart : function(evt){  return;
              evt.dataTransfer.setData('text', 'anything');
           	  let that = evt.target;
           	  
              that.style.opacity = 0.4;
              let elems =   document.getElementsByClassName('ndrag');
             
              document.addEventListener('mousemove',this._mousemove.bind(this));
              for (let i = 0 ; i < elems.length ; i++) {
              	 elems[i].removeAttribute('contenteditable');
              }                        
           },
           
           _mousemove : function(e){ return;
              if(position != null && e.pageY > position){
                window.scrollBy(0,(e.pageY - position))              
              }else if(position != null && e.pageY < position){
                 window.scrollBy(0,(e.pageY-position))              
              }else if(position == null) {
                 position = e.pageY ;             
              }         
           },
           
          _dragover : function (e) {
                 console.log(  e.clientY + ' ' + e.screenY )
               
               if( e.clientY > (window.innerHeight -150)){
                    stop = false;                   
                    scroll(1)                    	
              
                 }else if( e.clientY < 150){
                    stop = false;                   
                    scroll(1);                   
                   
                 }
          } ,
                      
           _closeDialog : function(){                  
               for(let i = 0; i < this.files.length ; i++)
                  this.files.pop();        
               document.getElementById('prgeditor').remove();                     
               var pad =document.getElementById('pad');
                 
               pad.innerHTML = '';
               pad.style.display = 'none';                
           },
           
           _hide : function(){
           	 if(this.currentContainer != null)
           	    this.currentContainer.style.display = 'none';                 
           },
           
           _dialog : function(){
               var dialog = document.getElementById('pad');
               dialog.style.display = 'block';
               dialog.style.width = document.body.clientWidth + 'px';
               dialog.style.height = document.body.clientWidth + 'px';
               
               dialog.style.backgroundColor = 'white';
               dialog.style.zIndex = 45666;
               dialog.style.opacity = 0.8;
               
               var canvas = document.createElement('canvas');
               canvas.id= 'prgeditor';
               
               if(this._isMobile()){
                  canvas.width = 100;
                  canvas.height = 100;
                  canvas.style.position = 'fixed';
                  canvas.style.top =  ((window.screen.height/2) - (50))+'px';
                  canvas.style.left = ((window.screen.width/2) - (50)) + 'px';   
                  var context = canvas.getContext('2d');
                  
                  dialog.appendChild(canvas);  
               }else{
                  canvas.width = 100;
                  canvas.height = 100;
                  canvas.style.position = 'fixed';
                  canvas.style.top =  ((window.screen.height/2) - (50))+'px';
                  canvas.style.left = ((window.screen.width/2) - (50)) + 'px';   
                  var context = canvas.getContext('2d');
                  
                  dialog.appendChild(canvas);                            
               }              
              
           }
          
      }
      
      
     /*   Router  */
     
     var Router = (function () {     
                    	     
     	     let that = this; 
           let validUrl = ['create','archive','show'];
           let events = {};
           
           for(let elem of validUrl)
             events[elem] = new Event(this);
          
     	    
     	     function router(username,url){ 
     	     
     	        let backOrNext = false;
     	        
     	        if(url[0] == '#'){
                 backOrNext = true;
                 url = url.substring(1,url.length);    	        
     	        }
     	     
     	        let splited = url.split('/');
     	        if(splited.length == 1  ){
     	            process(username,url,null,backOrNext)      	 
     	        }else if(splited.length == 2){
     	            process(username,splited[0],splited[1],backOrNext)
     	        }else if(splited.length ==3){
                  process(username,splited[1],splited[2],backOrNext)        	        
     	        }     
     	    
     	     }     	    
     	     
     	     function process (username,action,id,bn){ 
     	     	  
              let url ;     	
              if(bn){
                if(action == 'editor') action = 'archive';              
              }
     	        if(validUrl.indexOf(action) == -1) return; 
     	     	  events[action].notify({id : id,bn : bn,username:username});
     	     	  if(id){
                 url = action + '/' + id;     	     	  
     	     	  }else{
                 url = action;     	     	  
     	     	  }
     	     	   
     	     	  if(!bn) 
     	         window.history.pushState(null,null,'/' + username + '/editor/' + url);  
     	     } 
     	     
     	     return {
               route : router ,
               event : events 	     
     	     }
     })()
     
     /*  Collection */     
     var Collection = (function(){
       let models = [];
       
       function setModels(data){
       	models.length =0;
         models = data;
       }
       
       
       function getModel(id){
          return models.find(function (elem) {
          	  return elem._id == id;
          })
       }
       
       
       function getArchive(){
           return models;        
       }
       
       function getUser(){
           if(models.length != 0)
             return models[0].username;
           return '';       
       }
       
       return {
           setArchive : setModels,
           getModel : getModel,
           getArchive : getArchive ,
           getUser : getUser 
       }
     })()
     
     /*   Main Controller */
       
     var Controller = (function(){
      var uploaded = 0;    
     	View._init();      
     	
      socket.on("eduprog",function(data){         
          ++uploaded;
          for(let i = 0 ; i < View.content.length ; i++){
             if(View.content[i].name == data.name)
               { 
                   View.content[i].url = data.url;
                   if(uploaded == View.files.length)  
                    saveContent();                                 
               }          
          }    
      })
      
      socket.on('progresseditor',function(data){         
         View._progress(data);
      })          
      
      Router.event['create'].attach(function(sender,args){ 
         if(!View._isLoggedIn()) return;
      	 switch(state()){
             case 'create':
               break;
             case 'show':
               document.getElementById('editor-article').innerHTML = ''
               document.getElementById('editor-article').style.display = 'none';
               break;
             case 'archive':
               document.getElementById('editor-archive').innerHTML = '';
               document.getElementById('editor-archive').style.display = 'none';
               break;
             default:
               break;      	 
      	 }
      	 
          View._createEditor();     
          
          
      })
      
      Router.event['archive'].attach(function(sender,args){  
       setUsername(args.username);
       
            switch(state()){
             case 'create':
               document.getElementById('contentArticle').innerHTML = '';
               document.getElementById('iheader').innerHTML = '';
               document.getElementById('indexContainer').style.display = 'none';
               break;
             case 'show':
               document.getElementById('editor-article').innerHTML = ''
               document.getElementById('editor-article').style.display = 'none';
               break;
             case 'archive':
               document.getElementById('a-archive-container').innerHTML = '';
               //document.getElementById('editor-archive').style.display = 'none';
               break;
             default:
               break;      	 
      	} 
      	  
     
        if(Collection.getUser() !=args.username)
          getModels(args.username)
        else 
          View._archiveEditor(Collection.getArchive());       	                
      })
      
      Router.event['show'].attach(function(sender,args){ 
            setUsername(args.username);
               
      	  	 switch(state()){
             case 'create':
               document.getElementById('contentArticle').innerHTML = '';
               document.getElementById('iheader').innerHTML = '';
               document.getElementById('indexContainer').style.display = 'none';
               break;
             case 'show':
               document.getElementById('editor-article').innerHTML = ''
               //document.getElementById('editor-article').style.display = 'none';
               break;
             case 'archive':
              document.getElementById('a-archive-container').innerHTML = '';
               document.getElementById('editor-archive').style.display = 'none';
               break;
             default:
               break;      	 
      	 }
      	 
      	   if(!args.bn){
      	   	  if(Collection.getModel(args.id) === undefined){
      	   	   getModel(args.id)
      	   	  }
      	   	    
      	   	   else{ 
      	   	       View._showArticle(Collection.getModel(args.id)); 
      	   	   } 
      	        
      	       
      	   }else {
      	      if(Collection.getUser() != args.username){ 
      	             getModel(args.id)   
      	      }
      	   
      	       else{ 
      	         View._showArticle(Collection.getModel(args.id))  
      	       }              	   
      	   } 
      })    
     	  
     	  
     	function setUsername(username){         
           View.username = username;             	
     	}    
      
      View.insertImage.attach(function(sender,args){
         View._insertImage();        
      })
        
      View.save.attach(function (sender,args) {
        uploadFiles(sender)        	  
      })
        
      View.reorder.attach(function(sender,args){
          sender._reorder();        
      })
      
      function state() {
      	      	              	
      	let createStyle = window.getComputedStyle(document.getElementById('indexContainer'));
      	let archiveStyle = window.getComputedStyle(document.getElementById('editor-archive'));
      	let articleStyle = window.getComputedStyle(document.getElementById('editor-article'));
      	
      	if(createStyle.getPropertyValue('display') == 'block'){
            return 'create' ;        	
      	}else if(archiveStyle.getPropertyValue('display') == 'block'){
            return 'archive';      	
      	}else if(articleStyle.getPropertyValue('display') == 'block'){
            return 'show';      	
      	}else 
      	   return '';
      	
      }  
      
      
      function getModel(id){
      	app.createLayer();
         socket.emit('article',{id : id});
     
      }
      
      socket.on('article',function(data){  
         app.clearLayer();       
         View._showArticle(data.article);         
      })
        
      function getModels(username){
        app.createLayer();
        let xhr = new XMLHttpRequest();
        xhr.open('POST','/editor/articles');
        xhr.onreadystatechange = function(data){
           if(this.readyState == 4){
           	  app.clearLayer();
              let result = JSON.parse(xhr.responseText);
              Collection.setArchive(result);
              View._archiveEditor(result)             
           }
        }       
        xhr.setRequestHeader('username',username)
        xhr.send()  
      } 
       
      function saveContent(){
          let content = new XMLHttpRequest();
          
          let children = document.getElementById('contentArticle').children; 
          if(children.length > 0){
              for(let i = 0 ; i < children.length ; i++){
                  if(children[i].hasOwnProperty('name') ){                    
                     for(let t = 0 ; t < View.content.length ; t++)
                        if(View.content[t].name == children[i].name)
                           View.content[t].pos = i;            
                  }else if(children[i].classList.contains('caption')){                 	
                     View.content.push({pos : i,type : 'caption',html : children[i].innerHTML.trim()})                   
                  }else if(children[i].classList.contains('pureEditable')){  
                     View.content.push({pos: i,type : 'text',html : children[i].innerHTML.trim()})                  
                  }              
              }          
          }
          
          let header = document.getElementsByTagName('h3')[0];
          let description = document.getElementsByClassName('description')[0];
          if(description){
              View.content.push({type : 'description',html : description.innerHTML})    
          }else{
              alert('you have to insert description');
              return;
          }
          
          if(header){          	 
             View.content.push({type : 'header',html : header.innerHTML})
          }else {
          	alert('you have to insert header!')
          	return; 
          }
           
          
          content.open('POST','/editor/save');
          content.onreadystatechange = function(data){
               if(this.readyState == 4){              
                 let result = JSON.parse(content.responseText);    
                   View._closeDialog();
                   showArticle(result.ops[0]);                
               }              
          }
          
          content.setRequestHeader('Content-Type','application/json');
          content.send(JSON.stringify(View.content));      
        }        
        
        function showArticle(article){
           View._showArticle(article);                 
        }
        
        
          
      socket.on('a-continue', function (data){ 
            let reader = new FileReader(); 
             
		      View._progress({percent : data['percent']});
				var place = data['place'] * 524288; //The Next Blocks Starting Position
				var newFile; //The Variable that will hold the new Block of Data
			
			 let index =  View.files.findIndex(function(elem){
			   return elem.name == data['name']
			 }) 
			 
			 
			 reader.onload = function(e){ 
            socket.emit('a-upload',{'name' : data['name'], data : e.target.result})          
          }
			 
			 newFile = View.files[index].file.slice(place, place + Math.min(524288, (View.files[index].size-place)));
			 reader.readAsBinaryString(newFile);
	   });
     
      function uploadFiles(sender) {  
        for(let i = 0 ; i < sender.files.length ; i++){
              sender.totalSize += sender.files[i].size;
                                        
         }  
         sender._dialog();
         uploaded = 0;
     	  for(var i= 0 ; i < sender.files.length ; i++){    	  	
     	  	  socket.emit('a-start',{'name' :sender.files[i].name, 'size' : sender.files[i].size})     	  
     	  }     	  
     	
     }       
        
     })()
         
     return {
     	  hide : View._hide.bind(View),
        connect : connector  ,
        router : function(username,path){ 
           Router.route(username,path)        
        }
     }
      
  })() 
  
  
  
  
  /*            task 1 
  
  I set documentWidth in config but it set to 1566 or something when i check the same value of document.body.clientHeiht
  it gave me different number which is correct.
  my quastion is why in the first place set the config with wrong value?
  
  */
  
  /*             task 2
  
  I should fix all the possibility of size and orientation of pictures uploaded 
  
  */
