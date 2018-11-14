
window.onload = function(){
  (function(){
	
	var View = {
		
		 config : {
		 	  mainWidth : 900,
		 	  d : {containerWidth : window.innerWidth},
           menubar : ['home','article','video','gallery','about','login'],
           inputs : ['username','password','email']
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
        
		 _start : function(){
		 	 this._addEvents(); 	
		 	 this._init();         	 
		 },
		 
		_addEvents : function(){
          for (let i = 0 ; i < this.config.menubar.length ; i++) {
       	    this.defineProp(this,this.config.menubar[i],new Event(this))
          }    
          
          window.addEventListener('popstate',function(){
               Router.route('#' + document.location + '');          
          },false)
          
      },
		 
	   _init : function(){
	      let canvas = document.createElement('canvas');
	      canvas.width = 100;
	      canvas.height = 100;
	      
	      let windowHeight = window.innerHeight;
	      let windowWidth = window.innerWidth;
	      
	      let context = canvas.getContext('2d');
	      
	      let radius = 50;
	      
	      context.beginPath();
	      context.arc(50,50,radius,0,2*Math.PI);
	      context.closePath();
	      context.fillStyle = 'lightblue';
	      context.fill();
	      
	      
	      canvas.style.position = 'fixed';
	      
	      canvas.style.top = (windowHeight - 50) + 'px';
	      canvas.style.left = (windowWidth -50) + 'px';
	      
	      canvas.style.zIndex = 1000;
	      
	      canvas.addEventListener('click',this._showMenu.bind(this));
	      
	      document.body.appendChild(canvas);
	   },
	   
	   
	   _showMenu : function(e){
          
         let that = this;
	      let windowHeight = window.innerHeight;
	      let windowWidth = window.innerWidth;          
          
         let div = document.createElement('div');
         div.id = 'm-cover';
         div.style.position = 'absolute';
         div.style.backgroundColor = 'white';
         div.style.opacity = 1;
         div.style.top = 0;
         div.style.left = 0;
         div.style.zIndex = 998;
         
         div.style.width = windowWidth + 'px';
         div.style.height = windowHeight + 'px';
         document.body.appendChild(div);
         
 	      let canvas = document.createElement('canvas');
	      canvas.width = 2*window.innerHeight;
	      canvas.height = 2*window.innerHeight;
	   
	      
	      let context = canvas.getContext('2d');
	      
	      let radius = 50;
	
	      
	      canvas.style.position = 'fixed';
	      
	      canvas.style.top = 0;
	      canvas.style.left = (windowWidth -windowHeight) + 'px';
	      
	      canvas.style.zIndex = 1000;
	      
	     
	      e.target.remove();
	      canvas.id = 'm-menu';
	      document.body.appendChild(canvas);    
	      
	        
          let id = window.setInterval(function(){ 
            if(radius > window.innerHeight){
               clearInterval(id);               
               that._menubar();
               that._addSearch(div);
               canvas.setAttribute('radius',radius)
               
               return;            
            }
            
         radius +=10;
	      context.beginPath();
	      context.arc(windowHeight,windowHeight,radius,0,2*Math.PI);
	      context.closePath();
	      context.fillStyle = 'lightblue';
	      context.fill();
	        

         },10)	       
          
          div.addEventListener('click',this._hideMenu.bind(this));
	   },
	   
	   _clearMenu : function(){
	   	let search = document.getElementById('m-search');
	   	let cover = document.getElementById('m-cover'); 
	   	
	      if(search.hasOwnProperty('searching')){
	      	cover.style.opacity = 1;
	      	input = document.getElementById('m-search-input');        
	      }else{
	        search.remove();
	        cover.remove();      
	      }	     
	   },
	   
	   _menubar : function () {
	   	let that = this;
	      let menubar = document.createElement('div');
	      for(let i = 0 ; i < this.config.menubar.length ; i++){
            let menu = document.createElement('div');
            menu.innerHTML = this.config.menubar[i];
            menu.classList.add('menubar-m');	    
            menu.addEventListener('click',function () {
            	that[that.config.menubar[i]].notify('')
            })
            
            $(menu).hover(function(){
               this.innerHTML = that.config.menubar[i].toUpperCase() 
            },function(){
               this.innerHTML = that.config.menubar[i].toLowerCase()
            })
            menubar.appendChild(menu);  
	      }
	      
	      
	      menubar.classList.add('menubar-a');
	      
	      menubar.style.top = (window.innerHeight - (this.config.menubar.length * 20))/2 + 'px';
	      menubar.style.left = (window.innerWidth -100) + 'px';
	      
	      menubar.style.height = this.config.menubar.length * 20 + 'px';
	      document.body.appendChild(menubar)
	      
	      $(menubar).animate({opacity:1},300);
	      
	   },
	   
	   _addSearch : function(container){
	      let search = document.createElement('div');
	      let input = document.createElement('input');
	      input.type = 'text';
	      
	      if(this._isMobile()){
                        search.style.width = this.config.mainWidth + 'px';
            search.style.minHeight = window.innerHeight + 'px';
            search.id = 'm-search';
            input.style.width = this.config.mainWidth + 'px';
            input.style.height = 40 + 'px';
          //  search.style.left = (window.innerWidth-this.config.mainWidth)/2 + 'px';
            
            input.placeholder = 'Search';
            input.id = 'm-search-input'; 
            search.appendChild(input);
           // document.body.appendChild(search);
           container.appendChild(search); 
	      }else{
            search.style.width = this.config.mainWidth + 'px';
            search.style.minHeight = window.innerHeight + 'px';
            search.id = 'm-search';
            input.style.width = this.config.mainWidth + 'px';
            input.style.height = 40 + 'px';
          //  search.style.left = (window.innerWidth-this.config.mainWidth)/2 + 'px';
            
            input.placeholder = 'Search';
            input.id = 'm-search-input'; 
            search.appendChild(input);
           // document.body.appendChild(search);
           container.appendChild(search); 
	      }
	      
	      input.addEventListener('click',this._prepareSearch.bind(this));
	      
	   },
      
      
      _prepareSearch : function(e){
         e.stopPropagation();
         let search = document.getElementById('m-search');
         search['searching'] = '1';
         this._hideMenu();    
      },	   
	       
    _isMobile : function(){
       return this.config.mainWidth < this.config.d.containerWidth ? 0 : 1;
    },
    
    _hideMenu : function(e){    
    	document.getElementsByClassName('menubar-a')[0].remove();
      let that = this;      
      let canvas = document.getElementById('m-menu')
      
      let radius = canvas.getAttribute('radius');
        radius -=10
      let context = canvas.getContext('2d');
      let x = canvas.width/2;
      let y = canvas.height/2;
      let id = window.setInterval(function(){
          if(radius < 50){
             clearInterval(id);
             canvas.remove();
             that._init();
             that._clearMenu();
          }
                     
      context.beginPath();
      context.arc(x, y, radius, 0, 2*Math.PI);
      context.lineWidth = 21;
      radius -= 20;      

      // line color
      context.strokeStyle = 'white';
      context.stroke();  
          
                
      },10)      
      
    },
    
    _login : function(){
       let container = document.createElement('div');
       container.id = 'a-login-container';
       let that = this;
       container.style.width = 300 + 'px';
       container.style.height = 230 + 'px';
       let innerHeight = window.innerHeight;
       container.style.top = (innerHeight -230)/3 + 'px';
       let input ;
       container.appendChild(this._loginBox())       
       this.config.inputs.forEach(function(elem){
           input = that._createInput(elem);
           container.appendChild(input);
       })
       
       
       container.appendChild(this._term())
       document.body.appendChild(container)
    },
    
    _loginBox : function(){
        let loginTitle = document.createElement('div');
        loginTitle.style.height = 20 + 'px';
        loginTitle.style.width = 300 + 'px';
        loginTitle.style.fontSize = 16 + 'px';
        loginTitle.style.fontWeight = 600;
        
        let login = document.createElement('span');
        login.style.height = 20 + 'px';
        login.current = 1;
        login.innerHTML = 'Login'
        login.style.cursor = 'pointer'
        
        let register = document.createElement('span');
        register.style.height = 20 + 'px';
        register.style.color = 'lightgrey';
        register.innerHTML = 'Register' 
        register.style.cursor = 'pointer'
        
        register.addEventListener('mouseenter',function(){
           if(this.current == 1){
               this.style.color = 'lightgrey'
               login.style.color = 'black'           
           }else{
                this.style.color = 'black'
                login.style.color = 'lightgrey'
           }        
        })        
        
        
        register.addEventListener('mouseleave',function(){ 
            if(this.current == 1){
                 this.style.color = 'black';
                 login.style.color = 'lightgrey'            
            }else{
                 this.style.color = 'lightgrey'
                 login.style.color = 'black'
            }        
        })
        
        let span = document.createElement('span');
        span.innerHTML = '/'
        loginTitle.appendChild(login);
        loginTitle.appendChild(span);
        loginTitle.appendChild(register)
        
        
        return loginTitle;
    },
    
    _term : function(){
        let term = document.createElement('div');
        let span = document.createElement('span');
        
        term.style.width = 200 + 'px';
        span.innerHTML = 'Remember me';
        span.style.marginLeft = 5 + 'px';
        let canvas = this._checkbox(20,20);
        canvas.style.float = 'left';
        canvas.style.cursor = 'pointer';
        term.appendChild(canvas);
        term.appendChild(span);
        term.style.marginTop = 25 + 'px';
        term.style.marginLeft = 100 + 'px';
        
        return term;
       
                     
    },
    
    _checkbox : function(width,height){
       
        let canvas = document.createElement('canvas');
	      canvas.width = width;
	      canvas.height = height;
	  
	      
	      let context = canvas.getContext('2d');
	      
	      let radius = width/2;
	      
	      context.beginPath();
	      context.arc(width/2,width/2,radius,0,2*Math.PI);
	      context.closePath();
	      context.fillStyle = 'lightblue';
	      context.fill();
	      
	      	      
	      canvas.addEventListener('click',function(){
             	      
	      });
	      
	      return canvas;  
    },
    
    
    _createInput : function(name){
        let mainContainer = document.createElement('div');
        let input = document.createElement('input');
        mainContainer.style.width = 300 + 'px';
        mainContainer.style.marginTop = 18 + 'px'
        mainContainer.style.position = 'relative';
        input.type = 'text';
        input.style.width = 200 + 'px';
        mainContainer.style.height = 20 + 'px';
        input.style.height = 20 + 'px';
        input.style.position = 'relative';
        input.style.left = 100 + 'px';
        input.style.border= 'none';
        input.style.borderBottom = '1px solid grey';
        input.style.padding = '3px';       
         
        input.style.paddingLeft = 0;
        input.style.boxSizing = 'box-border'        
        input.style.zIndex = 101;
        input.style.opacity = 0.5;
        let title = document.createElement('span');
        title.style.height = 20 + 'px';
        title.style.position = 'absolute';
        title.style.zIndex = 100;
        title.innerHTML  = name;
        title.style.left = 100 + 'px'; 
        title.style.paddingTop = 5 + 'px';
        title.style.color= 'black';
        title.style.boxSizing = 'box-border'
        title.style.paddingRight = 5 + 'px';
        input.classList.add('a-login-text');
                
        
        input.addEventListener('focus',function(){
        	    if(this.hasOwnProperty('animated')) return;
             let style = window.getComputedStyle(title);
             let width = style.getPropertyValue('width');
             let toLeft = parseInt(width) + 10;
             this.style.borderBottom = '2px solid red'
             this.style.paddingBottom = '1px'
             this.animated = true;
            
             $(title).animate({left : '-=' + toLeft+ 'px'},400)        
        })        
        
        mainContainer.appendChild(input);
        mainContainer.appendChild(title);
       
        return mainContainer;    
    }
    
	   
	}
	
	
	var Router = (function(){
      const modules = ['gallery','video','editor'];
		
		function router(path){   
		  let backOrNext = false;
		  let route ; 
		  let inside  ;
		  
		  if(path[0] == '#') {
           path = path.substring(1,path.length)
           backOrNext = true;		  
		  }  
               
        var pathArray = location.href.split( '/' );
        var protocol = pathArray[0];
        var host = pathArray[2];
        var url = protocol + '//' + host;
        
        if(url.length == path.length) return;    
       
        route = path.slice(url.length + 1);
        let routeSplited = route.split('/');
        
        let index = modules.indexOf(routeSplited[0]);        
        if(index == -1) return;
        inside = backOrNext ? '#':'';
        switch(index){
           case 0:
             Index.hide();
             Video.hide();
             Gallery.router(inside + route.slice(routeSplited[0] + 1))  ;
             break;
           case 1:
             Index.hide();
             Gallery.hide()
             Video.router('archive')
             break;
           case 2:
             Video.hide();
             Gallery.hide();
             Index.router(inside + route.slice(routeSplited[0] + 1)) ;
             break;
           default:
            break;                         
        }
         
                       		
		}
		
		
      return {
         route : router      
      }      	
	})()
   
   var Controller = (function(){   
          
          View._start();
          View._login()
          View.article.attach(function(sender,args){
          	 sender._hideMenu()
          	 Video.hide();
          	 Gallery.hide();
             Index.router('archive');
          })
          
          View.video.attach(function(sender,args){          	
             sender._hideMenu();  
             Index.hide();
             Gallery.hide();     
             
             Video.router('archive');                  
          })
          
          View.gallery.attach(function(sender,args){
             sender._hideMenu();             
             Video.hide();
             Index.hide();      
             
             Gallery.router('archive');
                       
          })
          
        //  Video.router('archive');         
   })()

})()

}