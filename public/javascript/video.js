var Video = (function(){  
  var View = {
    
    config : {
       mainWidth : window.innerWidth,    
       d : {
           containerWidth : 900,
           headerHeight : 30       
       },
       m : {
          containerWidth : window.innerWidth  ,
          headerHeight : 30
       },
       
       events : ['upload']
    },    
    
    defineProp : function(obj,key,value){  
             var setting = {
               value : value,
               writable : true,
               enumerable : true,
               configurable : true      
              }             
               
             Object.defineProperty(obj,key,setting);
     }, 
     
     inited : false,
      
    _init : function(){
    	 this.inited = true;
       this._addEvents();
       this._configIt();
       this._setHeader();
       this._setMain(); 
       this._eventBinding();
    },
    
    _addEvents : function(){
       for (let i = 0 ; i < this.config.events.length ; i++) {
       	 this.defineProp(this,this.config.events[i],new Event(this))
       }    
    },
    
    _configIt : function(){
    	 let container = document.getElementById('videoContainer');
    	 let bodyContainer = document.getElementById('video-container');
    	 
    	 bodyContainer.classList.add('bodyContainer');
    	 container.style.width = this.config.mainWidth + 'px';
    	 container.style.display = 'block';
      
       
       if(this._isMobile()){
           bodyContainer.style.width = this.config.m.containerWidth + 'px';
       }else{          
           bodyContainer.style.width = this.config.d.containerWidth + 'px';
       }
       
    },
    
    _setHeader : function(){
       let vheader = document.getElementById('v-header');
       
       let btn = document.getElementById('v-header-btn');
       btn.classList.add('v-header-btn');
       if(this._isMobile()){
          vheader.style.height = this.config.m.headerHeight + 'px';
            btn.classList.add('mv-header-btn');
       }else{       	
       	 vheader.style.height = this.config.d.headerHeight + 'px';
          btn.classList.add('dv-header-btn');
          vheader.style.width = this.config.d.containerWidth + 'px';
          vheader.classList.add('dv-header');
       }    
       
       btn.addEventListener('click',this._createChannel.bind(this))
       
    },   
    
    _setMain : function () {
    	 let mainContainer = document.getElementById('v-video-container');   	 
    	 let videoContainer = document.createElement('div');
    	 videoContainer.id = 'v-video-archive';
    	 let videoUploader = document.createElement('div');
    	 
    	 let contentContainer = document.createElement('div');    	 
    	 contentContainer.id = 'v-content-container'
    	 
    	 videoContainer.classList.add('v-containers');
    	 videoUploader.classList.add('v-containers');
    	 videoUploader.id = 'v-uploader';
    	 if(this._isMobile()){
         mainContainer.style.width = this.config.m.containerWidth + 'px';
         videoContainer.style.width = this.config.m.containerWidth + 'px';
         videoUploader.style.width = this.config.m.containerWidth  + 'px';    	
         mainContainer.style.top = 20 + 'px';
         videoContainer.style.minHeight = (window.innerHeight -70) + 'px';
         videoUploader.style.minHeight = (window.innerHeight - 70) + 'px';         
         mainContainer.style.minHeight = (window.innerHeight - 70 ) + 'px';        
         contentContainer.style.width = 2*(this.config.m.containerWidth ) + 'px';    	 
    	 }else{
         mainContainer.style.width = this.config.d.containerWidth + 'px';
         videoContainer.style.width = this.config.d.containerWidth + 'px';
         videoUploader.style.width = this.config.d.containerWidth  + 'px';    	
         mainContainer.style.top = 20 + 'px';
         videoContainer.style.minHeight = (window.innerHeight -70) + 'px';
         videoUploader.style.minHeight = (window.innerHeight - 70) + 'px';         
         mainContainer.style.minHeight = (window.innerHeight - 70 ) + 'px';        
         contentContainer.style.width = 2*(this.config.d.containerWidth ) + 'px';
    	 }
    	 
    	 contentContainer.appendChild(videoContainer);
    	 contentContainer.appendChild(videoUploader);
    	 mainContainer.appendChild(contentContainer);
    },
    
    _eventBinding : function(){
       document.getElementById('v-selectfile').addEventListener('change',this._addVideoFiles.bind(this))    
       document.getElementById('v-header-upload').addEventListener('click',this._upload.bind(this));
    },
    
    _returnUrl : function(url){
      return "http://localhost:3000" + url
    },   
    
    _addVideoFiles : function(e){    	    
        this.file = e.target.files[0];
       
    	  document.getElementById('v-header-btn').style.display = 'none';
    	  let upload = document.getElementById('v-header-upload');
    	  upload.style.display = 'block';
    	  upload.classList.add('v-header-btn');
    	  let vheader = document.getElementById('v-header');
    	  let back = document.createElement('div');
    	  let imgBack = document.createElement('img');
    	  imgBack.src = this._returnUrl('/public/arrow/home.png');
        imgBack.id = 'v-video-imgBack';  	  
    	  imgBack.style.width = 20 +  'px';
    	  imgBack.style.height = 20 + 'px';
    	  imgBack.style.marginTop = 6 + 'px';  	  
    	  
    	  back.style.float = 'left';
    	  back.id = 'v-video-back';
    	  back.style.opacity = 0.5;
    	  back.appendChild(imgBack);  
    	  
    	  vheader.appendChild(back)
    	    	  
    	  let vUploader = document.getElementById('v-uploader');
    	     	  
    	  let title = document.createElement('div')
        title.style.height = 20 + 'px';
        title.color = 'green'
        title.marginTop = 5 +  'px';
        //title.style.borderBottom = '1px solid gray';
        title.style.textAlign = 'center';
        title.style.fontSize = 12 + 'px';
        
        let input = document.createElement('input');
        input.type = 'text';
        
        input.placeholder = 'type video title ...';
        input.id = 'v-video-title';
        
        title.appendChild(input)
        vUploader.appendChild(title);
        
        let tagLocation  = document.createElement('div');
        let tags = document.createElement('div');
        let location = document.createElement('div');
                
        tagLocation.id='v-video-tgl';
       
        tagLocation.style.height = 20 + 'px';
        tagLocation.style.marginTop = 5 + 'px';
        tagLocation.style.backgroundColor = 'white'
                
        let hash = document.createElement('span');
        hash.id= 'v-video-hash';
        hash.innerHTML = '#';
        hash.style.color = 'blue';
        hash.fontSize = 10 + 'px';
        
        let hashInput = document.createElement('input');
        hashInput.type = 'text'
        hashInput.id = 'v-video-hinput';
     
        hashInput.placeholder = 'separate tags with comma'
        tags.appendChild(hash);
        tags.appendChild(hashInput);    
        
        tags.style.float = 'left';
        tagLocation.appendChild(tags);        
        
        vUploader.appendChild(tagLocation)
        
    	  let video = document.createElement('video');
    	  let source = document.createElement('source');
        source.id = 'v-video-source';    	  
    	  video.id = 'v-video-player';
    	  video.setAttribute('controls',true);
    	  
    	  let vContainer = document.createElement('div');
    	  vContainer.style.position = 'relative';
    	  
    	  vContainer.appendChild(video);
    	  
    	  video.appendChild(source);
    	  vUploader.appendChild(vContainer);
        let reader = new FileReader();
        source.src = URL.createObjectURL(e.target.files[0]);
                   
        
        //video.classList.add('v-video-contain')
        let locationText = document.createElement('span');
        let locationImage = document.createElement('img');
        locationImage.src = this._returnUrl('/public/arrow/a.png')
        locationText.innerHTML = 'location';
        locationText.classList.add('v-video-locationText');
        locationImage.classList.add('v-video-locationImage');  
        locationImage.id = 'v-video-locationImage';
        locationImage.addEventListener('mouseover',function(){
        	  if (that.mapDown || that.marker) return;
            this.src =   that._returnUrl('/public/arrow/b.png')      
        })
        
        locationImage.addEventListener('mouseleave',function(){
        	    if (that.mapDown) return;
             this.src =   that._returnUrl('/public/arrow/a.png') 
        })        
        
        //location.appendChild(locationText);
        location.appendChild(locationImage);
        location.classList.add('v-video-location');
        tagLocation.appendChild(location);   
        
        let that = this;
        
        
        if(this._isMobile()){
          input.style.width = this.config.m.containerWidth + 'px';
          tagLocation.style.width = this.config.m.containerWidth + 'px';
          hashInput.style.width = 3*(this.config.m.containerWidth/4) + 'px';
          video.width = this.config.m.containerWidth;          
        }else{
          input.style.width = this.config.d.containerWidth + 'px';
          tagLocation.style.width = this.config.d.containerWidth + 'px';
          hashInput.style.width = this.config.d.containerWidth/2 + 'px';
          video.width = this.config.d.containerWidth;  
        }
        
        location.addEventListener('click',function(){
        	   if(this.mapCreated === undefined){
        	   this.mapCreated = true;
        	   that.mapDown = true;
        	   let mapContainer = document.createElement('div');
        	   mapContainer.id = 'v-video-map';
        	   mapContainer.style.position = 'absolute';
        	  
        	   mapContainer.style.zIndex = 1000;
        	  
        	   
        	   let progress = document.createElement('div');
        	   progress.id = 'v-video-progress';
        	   progress.style.position = 'absolute';
        	 
        	   progress.style.display = 'none';
        	   progress.style.zIndex = 1001;
        	   progress.style.top = 0;
        	   let canvas = document.createElement('canvas');
        	   progress.appendChild(canvas);
        	   canvas.id = 'v-video-prgcanvas';

        	   canvas.style.position = 'relative';// alert(video.offsetHeight + ' ' + that.config.d.containerWidth)

        	   
        	   
        	   if(this._isMobile()){
        	      mapContainer.style.top = -video.videoHeight + 'px';
           	   mapContainer.style.width = that.config.m.containerWidth + 'px';
        	      mapContainer.style.height = video.offsetHeight + 'px';;
        	    
        	      progress.style.width = that.config.m.containerWidth + 'px';
        	      progress.style.height = video.offsetHeight + 'px';
        	      
        	      canvas.width = 100;
        	      canvas.height = 100;
        	      canvas.style.top = (video.offsetHeight/2-50 ) + 'px';
        	      canvas.style.left = (that.config.m.containerWidth/2 -50) + 'px';
        	   }else{
        	      mapContainer.style.top = -video.videoHeight + 'px';
           	   mapContainer.style.width = that.config.m.containerWidth + 'px';
        	      mapContainer.style.height = video.offsetHeight + 'px';;
        	    
        	      progress.style.width = that.config.d.containerWidth + 'px';
        	      progress.style.height = video.offsetHeight + 'px';
        	      
        	      canvas.width = 100;
        	      canvas.height = 100;
        	      canvas.style.top = (video.offsetHeight/2-50 ) + 'px';
        	      canvas.style.left = (that.config.d.containerWidth/2 -50) + 'px';
        	   }
        	   vContainer.appendChild(progress);        	   
        	   vContainer.appendChild(mapContainer); 
        	 
        	   let map=L.map('v-video-map').setView([51.505, -0.09], 13);
            L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
              attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
              maxZoom: 18,
              id: 'mapbox.streets',
                accessToken: 'pk.eyJ1IjoiMWlvMWwiLCJhIjoiY2psNThyd3luMGVsMjN4bnR3bXc4MXV2cyJ9.ks2qVsrV6d1rXu54-CyqIw'
            }).addTo(map);   
             
             
        	  document.getElementById('v-video-locationImage').src =  that._returnUrl('/public/arrow/b.png') 
           $(mapContainer).animate({top : '+='+video.videoHeight},400)  
              map.on('click',function(e){
                   //locationText.innerHTML = e.latlng.toString()
                   //locationText.position = e.latlng;
                   if(that.marker){ 
                     map.removeLayer(that.marker);
                      that.marker = new L.Marker(e.latlng);
                       that.marker.addTo(map)
                       that.location = e.latlng;
                       document.getElementById('v-video-locationImage').src =    that._returnUrl('/public/arrow/a.png') 
                   }else{ 
                   	  that.marker = new L.Marker(e.latlng);
                       that.marker.addTo(map)
                       that.location = e.latlng;
                       document.getElementById('v-video-locationImage').src =    that._returnUrl('/public/arrow/a.png') 
                   } 
                  
                 })  
        	   }else if(that.mapDown == true){
        	   	
              $('#v-video-map').animate({top : '-=' + video.videoHeight},400,function(){    
                    document.getElementById('v-video-locationImage').src =    that._returnUrl('/public/arrow/a.png')                
                   that.mapDown = false;        
              })        	   
        	   }else if(that.mapDown == false){ 
                $('#v-video-map').animate({top : '+='+video.videoHeight},400,function(){
                   that.mapDown = true;	      
                    document.getElementById('v-video-locationImage').src =    that._returnUrl('/public/arrow/b.png')           
                })            	   
        	   }
  
        })
        
        video.style.marginLeft = 'auto';
        video.style.marginRight = 'auto';
        video.style.marginTop = 5 + 'px';
        video.style.display = 'block';
        
        back.addEventListener('click',this._slideLeft.bind(this))       
        
        video.load();
        this._slideContainer();
    },
    
    
    _showVideos : function(videos){
    	let that = this;
    	let mainContainer = document.getElementById('v-video-archive');
    	let monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    	let video;
      for(let i = 0 ; i < videos.length ; i++){
      	 video = videos[i];
      	 
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
           thumbPoster.src = this._returnUrl('/' + video.image);
           thumbContainer.id = 'v-archive-thumb';
           thumbPoster.id = 'v-archive-poster';
           thumbContainer.appendChild(thumbPoster);
           
           let videoContent = document.createElement('div');
           let videoTitle = document.createElement('div');
           let videoTags = document.createElement('div');
           
           videoContent.classList.add('v-archive-content');
           videoTitle.classList.add('v-archive-title');
           videoTags.classList.add('v-archive-tags');
           
           videoTitle.innerHTML = video.title;   
               
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
           
           
        
           if(this._isMobile()){
                timeContainer.style.width = 50 + 'px';
                timeContainer.style.height = 60 + 'px';
                
                thumbContainer.style.width = 120 + 'px';
                thumbContainer.style.height = 100 + 'px';
                
                thumbPoster.style.width = 120 + 'px';
                thumbPoster.style.height = 100 + 'px';       
                
                videoContent.style.width =  100 + 'px';
                videoContent.style.height = 100 + 'px';
                videoTitle.style.fontSize= 14 + 'px';     
                videoTitle.style.cursor = 'pointer';       
                
                videoTitle.style.color = 'black';
                videoTitle.style.padding = 4 + 'px';    
                videoContent.style.marginLeft = 10 + 'px';
                videoTitle.style.fontWeight = 600;
               
                container.style.width = 280 + 'px';
                container.style.height = 190 + 'px';
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
                  
               
                videoTitle.style.color = 'black';
                videoTitle.style.fontWeight = 600;
                //videoTitle.style.backgroundColor = 'lightblue'
                videoTitle.style.padding = 4 + 'px';    
                videoTitle.style.marginTop = 5 + 'px'
                videoContent.style.marginLeft = 10 + 'px';
               
                container.style.width = 330 + 'px';
                container.style.height = 195 + 'px';
                container.style.float = 'left';
                container.style.marginBottom = 20 + 'px'
                topContainer.style.width = 330 + 'px';
                topContainer.style.height = 120 + 'px';
                
                
                if(i == 1 || i == 3)
                  container.style.marginLeft = 100+ 'px';               
                       
           }
           
           videoTitle.setAttribute('vid',i);
           videoTitle.addEventListener('click',function(){
              that._showVideo(videos[this.getAttribute('vid')]);
              that._slideContainer();             
           })
           mainContainer.appendChild(container);
      }
    },
    
    _showVideo : function(model){
       // this.file = e.target.files[0];
       
        try {
          document.getElementById('v-video-back').remove();	
        }catch(e){}
        
        let vUploader = document.getElementById('v-uploader');
        let upload = document.getElementById('v-header-upload');
         
        upload.style.display = 'none';
        vUploader.innerHTML = '';
        
    	  document.getElementById('v-header-btn').style.display = 'none';
    	  //let upload = document.getElementById('v-header-upload');
    	  //upload.style.display = 'block';
    	  //upload.classList.add('v-header-btn');
    	  let vheader = document.getElementById('v-header');
    	  let back = document.createElement('div');
    	  let imgBack = document.createElement('img');
    	  imgBack.src = this._returnUrl('/public/arrow/home.png');
    	  
    	  imgBack.style.width = 20 +  'px';
    	  imgBack.style.height = 20 + 'px';
    	  imgBack.style.marginTop = 6 + 'px';
    	  //imgBack.style.opacity = 0.5;
    	 
    	  back.style.float = 'left';
    	  
    	  back.appendChild(imgBack);  
    	  back.classList.add('v-video-back');
    	  back.id = 'v-video-back';
    	  
    	  vheader.appendChild(back);
    	    	  
    	 // let vUploader = document.getElementById('v-uploader');
    	     	  
    	  let title = document.createElement('div')
        title.style.height = 20 + 'px';
        title.color = 'green'
        title.marginTop = 5 +  'px';
        //title.style.borderBottom = '1px solid gray';
        title.style.textAlign = 'center';
        
        title.style.fontSize = 12 + 'px';
        title.innerHTML = model.title;       
        title.style.color = 'slategray'
        
        vUploader.appendChild(title);
        
        let tagLocation  = document.createElement('div');
        let tags = document.createElement('div');
        let location = document.createElement('div');
                
        
        tagLocation.style.height = 20 + 'px';
        tagLocation.style.marginTop = 5 + 'px';
        tagLocation.style.backgroundColor = 'white'
                
        let hash = document.createElement('span');
       // hash.id= 'v-video-hash';
        hash.innerHTML = '#';
        hash.style.color = 'blue';
        hash.style.paddingTop = 2 + 'px';
        hash.style.width = 20 + 'px';
        
        tags.appendChild(hash); 
        
        for(let i = 0 ; i < model.tags.length ; i++){
           let tag = document.createElement('span');
           tag.classList.add('v-video-spanTag');        
        
           tag.innerHTML = model.tags[i];
           tags.appendChild(tag);                 
        }
          
        
        tags.style.float = 'left';
        tagLocation.appendChild(tags);        
        
        vUploader.appendChild(tagLocation)
        
    	  let video = document.createElement('video');
    	  let source = document.createElement('source');
    	  source.type ='video/webm;codecs="vp8, vorbis"'
        source.id = 'v-video-source';    	  
    	  video.id = 'v-video-player';
    	  video.setAttribute('controls',true);
    	  
    	  let vContainer = document.createElement('div');
    	  vContainer.style.position = 'relative';
    	  
    	  vContainer.appendChild(video);
    	  
    	  video.appendChild(source);
    	  vUploader.appendChild(vContainer);
       
        source.src =this._returnUrl("/" + model.url);
                  
        
        //video.classList.add('v-video-contain')
       
        let locationImage = document.createElement('img');
        locationImage.src = this._returnUrl('/public/arrow/a.png')
        // locationText.innerHTML = 'location';
        // locationText.classList.add('v-video-locationText');
        locationImage.classList.add('v-video-locationImage');  
        locationImage.id = 'v-video-locationImage';
        locationImage.addEventListener('mouseover',function(){
        	  if (that.mapDown || that.marker) return;
            this.src =   that._returnUrl('/public/arrow/b.png')      
        })
        
        locationImage.addEventListener('mouseleave',function(){
        	    if (that.mapDown) return;
             this.src =   that._returnUrl('/public/arrow/a.png') 
        })
        
        if(this._isMobile()){
           title.style.width = this.config.m.containerWidth + 'px';
           tagLocation.style.width = this.config.m.containerWidth + 'px';
           video.width = this.config.m.containerWidth;         
        }else{
           title.style.width = this.config.d.containerWidth + 'px';
           tagLocation.style.width = this.config.d.containerWidth + 'px';
           video.width = this.config.d.containerWidth;   
        }
        //location.appendChild(locationText);
        location.appendChild(locationImage);
        location.classList.add('v-video-location');
        tagLocation.appendChild(location);   
        
        let that = this;
        
        location.addEventListener('click',function(){
        	   if(this.mapCreated === undefined){
        	   this.mapCreated = true;
        	   that.mapDown = true;
        	   let mapContainer = document.createElement('div');
        	   mapContainer.id = 'v-video-map';
        	   mapContainer.style.position = 'absolute';
        	   mapContainer.style.top = -video.videoHeight + 'px';
        	 
        	   mapContainer.style.zIndex = 1000;
        	   mapContainer.style.height = video.offsetHeight + 'px';;
        	   
        	   if(that._isMobile()){
        	        mapContainer.style.width = that.config.m.containerWidth + 'px';  	
        	   }else {
        	        mapContainer.style.width = that.config.d.containerWidth + 'px';  	
        	   }      	   
        	   vContainer.appendChild(mapContainer); 
        
        	   let map=L.map('v-video-map').setView(model.location, 13);
        	      let loc = new L.Marker(model.location);
             loc.addTo(map)
            L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
              attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
              maxZoom: 18,
              id: 'mapbox.streets',
                accessToken: 'pk.eyJ1IjoiMWlvMWwiLCJhIjoiY2psNThyd3luMGVsMjN4bnR3bXc4MXV2cyJ9.ks2qVsrV6d1rXu54-CyqIw'
            }).addTo(map);   
             
             
        	   document.getElementById('v-video-locationImage').src =    that._returnUrl('/public/arrow/b.png') 
           $(mapContainer).animate({top : '+='+video.videoHeight},400)  
              map.on('click',function(e){
                   //locationText.innerHTML = e.latlng.toString()
                   //locationText.position = e.latlng;
                   if(that.marker){ 
                     map.removeLayer(that.marker);
                      that.marker = new L.Marker(e.latlng);
                       that.marker.addTo(map)
                       that.location = e.latlng;
                       document.getElementById('v-video-locationImage').src =    that._returnUrl('/public/arrow/a.png') 
                   }else{ 
                   	  that.marker = new L.Marker(e.latlng);
                       that.marker.addTo(map)
                       that.location = e.latlng;
                       document.getElementById('v-video-locationImage').src =    that._returnUrl('/public/arrow/a.png') 
                   } 
                  
                 })  
        	   }else if(that.mapDown == true){
        	   	
              $('#v-video-map').animate({top : '-=' + video.videoHeight},400,function(){    
                    document.getElementById('v-video-locationImage').src =    that._returnUrl('/public/arrow/a.png')                
                   that.mapDown = false;        
              })        	   
        	   }else if(that.mapDown == false){ 
                $('#v-video-map').animate({top : '+='+video.videoHeight},400,function(){
                   that.mapDown = true;	      
                    document.getElementById('v-video-locationImage').src =    that._returnUrl('/public/arrow/b.png')           
                })            	   
        	   }
  
        })
        
        video.style.marginLeft = 'auto';
        video.style.marginRight = 'auto';
        video.style.marginTop = 5 + 'px';
        video.style.display = 'block';       
       
        back.addEventListener('click',this._slideLeft.bind(this))
       // this._slideContainer();
    },
    
    _isMobile : function(){
       return this.config.mainWidth < this.config.d.containerWidth ? 1 : 0;
    },
    
    _createChannel : function(){
        $('#v-selectfile').trigger('click');        
    },
    
    _upload : function(){      
      let rawTitle = document.getElementById('v-video-title').value;
      let rawTags = document.getElementById('v-video-hinput').value;
      let location = this.location;
      
      let title  = rawTitle.trim();
      let tags = rawTags.split(',');
      let args ;
      if(location != null && tags.length != 0 && title !=''){
          args = {
             title : title,
             tags : tags,
             location : location           
          }    
      } else return;    	
     
      document.getElementById('v-video-progress').style.display = 'block';
      document.getElementById('v-video-progress').style.backgroundColor = 'white';
      document.getElementById('v-video-progress').style.opacity = 0.8;
      
      this.upload.notify(args);
    },
    
    _progress : function(progress){       
              let canvas = document.getElementById('v-video-prgcanvas');
              let x = Math.floor(canvas.width/2);
              let y = Math.floor(canvas.height/2);
              
              let context = canvas.getContext('2d');
              let prog = progress/100;
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
    
    _slideLeft : function(){
    	 document.getElementById('v-header-upload').style.display = 'none'
        this._slideContainer();
    },
    
    _hide : function(){
        document.getElementById('videoContainer').style.display = 'none';
     },
    
    _slideContainer : function(){
    	let sliderWidth ;
    	if(this._isMobile()){
    	  sliderWidth = this.config.m.containerWidth;
    	}else{
    	  sliderWidth = this.config.d.containerWidth;
    	}
      let vContentContainer = document.getElementById('v-content-container');
      let that = this;
      if(this._isMobile()){
      	       if(this.slide == 0 || this.slide === undefined)	{
         $(vContentContainer).animate({left: '-=' + sliderWidth},400,function(){
            that.slide = 1;
            
         }) 
        
       } else{
         $(vContentContainer).animate({left: '+=' + sliderWidth},400,function(){
           that.slide = 0;
             document.getElementById('v-video-back').remove()
    	       document.getElementById('v-header-btn').style.display = 'block';  
    	       document.getElementById('v-uploader').innerHTML = '';  
         }) ;
         
       } 
      
      }else{
       if(this.slide == 0 || this.slide === undefined)	{
         $(vContentContainer).animate({left: '-=' + sliderWidth},400,function(){
            that.slide = 1;
            
         }) 
        
       } else{
         $(vContentContainer).animate({left: '+=' + sliderWidth},400,function(){
           that.slide = 0;
             document.getElementById('v-video-back').remove()
    	       document.getElementById('v-header-btn').style.display = 'block';  
    	       document.getElementById('v-uploader').innerHTML = '';  
         }) ;
         
       }  
      }
    }   
  
  }
  
  
       var Router = (function () {     
                    	     
     	     let that = this; 
           let validUrl = ['create','archive'];
           let events = {};
           
           for(let elem of validUrl)
             events[elem] = new Event(this);
          
     	    
     	     function router(url){	
     	     	  if(validUrl.indexOf(url) == -1) return;
     	     	  events[url].notify('')
     	        window.history.pushState(null,null,'/video/' + url);    
     	     }     	     
     	     
     	     return {
               route : router ,
               event : events 	     
     	     }
     })()
     
  
  var Controller = (function(){ 
      let reader = new FileReader();  	 
  	   var socket = io('http://localhost:3000');     
      
      View._addEvents();
      Router.event['archive'].attach(function(sender,args){
      	 if(!View.inited){                    	   
      	   View._init(); 
      	   getModels();       	 
      	 }     	 
      	 else {
      	 	 document.querySelector('#videoContainer').style.display = 'block';
      	 }
             
      })
     	  
      
      View.upload.attach(function(sender,args){
          reader.onload = function(e){
             socket.emit('upload',{'name' : sender.file.name, data : e.target.result})          
          }
          
          socket.emit('start',{'name' :sender.file.name, 'size' : sender.file.size,args : args})
      })
      
      socket.on('continue', function (data){
		      View._progress(data['percent']);
				var place = data['place'] * 524288; //The Next Blocks Starting Position
				var newFile; //The Variable that will hold the new Block of Data
			
			  newFile = View.file.slice(place, place + Math.min(524288, (View.file.size-place)));
				reader.readAsBinaryString(newFile);
			});
			
	   socket.on('done',function (data) {	   	 
	       document.getElementById('v-video-progress').style.display = 'none';
	       View._showVideo(data);
	   })
	   
	   socket.on('error',function(data){
          	   
	   })
	   
	  function getModels(){
        let xhr = new XMLHttpRequest();
        xhr.open('POST','/video/index');
        xhr.onreadystatechange = function (data) {
        	 if(this.readyState == 4){
             let result = JSON.parse(xhr.responseText);
             View._showVideos(result);        	 
        	 }
        }	  
        
        xhr.send();
	  }  
	   
  })()
  
  
  return {
  	 hide : View._hide,
    router : function(path){
        Router.route(path)    
    }
  }
  

})()