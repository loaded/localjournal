

window.onload = function(){


  var View = {

   _login : function(){
       let container = document.createElement('div');
       container.id = 'a-login-container';
       let that = this;
       container.style.width = 300 + 'px';
       //container.style.height = 230 + 'px';
       let innerHeight = window.innerHeight;
       container.style.overflow = 'hidden'
       container.style.top = (innerHeight -230)/3 + 'px';
       let input ;
       container.appendChild(this._loginBox());
       
       let mainBox = document.createElement('div');
       mainBox.id = 'a-login-mainBox';
       mainBox.style.position = 'relative'
       mainBox.animated = 'login'
       let loginDiv = document.createElement('div');
       loginDiv.id = 'a-login-loginDiv' ;
       loginDiv.style.width = 300 + 'px';
       loginDiv.style.float = 'left';        
       let registerDiv = document.createElement('div');
       registerDiv.id = 'a-login-registerDiv';
       
       loginDiv.style.width = 300 + 'px';
       registerDiv.style.width = 300 + 'px';
       registerDiv.style.float = 'right'
       
       registerDiv.style.height = 200 + 'px';
       mainBox.style.width = 600 + 'px';
       
     
       
       this._fillRegister(registerDiv);
       this._fillLogin(loginDiv);
       this._createGuest();
       mainBox.appendChild(loginDiv);
       mainBox.appendChild(registerDiv);  
       
       container.appendChild(mainBox)
       
       
       document.body.appendChild(container)
    },
    
    _createGuest : function(){
       let div = document.createElement('div');
       div.innerHTML = 'continue as gust';
       div.style.marginLeft = 'auto';
       div.style.marginRight = 'auto';
       div.style.color = 'blue';
       div.style.cursor = 'pointer';
       div.style.fontSize = 14 + 'px';
       div.style.marginTop = '20px';
       document.body.appendChild(div);
    },
    
    
    
    
    _fillRegister : function(register){
    	let that = this;
       ['username','password','email'].forEach(function(elem){
          register.appendChild(that._createInput(elem))       
       })
       
       register.appendChild(this._term('I agree with this'))
    },
    
    _fillLogin : function(login){
      let that = this;
      ['username','password'].forEach(function(elem){
          login.appendChild(that._createInput(elem))      
      })
      
      login.appendChild(this._term('Reset Password'))
    },
    
    
    
    _loginBox : function(){
        let loginTitle = document.createElement('div');
        loginTitle.style.height = 20 + 'px';
        loginTitle.style.width = 300 + 'px';
        loginTitle.style.fontSize = 16 + 'px';
        loginTitle.style.fontWeight = 600;
        loginTitle.style.marginLeft = 100 + 'px';
        
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
           if(mainBox.animated == 'register'){
               this.style.color = 'lightgrey'
               login.style.color = 'black'           
           }else{
                this.style.color = 'black'
                login.style.color = 'lightgrey'
           }        
        })        
        
        
        register.addEventListener('mouseleave',function(){ 
            if(mainBox.animated == 'register'){
                 this.style.color = 'black';
                 login.style.color = 'lightgrey'            
            }else{
                 this.style.color = 'lightgrey'
                 login.style.color = 'black'
            }        
        })
        
        
        register.addEventListener('click',function () { 
           let mainBox = document.getElementById('a-login-mainBox');          
           if(mainBox.animated == 'login'){
               mainBox.animated = 'register'
               this.style.color = 'black';
               login.style.color = 'lightgray'           	   
           	   $(mainBox).animate({left : '-=300'},200)  
           }        	  
        	
        })
        
        login.addEventListener('click',function(){
        	  let mainBox = document.getElementById('a-login-mainBox');
        	  if(mainBox.animated == 'register'){
               mainBox.animated ='login';        	
               this.style.color = 'black'    
               register.style.color = 'lightgray'
        	     $(mainBox).animate({left : '+=300'},200)  
        	  }
                    
        })
        let span = document.createElement('span');
        span.innerHTML = '/'
        span.classList.add('slash')
        loginTitle.appendChild(login);
        loginTitle.appendChild(span);
        loginTitle.appendChild(register)
        
        
        let slash = document.createElement('span');
        slash.innerHTML = '/'
        slash.classList.add('slash')
        loginTitle.appendChild(slash)
        let send = document.createElement('span');
        send.style.height = 20 + 'px';
        //send.style.backgroundColor = 'green';
        send.style.color = 'green';
        send.innerHTML = 'Send';
        //send.style.float = 'right';
        send.style.cursor  = 'pointer';
        send.style.marginTop = 18 + 'px';
        send.style.fontSize = 16 + 'px';
        send.style.fontWeight = 600;
        send.style.boxSizing = 'border-box';
        send.style.padding = 3 + 'px';
        send.style.textAlign = 'center';
        send.style.lineHeight = 16 + 'px';
        send.style.verticalAlign = 'middle';
        $(send).hover(function(){
             this.style.backgroundColor = 'green' ;
             this.style.color = 'white';       
        },function(){
              this.style.backgroundColor = 'white';
              this.style.color = 'green';        
        })
        
        
        loginTitle.appendChild(send)
        
        return loginTitle;
    },
    
    _term : function(title){
        let term = document.createElement('div');
        let span = document.createElement('span');
        
        term.style.width = 200 + 'px';
        span.innerHTML = title;
        span.style.marginLeft = 5 + 'px';
        let canvas = this._checkbox(20,20);
        canvas.style.float = 'left';
        canvas.style.cursor = 'pointer';
        canvas.style.position = 'relative';
        canvas.style.zIndex = 100;
        term.appendChild(canvas);
        term.appendChild(span);
        term.style.marginTop = 25 + 'px';
        term.style.marginLeft = 100 + 'px';
        term.style.position = 'relative';
        
        canvas.addEventListener('click',this._checked.bind(this,term))
        
        return term;
       
                     
    },
    
    _checked : function(term){
    	    let that = this;
          let canvas = document.createElement('canvas');
	      canvas.width = 20;
	      canvas.height = 20;
	   
	      
	      let context = canvas.getContext('2d');
	      
	      let radius = 1;
	
	      
	      canvas.style.position = 'absolute'	      
	     
	     canvas.style.zIndex = 101;
	     canvas.style.left = 0;
	     canvas.style.top = 0;
	      
	     
	     	//canvas.id = 'm-menu';
		      term.appendChild(canvas);    
	      
	        
          let id = window.setInterval(function(){ 
            if(radius > 4){
               clearInterval(id);               
               
               return;            
            }
            
         radius +=1;
	      context.beginPath();
	      context.arc(10,10,radius,0,2*Math.PI);
	      context.closePath();	
	      context.fillStyle = 'green';
	      context.fill();
	        

         },50)	
         
         canvas.addEventListener('click',function(){
              that._uncheck(this);       
         }) 
    },
    
    _uncheck : function(canvas){
           	      
      let radius = 4;
       
      let context = canvas.getContext('2d');
      let x = canvas.width/2;
      let y = canvas.height/2;
      let id = window.setInterval(function(){
          if(radius < 2){
             clearInterval(id);
             canvas.remove();
             
             
          }
                     
      context.beginPath();
      context.arc(x, y, radius, 0, 2*Math.PI);
      context.lineWidth = 3;
      radius -= 2;      

      // line color
      context.strokeStyle = 'lightblue';
      context.stroke();  
          
                
      },50)  
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
        input.style.boxSizing = 'border-box'        
        input.style.zIndex = 101;
        input.style.opacity = 0.5;
        let title = document.createElement('span');
        title.style.height = 20 + 'px';
        title.style.position = 'absolute';
        title.style.zIndex = 100;
        title.innerHTML  = name;
        title.style.left = 100 + 'px'; 
        //title.style.paddingTop = 5 + 'px';
        title.style.color= 'black';
        title.style.boxSizing = 'border-box'
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
            
             $(title).animate({left : '-=' + toLeft+ 'px',paddingTop : '+=3'},200)        
        })        
        
        mainContainer.appendChild(input);
        mainContainer.appendChild(title);
       
        return mainContainer;    
    }
    

  }
}
