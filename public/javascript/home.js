var home = (function(){
      
     let View = {
       config : {
          mainWidth : 900,
          d : {containerWidth:window.innerWidth},
          m : {mainWidth : null},
          header : {height : 30,top : 10},
          events : ['getloc']       
       },
       onMap : true,       
       inited : false,       
       defineProp : function(obj,key,value){
         let setting = {
            value : value,
            writable : true,
            enumerable : true,
            configurable : true         
         }
         
         Object.defineProperty(obj,key,setting)
       },
       
       _start : function(){
       	 this._config();
          this._addEvent();
          this._init(); 
       },
       
       _config : function(){
          if(this._isMobile()){
              this.config.m.mainWidth = window.innerWidth - 5;         
          }else{
          
          }    
       },
       
       _addEvent : function(){ if(this.getloc != null) return;
              for (let i = 0 ; i < this.config.events.length ; i++) { 
       	 this.defineProp(this,this.config.events[i],new Event(this))
       } 
       },
       
       _init : function(){ alert(window.innerWidth)
       	
       	 this._setHome()
       	 
       	 this._setMain(); 
          this._setHeader();
          
          this._setMap(); 
          this.inited = true;    
       },
       
       _setHome : function () {
            let home = document.getElementById('home');
            if(this._isMobile()){
               header.style.width = this.config.m.mainWidth + 'px';            
            }else {
              home.style.width = this.config.mainWidth + 'px';
            }
          
            home.style.height = window.innerHeight + 'px';
            home.style.position = 'relative';   	
            home.style.marginLeft = 'auto';
            home.style.marginRight = 'auto';
       },
       
       _setHeader : function(){
       	 let that = this;
          let header = document.createElement('div');
          header.style.height = this.config.header.height + 'px';
          header.style.position = 'fixed';
          header.style.borderBottom = '1px solid gray'
          header.style.top = this.config.header.top + 'px';          
          header.style.backgroundColor = 'white';
          
          header.style.zIndex = 800;
          if(this._isMobile()){
             header.style.width = this.config.m.mainWidth + 'px';
          
          }else{
             header.style.width = this.config.mainWidth + 'px';
          }
          
          let hashContainer = document.createElement('div');
          hashContainer.style.position = 'relative';
          hashContainer.style.height = 30 + 'px';
          hashContainer.style.paddingTop = 8  + 'px';
          hashContainer.style.float = 'left';
         
         
          let hash = document.createElement('span');
          hash.innerHTML = '#';
          
          let hashInput = document.createElement('input');
          hashInput.type = 'text'
          hashInput.id = 'v-video-hinput';
     
          hashInput.placeholder = 'separate tags with comma'
                    
          hashContainer.appendChild(hash);
          hashContainer.appendChild(hashInput);
          
          let mapSign = new Image();
          mapSign.src = makeUrl('public/arrow/a.png');
          mapSign.style.float = 'right';
          mapSign.width = 15;
          mapSign.height = 15;
          mapSign.style.cursor = 'pointer';
          mapSign.style.marginTop = 12 + 'px';
          header.appendChild(mapSign);
          header.appendChild(hashContainer);
          
          mapSign.addEventListener('click',function(){
              //document.getElementById('h-main-map').style.display = 'none';
              
              if(that.onMap)
                $('#h-main-map').animate({opacity : 0},400,function(){
                   that._showItems()
                   that.onMap = false;
               });
              else 
                $('#h-view').animate({opacity : 0},400,function(){
                    this.remove();
                    document.getElementById('h-main-map').style.opacity = 1;           
                    that.onMap = true;     
                })
               
              
              
          })
          
          document.getElementById('h-main').appendChild(header);                 
       },
       
       _setMain : function(){
          let main = document.createElement('div');
          main.style.position = 'relative';
          main.style.marginLeft = 'auto';
          main.style.marginRight = 'auto';
          main.style.height = window.innerHeight + 'px';
          //main.style.backgroundColor = 'lightblue'
          main.id = 'h-main'
                    
          if(this._isMobile()){
             main.style.width = this.config.m.mainWidth + 'px';          
          }else{
             main.style.width = this.config.mainWidth + 'px';
          }         
          
          document.getElementById('home').appendChild(main)
       },
       
       _showItems : function(){
       	let that = this;
         let viewPort = document.createElement('div');
         let container = document.createElement('div');
         
         viewPort.style.height = (window.innerHeight - 70) + 'px';
         viewPort.style.position = 'absolute';
         viewPort.style.zIndex = 805;
         viewPort.id = 'h-view';
         
         container.style.height = 'auto';
         
         if(this._isMobile()){
           viewPort.style.width = this.config.m.mainWidth + 'px';
           viewPort.style.top = 50 + 'px';
           container.style.width = this.config.m.mainWidth  + 'px';
         }else{
           viewPort.style.width = this.config.mainWidth + 'px';
           viewPort.style.top = 50 + 'px';
         }
         
        
         viewPort.appendChild(container);
         document.getElementById('h-main').appendChild(viewPort);
                          	 
    	 const ps = new PerfectScrollbar(viewPort,{
          suppressScrollX:true	 
    	 });      
         
         
         container.style.display = 'flex'
         container.style.justifyContent = 'space-between';
         container.style.flexWrap = 'wrap';
         this.models.forEach(function(model){
            if(model.type =='article')
               container.appendChild(that._article(model,false))
            else if(model.type == 'gallery')
               container.appendChild(that._gallery(model,false))
            else
               container.appendChild(that._video(model,false));        
         })  
       },
       
       _setMap : function(){
       	let that = this;
       	 let mainContainer = document.createElement('div');
       	 var mapContainer = document.createElement('div');
       	 
       	 
       	 mainContainer.style.height = (window.innerHeight - 70) + 'px';
       	 mainContainer.style.position = 'relative';
          
           mapContainer.style.height = (window.innerHeight - 70 )+ 'px'
           mapContainer.style.position = 'absolute';
           mainContainer.style.zIndex = 802;
           mainContainer.style.overflow = 'hidden';
           
           
           if(this._isMobile()){
               mapContainer.style.width = this.config.m.mainWidth  + 'px';
               //mapContainer.style.top = 50 + 'px';
               mainContainer.style.width = this.config.m.mainWidth + 'px';
               mainContainer.style.top = 50 + 'px'
           }else {
           	  mapContainer.style.width = this.config.mainWidth + 'px';
           	  //mapContainer.style.top = 50 + 'px';
           	  mainContainer.style.width = this.config.mainWidth + 'px';
           	  mainContainer.style.top = 50 + 'px';
           }
           
           mainContainer.id = 'h-main-map'
          mapContainer.id = 'h-map';
          document.getElementById('h-main').appendChild(mainContainer);
          mainContainer.appendChild(mapContainer)
        	   let map=L.map('h-map',{zoomControl : false}).setView([34.811548, 46.493454], 7);
            L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
              attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
              maxZoom: 18,
              id: 'mapbox.streets',
                accessToken: 'pk.eyJ1IjoiMWlvMWwiLCJhIjoiY2psNThyd3luMGVsMjN4bnR3bXc4MXV2cyJ9.ks2qVsrV6d1rXu54-CyqIw'
            }).addTo(map);  
            
            new L.Control.Zoom({ position: 'bottomleft' }).addTo(map);
          
          map.on('moveend',function(){ 
              
              that.getloc.notify({bottom : map.getBounds().getSouthWest(), upper : map.getBounds().getNorthEast()});
              
          }) 
          
          that.map = map;
           
                 
       },
       
       _isMobile : function () { console.log(window.innerWidth )
       	 return window.innerWidth > this.config.mainWidth ? false : true;
       },
       
       _hide : function(){
           document.getElementById('home').style.display = 'none';
       },
       
       _show : function () {
       	 document.getElementById('home').style.display = 'block';
       },
       
       _popUp : function(where,model){
       	  if(View.iter && where == 'interval') return;
           if(document.getElementsByClassName('h-thumb').length != 0)
             document.getElementsByClassName('h-thumb')[0].remove();
           //let evt = event.originalEvent;
           let container;
           if(model.hasOwnProperty('type') && model.type == 'article')
             container =  this._article(model,true)
            else if(model.hasOwnProperty('type') && model.type == 'gallery')
              container = this._gallery(model,true)
             else
            container = this._video(model,true);
       
           container.style.position = 'absolute';
           container.style.paddingTop = 10 + 'px';
           container.style.width = 300 + 'px'; 
             
           container.style.top = 0;
           container.style.left = -300 + 'px';
           container.style.backgroundColor = 'white';
           container.style.zIndex = 801;
           container.classList.add('h-thumb')
           container.addEventListener('click',function(){
              $(this).animate({left : '-=' + 300},100)           
           })
           
           document.getElementById('h-main-map').appendChild(container);
           
           $(container).animate({left : '+=' + 300},300);
           
       },
       
       _video : function(model,isThumb){
          video = model;
          
          let monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      	 
      	 let date = new Date(video.date);
          let container = document.createElement('div');
          let timeContainer = document.createElement('div');          
          let topContainer = document.createElement('div');
          
         
          
          timeContainer.classList.add('v-archive-timeContainer');
                        
                 let yearContainer = document.createElement('div');
                 let monthContainer = document.createElement('div');
                 let dayContainer = document.createElement('div');
                 
                 yearContainer.innerHTML = date.getFullYear();
                 monthContainer.innerHTML = monthShortNames[date.getMonth()]
                 dayContainer.innerHTML = date.getDate()
                 
                 
                 yearContainer.classList.add('v-archive-yearC');
                 monthContainer.classList.add('v-archive-monthC');
                 dayContainer.classList.add('v-archive-dayC');
                 
                 timeContainer.appendChild(yearContainer);
                 timeContainer.appendChild(monthContainer);
                 timeContainer.appendChild(dayContainer)      
           
           let thumbContainer = document.createElement('div');
           let thumbPoster = document.createElement('img');
           thumbPoster.src = makeUrl( video.image);
           thumbContainer.id = 'v-archive-thumb';
           thumbPoster.id = 'v-archive-poster';
           thumbContainer.appendChild(thumbPoster);
           
           let videoContent = document.createElement('div');
           let videoTitle = document.createElement('div');
           let videoTags = document.createElement('div');
           

           
           videoTitle.innerHTML = video.title;   
           
           $(videoTitle).hover(function(){
               this.style.color = 'limegreen';           
           },function(){
               this.style.color = 'black'           
           })
           for(let tg of video.tags){
              let span = document.createElement('span');
              span.classList.add('v-archive-tagstg');          
              span.innerHTML = '#' + tg;  
              videoTags.appendChild(span);              
            }        
            
           let view = document.createElement('div');
           view.classList.add('v-archive-view');
           view.innerHTML = '1 Million View';
           
           let duration = document.createElement('div');
           duration.classList.add('v-archive-duration');
           duration.innerHTML = '00:45';
           let del = document.createElement('div');
           del.classList.add('v-archive-delete');
           //del.innerHTML = 'delete';
           
           
           del.addEventListener('click',function(){
              if(this.clicked){
                 this.style.color = 'tomato';  
                 this.clicked = false;            
              }   else{
              	 this.clicked = true;
                 this.style.color = 'red';              
              }          
           })
           
          // videoContent.appendChild(videoTitle);
           videoContent.appendChild(videoTags);           
           videoContent.appendChild(view);
           videoContent.appendChild(duration)
           videoContent.appendChild(del)
           
           
           topContainer.appendChild(timeContainer);
           topContainer.appendChild(thumbContainer);
           topContainer.appendChild(videoContent);
           
           container.appendChild(topContainer);
           container.appendChild(videoTitle);
           
           
        
           if(this._isMobile() || isThumb){
                timeContainer.style.width = 50 + 'px';
                timeContainer.style.height = 60 + 'px';
                
                thumbContainer.style.width = 120 + 'px';
                thumbContainer.style.height = 100 + 'px';
                
                thumbPoster.style.width = 120 + 'px';
                thumbPoster.style.height = 100 + 'px';       
                
                videoContent.style.width =  100 + 'px';
              //  videoContent.style.height = 100 + 'px';
                videoTitle.style.fontSize= 12 + 'px';     
                videoTitle.style.cursor = 'pointer';       
                
                videoTitle.style.color = '#00509d';
                videoTitle.style.padding = 4 + 'px';   
                videoTitle.style.paddingLeft = 50 + 'px'; 
                videoContent.style.marginLeft = 10 + 'px';
                videoTitle.style.fontWeight = 600;
               
                //container.style.width = 280 + 'px';
                container.style.height = 'auto';
                container.style.marginBottom = 15 + 'px'
                container.style.marginLeft = 'auto';
                container.style.marginRight = 'auto'
                topContainer.style.width = 280 + 'px';
                
                topContainer.style.height = 100 + 'px';
                //container.style.float = 'left';
                                
                //if(i == 1 || i == 3)
                  //container.style.marginLeft = 100+ 'px';            
           }else{
                timeContainer.style.width = 50 + 'px';
                timeContainer.style.height = 60 + 'px';
                
                thumbContainer.style.width = 150 + 'px';
                thumbContainer.style.height = 120 + 'px'
                
                thumbPoster.style.width = 150 + 'px';
                thumbPoster.style.height = 120 + 'px';       
                
                videoContent.style.width =  120 + 'px';
                videoContent.style.height = 'auto';
                videoTitle.style.fontSize= 14 + 'px';     
                videoTitle.style.cursor = 'pointer';    
               
                  
               
                videoTitle.style.color = '#00509d';
                videoTitle.style.transform = 'scaleX(1.02265)'
               // videoTitle.style.fontWeight = 600;
                //videoTitle.style.backgroundColor = 'lightblue'
                videoTitle.style.padding = 4 + 'px';    
                videoTitle.style.marginTop = 5 + 'px'
                videoContent.style.marginLeft = 10 + 'px';
                  videoTitle.style.paddingLeft = 60 + 'px'  
                container.style.width = 330 + 'px';
                container.style.height = 195 + 'px';
                //container.style.float = 'left';
                container.style.marginBottom = 20 + 'px'
                topContainer.style.width = 330 + 'px';
                topContainer.style.height = 120 + 'px';
                
                
             //   if(i % 2 == 1)
               //   container.style.marginLeft = 100+ 'px';               
                       
           }
           
           
           videoTitle.addEventListener('click',function(){ 
              app.router(model.username,'video/show/' + model._id );          
           })
       
           videoContent.classList.add('v-archive-content');
           videoTitle.classList.add('v-archive-title');
           videoTags.classList.add('v-archive-tags');
           
          // videoTitle.setAttribute('vid',i);
           /*videoTitle.addEventListener('click',function(){
              that._showVideo(videos[this.getAttribute('vid')]);
              that._slideContainer();             
           })*/
           
           return container;
       } ,
       
       
       _gallery : function(elem,isThumb){
         let video = elem;
          
          let monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      	 
      	 let date = new Date(video.date);
          let container = document.createElement('div');
          let timeContainer = document.createElement('div');          
          let topContainer = document.createElement('div');
          
         
          
          timeContainer.classList.add('v-archive-timeContainer');
                        
                 let yearContainer = document.createElement('div');
                 let monthContainer = document.createElement('div');
                 let dayContainer = document.createElement('div');
                 
                 yearContainer.innerHTML = date.getFullYear();
                 monthContainer.innerHTML = monthShortNames[date.getMonth()]
                 dayContainer.innerHTML = date.getDate()
                 
                 
                 yearContainer.classList.add('v-archive-yearC');
                 monthContainer.classList.add('v-archive-monthC');
                 dayContainer.classList.add('v-archive-dayC');
                 
                 timeContainer.appendChild(yearContainer);
                 timeContainer.appendChild(monthContainer);
                 timeContainer.appendChild(dayContainer)      
           
           let thumbContainer = document.createElement('div');
           let thumbPoster = document.createElement('img');
           thumbPoster.src = makeUrl("uploads/"+video.username +'/gallery/'+video.gallery+'/thumb/'+video.src);
           thumbContainer.id = 'v-archive-thumb';
           thumbPoster.id = 'v-archive-poster';
           thumbContainer.appendChild(thumbPoster);
           
           let videoContent = document.createElement('div');
           let videoTitle = document.createElement('div');
           let videoTags = document.createElement('div');

           
           videoTitle.innerHTML = ' ';
           videoTitle.style.textAlign = 'center';
           
           $(videoTitle).hover(function(){
               this.style.color = 'limegreen';           
           },function(){
               this.style.color = 'black'           
           })
           for(let tg of video.tag){
              let span = document.createElement('span');
              span.classList.add('v-archive-tagstg');          
              span.innerHTML = '#' + tg;  
              videoTags.appendChild(span);              
            }        
            
           let view = document.createElement('div');
           view.classList.add('v-archive-view');
           view.innerHTML = '1 Million View';
           
           let duration = document.createElement('div');
           duration.classList.add('v-archive-duration');
           duration.innerHTML = video.gallery;
           let del = document.createElement('div');
           del.classList.add('v-archive-delete');
           //del.innerHTML = 'delete';
           
           
           del.addEventListener('click',function(){
              if(this.clicked){
                 this.style.color = 'tomato';  
                 this.clicked = false;            
              }   else{
              	 this.clicked = true;
                 this.style.color = 'red';              
              }          
           })
           
          // videoContent.appendChild(videoTitle);
           videoContent.appendChild(videoTags);           
           videoContent.appendChild(view);
           videoContent.appendChild(duration)
           videoContent.appendChild(del)
           
           
           topContainer.appendChild(timeContainer);
           topContainer.appendChild(thumbContainer);
           topContainer.appendChild(videoContent);
           
           container.appendChild(topContainer);
          container.appendChild(videoTitle);    
           
        
           if(this._isMobile() || isThumb){
                timeContainer.style.width = 50 + 'px';
                timeContainer.style.height = 60 + 'px';
                
                thumbContainer.style.width = 120 + 'px';
                thumbContainer.style.height = 100 + 'px';
                
                
            
                if(video.width > video.height){
                   thumbPoster.style.width = 120 + 'px';
                   thumbPoster.style.height = (120/video.width) * video.height + 'px';       
                
                }else {
                	thumbPoster.style.width = (100/video.height) * video.width + 'px';
                	thumbPoster.style.height = 100 + 'px';
                }
                
                
                thumbPoster.style.marginLeft = 'auto';
                thumbPoster.style.marginRight = 'auto';
                thumbPoster.style.display = 'block';
                videoContent.style.width =  100 + 'px';
              //  videoContent.style.height = 100 + 'px';
                videoTitle.style.fontSize= 12 + 'px';     
                videoTitle.style.cursor = 'pointer';       
                
                videoTitle.style.color = '#00509d';
                videoTitle.style.padding = 4 + 'px';    
                videoContent.style.marginLeft = 10 + 'px';
                videoTitle.style.fontWeight = 600;
               
                //container.style.width = 280 + 'px';
                container.style.height = 'auto';
                container.style.marginBottom = 15 + 'px'
                container.style.marginLeft = 'auto';
                container.style.marginRight = 'auto'
                topContainer.style.width = 280 + 'px';
                
                topContainer.style.height = 100 + 'px';
                //container.style.float = 'left';
                                
                //if(i == 1 || i == 3)
                  //container.style.marginLeft = 100+ 'px';            
           }else{
                timeContainer.style.width = 50 + 'px';
                timeContainer.style.height = 60 + 'px';
                
                thumbContainer.style.width = 150 + 'px';
                thumbContainer.style.height = 120 + 'px'
                
                thumbPoster.style.width = 150 + 'px';
                thumbPoster.style.height = 120 + 'px';       
                
                
                
                
                if(video.width > video.height){
                   thumbPoster.style.width = 150 + 'px';
                   thumbPoster.style.height = (150/video.width) * video.height + 'px';       
                
                }else {
                	thumbPoster.style.width = (120/video.height) * video.width + 'px';
                	thumbPoster.style.height = 120 + 'px';
                }
                
                
                thumbPoster.style.marginLeft = 'auto';
                thumbPoster.style.marginRight = 'auto';
                thumbPoster.style.display = 'block';
                
                videoContent.style.width =  120 + 'px';
                videoContent.style.height = 'auto';
                videoTitle.style.fontSize= 14 + 'px';     
                videoTitle.style.cursor = 'pointer';       
                  
               
                videoTitle.style.color = '#00509d';
                videoTitle.style.transform = 'scaleX(1.02265)'
               // videoTitle.style.fontWeight = 600;
                //videoTitle.style.backgroundColor = 'lightblue'
                videoTitle.style.padding = 4 + 'px';    
                videoTitle.style.marginTop = 5 + 'px'
                videoContent.style.marginLeft = 10 + 'px';
               
                container.style.width = 330 + 'px';
                container.style.height = 195 + 'px';
                //container.style.float = 'left';
                container.style.marginBottom = 20 + 'px'
                topContainer.style.width = 330 + 'px';
                topContainer.style.height = 120 + 'px';
                
                
             //   if(i % 2 == 1)
               //   container.style.marginLeft = 100+ 'px';               
                       
           }
           
           thumbPoster.style.cursor  = 'pointer';
           thumbPoster.addEventListener('click',function(){ 
              app.router(video.username,'gallery/images/' + video.gallery );          
           })
       
           videoContent.classList.add('v-archive-content');
           videoTitle.classList.add('v-archive-title');
           videoTags.classList.add('v-archive-tags');
        
           
           return container;
               
       },
       
       _article : function(elem,isThumb){
            let monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
           
           	 
           	String.prototype.replaceAt=function(index, replacement) {
                return this.substr(0, index) + replacement+ this.substr(index ,this.length);
            }
           	 
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
              
              //if(!tags) continue;
              let dte = new Date(date);
              let archive = document.createElement('div');
              archive.classList.add('a-archive');
             // archiveContainer.append(archive);
              
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
            
                //document.getElementById('a-archive-container').innerHTML = '';
                //document.getElementById('editor-archive').style.display = 'none';  
                app.router(elem.username,'editor/show/' + elem._id);
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
             	 
              if(this._isMobile() || isThumb){
                archive.style.height = 110 + 'px';
                //archive.style.width = window.innerWidth + 'px';
               // archive.style.top = 15 + 'px';
                timeContainer.style.width = 45 + 'px';
                timeContainer.style.height = 60  + 'px';   
                
                articleContent.style.height = 100 + 'px';
                articleContent.style.width = 255 + 'px';
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
              
              return archive;	             	 
             	        
       },
       
            _returnUrl : function(url){
              return "http://"+ localhost + url
           }
     }     
     
       
       var Router = (function () {     
                    	     
     	     let that = this; 
           let validUrl = ['index'];
           let events = {};
           
           for(let elem of validUrl)
             events[elem] = new Event(this);
          
     	    
     	     function router(url){	
     	     	  //if(validUrl.indexOf(url) == -1) 
     	     	  events['index'].notify('')
     	        window.history.pushState(null,null,'/home');    
     	     }     	     
     	     
     	     return {
               route : router ,
               event : events 	     
     	     }
     })()
     
                   
       var Collection = (function(){
          let models ;
          function ModelCount() {
          	return models.length
          }
          
          function setModels(arr) {
          	models = arr;
          }
          return {
             total : ModelCount,
             setModels : setModels       
          }
       })()   
     
     let Controller = (function(){
           
          View._addEvent()          
           Router.event['index'].attach(function(sender,args){ 
              Index.hide()
              Video.hide();
              Gallery.hide();
              if(View.inited)
                View._show();
              else{
              	 View._start(); 
              	 View.getloc.notify({bottom : View.map.getBounds().getSouthWest(), upper : View.map.getBounds().getNorthEast()});
              }
                         
           })
           
           View.getloc.attach(function(sender,args){  
              socket.emit('getloc',JSON.stringify(args))   
           })
           
           
           let iter;
           socket.on('home',function(data){
           
           	let models = JSON.parse(data);
           	models.sort(function(a,b){
               return a - b;           	
           	})
           	View.models = models;
            
        	   View.iter = false;
        	   if(iter) window.clearInterval(iter);
           	for(let i = 0 ; i < models.length ; i++)
           	   {            	
           	      if(models[i].hasOwnProperty('username'))
                   new L.Marker(models[i].location).addTo(View.map).on('click',function(e){
                   	 View.iter = true;
                      View._popUp('click',models[i]);    
                   });                      	   
           	   }
           	   let it = 0;
           	    iter = window.setInterval(function () {
           	   	 if(View.iter) clearInterval(iter);
           	   	 if(it < models.length){
           	   	 	
                       if(models[it])
                         View._popUp('interval',models[it++]);  
                        else clearInterval(iter)         	   	 
           	   	 }
                            
           	   },3000)
                          
           })
           
           
           function getModels(){
                         
           }       
     })()
     
     
     return {
          router : function(path){
              Router.route(path); 
                       
          },
          
          hide : View._hide     
     }      
      
})()