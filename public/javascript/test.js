
/*============================================== Events ===============================================*/

    
   function makeUrl(url){
       return "http://localhost:3000/"+url;   
    }
/*=========================================== View =============================================== */  
var Gallery = (function(){
  var View = {
    windowWidth : $(document).width(),    
	 windowHeight :$(document).height(),
    index : 1,
    inited : false,
    mainWidth : 900,
    mainHeight : 620,
    mobile : {
      width : 100,
      margin : 5,
      top : 10
    },
    desktop : {
      width : 150,
      margin: 20,
      top : 20
    },
    menu : ["menu","cover","text","filter","location","share"],
    main : {
       mobile : {
          left : 5,
          top : 10
       },
      
       desktop : {
          width : 900,
          top : 10      
       }    
    },
    
    bottom : {
        mobile : {
           height : 20        
        },
        
        desktop : {
           height : 22
        }    
    },
   
    galleryName : '',
    fileName  : [],
    queue     : [],
    files : [],
    busy : 0,
    removedDownload : [],
    orientation : -1,
    header : {
    	el : document.getElementById('header'),
    	height: 30
    },
    uploader : {
      el : document.getElementById('uploader'),    	
    	height : 200,
    	mobile : 0,
    	desktop : 0,
    	view : 0,
    	position: 0,
    	busy : 0
    },
    space : {
      el : document.getElementById('space'),    	
    	height: 22
    },
    pool : {
    	el : document.getElementById('pool'),
    	height : 360,
    	marginRight : 0,
    	rowCount : 0
    },
    slideShow : 0,
    events : ['createGallery','bckGallery','nxtGallery',
                 'arwUp','arwDown','upload','remove','showImage','gallery','loadImage'],    
    
    defineProp : function(obj,key,value){  
      var View = {
        value : value,
        writable : true,
        enumerable : true,
        Viewurable : true      
      }    
      
      Object.defineProperty(obj,key,View);
    },
    
    isMobile : function(){ 
      return $(document).width()> this.mainWidth ? 0 : 1;
    },
    _setHeader : function(){
    	 var mobile = this.isMobile();
       this.header.el.style.height = this.header.height + 'px';
       var cgbtn = document.getElementById('cgbtn');
       var isChrome = /chrome/i.test( navigator.userAgent );
       var bnxt = document.getElementById('back-next');
       
       if(this.index){
         document.getElementById('back-next').style.display = 'none';       
       }else {
         document.getElementsByClassName('indt').style.display= 'none';       
       }       
       
       if(isChrome){
          $('#back-reset').css({'padding-top' : '3px'})       
       }           
       
       if(mobile){         
       	 bnxt.classList.remove('dbnxt');
          cgbtn.classList.add('mcgbtn');
          $(bnxt).css({'top' : '11px'})   
          if(isChrome){
            $(cgbtn).css({'padding-top' : '2px','padding-bottom' : '0px'})
            $('#back-next').css({'top' : '13px'})
            $('#back-reset').css({'width' : '55px'})
         }  
         $(bnxt).addClass('mbnxt')
       }else{
       	 
       	 bnxt.classList.remove('mbnxt')
          cgbtn.classList.remove('cgbtn');
          if(isChrome) {
             $('#back-next').css({'top' : '12px'})          
          }else {
             $('#back-next').css({'top' : '10px'})          
          }
          cgbtn.classList.add('dcgbtn')
          $(bnxt).addClass('dbnxt');
       }
    },
    _setMain : function(){
    	 var mobile = this.isMobile();
    	 var main = document.getElementById('main'); 
    	 main.style.display = 'block'
    	
    	 if(mobile) { 
    	   main.style.width = (this.windowWidth -10) + 'px';
    	   main.style.height = (this.windowHeight -10) + 'px';
    	   main.style.left = this.main.mobile.left + 'px';    	    
    	 }else {    	 
         main.style.width = this.mainWidth + 'px';
         main.style.height = (this.mainHeight -10) +  'px';      
         var margin_left = parseInt((this.windowWidth - 900)/2);
         main.style.left = margin_left + 'px';     
    	 }
         
    },
    _setUploader : function(){
       var mobile = this.isMobile();
       
       if(mobile){
           this.uploader.el.style.height = 133 + 'px';
           
           this.uploader.mobile = this.windowWidth - 2*this.main.mobile.left ;
           this.uploader.view = this.uploader.mobile;
           this.uploader.el.style.width = this.uploader.mobile + 'px';
       }else {
          this.uploader.el.style.height = this.uploader.height + 'px'; 
          this.uploader.desktop = 900;
          this.uploader.view = this.uploader.desktop;
          this.uploader.el.style.width = 900 + 'px';
       }    
    },
    
 
    _galSpace : function(){ return;
      var mobile = this.isMobile();
      //$('.edt').css('display','none')
      $('.edt').css('display','none'); 
   
      if(mobile){
         $('#space-wrapper').css({'width' : '277px','height': '20px','left' : -277 + 'px'})
         this.space.el.style.height = '20px';         
         $('.txt').css({'font-size' : '12px','height' : '16px','vertical-align' : 'middle','line-height' : '1.2'});
         $('.galedit').css({'width' : '70px'});       
         var isChrome = /chrome/i.test( navigator.userAgent );
          
          if(isChrome) {
            $('.txt').css({'padding-top' : '3px','padding-bottom': '1px','font-size':'14px'})          
          }
          
         $('#arrow').addClass('marrow')
         $('#arrow-up').addClass('marup');
         $('#arrow-down').addClass('marup');
         $('#space-wrapper').animate({left : '+=277'},400);
         
      }else {
        $('#space-wrapper').css({'width' : '324px','height': '22px','left' : -324 + 'px'})
         this.space.el.style.height = '22px';
         $('.galedit').css({'width' : '70px'});  
         $('.txt').css({'font-size' : '12px','height' : '18px','vertical-align': 'middle','line-height':'1.2'});
          var isChrome = /chrome/i.test( navigator.userAgent );
          
          if(isChrome) {
            $('.txt').css({'padding-top' : '3px','padding-bottom': '1px','font-size':'14px'})          
          }          
       
         $('#arrow-up').addClass('darup');
         $('#arrow-down').addClass('darup')
         $('#arrow').addClass('darrow')
         
         $('#space-wrapper').animate({left : '+=324'});
      }
    },
    
    _setSpace : function(){
       var mobile = this.isMobile();
       $('.indx').css('display','none');
       
       if(this.index){
         document.getElementById('galback').style.width = '60px';
         document.getElementById('galback').style.marginTop = '2px';
       }      
    
       if(mobile){
         $('.dsp .dsc .dsz .darrow .darup').removeClass('dsp dsc dsz darrow darup');
         $('#space-wrapper').css({'width' : '277px','height': '20px','left' : -277 + 'px'})
         this.space.el.style.height = '20px';
         
         $('.txt').css({'font-size' : '12px','height' : '16px','vertical-align' : 'middle','line-height' : '1.2'});
         $('.lft').addClass('mlft')
         $('.sp').addClass('msp');
         $('.sz').addClass('msz');
         $('.sc').addClass('msc');
         
         if(this.index){
             document.getElementById('space-wrapper').style.display = 'none';           
         }   
         var isChrome = /chrome/i.test( navigator.userAgent );
          
         if(isChrome) {
           $('.txt').css({'padding-top' : '3px','padding-bottom': '1px','font-size':'14px'})          
         }
         $('#arrow').addClass('marrow')
         $('#arrow-up').addClass('marup');
         $('#arrow-down').addClass('marup')
         $('#add-image').css({'width' : '12px','height':'12px'})
       }else {
       	
         if(this.index){
             document.getElementById('space-wrapper').style.display = 'none';           
         } 
       	$('#tile').css('top','2px')
       	$('.msp .msc .msz .mlft .marrow .marup').removeClass(' msp msc msz mlft marrow marup');
         $('#space-wrapper').css({'width' : '324px','height': '22px','left' : -324 + 'px'})
         this.space.el.style.height = '22px';
         
         $('.txt').css({'font-size' : '12px','height' : '18px','vertical-align': 'middle','line-height':'1.2'});
          var isChrome = /chrome/i.test( navigator.userAgent );
          
          if(isChrome) {
            $('.txt').css({'padding-top' : '3px','padding-bottom': '1px','font-size':'14px'})          
          }
          
         
         $('.sp').addClass('dsp');
         $('.sz').addClass('dsz');
         $('.sc').addClass('dsc');     
         $('.lft').addClass('dlft')
         $('#arrow-up').addClass('darup');
         $('#arrow-down').addClass('darup')
         $('#arrow').addClass('darrow')
       }    
    },
    _setPool : function () {
    	 this._marginRight();
    
    },
    
    _start : function(){
        for(var i = 0 ; i < this.events.length ; i++)
    	  this.defineProp(this,this.events[i],new Event(this));    
    },
    _init: function(){ 
       this.inited = true;
     
       this._setMain();
       this._setHeader();
       this._setUploader();
       this._setSpace();           
       this._setPool();
       
       document.getElementById('cgbtn').addEventListener(
                          'click',this._createGallery.bind(this),false);
       document.getElementById('arrow-up').addEventListener(
                          'click',this._arwUp.bind(this),false);
       document.getElementById('arrow-down').addEventListener(
                          'click',this._arwDown.bind(this),false);
       document.getElementById('gback').addEventListener(
                               'click',this._bckGallery.bind(this),false);
       document.getElementById('back-img').addEventListener(
                          'click',this._bckGallery.bind(this),false);
       document.getElementById('gnext').addEventListener(
                           'click',this._nxtGallery.bind(this),false);
       document.getElementById('next-img').addEventListener(
                          'click',this._nxtGallery.bind(this),false);
       document.getElementById('back-reset').addEventListener(
                           'click',this._backReset.bind(this),false);
       document.getElementById('input-label').addEventListener(
                            'click',function () { 
                            	 if($(this).css('left') === '0px'){
                                  $(this).animate({opacity:1,left:"-=100"},400,function () {
                                  	  document.getElementById('input-name').focus();
                                  })                            	 
                            	 }
                            },false);
       document.getElementById('input-create').addEventListener(
                              'click',this._setUpload.bind(this),false);
       document.getElementById('browse').addEventListener(
                               'click',this._browseFile.bind(this),false); 
                  
       document.getElementById('files').addEventListener(
                                'change',this._getInput.bind(this),false); 
       document.getElementById('upload').addEventListener(
                                 'click',this._upload.bind(this),false); 
       document.getElementById('remove').addEventListener(
                                 'click',this._remove.bind(this),false); 
       document.getElementById('set-cover').addEventListener(
                                 'click',this._setCover.bind(this),false); 
       document.getElementById('tile').addEventListener(
                               'click',this._showTile.bind(this),false);
       
    },
    
    _showTile : function(){
      var that = this;      
      var tile = document.getElementById('tile');
      if(tile['up']){
        if(this.windowWidth < this.mainWidth)
         
        $('#tiler').animate({top : '+=155'},400,function(){
            document.getElementById('tile').src = makeUrl('public/arrow/tile.png');    
         tile['up'] = 0; 
         document.getElementById('pool').innerHTML = '';
        })
       else 
        $('#tiler').animate({top : '+=224'},400,function(){
            document.getElementById('tile').src = makeUrl('public/arrow/tile.png');    
         tile['up'] = 0; 
         document.getElementById('pool').innerHTML = '';
        })
       
      }else {
      document.getElementById('pool').innerHTML = '';
      $('#tiler').css('z-index',-200)  ; // I am not sure this is necessary
      if(this.windowWidth < this.mainWidth )             
        $('#tiler').animate({top : '-=155'},400,function(){
           document.getElementById('tile').src = makeUrl('public/arrow/tileback.png');    
           tile['up'] = 1; 
               
           that._showGalleries();
        })  
      else 
         $('#tiler').animate({top : '-=224'},400,function(){
           document.getElementById('tile').src = makeUrl('public/arrow/tileback.png');    
           tile['up'] = 1; 
           
           that._showGalleries();
        })  
      
      }
    	
    }, 
    
    
    _showGalleries : function(){
      var container = document.createElement('div');
     
       document.getElementById('pool').appendChild(container);
       var t = 1;
       for (var i in this.galleries) {
       	 this._addGallery(this.galleries[i][0],t,container,i); 
       	 t++;
       }
    },   
    
    _addGallery : function(thumb,index,container,gallery){      
       var that = this;
    	 var mobile = this.isMobile();
       var templateDownload = document.createElement('div');
       var image = new Image();     
      
       if(mobile){
       	if(thumb.width > thumb.height){
            image.width = this.mobile.width;
            image.height = parseInt(this.mobile.width *(thumb.height/thumb.width));    
        
         }else {
           image.width =parseInt(this.mobile.width * (thumb.width/thumb.height));
           image.height = this.mobile.width;        
         }   
       	
         templateDownload.classList.add('mtemplate-tile') ;
        
         var left = parseInt((100 - image.width )/2) + 'px';  
       }else { 
         templateDownload.classList.add('template-tile') ;
        
        if(thumb.width > thumb.height){
          image.width = this.desktop.width;
          image.height = parseInt(this.desktop.width *(thumb.height/thumb.width));    
        
        }else {
          image.width =parseInt(this.desktop.width * (thumb.width/thumb.height));
          image.height = this.desktop.width;        
        }   
         var left = parseInt((150 - image.width )/2) + 'px';  
       }
       if((index % this.pool.rowCount) == 0)          
         templateDownload.style.marginRight = 0;
       else 
         templateDownload.style.marginRight = this.pool.marginRight  + 'px';    
       templateDownload.setAttribute('name',gallery);
       templateDownload['green'] = 1;                    ///////////          remove this
                             
       image.style.position = 'relative';
       image.style.left = left; 
       
       image.src = makeUrl("image/"+thumb.gallery+"/thumb/"+thumb.src);
      // $(image).addClass('template-green');
       
       image.addEventListener('load',function(){          
           $(templateDownload).animate({opacity: 1},400);           
       })       
             
       templateDownload.addEventListener('click',function(e){
          that.gallery.notify(e);       
       },false)
       templateDownload.appendChild(image);       
       container.appendChild(templateDownload)     
    },
                               
    /*-------------------------------------- View Port ---------------------------------------*/
  
    
    _galleryShow : function(thumb,index,mypool,gallery){  
       var that = this;
    	 var mobile = this.isMobile();
       var templateDownload = document.createElement('div');
       var image = new Image();     
      
       if(mobile){
       	if(thumb.width > thumb.height){
            image.width = this.mobile.width;
            image.height = parseInt(this.mobile.width *(thumb.height/thumb.width));         
         }else {
           image.width =parseInt(this.mobile.width * (thumb.width/thumb.height));
           image.height = this.mobile.width;        
         }   
       	
         templateDownload.classList.add('mtemplate-download') ;
        
         var left = parseInt((100 - image.width )/2) + 'px';  
       }else { 
         templateDownload.classList.add('template-download') ;
        
        if(thumb.width > thumb.height){
          image.width = this.desktop.width;
          image.height = parseInt(this.desktop.width *(thumb.height/thumb.width));    
        
        }else {
          image.width =parseInt(this.desktop.width * (thumb.width/thumb.height));
          image.height = this.desktop.width;        
        }   
         var left = parseInt((150 - image.width )/2) + 'px';  
       }
       if((index % this.pool.rowCount) == 0)          
         templateDownload.style.marginRight = 0;
       else 
         templateDownload.style.marginRight = this.pool.marginRight  + 'px';    
       templateDownload.setAttribute('name',thumb.src);
       templateDownload.setAttribute('index',index-1);
       templateDownload.setAttribute('gallery',gallery);
          
                             
       image.style.position = 'relative';
       image.style.left = left; 
       
       image.src = makeUrl("image/"+thumb.gallery+"/thumb/"+thumb.src);
      // $(image).addClass('template-green');
       
       image.addEventListener('load',function(){          
           $(templateDownload).animate({opacity: 1},400);           
       })
             
       templateDownload.appendChild(image);        
       templateDownload.addEventListener('click',function(e){
           that.showImage.notify(e);
       },false);       
       
       mypool.appendChild(templateDownload)            
    },
    _constructImage : function(index,gallery,upOdown){
    	 var that = this;
    	 that.busy = 1;
    	 var currentMaxZIndex ;
       var div = document.createElement('div');
       div.classList.add('image-view');
       var currentActiveImage = document.getElementsByClassName('active-image');
       
       if(currentActiveImage.length > 0){
       
         //currentMaxZIndex = window.getComputedStyle(currentActiveImage[0],null).getPropertyValue('z-index'); 
          currentMaxZIndex = $(currentActiveImage[0]).css('zIndex'); 
          $(currentActiveImage[0]).animate({opacity : 0.3},400);   
             currentActiveImage[0].classList.remove('active-image'); 
       }
       
       div.classList.add('active-image');
       div.setAttribute('index',index);
       div.setAttribute('gallery',gallery);
       var viewHeight = this._getHeightView();
       div.style.width = this.uploader.view + 'px';
       div.setAttribute('height',viewHeight) ;
       div.style.height = viewHeight + 'px';    
                     
       var imageContainer = document.createElement('div');
       imageContainer.style.width = this.uploader.view + 'px';
       imageContainer.style.height = (viewHeight-10) + 'px';
       imageContainer.style.marginTop = 10 + 'px';
       //imageContainer.style.position = 'absolute'
       div.appendChild(imageContainer);     
       
       var height = this.galleries[gallery][index].height;
       var width = this.galleries[gallery][index].width;
       var url = 'image/' + gallery + '/' + this.galleries[gallery][index].src;            
       var prevUrl = 'preview/'+gallery + '/' + this.galleries[gallery][index].src;
       
       var image = document.createElement('img');
       image.classList.add('pimage');
       image['gallery'] = gallery;
       image['url'] = this.galleries[gallery][index].src;
       image.style.position = 'relative';       
       imageContainer.appendChild(image);       
       var longWidth = this.uploader.view;
       
       if(this.isMobile()){
         if(width > height){
            if(width > this.uploader.view){
               image.width = this.uploader.view;
               image.height = parseInt(longWidth *(height/width));
               image.style.top = 0;
              // image.style.top = parseInt(-(viewHeight - image.height)/2) + 'px';            
            }else {               
               image.width = this.uploader.view;
               image.height = parseInt(longWidth *(height/width));
             //  image.style.top = parseInt(-(viewHeight - image.height)/2) + 'px';  
             image.style.top = 0;          
            }         
         }else {
            if(height > viewHeight){
               image.height = viewHeight ;
               image.width = parseInt(viewHeight * (width/height))
               image.style.left = parseInt((this.uploader.view-image.width)/2) + 'px';
            }else{
                image.height = viewHeight ;
               image.width = parseInt(viewHeight * (width/height))
               image.style.left = parseInt((this.uploader.view-image.width)/2) + 'px';
            }
         }       
       }else {
          if(width > height){
            if(width > this.uploader.view){
               image.width = this.uploader.view;
               image.height = parseInt(longWidth *(height/width)); 
              // image.style.top = parseInt(-(viewHeight - image.height)/2) + 'px';
              image.style.top = 0;
            }else {
               
               image.width = this.uploader.view;
               image.height = parseInt(longWidth *(height/width));
               //image.style.top = parseInt(-(viewHeight - image.height)/2) + 'px';
               image.style.top = 0;
            }         
         }else {
            if(height > viewHeight){
               image.height = viewHeight ;
               image.width = parseInt(viewHeight * (width/height))
               image.style.left = parseInt((this.uploader.view-image.width)/2) + 'px';
            }else{
               image.height = viewHeight ;
               image.width = parseInt(viewHeight * (width/height))
               image.style.left = parseInt((this.uploader.view-image.width)/2) + 'px';
            }
         }       
       }
       
       image.src = makeUrl(url);       
       image.style.opacity = 0;
       image.addEventListener('load',function(){
       	 that.busy = 0;
       	 if(upOdown == null){
            $(this).animate({opacity : 1},400);       	 
       	 }else {
            this.style.opacity =1;       	 
       	 }
       	 
          that._upOrDown(upOdown,currentMaxZIndex);
       })                 
      
       document.getElementById('pool').appendChild(div); 
       window.history.pushState(null,null,"/"+prevUrl);
       
    },    
    
    _showImage : function(e,a,b){ 
    	 var that = this;
    	 var index,gallery;
    	 if(a == null || b== null){
    	    var elem = e.target;
          var index = elem.parentElement.getAttribute('index');
         var gallery = elem.parentElement.getAttribute('gallery');
    	 }else{    	 	 
    	 	 for(var i = 0 ; i < this.galleries[a].length ; i++)
    	 	   if (this.galleries[a][i].src == b) index = i;           
          gallery = a;
    	 }
    	 
    	 this.indexOfSlide = index;
    	 
    	 this._constructImage(index,gallery,null);
    	 
    	
    	      
       if(document.getElementsByClassName('back-sign')[0])
          document.getElementsByClassName('back-sign')[0].style.display = 'none';  // add id to it
       
       var setting = document.createElement('div');
       setting.classList.add('setting','showImage');
        var imgSetting = document.createElement('img');
       imgSetting.src = makeUrl('public/arrow/setting.png');     
       setting.appendChild(imgSetting);       
       var closeSign = document.createElement('div');
       closeSign.classList.add('close-sign','showImage');   
      
       var closeImage = document.createElement('img');
       closeImage.src = makeUrl('public/arrow/close.png');
       
       var txt = document.createElement('div');
       txt.classList.add("txtpng",'showImage');
       
       var txtpng = document.createElement('img');
       let txtXwar = document.createElement('img');
       let txtJur = document.createElement('img');
       
       txtXwar.classList.add('txtXwar');
       txtJur.classList.add('txtJur');
       
       txtXwar.src = makeUrl('public/arrow/xwar.png');
       txtJur.src = makeUrl('public/arrow/jur.png');
       
       txtJur.style.left = -5 + 'px';
       txtXwar.style.right = -5 + 'px';
       
       
       txtpng.src =makeUrl('public/arrow/txt.png');
       txtpng.setAttribute('id','txtpng');
       txt.append(txtpng);
       txt.append(txtJur);
       txt.append(txtXwar);
       
       txt.style.opacity = 0.5;
       
              
       closeSign.append(closeImage)
       this.header.el.append(closeSign)
       this.header.el.appendChild(setting)
       this.header.el.appendChild(txt);
       
       $(txt).hover(function(){
       	  closeSign.style.opacity = 0.2;
       	  setting.style.opacity = 0.2;
       	  this.style.opacity = 1;
       	  var uppng = document.createElement('img');
       	  var downpng = document.createElement('img');
       	  //this.innerHTML = "text"
       	  uppng.id = 'uppng';
       	  downpng.id = 'downpng';
       	  //this.appendChild(uppng)
       	  //this.appendChild(downpng)
       	  uppng.src = makeUrl('public/arrow/up.png');
       	  downpng.src = makeUrl('public/arrow/down.png');
       	  
       	  $(txtJur).animate({left : "-=100"},400);
       	  $(txtXwar).animate({right : "-=100"},400)      	  
       	  $(this).unbind('mouseover mouseenter mouseleave')
           //document.getElementById('txtpng').src = makeUrl('public/arrow/text1.png');     
           txtJur.addEventListener('click',function(){
              if(that.galleries[gallery].length > (that.indexOfSlide +1) && !that.busy){                              
                that._constructImage(++that.indexOfSlide,gallery,'up');                
              }
           })
                      
           txtXwar.addEventListener('click',function(){
              if((that.indexOfSlide-1) > -1  && !that.busy){
                 that._constructImage(--that.indexOfSlide,gallery,'down')              
              }
           })          
             
       })      

       closeSign.addEventListener('click',function(){
       	 window.history.back()
          this.remove();
          $('.image-view').remove();
          if(document.getElementsByClassName('back-sign')[0])
             document.getElementsByClassName('back-sign')[0].style.display = 'block'; 
          setting.remove();    
          document.getElementsByClassName('txtpng')[0].remove();
          if(that.slideShow)
            that._forSlideShow(that);                                  
       },false)
       
       setting.addEventListener('click',function () {
       	 that._createMenu(that);
       })
       
       this._showText(gallery,index);   
    },
    
    
    _upOrDown : function(upOdown,zIndex){
       var activeElement = document.getElementsByClassName('active-image')[0];
       activeElement.style.zIndex = parseInt(zIndex) + 1; 
       var height = activeElement.getAttribute('height');
      
       if(upOdown == "up"){
         activeElement.style.top = (height) + "px";
        $(activeElement).animate({top : "-="+(height)},400);
       }else if(upOdown == 'down') {
       	activeElement.style.top = (-height) +'px';
       	$(activeElement).animate({top : "+="+(height)},400)
       }
       
    },
    
    _showText : function(gal,i){ 
       var txt = document.createElement("div");
       var container = document.getElementsByClassName('image-view')[0];
       if(typeof(this.galleries[gal][i].text ) !== 'undefined')
        txt.innerHTML = this.galleries[gal][i].text;
       
       txt.id = "txt";        
       txt.classList.add('text-ovrlay');
       
       var style = window.getComputedStyle(container);
       var var1 = style.getPropertyValue('width');
       var var2 = style.getPropertyValue('height');     
       //input.width = parseInt(var1.substr(0,var1.length-2));
       //input.height = parseInt(var2.substr(0,var2.length-2)) ;
       txt.style.width = var1;
       txt.style.height =var2;
       
       container.append(txt);
    },
    
    _createMenu : function(t){    	
    	if(document.getElementsByClassName('text-desc').length)
    	   document.getElementsByClassName('text-desc')[0].remove();
    	var that = t;
      var menu = document.createElement('div');      
      menu.classList.add('menu');
      var thumbview = document.getElementsByClassName('image-view')[0];
      var menuHtml = "<div class='mn'></div><div class='mn'>set cover</div><div class='mn'>text</div><div class='mn'>filters</div><div class='mn'>location</div><div class='mn'>share</div>";     
      
      menu.innerHTML = menuHtml;     
    
      thumbview.append(menu);
      var childs = menu.childNodes;
      for(var i = 0 ; i < childs.length ; i++){
            childs[i].setAttribute('id',this.menu[i]);  
            childs[i].addEventListener('click',function (e) {
            	that._menuHandler.bind(that)(e);            	
         })            
      }    
    }, 
    
    _menuHandler : function(e){
      var elem = e.target; 
     
      switch(elem.id){
         case this.menu[0]:
           this._dirHandler();
           break;
         case this.menu[1]:
           this._coverHandler();
           break;
         case this.menu[2]:
           this._textHandler.apply(this);
           break;
          case this.menu[3]:
           this._filterHandler();
           break;
          case this.menu[4]:
           this._locationHandler();
           break;
          case this.menu[5]:
           this._shareHandler();
           break;
          default:
           break;     
      }
      
    },
    
    _filterHandler : function(){alert("filter")},
    _dirHandler : function () {
    	alert("dir");
    },
    _coverHandler : function(){alert("cover")},
    _textHandler : function () {
    	 var that = this;
    	 document.getElementsByClassName('menu')[0].remove();
    	 var container = document.getElementsByClassName('image-view')[0];
       var input = document.createElement("div");
       input.setAttribute('contenteditable','true');
       
       var gal = container.getAttribute('gallery');
       var index = container.getAttribute('index');
      
     
       
       if(this.galleries[gal][index].text !== undefined ){ 
       	   document.getElementById('txt').remove();
           input.innerHTML = this.galleries[gal][index].text;
           
       } else      
         input.innerHTML = 'Type here';
       
       input.id = "Editor";        
       input.classList.add('text-desc');
       
       var style = window.getComputedStyle(container);
       var var1 = style.getPropertyValue('width');
       var var2 = style.getPropertyValue('height');     
       //input.width = parseInt(var1.substr(0,var1.length-2));
       //input.height = parseInt(var2.substr(0,var2.length-2)) ;
       input.style.width = var1;
       input.style.height =var2;
     
       container.append(input);  
       this._adminText();      
   },
    
    _adminText : function(){        
      var showImage = document.getElementsByClassName('showImage');
      for(var i = 0 ; i < showImage.length ; i++)
        showImage[i].style.display = 'none';   
         
      var html = '',
		template = '<span class="xbt-edit"><code class="btn-xs %btnClass%" title="%desc%" onmousedown="event.preventDefault();" onclick="doCommand(\'%cmd%\')"><i class="%iconClass%"></i> %cmd%</code></span>';
   	commands.map(function(command, i) {
		commandRelation[command.cmd] = command;
		var temp = template;
		temp = temp.replace(/%iconClass%/gi, icon(command));
		temp = temp.replace(/%desc%/gi, command.desc);
		temp = temp.replace(/%btnClass%/gi, supported(command));
		temp = temp.replace(/%cmd%/gi, command.cmd);
		html+=temp;
	  });
	  
	  var editor = document.createElement('div');
	  var style = window.getComputedStyle(this.header.el);	
	  var height = style.getPropertyValue('height');
     editor.style.height = height;
     editor.setAttribute('id','t-editor');
     
     var mainEditorContainer = document.createElement('div');
     mainEditorContainer.setAttribute('id','mec');
     mainEditorContainer.style.height = height;
          
     editor.innerHTML = html;
     var bnext = document.createElement('div');
     bnext.setAttribute('id','bnextEditor');
     var nextBack = "<span id='bckeditor'><img class='edimg' src=" + makeUrl('public/arrow/hbck.png') + "></span><span id='nxteditor'><img class='edimg' src='public/arrow/hnxt.png'></span>";
     var saveExit = "<span id='save'>Save</span><span id='exit'>Exit<span/>";
     var svit = document.createElement('div');
     svit.setAttribute('id','saveExit');
     svit.innerHTML = saveExit;     
     var nbholder = document.createElement('div');
     nbholder.setAttribute('id','nbholder');
     nbholder.innerHTML = nextBack;
     this.header.el.appendChild(nbholder);
     this.header.el.appendChild(editor);  
   
     this.header.el.appendChild(svit)
     
     document.getElementById('bckeditor').addEventListener('click',this._editorBack)
     document.getElementById('nxteditor').addEventListener('click',this._editorForward);
     document.getElementById('save').addEventListener('click',this._saveContent)
     document.getElementById('exit').addEventListener('click',this._exitContent)    
    },
    
    _exitContent : function(){
    
    },
    _saveContent : function(){
       var editor = document.getElementById('Editor');
       var img = document.getElementsByClassName('pimage')[0];
       var index = document.getElementsByClassName('image-view')[0];
       var i = index.getAttribute('index');
       alert(index)
       var obj = {gallery : img['gallery'],src : img['url'],text : editor.innerHTML};
       var xhr = new XMLHttpRequest();
      	xhr.open('post','/text');
      	xhr.onreadystatechange = function(){
            if(this.readyState == 4){
               //do something to show it has saved      
            }      	
      	}
         xhr.setRequestHeader('Content-Type','application/json');    	
      	xhr.send(JSON.stringify(obj));
       
    },
    
    _editorForward : function(){
    	  var editor = document.getElementById('t-editor');
        var style = window.getComputedStyle(editor);
        var width = style.getPropertyValue('width')
        var left = style.getPropertyValue('left');
       
        $('#t-editor').animate({left : '+=60'},200,function(){})
    },
    
    _editorBack : function(){
    	  var editor = document.getElementById('t-editor');
         var style = window.getComputedStyle(editor);
        var width = style.getPropertyValue('width');
        var left = style.getPropertyValue('left');
       
        $('#t-editor').animate({left : '-=60'},200,function(){})
    },
    _locationHandler : function(){alert("location")},
    _shareHandler  : function(){alert("shareHandler")},
    
    _backMenu : function (elem) {
    	  alert(elem.id)
    },
    
    _showSelection : function(){
        var textComponent = document.getElementById('Editor');
        var selectedText;

       if (textComponent.selectionStart !== undefined)
       {// Standards Compliant Version
         var startPos = textComponent.selectionStart;
         var endPos = textComponent.selectionEnd;
         selectedText = textComponent.value.substring(startPos, endPos);
       }
        else if (document.selection !== undefined)
       {// IE Version
         textComponent.focus();
         var sel = document.selection.createRange();
         selectedText = sel.text;
       }

       alert("You selected: " + selectedText);
    },
    
    _forSlideShow : function(that){ 
      if(that.isMobile()){
          $('#tiler').animate({top  : '+=155'},400,function(){
        	 this.style.zIndex=200;        
          document.getElementById('cgbtn').style.display = 'block';
          document.getElementById('homeback').style.display = 'block';
          document.getElementById('tile').src = makeUrl('public/arrow/tile.png');  
          that.slideShow = 0;
          var tile = document.getElementById('tile');
          tile['up'] = 0;           
        });        
      }else{
          $('#tiler').animate({top  : '+=224'},400,function(){
        	 this.style.zIndex=200;        
          document.getElementById('cgbtn').style.display = 'block';
          document.getElementById('homeback').style.display = 'block';
          document.getElementById('tile').src = makeUrl('public/arrow/tile.png');  
          that.slideShow = 0;
          var tile = document.getElementById('tile');
          tile['up'] = 0;           
        });            
      }
      
     
       
    },    
    
    _showImages : function(e,gal){
    	 var gallery,elem;
       var that = this;    	
    	 if(gal == null){
    	   elem = e.target;
         gallery =  elem.parentElement.getAttribute('name');
    	 }else{
    	  gallery = gal; 
    	 }
       
       if(document.getElementById('thumbview'))
       document.getElementsByClassName('thumbview')[0].remove();
       var mobile = this.isMobile();       
       var div = document.createElement('div');
       
       div.classList.add('thumbview');
       var pool = document.getElementById('pool');
       
       div.style.width = this.uploader.view + 'px';
       div.style.height = this._getHeightView() + 'px';
       div.style.left = -(this.uploader.view) + 'px';
       
       document.getElementById('homeback').style.display = 'none';
       document.getElementById('cgbtn').style.display = 'none';
       
       
       var backSign = document.createElement('div');  //        add id to it 
       backSign.classList.add('back-sign');
       
       var image = new Image();
       
       image.src = makeUrl('public/arrow/home.png');
       backSign.appendChild(image);
       
       backSign.addEventListener('click',function(){
       	 this.remove();
          document.getElementById('homeback').style.display = 'block';
          document.getElementById('cgbtn').style.display = 'block';
        if(gal != null)
           that._forSlideShow(that);
          $(div).animate({left : '-=' + that.uploader.view},400)
          
       },false)
       
       
      if(mobile)
         backSign.classList.add('mback-sign');
      else
        backSign.classList.add('dback-sign'); 
        this.header.el.append(backSign); 
       
      var arr = this.galleries[gallery];
      for(var i=0 ; i < arr.length ; i++){
         this._galleryShow(arr[i],i+1,div,gallery);      
      }       
       
      pool.appendChild(div);
       
      $(div).animate({left : '+=' + this.uploader.view},400)
      window.history.pushState(null,null,'/'+gallery+'/'+'images');
    },
    
    
    _getHeightView : function(){
    	   var header = 0;
    	   var height = 0;
        if(this.isMobile()){
            header  = this.header.height + this.main.mobile.top;   
            height = this.windowHeight - header;  
        }else {
            header = this.header.height + this.main.desktop.top;
            height = this.windowHeight - header;
          
        } 
        
        return height;   
    },
    _upload : function () { 
    	 this.upload.notify(this.queue)
    },
    _remove : function(){  // not supported by IE
        var that = this;
        if(this.isMobile()){
           $('.mtemplate-upload').filter(function(index){ 
              return this['green'] == 0;
           }).animate({opacity : 0},400,function(){
           	  that._removeFromPool({src : this['name']});
              this.remove();                   
           })        
        }else {
           $('.template-upload').filter(function(index){
               return this['green'] == 0 ;                         
           }).animate({opacity : 0},400,function(){
               that._removeFromPool({src : this['name']});               
               this.remove();           
           })
        }
        
        this.remove.notify(this.removedDownload)    
    },
    _setCover : function(){},
    _createGallery : function(){
    	 var isChrome = /chrome/i.test( navigator.userAgent );
    	 this.uploader.position = 0;
    	 $('#uploader').css('left',0)
       var input = document.getElementById('input');
       var label = document.getElementById('input-label');
       document.getElementById('input-name').value = "";
       if( $(label).css('left') === '-100px')          
          $(label).css('left',0).css('opacity',0.25) ;     
       document.getElementById('homeback').style.display = 'none'
       document.getElementById('arrow').style.display = 'none';
       document.getElementById('cgbtn').style.display = 'none';
       document.getElementById('back-next').style.display = 'none';
       document.getElementById('back-reset').style.display = "block";    
       document.getElementById('galback').style.display = 'none';
       
       var tile = document.getElementById('tile');
       if(tile && tile['up']){
                  if(this.windowWidth < this.mainWidth)
         
        $('#tiler').animate({top : '+=155'},400,function(){
            document.getElementById('tile').src = makeUrl('public/arrow/tile.png');    
         tile['up'] = 0; 
         document.getElementById('pool').innerHTML = '';
        })
       else 
        $('#tiler').animate({top : '+=224'},400,function(){
            document.getElementById('tile').src = makeUrl('public/arrow/tile.png');    
         tile['up'] = 0; 
         document.getElementById('pool').innerHTML = '';
        }) 
       }       
       
       $('.dtemplate-gallery').remove()
       $('.template-download').remove();
       $('.dtemplate-download').remove();
       $('.mtemplate-download').remove();
       $('.mtemplate-gallery').remove();
       if($(document).width()> 900){
       	$('#back-reset').removeClass('mbreset');
         $('#back-reset').addClass('dbreset');
         $('#input-label').addClass('dinlabel');
         $('#input-name').addClass('dinname');
         $('#input-create').addClass('dincreate')
         input.style.width = '216px';
         if(isChrome){
          $('#input-create').css({'padding-top' : '4px','font-stretch' : 'expanded','letter-spacing' : '1px'})
              
         }else { 
               
         }
         input.style.top = "70px";    
         input.style.left ='410px'
       }else {
       	
       	$('#back-reset').removeClass('dbreset');
       	$('#back-reset').addClass('mbreset');
       	$('#input-label').addClass('minlabel');
         $('#input-name').addClass('minname');
         $('#input-create').addClass('mincreate')
         var winsize = $(document).width();       
         
         input.style.top = '60px';
         input.style.width = '175px';
          
           
         if(isChrome){
            $('#back-reset').css({'font-size':'14px','padding-top':'2px'})   
            $('#back-next').css({'top':'12px'})        
            $('#input-create').css({'font-size' : '14px' ,'padding-top' : '4px','font-stretch' : 'expanded','letter-spacing' : '1px'})
            $('#input-label').css({'font-size' : '14px'})
         }
           
         var lft = parseInt((this.windowWidth -275)/2);
         input.style.left = lft + 100+ 'px';
       }       
       
       input.style.display = 'block';       
       label.style.display = 'block';
     
     
      // this.createGallery.notify("I have been clicked");    
    }, 
   
    
    _bckGallery : function(){
        var that = this;
        var howMuch = this._howMuchToSlide(false);
        if( this.uploader.busy || !howMuch) return;
        this.uploader.busy = 1; 
       
    	  if(this.isMobile()){
    	  	       
         $('#uploader').animate({left : "-=" + howMuch},1000,function(){
             that.uploader.position -= howMuch;
             that.uploader.busy = 0;
         })
       }else { $()
         
         $('#uploader').animate({left : "-=" + howMuch},1000,function(){
                 that.uploader.position -= howMuch;
                that.uploader.busy = 0;        
         })
       } 	
       this.bckGallery.notify("back Gallery has been clicked");    
    },
    
    _howMuchToSlide : function(direction){
       if(this.isMobile()){
       	 var unit = this.mobile.width + this.mobile.margin;
          if(direction){
              if(Math.abs(this.uploader.position) > 2*unit)    
                return 2*unit;
              else if(Math.abs(this.uploader.position) = unit)
                return unit; 
              else 
                return Math.abs(this.uploader.position)    
          }else {             
             var newLength = this.uploader.mobile + this.uploader.position
             var left = newLength - this.uploader.view;
             if(left > 2*unit)              
                 return 2*unit;
             else if(left > unit)
                 return unit;
             else 
                 return 0;
          }       
       }else {
          var unit = this.desktop.width + this.desktop.margin;
          if(direction){
              if(Math.abs(this.uploader.position) >= 2*unit)    
                return 2*unit;
              else if(Math.abs(this.uploader.position) == unit)
                return unit;    
               else 
                 return Math.abs(this.uploader.position); 
          }else {             
             var newLength = this.uploader.desktop + this.uploader.position
             var left = newLength - this.uploader.view;
             if(left >= 2*unit)              
                 return 2*unit;
             else if(left >= unit)
                 return unit;
             else 
                 return left;
          }         
       }
    },
    
    _nxtGallery : function(){   
       var that = this;
       var howMuch = this._howMuchToSlide(true);
       if(this.uploader.busy || !howMuch ) return;
        this.uploader.busy = 1;
       if(this.isMobile()){
         
         $('#uploader').animate({left : "+=" + howMuch},1000,function(){
               that.uploader.position += howMuch;
               that.uploader.busy = 0;         
         })
       }else {
       	  
            $('#uploader').animate({left : "+=" + howMuch},1000,function(){
                 that.uploader.position += howMuch;
                that.uploader.busy = 0;       
                
            })
       } 	 
       this.nxtGallery.notify("next gallery has been clicked");    
    },
    
    _arwUp : function(){
       this.arwUp.notify("arw Up gallery is clicked")    
    },
    
    _arwDown : function(){
       this.arwDown.notify("arw Down has been clicked");    
    },
    
    _backReset : function(){
      document.getElementById('input').style.display = 'none';
      document.getElementById('back-reset').style.display = 'none';
      document.getElementById('back-next').style.display = 'none';       // TODO add class to do this all
      document.getElementById('cgbtn').style.display = 'block';    
      document.getElementById('arrow').style.display = 'block'; 
      document.getElementById('homeback').style.display = 'block';
      $('.template-upload').remove();
      $('.mtemplate-upload').remove();
      $('.mtemplate-gallery').remove();
     
      $('.dtemplate-gallery').remove();
      document.getElementById('pool').innerHTML = '';
      if(this.isMobile()){
         document.getElementById('space-wrapper').style.left ='-277px';      
      }else {
         document.getElementById('space-wrapper').style.left = '-324px';
      }
      document.getElementById('space-wrapper').style.display = 'none';
      document.getElementById('galback').style.display = 'block';
      this._galleries();
      
    },
    
     _galleries () {
     	var that = this;
      	var xhr = new XMLHttpRequest();
      	xhr.open('GET','/index');
      	xhr.onreadystatechange = function(){
            if(this.readyState == 4){
               that.loadGalleries(xhr.responseText);            
            }      	
      	}
      	     	
      	xhr.send();
   },
   
    _browseFile : function(){
      $('#files').trigger('click');
    },
    
    _setUpload  :function () {
    	 this.galleryName = document.getElementById('input-name').value;      // TODO regex for gallery name
    	 document.getElementById('input').style.display = 'none';
    	 document.getElementById('arrow').style.display = 'block';
    	 document.getElementById('back-next').style.display = 'block';
    	 document.getElementById('space-wrapper').style.display = 'block';
    	 var mobile = this.isMobile();
       if(mobile)
    	   $('#space-wrapper').animate({left : "+=277"},1000);
    	 else 
    	   $('#space-wrapper').animate({left : "+=324"},1000);
    	  $('.space--remove-text').hover(function(){
        	    $(this).css('color','tomato');
            $('.space--remove').css('background-color','gray');        
        },function(){
             $('.space--remove').css('background-color','tomato');
             $(this).css('color','gray');      
        })
        
        $('.space--upload-text').hover(function(){
             $('.space--upload').css('background-color','gray');
             $(this).css('color','green') ;    
        },function(){
             $('.space--upload').css('background-color','green');
             $(this).css('color','gray');        
        })  
    },
    
    _getInput : function(e){
    	 var that = e.target;    
       var files = that.files;
       for(var i = 0 ; i < files.length ; i++){
         var file = files[i];
         this._getOrientation(file,this._getImages,this)
        //this._getImages(file)      
       }
    },
    
    _getImages : function(file,that,orientation){     	   
         if(orientation == -1 || orientation == -2) return;    	   	   
    	   that.orientation = orientation;
    	  
         var reader = new FileReader();
         reader.addEventListener('load',function(){
             var image = new Image();
             image.name = file.name; 
             that.files.push(file);
             image.addEventListener('load',that._renderTemplate.bind(that),false);                  
             image.src = reader.result;
         })
         
        reader.readAsDataURL(file); 
    },
    
    _getOrientation : function(file,callback,that){ 
         var reader = new FileReader();
         reader.onload = function(e) { 

           var view = new DataView(e.target.result);
         
           if (view.getUint16(0, false) != 0xFFD8) return callback(file,that,-2); 
           var length = view.byteLength, offset = 2;
           while (offset < length) {
             var marker = view.getUint16(offset, false);
             offset += 2;
            if (marker == 0xFFE1) {
              if (view.getUint32(offset += 2, false) != 0x45786966) return callback(file,that,-1);
              var little = view.getUint16(offset += 6, false) == 0x4949; 
              offset += view.getUint32(offset + 4, little);
              var tags = view.getUint16(offset, little);
              offset += 2;
            
             for (var i = 0; i < tags; i++)
               if (view.getUint16(offset + (i * 12), little) == 0x0112){
               
                that.fileName.push({"name" : file.name , "value" :  view.getUint16(offset + (i * 12) + 8, little)})
                return callback(file,that,view.getUint16(offset + (i * 12) + 8, little));
                 
             }
          }
         else if ((marker & 0xFF00) != 0xFF00) break;
         else offset += view.getUint16(offset, false);
       }
       
       return callback(file,that,-1);
      };
      
      reader.readAsArrayBuffer(file);
    },
    _renderGallery : function(img){
      var that = this;    
    	var mobile = this.isMobile();
      var image = new Image();
      var templateGallery = document.createElement('div');
      var gallery = document.createElement('div');
      var preview= document.createElement('div');
      var label = document.createElement('div');
         
      if(mobile){
      	   	
        if(img.width > img.height){
          image.width = this.mobile.width;
          image.height = parseInt(this.mobile.width *(img.height/img.width));    
        }else {
          image.width =parseInt(this.mobile.width * (img.width/img.height));
          image.height = this.mobile.width;        
        }     	
          var marginLeft = parseInt((this.mobile.width-image.width)/2);
          var marginTop = parseInt((this.mobile.width-image.height)/2);
          image.style.position = 'relative';      
          image.style.top = marginTop + 'px';       
          image.style.left = marginLeft + 'px';
          
          preview.classList.add('mpreview');
          templateGallery.classList.add('mtemplate-gallery'); 
          label.classList.add('mgallery-name'); 
          
       }else {
       	
       if(img.width > img.height){
           image.width = this.desktop.width;
           image.height = parseInt(this.desktop.width *(img.height/img.width));            
       }else {
         image.width =parseInt(this.desktop.width * (img.width/img.height));
         image.height = this.desktop.width;        
       }
          var marginLeft = parseInt((this.desktop.width-image.width)/2);
          var marginTop = parseInt((this.desktop.width-image.height)/2);
          image.style.position = 'relative';      
          image.style.top = marginTop + 'px';       
          image.style.left = marginLeft + 'px';
             
          preview.classList.add('preview'); 
          templateGallery.classList.add('dtemplate-gallery'); 
           label.classList.add('gallery-name')
       }
       
       label.innerHTML = img.gallery;  
       image.src = makeUrl('image/' + img.gallery + '/thumb/'+img.src);
       
       preview.appendChild(image) ; 
       templateGallery.setAttribute('name',img.gallery); 
      
       templateGallery.appendChild(preview); 
       templateGallery.appendChild(label); 
      
       image.onload = function(){          
         $(templateGallery).animate({opacity : 1},400);
       }
       that._uploader(true);
       that.uploader.el.appendChild(templateGallery);
        templateGallery.addEventListener('click',function(){ 
           that._fullPool(img.gallery);       
       },false)
      
    },
    _renderTemplate : function(e){ 
    	 var image = e.target
    	 var width = image.width;
    	 var height = image.height;     
    	 var that = this;   
       var orientation = -1; 
       var mobile = this.isMobile();
       for(var i = 0 ; i < this.fileName.length ; i++){          
           if(this.fileName[i].name == image.name){
           orientation = this.fileName[i].value;
           break;
         }          
       }       
    	  	 
    	 if(orientation < 0 && orientation > 9) return;  // TODO error invalid orientation -1,-2 is not valid 
    	  	     	 
       var templateUpload = document.createElement("div");
       var preview = document.createElement('div');
       var canvas = document.createElement('canvas');
       
       var ctx = canvas.getContext('2d');
       
       if (4 < orientation && orientation < 9) {      	         	  
       	  
       	  if(width > height ){
       	  	 if(mobile){
       	  	    height = parseInt(100*(height/width))
                width = 100;       
       	  	 }else {
       	  	    height = parseInt(150*(height/width))
                width = 150;       
       	  	 }
             	  
       	  }else{
       	  	  if(mobile){
       	  	      width = parseInt(100 * (width / height));
       	         height = 100;          
       	  	  }else {
       	  	     width = parseInt(150 * (width / height));
       	        height = 150;          
       	  	  }
       	    	     
       	  }            	 
           
           canvas.width = height;
           canvas.height = width;
                               
       } else {    
             
       	  if(width > height ){
       	  	if(mobile){
       	  	  height = parseInt(100*(height/width))
              width = 100;    
       	  	}else {
       	  	  height = parseInt(150*(height/width))
              width = 150;    
       	  	}
                 	  
       	  }else{       	  	
       	  	  if(mobile){
       	  	    width = parseInt(100 * (width / height));
       	       height = 100;      	
       	  	  }else {
       	  	    width = parseInt(150 * (width / height));
       	       height = 150;      	
       	  	  }       	          
       	  } 	  
                     	  
           canvas.width = width;         
           canvas.height = height;               
       }     
        
       image.width = width;
       image.height = height;
            
       if(mobile){
          var marginLeft = parseInt((100-canvas.width)/2);
          var marginTop = parseInt((100-canvas.height)/2);
          canvas.style.position = 'relative';      
          canvas.style.top = marginTop + 'px';       
          canvas.style.left = marginLeft + 'px';
       }else {
          var marginLeft = parseInt((150-canvas.width)/2);
          var marginTop = parseInt((150-canvas.height)/2);
          canvas.style.position = 'relative';      
          canvas.style.top = marginTop + 'px';       
          canvas.style.left = marginLeft + 'px';
       }
             
       switch (orientation) {
         case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
         case 3: ctx.transform(-1, 0, 0, -1, width, height ); break;
         case 4: ctx.transform(1, 0, 0, -1, 0, height ); break;
         case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
         case 6: ctx.transform(0, 1, -1, 0, height , 0); break;
         case 7: ctx.transform(0, -1, -1, 0, height , width); break;
         case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
         default: break;
       }      
       
       if(mobile){
           preview.classList.add('mpreview');
           templateUpload.classList.add('mtemplate-upload')                
       }else {
           preview.classList.add('preview');
           templateUpload.classList.add('template-upload')
       }
     
       ctx.drawImage(image,0,0,image.width,image.height);
       preview.appendChild(canvas);      
       
      
       canvas.style.borderBottom = "3px solid green";
       canvas['green'] = 1;
       canvas['name'] = image.name;
       templateUpload['green'] = 1;
       templateUpload.setAttribute('name',image.name);
       that._addToQueue(image.name);
      
       $(canvas).hover(function(){
       	  if(this['green'] == 1){
       	      canvas.style.borderBottom = "3px solid tomato"
       	  }else {
               canvas.style.borderBottom = "3px solid green";              	  
       	  }           
               
       },function(){
       	  if(canvas['green'] == 1){
       	      canvas.style.borderBottom = "3px solid green"
       	  }else {
               canvas.style.borderBottom = "3px solid tomato";              	  
       	  }   
               
       })
       
       canvas.addEventListener('click',function(){
          if(this['green'] == 1){
             this['green'] = 0;
             templateUpload['green'] = 0;
             that._removeFromQueue(this['name']);
             this.style.borderBottom = "3px solid tomato";
          }else{
              this['green'] = 1;
              templateUpload['green'] = 1;
              that._addToQueue(this['name']);
              this.style.borderBottom = "3px solid green";
          } 
           	
                 
       },false)       
       
       var progressbar = document.createElement('canvas');
       $(progressbar).addClass('progressbar');
       if(mobile){
           progressbar.width = 100;
           progressbar.height = 23;
       }else {
          progressbar.width = 150;
          progressbar.height = 25;
       }
      
       
       templateUpload.appendChild(preview);
       templateUpload.appendChild(progressbar);

       this._uploader(true);
       this.uploader.el.appendChild(templateUpload);
       $(templateUpload).animate({opacity : 1},400);
    },
    
    _removeFromQueue : function(name){ 
       var index = this.queue.indexOf(name); 
       if(index > -1) {
       	 this.queue.splice(index,1);           
       }     
    },
    
    _addToQueue : function(name){    	 
       this.queue.push(name);  
    },
    
    _progress : function(progress){
           var canvas ;    
           if(this.isMobile())           
              canvas = $(".mtemplate-upload[name='" + progress.name + "']").find('.progressbar')[0];
           else 
               canvas = $(".template-upload[name='" + progress.name + "']").find('.progressbar')[0];
           var prog = progress.recived/progress.expected; 
           var x = Math.floor(canvas.width/2);
           var y = Math.floor(canvas.height/2); 
           var context = canvas.getContext('2d');  
           var radius = 10 * Math.sqrt(prog) ; 
           
           if(canvas.hasOwnProperty('progressing')){
             context.beginPath();            
             context.arc(parseInt(x),parseInt(y),radius.toFixed(2),0,Math.PI * 2,true);
             context.closePath()             
             context.fillStyle = 'green';
             context.fill();                  
           }else if(!canvas.hasOwnProperty('progressing')){             
             canvas['progressing'] = '1';
             context.beginPath();              
             context.arc(parseInt(x),parseInt(y),10,0,Math.PI * 2,true);
             context.closePath();   
             context.fillStyle = 'lightgray';
             context.fill(); 
            }
          
    },
    
    _clearUploadTemplate : function () {
    	
    },
    
    _recalculateMargin : function(){ 
       var mobile = this.isMobile();
       var rows = this.pool.rowCount;
       
       if(mobile){
         var num = document.getElementsByClassName('mtemplate-download');         
         for(var i = 1 ; i < num.length + 1 ; i++){ 
           if(i%rows == 0) num[i-1].style.marginRight = 0;
           else num[i-1].style.marginRight = this.pool.marginRight + 'px';        
         }
                 
       }else {
         var num = document.getElementsByClassName('template-download');
         
         for(var i = 1 ; i < num.length+1 ; i++)
           if((i%rows == 0) )num[i-1].style.marginRight = 0;
           else num[i-1].style.marginRight = this.pool.marginRight + 'px';
       }
      
    },
     /*--------------------------------- This can be reduced -----------------------------------------*/
    _marginRight : function(){              
      var mobile = this.isMobile() ; 
      var viewPort = this.uploader.view;
            
      if(mobile){
        var space = viewPort - this.mobile.width;
        var unit = this.mobile.width + this.mobile.margin;
        var rem = space % unit;
        var num = Math.floor(space/unit);
        this.pool.rowCount = num + 1;
        
        this.pool.marginRight =  parseInt(rem/num) + this.mobile.margin;
      }else {
        var space = viewPort - this.desktop.width;
        var unit = this.desktop.width + this.desktop.margin;
        var rem = space % unit;
        var num = Math.floor(space/unit);
        this.pool.rowCount = num + 1;
        this.pool.marginRight = parseInt(rem/num) + this.desktop.margin;
      }
    },
    _fullPool : function(gallery){ 
      document.getElementById('pool').innerHTML = '';
      var arr = this.galleries[gallery];
      this._galSpace();
      for(var i=0 ; i < arr.length ; i++){
         this._addModelToPool(arr[i],i+1);      
      }
      
    },
    
    _addModelToPool : function(thumb,index){  
       var that = this;
    	 var mobile = this.isMobile();
       var templateDownload = document.createElement('div');
       var image = new Image();     
      
       if(mobile){
       	if(thumb.width > thumb.height){
            image.width = this.mobile.width;
            image.height = parseInt(this.mobile.width *(thumb.height/thumb.width));    
        
         }else {
           image.width =parseInt(this.mobile.width * (thumb.width/thumb.height));
           image.height = this.mobile.width;        
         }   
       	
         templateDownload.classList.add('mtemplate-download') ;
        
         var left = parseInt((100 - image.width )/2) + 'px';  
       }else { 
         templateDownload.classList.add('template-download') ;
        
        if(thumb.width > thumb.height){
          image.width = this.desktop.width;
          image.height = parseInt(this.desktop.width *(thumb.height/thumb.width));    
        
        }else {
          image.width =parseInt(this.desktop.width * (thumb.width/thumb.height));
          image.height = this.desktop.width;        
        }   
         var left = parseInt((150 - image.width )/2) + 'px';  
       }
       if((index % this.pool.rowCount) == 0)          
         templateDownload.style.marginRight = 0;
       else 
         templateDownload.style.marginRight = this.pool.marginRight  + 'px';    
       templateDownload.setAttribute('name',thumb.src);
       templateDownload.setAttribute('gallery',thumb.gallery);
       templateDownload.setAttribute('index',index-1);
       templateDownload['green'] = 1;       
                             
       image.style.position = 'relative';
       image.style.left = left; 
       
       image.src =makeUrl("image/"+thumb.gallery+"/thumb/"+thumb.src);
      // $(image).addClass('template-green');
       
       image.addEventListener('load',function(){          
           $(templateDownload).animate({opacity: 1},400);           
       })
             
       templateDownload.appendChild(image); 
       var that = this; 
       templateDownload.addEventListener('click',function(e){         
         that._upTile(e);
       })
      
       var pool =  document.getElementById('pool');
       pool.appendChild(templateDownload)            
    },
   
    
    _upTile : function(e){
      var that = this;      
      document.getElementById('homeback').style.display = 'none';
      document.getElementById('cgbtn').style.display = 'none';
      var tile = document.getElementById('tile');
      
      if(tile['up']){
        if(this.windowWidth < this.mainWidth)
         
        $('#tiler').animate({top : '+=155'},400,function(){
            document.getElementById('tile').src = makeUrl('public/arrow/tile.png');    
         tile['up'] = 0; 
         document.getElementById('pool').innerHTML = '';
        })
       else 
        $('#tiler').animate({top : '+=224'},400,function(){
            document.getElementById('tile').src = makeUrl('public/arrow/tile.png');    
         tile['up'] = 0; 
         document.getElementById('pool').innerHTML = '';
        })
       
      }else {
      document.getElementById('pool').innerHTML = '';
      $('#tiler').css('z-index',-200)  ; // I am not sure this is necessary
      if(this.windowWidth < this.mainWidth )             
        $('#tiler').animate({top : '-=155'},400,function(){
           document.getElementById('tile').src = makeUrl('public/arrow/tileback.png');    
           tile['up'] = 1; 
           if(e != null)
            that.slideShow = 1;
           if(e !=null && e !=1)
           that._showImage(e); 
        })  
      else 
         $('#tiler').animate({top : '-=224'},400,function(){
           document.getElementById('tile').src = makeUrl('public/arrow/tileback.png');    
           tile['up'] = 1;
           if(e != null) 
           that.slideShow = 1;
           if(e !=null && e != 1)
           that._showImage(e);
        })  
      
      }
    },
    
    
    _addModel : function(thumb,index){     
    	 var that = this;
    	 var mobile = this.isMobile();
       var templateDownload = document.createElement('div');
       var image = new Image();
       
       if(mobile){
         templateDownload.classList.add('mtemplate-download') ;
         image.width = parseInt(thumb.width*2/3);
         image.height = parseInt(thumb.height*2/3);
         var left = parseInt((100 - image.width )/2) + 'px';  
       }else {
         templateDownload.classList.add('template-download') ;
         image.width = thumb.width;
         image.height = thumb.height;
         var left = parseInt((150 - image.width )/2) + 'px';  
       }
       if((index % this.pool.rowCount) == 0)          
         templateDownload.style.marginRight = 0;
       else 
         templateDownload.style.marginRight = this.pool.marginRight  + 'px';    
       templateDownload.setAttribute('name',thumb.src);
    
       templateDownload['green'] = 1;       
                             
       image.style.position = 'relative';
       image.style.left = left; 
       
       image.src = makeUrl("image/"+that.galleryName+"/thumb/"+thumb.src);
       $(image).addClass('template-green');
       
       image.addEventListener('load',function(){          
           $(templateDownload).animate({opacity: 1},400);           
       })
       
       $(image).hover(function(){
           var parent = this.parentElement;
           if(parent['green'] == 1){
             image.style.borderTop = '3px solid tomato';           
           }else {
             image.style.borderTop = '3px solid green';           
           }
       },function(){
          var parent = this.parentElement;
          if(parent['green'] == 1){
            image.style.borderTop = '3px solid green';          
          } else {
            image.style.borderTop = '3px solid tomato';          
          }                
       })
       
       image.addEventListener('click',function(){
         var parent = this.parentElement;
         if(parent['green'] == 1){
         	 parent['green'] = 0;
             image.style.borderTop = '3px solid tomato';
             that.removedDownload.push({src : parent.getAttribute('name'),height : 0,width : 0});
         }else {
         	 parent['green'] = 1;
             image.style.borderTop = '3px solid green';
             
             var index = function(name){
             	 for(var i = 0 ; i < that.removedDownload.length ; i++){ 
             	 	 if(that.removedDownload[i].src == name){
             	 	 	return i;
             	 	 	}
             	 }
             }(parent.getAttribute('name'))
             
             that.removedDownload.splice(index,1);         
         }
       },false)
       
       templateDownload.appendChild(image); 
      
       var pool =  document.getElementById('pool');
       pool.appendChild(templateDownload)            
    },  
    
    _removeModel : function(thumb){
    
    },
    
    _removeFromPool : function(args){ 
    	  var that = this;    	 
    	  this.queue.splice(this.queue.indexOf(args.src),1); 
    	  for(var i = 0 ; i < this.files.length ; i++){
          if(this.files[i].name == args.src){ 
             this.files.splice(i,1);
             break;          
          } 	  
    	  }    	  
        if(args.hasOwnProperty('height')){ 
           if(this.isMobile()){
              $(".mtemplate-upload[name='" + args.src + "']").animate({opacity : 0},400,function(){              
                 this.remove();
                 that._uploader(false);              
              })           
           }else { 
              $(".template-upload[name='" + args.src + "']").animate({opacity : 0},400,function(){
                 this.remove();               
                 that._uploader(false);          
              }) 
           }        
        }else this._uploader(false);
        
      return;
    }, 
    
    _uploader : function (add) {
    	 var mobile = this.isMobile();
    	 var num,viewPort,unitLength;
    	 viewPort = this.uploader.view; 
    	 if(mobile){
    	 	 var num1 = document.getElementsByClassName('mtemplate-gallery').length;
          var num2 = document.getElementsByClassName('mtemplate-upload').length;	
          num = Math.max(num1,num2);
          unitLength = this.mobile.width + this.mobile.margin;
    	 }else {
    	 	 var num1 = document.getElementsByClassName('dtemplate-gallery').length; 
    	    var num2 = document.getElementsByClassName('template-upload').length;
    	    num = Math.max(num1,num2) ; 
    	    unitLength = this.desktop.width + this.desktop.margin ;    	    
    	 }  	 
    	 
    	 if(add){
    	   if(mobile){   	      
    	      var afterAdd = (num+1)*unitLength;
    	      
    	      if(afterAdd > viewPort){
               this.uploader.el.style.width = afterAdd + 'px';
               this.uploader.mobile = afterAdd;   	      
    	      }
    	   }else {   	     
    	     var afterAdd = (num+1) * unitLength ;
    	     
    	     if(afterAdd > viewPort){
               this.uploader.el.style.width = afterAdd +'px';
               this.uploader.desktop = afterAdd;    
    	     }
    	   } 
    	 }else { 
         if(mobile){          
           var afterRemove = (num) * unitLength;
           if(afterRemove > viewPort){
              this.uploader.el.style.width = afterRemove + 'px';
              this.uploader.mobile = afterRemove;
           }else {
              this.uploader.el.style.width = viewPort + 'px';
              this.uploader.mobile = viewPort;        
           }
         }else {             
            var afterRemove = (num) * unitLength;
            if(afterRemove > viewPort){
               this.uploader.el.style.width = afterRemove + 'px';
               this.uploader.desktop = afterRemove;            
            }else {
               this.uploader.el.style.width = viewPort + 'px';
               this.uploader.desktop = viewPort;            
            }
         }          	 
    	 }
    	 return;
    },
    _removeDownloadTemplate : function(model){ 
    	 var index = this.findIndex(this.removedDownload,model);
    	 var that = this;
       this.removedDownload.splice(index,1); 
       if(this.isMobile()){
        $(".mtemplate-download[name='" + model.src + "']").animate({opacity : 0},400,function(){
          this.remove(); 
          that._recalculateMargin()      
       })
       }else {
        $(".template-download[name='" + model.src + "']").animate({opacity : 0},400,function(){
          this.remove();       
           that._recalculateMargin()  
       })
       }     
       
       return;
    },
    
    findIndex : function(arr,obj){
       for (var i = 0 ; i < arr.length ; i++) {
       	if(arr[i].src == obj.src) return i;
       }          
       return -1;
    },
    
    loadGalleries : function(data){
        var result = JSON.parse(data);
        var galleries = {};
        for(var i = 0 ; i < result.length ; i++){
           var gallery = result[i].gallery;
           if(!galleries[gallery])
             galleries[gallery] = [];
            
           galleries[gallery].push({text : result[i].text,gallery : gallery,src : result[i].src,width : result[i].width,height: result[i].height});        
        }       
        this.galleries = Object.assign({},galleries);
        
        for(var i in galleries ){
            this._renderGallery(galleries[i][0]);
        }           
    },   
    
    _galleryTemplate : function(obj){
       var template = document.createElement('div');       
    },
    
    _hide : function(){
      document.getElementById('main').style.display = 'none';
    }
    
  }
  
 
  
 /*============================================ Models ==============================================*/
 
 var Model = function(src,height,length){
    this.src = src;
    this.height = height;
    this.length = length; 
 }
  
/*============================================ Collections ==========================================*/

  var Collection = function(controller){ 
  	 this.models = [];
      
    var that = this;
    this.addModel = function (model){ 
    	 that.models.push(model);    	
       controller.addedToCollection(model,that.models.length);  
    }
    
    this.removeModel = function (model){ 
       var index = search(model); 
       if(index > -1)
         that.models.splice(index,1);
       else return -1;
       
       return controller.removedFromCollection(model)
       
    }
    
    this.removeCollection = function(queue){      
       while(queue.length != 0)
         that.removeModel(queue[0])        
    }
    
    function search(model){ 
    	var index ; 
      for(index = 0 ; that.models.length ; index++){
      	 if(that.models[index].src == model.src)        
            return index;
      }
      
      return -1;
    }
    
  }    
  
  
    
       var Router = (function () {     
                    	     
     	     let that = this; 
           let validUrl = ['archive'];
           let events = {};
           
           for(let elem of validUrl)
             events[elem] = new Event(this);
          
     	    
     	     function router(url){	
     	     	  if(validUrl.indexOf(url) == -1) return;
     	     	  events[url].notify('')
     	        //window.history.pushState(null,null,'/video/' + url);    
     	     }     	     
     	     
     	     return {
               route : router ,
               event : events 	     
     	     }
     })()
  
  /*========================================= Controller ============================================*/
  
  var Controller = (function(){ 
     
     this.collection = new Collection(this);
     //this.view = new View(View,this);     
     View._start();
     
     Router.event['archive'].attach(function(sender,args){ 
     	  if(View.inited){
          document.getElementById('main').style.display = 'block';     	  
     	  }else{
     	    View._init();
         galleries();
     	  }
     	   
     })
     

     var that =  this;
        
     
      var socket = io("http://localhost:3000");
      socket.on("id",function(data){
         that.id = data.id;         
      });
      
     
      socket.on('thumb',function(data){ 
      	 that.collection.addModel(data);          
      })
      
      socket.on('progress',function(data){
          //that.view.progress.notify(data);
          View._progress(data)      
      })
    
     View.upload.attach(function (sender,args) {
     	  Upload(sender,args)
     })
      
      
      function galleries () {
      	var xhr = new XMLHttpRequest();
      	xhr.open('GET','/gallery/index');
      	window.history.pushState(null,null,'/gallery/index')
      	xhr.onreadystatechange = function(){
            if(this.readyState == 4){
               View.loadGalleries(xhr.responseText);                
               View._showTile();
               
               //readyUrl();        
            }      	
      	}
      	
      	xhr.send();
      }
     
      function Upload(sender,queue) {    
     	  for(var i= 0 ; i < sender.files.length ; i++){
     	  	 if(queue.indexOf(sender.files[i].name) == -1) continue;  
          var file = new FormData(); 
          file.append(sender.files[i].name,sender.files[i]);
          var xhr = new XMLHttpRequest();
          xhr.open('POST','/gallery/upload'); 
          xhr.setRequestHeader('id',that.id);
          xhr.setRequestHeader('imageName',sender.files[i].name);
          xhr.setRequestHeader('gallery',sender.galleryName )
          xhr.send(file);     	  
     	  }
     }
   
    
     function Remove(sender,queue){
         var delThumb = new XMLHttpRequest();
         delThumb.open('POST','/gallery/delete');
         delThumb.onreadystatechange = function (data) { 
            if(this.readyState == 4){ 
               that.collection.removeCollection(queue);               
            }
         }
         delThumb.setRequestHeader('Content-Type','application/json');
         delThumb.setRequestHeader('gallery',sender.galleryName)
         delThumb.send(JSON.stringify(queue));
     }
     
     View.remove.attach(function(sender,args){        
         return  Remove(sender,args);
     })
     
     
     this.removedFromCollection= function(args){         
        return  View._removeDownloadTemplate(args);
     }
     
     this.addedToCollection = function(args,index){
        View._removeFromPool(args);
        View._addModel(args,index);     
        return;
     }       
     
     View.showImage.attach(function(sender,args){     
         View._showImage(args);     
     }) 
     
     View.gallery.attach(function(sender,args){
         View._showImages(args);     
     })
     function readyUrl(){
       var path = window.location.pathname;   
       var elements = path.split('/');
       if(elements.length == 3){
       	View._upTile(null);
         View._showImages(null,elements[1])
       }
      else if(elements.length == 4){ 
      	View._upTile(1);      	
         View._showImage(null,elements[2],elements[3])
      }
     }
   
  })()
  
  
  return {
     hide : View._hide.bind(View),
     router : function(path){
        Router.route(path);     
     }  
  }  
  
  })()

   
      
  /*

  TODO LIST

  1-change the attr and prop
  
  details : prop is for changing property of an element while attr is fixed in loading 
  if it was set in the element while rendering the page attr always return the value that was set to it 
  but prop return while we are changing it during execution with javascript
  
  
  gallery name should be 
  1-trimed 
  2-shuld not contain any space or anything that could not be folder name
  3-conside the api for this
  in this case the galley name is setted by the appi and we should load just the upload page
  
  
  4- should functions have return ? and what will happen if we don't use it?
  
  5- check to upload any image format with case insensetive
  
  6- creating user for database
  7 - see what happen if a fucntion does not return anything at all.
  8- image orientation check .set a default one if file is proper image
  9- notify when a gallery added and update the galleies to use arre when pressing galleris button
  10-trim gallery name to prevent like space and any charachter that are not allowed in creating directory
  11-in function defineProp there is property that it's name is wrong as result of search and replace 
  12-if length and height of an image is smaller than viewport we should set the margin ...
 */