var Video = (function(){
  
  
  var View = {
    
    config : {
       mainWidth : window.innerWidth,    
       d : {
           containerWidth : 900,
           headerHeight : 30       
       },
       m : {}
    },
    
    _init : function(){
       
       this._configIt();
       this._setHeader();
       this._setMain(); 
    },
    
    _configIt : function(){
    	 let container = document.getElementById('videoContainer');
    	 let bodyContainer = document.getElementById('video-container');
    	 bodyContainer.style.width = this.config.d.containerWidth + 'px';
    	 bodyContainer.classList.add('bodyContainer');
    	 
    	 container.style.display = 'block';
       container.style.width = this.config.mainWidth + 'px';
       
    },
    
    _setHeader : function(){
       let vheader = document.getElementById('v-header');
       vheader.style.height = this.config.d.headerHeight + 'px';
       let btn = document.getElementById('v-header-btn');
       btn.classList.add('v-header-btn');
       if(this._isMobile()){}else{
          btn.classList.add('dv-header-btn');
          vheader.style.width = this.config.d.containerWidth + 'px';
          vheader.classList.add('dv-header');
       }
       
    },
    
    _setMain : function () {
    	
    },
    
    _isMobile : function(){
       return this.config.mainWidth < this.config.d.containerWidth ? 1 : 0;
    }   
  
  }
  
  
  var Controller = (function(){
      View._init();  
  })()

})()