/*============================================== Events ===============================================*/


function makeUrl(url) {
    return "http://" + localhost + '/' + url;
}
/*=========================================== View =============================================== */
var Gallery = (function() {
    function iMouseDown(e) {
        window.addEventListener('mousemove', iDivMove, true);
        let editable = document.getElementById('Editor')
        editable.removeAttribute('contenteditable');
    }

    function iMouseUp(e) {
        window.removeEventListener('mousemove', iDivMove, true);
        document.getElementById('gheader').style.position = 'fixed';
        let editable = document.getElementById('Editor');
        editable.setAttribute('contenteditable', 'true');
    }

    function iDivMove(e) {
        let div = document.getElementById('gheader');
        div.style.position = 'absolute';
        div.style.top = e.clientY + 'px';
        div.style.left = e.clientX + 'px';
    }

    var View = {

        config: {
            mainWidth: 900,
            mWidth: null,
            menubar: ['article', 'video', 'gallery', 'about']
        },
        windowWidth: $(document).width(),
        windowHeight: $(document).height(),
        index: 1,
        inited: false,
        mainWidth: 900,
        mainHeight: 620,
        mobile: {
            width: 100,
            margin: 5,
            top: 10
        },
        desktop: {
            width: 150,
            margin: 20,
            top: 20
        },
        btns: ['location', 'reorder', 'caption', 'text', 'tags', 'description', 'save'],
        menu: ["menu", "cover", "text", "filter", "location", "share"],
        main: {
            mobile: {
                left: 5,
                top: 10
            },

            desktop: {
                width: 900,
                top: 10
            }
        },

        bottom: {
            mobile: {
                height: 20
            },

            desktop: {
                height: 22
            }
        },

        galleryName: '',
        fileName: [],
        queue: [],
        files: [],
        busy: 0,
        activeEditor: false,
        removedDownload: [],
        orientation: -1,
        header: {
            el: document.getElementById('header'),
            height: 30
        },
        uploader: {
            el: document.getElementById('uploader'),
            height: 200,
            mobile: 0,
            desktop: 0,
            view: 0,
            position: 0,
            busy: 0
        },
        space: {
            el: document.getElementById('space'),
            height: 22
        },
        pool: {
            el: document.getElementById('pool'),
            height: 360,
            marginRight: 0,
            rowCount: 0
        },
        slideShow: 0,
        outsider: [],
        events: ['createGallery', 'bckGallery', 'nxtGallery',
            'arwUp', 'arwDown', 'upload', 'remove', 'showImage', 'gallery', 'loadImage'
        ],

        defineProp: function(obj, key, value) {
            var View = {
                value: value,
                writable: true,
                enumerable: true,
                Viewurable: true
            }

            Object.defineProperty(obj, key, View);
        },

        isMobile: function() {
            return $(document).width() > this.mainWidth ? 0 : 1;
        },


        _setHeader: function() {
            var mobile = this.isMobile();
            this.header.el.style.height = this.header.height + 'px';
            var cgbtn = document.getElementById('cgbtn');
            var isChrome = /chrome/i.test(navigator.userAgent);
            var bnxt = document.getElementById('back-next');
            if (!this._isLoggedIn()) {
                this.header.el.appendChild(this._profilePic());
                cgbtn.style.display = 'none';
            } else {

            }
            if (this.index) {
                document.getElementById('back-next').style.display = 'none';
            } else {
                document.getElementsByClassName('indt').style.display = 'none';
            }

            if (isChrome) {
                $('#back-reset').css({
                    'padding-top': '3px'
                })
            }

            if (mobile) {
                bnxt.classList.remove('dbnxt');

                cgbtn.classList.add('mcgbtn');
                $(bnxt).css({
                    'top': '11px'
                })
                if (isChrome) {
                    $(cgbtn).css({
                        'padding-top': '2px',
                        'padding-bottom': '0px'
                    })
                    $('#back-next').css({
                        'top': '13px'
                    })
                    $('#back-reset').css({
                        'width': '55px'
                    })
                }
                $(bnxt).addClass('mbnxt')
            } else {

                bnxt.classList.remove('mbnxt')
                cgbtn.classList.remove('cgbtn');
                if (isChrome) {
                    $('#back-next').css({
                        'top': '12px'
                    })
                } else {
                    $('#back-next').css({
                        'top': '10px'
                    })
                }
                cgbtn.classList.add('dcgbtn')
                $(bnxt).addClass('dbnxt');
            }
        },
        _setMain: function() {
            var mobile = this.isMobile();
            var main = document.getElementById('main');


            if (mobile) {
                main.style.width = (this.windowWidth - 5) + 'px';
                main.style.height = (this.windowHeight - 10) + 'px';
                main.style.left = this.main.mobile.left + 'px';
            } else {
                main.style.width = (this.mainWidth) + 'px';
                main.style.height = (this.mainHeight - 10) + 'px';
                var margin_left = parseInt((this.windowWidth - 900) / 2);
                main.style.left = margin_left + 'px';
            }

        },
        _setUploader: function() {
            var mobile = this.isMobile();

            if (mobile) {
                this.uploader.el.style.height = 133 + 'px';

                this.uploader.mobile = this.windowWidth - this.main.mobile.left;
                this.uploader.view = this.uploader.mobile;
                this.uploader.el.style.width = this.uploader.mobile + 'px';
            } else {
                this.uploader.el.style.height = this.uploader.height + 'px';
                this.uploader.desktop = 900;
                this.uploader.view = this.uploader.desktop;
                this.uploader.el.style.width = 900 + 'px';
            }
        },


        _isLoggedIn: function() {
            return username == this.username;
        },

        _profilePic: function() {
            if (document.getElementById('pp')) document.getElementById('pp').remove()
            let container = document.createElement('div');
            container.style.width = 200 + 'px';
            container.style.height = 30 + 'px';
            container.style.float = 'right';
            container.id = 'pp'
            container.classList.add('m-profile')
            let span = document.createElement('span');
            span.innerHTML = this.username;
            span.style.float = 'right';
            span.style.color = 'black';
            span.style.cursor = 'pointer';
            span.style.marginRight = 5 + 'px';
            span.style.marginTop = 7 + 'px';
            span.state = 'hide';
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
            span.addEventListener('click', this._hideOrShowMenu.bind(this))

            return container;

        },

        _hideOrShowMenu: function(e) {
            let elem = e.target;
            if (document.getElementById('g-menubar'))
                this._hideProfileMenu();
            else
                this._showProfileMenu();

        },

        _hideProfileMenu: function() {
            let canvas = document.getElementById('g-profile-menu')
            document.getElementById('g-menubar').remove()
            let radius = canvas.getAttribute('radius');
            radius -= 1
            let context = canvas.getContext('2d');
            let x = canvas.width / 2;
            let y = canvas.height / 2;
            let id = window.setInterval(function() {
                if (radius < 10) {
                    clearInterval(id);
                    canvas.remove();

                }

                context.beginPath();
                context.arc(200, 0, radius, 0.5 * Math.PI, Math.PI);
                context.lineWidth = 21;
                radius -= 15;

                // line color
                context.strokeStyle = 'white';
                context.stroke();


            }, 2)

        },
        _showProfileMenu: function() {
            let that = this;
            let left;
            let top = 40;
            if (this.isMobile()) {
                left = window.innerWidth - 200;

            } else {
                left = 900 + (window.innerWidth - 900) / 2 - 194;
            }

            let canvas = document.createElement('canvas');
            canvas.width = 200;
            canvas.height = 200;

            canvas.id = 'g-profile-menu'
            let context = canvas.getContext('2d');

            let radius = 1;
            canvas.style.position = 'fixed';

            canvas.style.top = top;
            canvas.style.left = left + 'px';

            canvas.style.zIndex = 100;

            canvas.id = 'g-profile-menu';
            document.body.appendChild(canvas);

            let id = window.setInterval(function() {
                if (radius > 150) {
                    clearInterval(id);
                    that._menubar()

                    canvas.setAttribute('radius', radius)

                    return;
                }

                radius += 2;
                context.beginPath();
                context.arc(200, 0, radius, 0.5 * Math.PI, Math.PI);
                context.closePath();
                context.fillStyle = 'lightblue';
                context.fill();

            }, 1)

        },

        _menubar: function() {
            let left;
            let top = 60;
            if (this.isMobile()) {
                left = window.innerWidth - 10;

            } else {
                left = 900 + (window.innerWidth - 900) / 2;
            }
            let that = this;
            let menubar = document.createElement('div');
            for (let i = 0; i < this.config.menubar.length; i++) {
                let menu = document.createElement('div');
                menu.innerHTML = this.config.menubar[i];
                menu.classList.add('menubar-m');
                menu.style.height = 20 + 'px';
                menu.style.color = 'white';
                menu.addEventListener('click', function() {
                    that._hideProfileMenu();
                    if (that.config.menubar[i] == 'article')
                        app.router(that.username, 'editor/archive')
                    else
                        app.router(that.username, that.config.menubar[i] + '/archive');
                })

                $(menu).hover(function() {
                    this.innerHTML = that.config.menubar[i].toUpperCase()
                }, function() {
                    this.innerHTML = that.config.menubar[i].toLowerCase()
                })
                menubar.appendChild(menu);
            }


            menubar.classList.add('menubar-a');
            menubar.id = 'g-menubar'

            menubar.style.top = top + 'px';
            menubar.style.left = (left - 60) + 'px';
            menubar.style.fontSize = 10 + 'px';


            menubar.style.height = this.config.menubar.length * 20 + 'px';
            document.body.appendChild(menubar)

            $(menubar).animate({
                opacity: 1
            }, 300);

        },

        _galSpace: function() {
            return;
            var mobile = this.isMobile();
            //$('.edt').css('display','none')
            $('.edt').css('display', 'none');

            if (mobile) {
                $('#space-wrapper').css({
                    'width': '277px',
                    'height': '20px',
                    'left': -277 + 'px'
                })
                this.space.el.style.height = '20px';
                $('.txt').css({
                    'font-size': '12px',
                    'height': '16px',
                    'vertical-align': 'middle',
                    'line-height': '1.2'
                });
                $('.galedit').css({
                    'width': '70px'
                });
                var isChrome = /chrome/i.test(navigator.userAgent);

                if (isChrome) {
                    $('.txt').css({
                        'padding-top': '3px',
                        'padding-bottom': '1px',
                        'font-size': '14px'
                    })
                }

                $('#arrow').addClass('marrow')
                $('#arrow-up').addClass('marup');
                $('#arrow-down').addClass('marup');
                $('#space-wrapper').animate({
                    left: '+=277'
                }, 400);

            } else {
                $('#space-wrapper').css({
                    'width': '324px',
                    'height': '22px',
                    'left': -324 + 'px'
                })
                this.space.el.style.height = '22px';
                $('.galedit').css({
                    'width': '70px'
                });
                $('.txt').css({
                    'font-size': '12px',
                    'height': '18px',
                    'vertical-align': 'middle',
                    'line-height': '1.2'
                });
                var isChrome = /chrome/i.test(navigator.userAgent);

                if (isChrome) {
                    $('.txt').css({
                        'padding-top': '3px',
                        'padding-bottom': '1px',
                        'font-size': '14px'
                    })
                }

                $('#arrow-up').addClass('darup');
                $('#arrow-down').addClass('darup')
                $('#arrow').addClass('darrow')

                $('#space-wrapper').animate({
                    left: '+=324'
                });
            }
        },

        _setSpace: function() {
            var mobile = this.isMobile();
            $('.indx').css('display', 'none');

            if (this.index) {
                document.getElementById('galback').style.width = '60px';
                document.getElementById('galback').style.marginTop = '2px';
            }

            if (mobile) {
                $('.dsp .dsc .dsz .darrow .darup').removeClass('dsp dsc dsz darrow darup');
                $('#space-wrapper').css({
                    'width': '277px',
                    'height': '20px',
                    'left': -277 + 'px'
                })
                this.space.el.style.height = '20px';

                $('.txt').css({
                    'font-size': '12px',
                    'height': '16px',
                    'vertical-align': 'middle',
                    'line-height': '1.2'
                });
                $('.lft').addClass('mlft')
                $('.sp').addClass('msp');
                $('.sz').addClass('msz');
                $('.sc').addClass('msc');

                if (this.index) {
                    document.getElementById('space-wrapper').style.display = 'none';
                }
                var isChrome = /chrome/i.test(navigator.userAgent);

                if (isChrome) {
                    $('.txt').css({
                        'padding-top': '3px',
                        'padding-bottom': '1px',
                        'font-size': '14px'
                    })
                }
                $('#arrow').addClass('marrow')
                $('#arrow-up').addClass('marup');
                $('#arrow-down').addClass('marup')
                $('#add-image').css({
                    'width': '12px',
                    'height': '12px'
                })

            } else {

                if (this.index) {
                    document.getElementById('space-wrapper').style.display = 'none';
                }
                $('#tile').css('top', '2px')
                $('.msp .msc .msz .mlft .marrow .marup').removeClass(' msp msc msz mlft marrow marup');
                $('#space-wrapper').css({
                    'width': '324px',
                    'height': '22px',
                    'left': -324 + 'px'
                })
                this.space.el.style.height = '22px';

                $('.txt').css({
                    'font-size': '12px',
                    'height': '18px',
                    'vertical-align': 'middle',
                    'line-height': '1.2'
                });
                var isChrome = /chrome/i.test(navigator.userAgent);

                if (isChrome) {
                    $('.txt').css({
                        'padding-top': '3px',
                        'padding-bottom': '1px',
                        'font-size': '14px'
                    })
                }


                $('.sp').addClass('dsp');
                $('.sz').addClass('dsz');
                $('.sc').addClass('dsc');
                $('.lft').addClass('dlft')
                $('#arrow-up').addClass('darup');
                $('#arrow-down').addClass('darup')
                $('#arrow').addClass('darrow')
                    //document.getElementById('arrow-down').style.right = 5 + 'px';
            }
        },

        _setPoolView: function() {
            let viewPort = document.createElement('div');

            viewPort.setAttribute('id', 'g-archive-view')
            if (this.isMobile()) {
                viewPort.style.width = (this.windowWidth - 5) + 'px';
                viewPort.style.height = (this.windowHeight - 50) + 'px';
            } else {
                viewPort.style.width = (this.mainWidth + 5) + 'px';
                viewPort.style.height = (this.mainHeight - 50) + 'px';
            }

            let pool = document.getElementById('pool');
            pool.appendChild(viewPort)

            const ps = new PerfectScrollbar(viewPort, {
                suppressScrollX: true
            });
        },


        _setPool: function() {
            this._marginRight();
        },

        _start: function() {
            for (let i = 0; i < this.events.length; i++)
                this.defineProp(this, this.events[i], new Event(this));

            for (let t = 0; t < this.btns.length; t++)
                this.events.push(this.btns[t])
            for (let i = 0; i < this.events.length; i++)
                this.defineProp(this, this.events[i], new Event(this))

            this.config.mWidth = window.innerWidth - 5;
        },
        _init: function() {

            if (this.inited) return;
            this.inited = true;

            this._setMain();
            this._setHeader();
            this._setUploader();
            this._setSpace();
            this._setPool();

            document.getElementById('cgbtn').addEventListener(
                'click', this._createGallery.bind(this), true);
            document.getElementById('arrow-up').addEventListener(
                'click', this._arwUp.bind(this));
            document.getElementById('arrow-down').addEventListener(
                'click', this._arwDown.bind(this));
            document.getElementById('gback').addEventListener(
                'click', this._bckGallery.bind(this), false);
            document.getElementById('back-img').addEventListener(
                'click', this._bckGallery.bind(this), false);
            document.getElementById('gnext').addEventListener(
                'click', this._nxtGallery.bind(this), false);
            document.getElementById('next-img').addEventListener(
                'click', this._nxtGallery.bind(this), false);
            document.getElementById('back-reset').addEventListener(
                'click', this._backReset.bind(this), false);
            document.getElementById('input-label').addEventListener(
                'click',
                function() {
                    if ($(this).css('left') === '0px') {
                        $(this).animate({
                            opacity: 1,
                            left: "-=100"
                        }, 400, function() {
                            document.getElementById('input-name').focus();
                        })
                    }
                }, false);
            document.getElementById('input-create').addEventListener(
                'click', this._setUpload.bind(this), false);
            document.getElementById('browse').addEventListener(
                'click', this._browseFile.bind(this), false);

            document.getElementById('files').addEventListener(
                'change', this._getInput.bind(this), false);
            document.getElementById('upload').addEventListener(
                'click', this._upload.bind(this), false);
            document.getElementById('remove').addEventListener(
                'click', this._remove.bind(this), false);
            document.getElementById('set-cover').addEventListener(
                'click', this._setCover.bind(this), false);
            document.getElementById('tile').addEventListener(
                'click', this._showTile.bind(this), false);

        },

        _showTile: function() {

            var that = this;
            var tile = document.getElementById('tile');
            if (tile['up']) return;
            if (tile['up']) {
                if (this.windowWidth < this.mainWidth) {
                    document.getElementById('tiler').style.top = 0 + 'px';
                    tile['up'] = 0;
                    document.getElementById('pool').innerHTML = '';
                } else {

                    document.getElementById('tiler').style.top = 0 + 'px';
                    tile['up'] = 0;
                    document.getElementById('pool').innerHTML = '';
                }

            } else {
                document.getElementById('pool').innerHTML = '';


                this._setPoolView();

                if (this.windowWidth < this.mainWidth) {
                    document.getElementById('tiler').style.top = -155 + 'px';
                    tile['up'] = 1;
                    that._showGalleries();
                } else {
                    document.getElementById('tiler').style.top = -224 + 'px';
                    tile['up'] = 1;
                    that._showGalleries();
                }
            }

        },


        _showGalleries: function() {
            var container = document.getElementById('g-archive-view');
            container.innerHTML = '';

            var t = 1;
            for (var i in this.galleries) {
                this._addGallery(this.galleries[i][0], t, container, i);
                t++;
            }
        },

        _addGallery: function(thumb, index, container, gallery) {
            var that = this;
            var mobile = this.isMobile();
            var templateDownload = document.createElement('div');
            var image = new Image();

            if (mobile) {
                if (thumb.width > thumb.height) {
                    image.width = this.mobile.width;
                    image.height = parseInt(this.mobile.width * (thumb.height / thumb.width));

                } else {
                    image.width = parseInt(this.mobile.width * (thumb.width / thumb.height));
                    image.height = this.mobile.width;
                }

                templateDownload.classList.add('mtemplate-tile');

                var left = parseInt((100 - image.width) / 2) + 'px';
            } else {
                templateDownload.classList.add('template-tile');

                if (thumb.width > thumb.height) {
                    image.width = this.desktop.width;
                    image.height = parseInt(this.desktop.width * (thumb.height / thumb.width));

                } else {
                    image.width = parseInt(this.desktop.width * (thumb.width / thumb.height));
                    image.height = this.desktop.width;
                }
                var left = parseInt((150 - image.width) / 2) + 'px';
            }
            if ((index % this.pool.rowCount) == 0)
                templateDownload.style.marginRight = 0;
            else
                templateDownload.style.marginRight = this.pool.marginRight + 'px';
            templateDownload.setAttribute('name', gallery);
            templateDownload['green'] = 1; ///////////          remove this

            image.style.position = 'relative';
            image.style.left = left;

            image.src = makeUrl("uploads/" + thumb.username + '/gallery/' + thumb.gallery + "/thumb/" + thumb.src);
            // $(image).addClass('template-green');

            image.addEventListener('load', function() {
                $(templateDownload).animate({
                    opacity: 1
                }, 400);
            })

            templateDownload.addEventListener('click', function(e) {
                Router.route(thumb.username, 'images/' + e.target.parentElement.getAttribute('name'))
            }, false)
            templateDownload.appendChild(image);
            container.appendChild(templateDownload)
        },

        /*-------------------------------------- View Port ---------------------------------------*/


        _galleryShow: function(thumb, index, mypool, gallery) {
            var that = this;
            var mobile = this.isMobile();
            var templateDownload = document.createElement('div');
            var image = new Image();

            if (mobile) {
                if (thumb.width > thumb.height) {
                    image.width = this.mobile.width;
                    image.height = parseInt(this.mobile.width * (thumb.height / thumb.width));
                } else {
                    image.width = parseInt(this.mobile.width * (thumb.width / thumb.height));
                    image.height = this.mobile.width;
                }

                templateDownload.classList.add('mtemplate-download');

                var left = parseInt((100 - image.width) / 2) + 'px';
            } else {
                templateDownload.classList.add('template-download');

                if (thumb.width > thumb.height) {
                    image.width = this.desktop.width;
                    image.height = parseInt(this.desktop.width * (thumb.height / thumb.width));

                } else {
                    image.width = parseInt(this.desktop.width * (thumb.width / thumb.height));
                    image.height = this.desktop.width;
                }
                var left = parseInt((150 - image.width) / 2) + 'px';
            }
            if ((index % this.pool.rowCount) == 0)
                templateDownload.style.marginRight = 0;
            else
                templateDownload.style.marginRight = this.pool.marginRight + 'px';
            templateDownload.setAttribute('name', thumb.src);
            templateDownload.setAttribute('index', index - 1);
            templateDownload.setAttribute('gallery', gallery);



            image.style.position = 'relative';
            image.style.left = left;

            image.src = makeUrl("uploads/" + thumb.username + '/gallery/' + thumb.gallery + "/thumb/" + thumb.src);
            // $(image).addClass('template-green');

            image.addEventListener('load', function() {
                $(templateDownload).animate({
                    opacity: 1
                }, 400);
            })

            templateDownload.appendChild(image);
            templateDownload.addEventListener('click', function(e) {
                // that.showImage.notify(e);
                //alert(e.target.parentElement.getAttribute('name'))
                Router.route(thumb.username, 'show/' + thumb._id)
            }, false);

            mypool.appendChild(templateDownload)
        },
        _constructImage: function(index, gallery, upOdown) {
            var that = this;
            that.busy = 1;
            var url = '';
            var currentMaxZIndex;
            var div = document.createElement('div');
            div.classList.add('image-view');
            var currentActiveImage = document.getElementsByClassName('active-image');

            if (currentActiveImage.length > 0) {

                //currentMaxZIndex = window.getComputedStyle(currentActiveImage[0],null).getPropertyValue('z-index'); 
                currentMaxZIndex = $(currentActiveImage[0]).css('zIndex');
                // $(currentActiveImage[0]).animate({opacity : 0.3},400);   
                currentActiveImage[0].classList.remove('active-image');
            }

            div.classList.add('active-image');
            div.setAttribute('index', index);
            div.setAttribute('gallery', gallery);
            var viewHeight = this._getHeightView();
            div.style.width = this.uploader.view + 'px';
            div.setAttribute('height', viewHeight);
            div.style.height = viewHeight + 'px';

            var imageContainer = document.createElement('div');
            imageContainer.style.width = this.uploader.view + 'px';
            imageContainer.style.height = (viewHeight - 10) + 'px';
            imageContainer.style.marginTop = 10 + 'px';
            //imageContainer.style.position = 'absolute'
            div.appendChild(imageContainer);

            var height = this.galleries[gallery][index].height;
            var width = this.galleries[gallery][index].width;

            var prevUrl = 'preview/' + gallery + '/' + this.galleries[gallery][index].src;

            var image = document.createElement('img');
            image.classList.add('pimage');
            image['gallery'] = gallery;
            image['url'] = this.galleries[gallery][index].src;
            image.style.position = 'relative';
            imageContainer.appendChild(image);
            var longWidth = this.uploader.view;

            if (this.isMobile()) {
                url = 'uploads/' + this.galleries[gallery][index].username + '/gallery/' + gallery + '/mobile/' + this.galleries[gallery][index].src;
                if (width > height) {
                    if (width > this.uploader.view) {
                        image.width = this.uploader.view;
                        image.height = parseInt(longWidth * (height / width));
                        image.style.top = 0;
                        // image.style.top = parseInt(-(viewHeight - image.height)/2) + 'px';            
                    } else {
                        image.width = this.uploader.view;
                        image.height = parseInt(longWidth * (height / width));
                        //  image.style.top = parseInt(-(viewHeight - image.height)/2) + 'px';  
                        image.style.top = 0;
                    }
                } else {
                    if (height > viewHeight) {
                        image.height = viewHeight;
                        image.width = parseInt(viewHeight * (width / height))
                        image.style.left = parseInt((this.uploader.view - image.width) / 2) + 'px';
                    } else {
                        image.height = viewHeight;
                        image.width = parseInt(viewHeight * (width / height))
                        image.style.left = parseInt((this.uploader.view - image.width) / 2) + 'px';
                    }
                }
            } else {
                url = 'uploads/' + this.galleries[gallery][index].username + '/gallery/' + gallery + '/desktop/' + this.galleries[gallery][index].src;
                if (width > height) {
                    if (width > this.uploader.view) {
                        image.width = this.uploader.view;
                        image.height = parseInt(longWidth * (height / width));
                        // image.style.top = parseInt(-(viewHeight - image.height)/2) + 'px';
                        image.style.top = 0;
                    } else {

                        image.width = this.uploader.view;
                        image.height = parseInt(longWidth * (height / width));
                        //image.style.top = parseInt(-(viewHeight - image.height)/2) + 'px';
                        image.style.top = 0;
                    }
                } else {
                    if (height > viewHeight) {
                        image.height = viewHeight;
                        image.width = parseInt(viewHeight * (width / height))
                        image.style.left = parseInt((this.uploader.view - image.width) / 2) + 'px';
                    } else {
                        image.height = viewHeight;
                        image.width = parseInt(viewHeight * (width / height))
                        image.style.left = parseInt((this.uploader.view - image.width) / 2) + 'px';
                    }
                }
            }

            image.src = makeUrl(url);
            image.style.opacity = 0;
            image.style.display = 'none';
            
            image.addEventListener('load', function() {
                that.busy = 0;
                image.style.display = 'block'
                if (upOdown == null) {
                    $(this).animate({
                        opacity: 1
                    }, 400);
                } else {
                    this.style.opacity = 1;
                }

                that._upOrDown(upOdown, currentMaxZIndex);
            })

            let txt = document.getElementById('txtpng');
            let jur = document.getElementsByClassName('txtJur')[0];
            let xwar = document.getElementsByClassName('txtXwar')[0];
            let txtContainer = document.getElementsByClassName('txtpng')[0];
            if (this.galleries[gallery][index].text !== undefined) {

                txtContainer.style.opacity = 1;

                txt.style.opacity = 1;
                jur.style.opacity = 1;
                xwar.style.opacity = 1;
                txt['gallery'] = gallery;
                txt['i'] = index;
                txt['overlay'] = 1;
            } else {
                document.getElementsByClassName('txtpng')[0].style.opacity = 0.5;
                txt['overlay'] = 0;
            }

            document.getElementById('pool').appendChild(div);
            // window.history.pushState(null,null,"/show"+prevUrl);     
        },

        _browserConstruct: function(a, b) {
            let index, gallery;

            for (var i = 0; i < this.galleries[a].length; i++)
                if (this.galleries[a][i].src == b) index = i;
            gallery = a;

            let activeImageIndex = document.getElementsByClassName('active-image')[0].getAttribute('index');

            if (activeImageIndex > index)
                this._constructImage(index, gallery, 'down')
            else
                this._constructImage(index, gallery, 'up');
        },

        _showImage: function(e, a, b) {
            var that = this;
            var index, gallery;
            if (a == null || b == null) {
                var elem = e.target;
                var index = elem.parentElement.getAttribute('index');
                var gallery = elem.parentElement.getAttribute('gallery');
            } else {
                for (var i = 0; i < this.galleries[a].length; i++)
                    if (this.galleries[a][i].src == b) index = i;
                gallery = a;
            }

            this.indexOfSlide = index;



            if (document.getElementsByClassName('back-sign')[0])
                document.getElementsByClassName('back-sign')[0].style.display = 'none'; // add id to it
            if (document.getElementsByClassName('g-gallery-title')[0])
                document.getElementsByClassName('g-gallery-title')[0].style.display = 'none';
            var setting = document.createElement('div');
            setting.classList.add('setting', 'showImage');
            setting.id = 'show-setting'
            var imgSetting = document.createElement('img');
            imgSetting.src = makeUrl('public/arrow/setting.png');
            setting.appendChild(imgSetting);
            var closeSign = document.createElement('div');
            closeSign.classList.add('close-sign', 'showImage');
            closeSign.id = 'show-close-sign'
            var closeImage = document.createElement('img');
            closeImage.src = makeUrl('public/arrow/close.png');

            var txt = document.createElement('div');
            txt.classList.add("txtpng", 'showImage');

            var txtpng = document.createElement('img');
            let txtXwar = document.createElement('img');
            let txtJur = document.createElement('img');

            txtXwar.classList.add('txtXwar');
            txtJur.classList.add('txtJur');

            txtXwar.src = makeUrl('public/arrow/xwar.png');
            txtJur.src = makeUrl('public/arrow/jur.png');

            txtJur.style.left = -5 + 'px';

            txtXwar.style.right = -5 + 'px';


            txtpng.src = makeUrl('public/arrow/txt.png');
            txtpng.setAttribute('id', 'txtpng');
            txt.append(txtpng);
            txt.append(txtJur);
            txt.append(txtXwar);

            txtpng.addEventListener('click', function() {
                if (parseInt(this['overlay'])) {
                    that._showText(this.gallery, this.i)
                }
            })


            closeSign.append(closeImage)
            this.header.el.append(closeSign)
            this.header.el.appendChild(setting)
            this.header.el.appendChild(txt);

            $(txt).hover(function() {
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

                $(txtJur).animate({
                    left: "-=100"
                }, 400);
                $(txtXwar).animate({
                    right: "-=100"
                }, 400)
                $(this).unbind('mouseover mouseenter mouseleave')
                    //document.getElementById('txtpng').src = makeUrl('public/arrow/text1.png');   

                if (parseInt(txtpng['overlay'])) {
                    txtpng.style.opacity = 1;
                    txtJur.style.opacity = 0.5;
                    txtXwar.style.opacity = 0.5;
                } else {
                    txtpng.style.opacity = 0.5;
                    txtJur.style.opacity = 0.5;
                    txtXwar.style.opacity = 0.5;
                }

                txtJur.addEventListener('click', function() {
                    if ((that.galleries[gallery].length) > (parseInt(that.indexOfSlide) + 1) && !that.busy) {
                        if (that.activeEditor) that._closeEditor();
                        let model = Collection.getModelTwo(gallery, that.galleries[gallery][++that.indexOfSlide].src);
                        // window.history.pushState(null,null,'/gallery/show/' + model._id);  
                        Router.route(that.username, 'show/' + model._id)
                            //that._constructImage(++that.indexOfSlide,gallery,'up');              
                    }
                })

                txtXwar.addEventListener('click', function() {
                    if ((that.indexOfSlide - 1) > -1 && !that.busy) {
                        if (that.activeEditor) that._closeEditor();
                        let model = Collection.getModelTwo(gallery, that.galleries[gallery][--that.indexOfSlide].src);
                        //window.history.pushState(null,null,'/gallery/show/' + model._id); 
                        Router.route(that.username, 'show/' + model._id)
                            //that._constructImage(--that.indexOfSlide,gallery,'down');         
                    }
                })

            })

            closeSign.addEventListener('click', function() {
                that._closeShowImage.call(that);
                window.history.pushState(null, null, '/gallery/images/' + gallery)
            }, false)

            setting.addEventListener('click', function() {
                that._createMenu(that);
            })
            this._constructImage(index, gallery, null);

        },

        _closeShowImage: function() {

            if (this.activeEditor)
                this._closeEditor();

            document.getElementById('show-close-sign').remove();
            $('.image-view').remove();
            if (document.getElementsByClassName('back-sign')[0])
                document.getElementsByClassName('back-sign')[0].style.display = 'block';
            if (document.getElementsByClassName('g-gallery-title')[0])
                document.getElementsByClassName('g-gallery-title')[0].style.display = 'block';
            document.getElementById('show-setting').remove();
            document.getElementsByClassName('txtpng')[0].remove();
            if (this.slideShow)
                this._forSlideShow(this);
        },

        _closeEditor: function() {
            let editor = document.getElementById('gheader');
            editor.innerHTML = '';

            editor.style.left = 0;
            editor.style.top = 0;
            editor.style.display = 'none';
        },

        _upOrDown: function(upOdown, zIndex) {
            var activeElement = document.getElementsByClassName('active-image')[0];
            activeElement.style.zIndex = parseInt(zIndex) + 1;
            var height = activeElement.getAttribute('height');

            if (upOdown == "up") {
                activeElement.style.top = (height) + "px";
                $(activeElement).animate({
                    top: "-=" + (height)
                }, 400);
            } else if (upOdown == 'down') {
                activeElement.style.top = (-height) + 'px';
                $(activeElement).animate({
                    top: "+=" + (height)
                }, 400)
            }

        },

        _showText: function(gal, i) {
            var txt = document.createElement("div");
            var container = document.getElementsByClassName('active-image')[0];
            if (typeof(this.galleries[gal][i].text) !== 'undefined')
                txt.innerHTML = this.galleries[gal][i].text;


            txt.classList.add('text-ovrlay');

            var style = window.getComputedStyle(container);
            var var1 = style.getPropertyValue('width');
            var var2 = style.getPropertyValue('height');
            //input.width = parseInt(var1.substr(0,var1.length-2));
            //input.height = parseInt(var2.substr(0,var2.length-2)) ;
            txt.style.width = var1;
            txt.style.height = var2;
            txt.style.opacity = 0;

            let child = container.children;
            child[0].style.opacity = 0.2;
            $(child[0]).animate({
                opacity: 0.2
            }, 400, function() {
                $(txt).animate({
                    opacity: 1
                }, 1000)
            })
            container.append(txt);


        },

        _createMenu: function(t) {
            if (document.getElementsByClassName('text-desc').length)
                document.getElementsByClassName('text-desc')[0].remove();
            var that = t;
            var menu = document.createElement('div');
            menu.classList.add('menu');
            var thumbview = document.getElementsByClassName('image-view')[0];
            var menuHtml = "<div class='mn'></div><div class='mn'>set cover</div><div class='mn'>text</div><div class='mn'>filters</div><div class='mn'>location</div><div class='mn'>share</div>";

            menu.innerHTML = menuHtml;

            thumbview.append(menu);
            var childs = menu.childNodes;
            for (var i = 0; i < childs.length; i++) {
                childs[i].setAttribute('id', this.menu[i]);
                childs[i].addEventListener('click', function(e) {
                    that._menuHandler.bind(that)(e);
                })
            }
        },

        _menuHandler: function(e) {
            var elem = e.target;

            switch (elem.id) {
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

        _filterHandler: function() {
            alert("filter")
        },
        _dirHandler: function() {
            alert("dir");
        },
        _coverHandler: function() {
            alert("cover")
        },
        _textHandler: function() {
            var that = this;
            document.getElementsByClassName('menu')[0].remove();
            var container = document.getElementsByClassName('image-view')[0];
            var input = document.createElement("div");
            input.setAttribute('contenteditable', 'true');

            var gal = container.getAttribute('gallery');
            var index = container.getAttribute('index');



            if (this.galleries[gal][index].text !== undefined) {
                //document.getElementById('txt').remove();
                input.innerHTML = this.galleries[gal][index].text;

            } else
                input.innerHTML = 'Type here';

            input.id = "Editor";
            input.classList.add('text-desc');
            input.style.top = '10px';

            var style = window.getComputedStyle(container);
            var var1 = style.getPropertyValue('width');
            var var2 = style.getPropertyValue('height');
            //input.width = parseInt(var1.substr(0,var1.length-2));
            //input.height = parseInt(var2.substr(0,var2.length-2)) ;
            input.style.width = var1;
            input.style.height = var2;

            container.append(input);
            this._adminText();
        },

        _adminText: function() {

            this._styleElements();
            return;
            var showImage = document.getElementsByClassName('showImage');
            for (var i = 0; i < showImage.length; i++)
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
                html += temp;
            });

            var editor = document.createElement('div');
            var style = window.getComputedStyle(this.header.el);
            var height = style.getPropertyValue('height');
            editor.style.height = height;
            editor.setAttribute('id', 't-editor');

            var mainEditorContainer = document.createElement('div');
            mainEditorContainer.setAttribute('id', 'mec');
            mainEditorContainer.style.height = height;

            editor.innerHTML = html;
            var bnext = document.createElement('div');
            bnext.setAttribute('id', 'bnextEditor');
            var nextBack = "<span id='bckeditor'><img class='edimg' src=" + makeUrl('public/arrow/hbck.png') + "></span><span id='nxteditor'><img class='edimg' src='public/arrow/hnxt.png'></span>";
            var saveExit = "<span id='save'>Save</span><span id='exit'>Exit<span/>";
            var svit = document.createElement('div');
            svit.setAttribute('id', 'saveExit');
            svit.innerHTML = saveExit;
            var nbholder = document.createElement('div');
            nbholder.setAttribute('id', 'nbholder');
            nbholder.innerHTML = nextBack;
            this.header.el.appendChild(nbholder);
            this.header.el.appendChild(editor);

            this.header.el.appendChild(svit)

            document.getElementById('bckeditor').addEventListener('click', this._editorBack)
            document.getElementById('nxteditor').addEventListener('click', this._editorForward);
            document.getElementById('save').addEventListener('click', this._saveContent)
            document.getElementById('exit').addEventListener('click', this._exitContent)
        },

        _exitContent: function() {

        },
        _saveContent: function() {
            var editor = document.getElementById('Editor');
            var img = document.getElementsByClassName('pimage')[0];
            var index = document.getElementsByClassName('image-view')[0];
            var i = index.getAttribute('index');

            var obj = {
                gallery: img['gallery'],
                src: img['url'],
                text: editor.innerHTML
            };
            var xhr = new XMLHttpRequest();
            xhr.open('post', '/gallery/text');
            xhr.onreadystatechange = function() {
                if (this.readyState == 4) {
                    //do something to show it has saved      
                }
            }
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(obj));

        },

        _editorForward: function() {
            var editor = document.getElementById('t-editor');
            var style = window.getComputedStyle(editor);
            var width = style.getPropertyValue('width')
            var left = style.getPropertyValue('left');

            $('#t-editor').animate({
                left: '+=60'
            }, 200, function() {})
        },

        _editorBack: function() {
            var editor = document.getElementById('t-editor');
            var style = window.getComputedStyle(editor);
            var width = style.getPropertyValue('width');
            var left = style.getPropertyValue('left');

            $('#t-editor').animate({
                left: '-=60'
            }, 200, function() {})
        },
        _locationHandler: function() {
            alert("location")
        },
        _shareHandler: function() {
            alert("shareHandler")
        },

        _backMenu: function(elem) {
            alert(elem.id)
        },

        _showSelection: function() {
            var textComponent = document.getElementById('Editor');
            var selectedText;

            if (textComponent.selectionStart !== undefined) { // Standards Compliant Version
                var startPos = textComponent.selectionStart;
                var endPos = textComponent.selectionEnd;
                selectedText = textComponent.value.substring(startPos, endPos);
            } else if (document.selection !== undefined) { // IE Version
                textComponent.focus();
                var sel = document.selection.createRange();
                selectedText = sel.text;
            }

            alert("You selected: " + selectedText);
        },

        _forSlideShow: function(that) {
            if (that.isMobile()) {
                $('#tiler').animate({
                    top: '+=155'
                }, 400, function() {
                    this.style.zIndex = 200;
                    document.getElementById('cgbtn').style.display = 'block';
                    //document.getElementById('homeback').style.display = 'block';
                    // document.getElementById('tile').src = makeUrl('public/arrow/tile.png');  
                    that.slideShow = 0;
                    var tile = document.getElementById('tile');
                    tile['up'] = 0;
                });
            } else {
                $('#tiler').animate({
                    top: '+=224'
                }, 400, function() {
                    this.style.zIndex = 200;
                    document.getElementById('cgbtn').style.display = 'block';
                    //document.getElementById('homeback').style.display = 'block';
                    // document.getElementById('tile').src = makeUrl('public/arrow/tile.png');  
                    that.slideShow = 0;
                    var tile = document.getElementById('tile');
                    tile['up'] = 0;
                });
            }



        },

        _showImages: function(arr, gallery) {
            /* var gallery,elem;
       var that = this;    	
    	 if(gal == null){
    	   elem = e.target;
         gallery =  elem.parentElement.getAttribute('name');
    	 }else{
    	  gallery = gal; 
    	 }*/

            try {
                document.getElementById('g-gallery-title').remove();
                document.getElementById('back-sign').remove();
            } catch (e) {

            }


            if (document.getElementById('pp'))
                document.getElementById('pp').style.display = 'none'
            if (!this._isLoggedIn()) {
                try {
                    document.getElementById('pp').remove()
                } catch (e) {

                }
            } else {
                /*  this.header.el.appendChild(this._profilePic());
           document.getElementById('cgbtn').style.display = 'none'; */
            }


            var that = this;
            if (document.getElementById('thumbview'))
                document.getElementsByClassName('thumbview')[0].remove();
            var mobile = this.isMobile();
            var div = document.createElement('div');

            div.classList.add('thumbview');
            div.id = 'thumbview';
            var pool = document.getElementById('pool');

            div.style.width = this.uploader.view + 'px';
            div.style.height = this._getHeightView() + 'px';
            div.style.left = -(this.uploader.view) + 'px';

            document.getElementById('homeback').style.display = 'none';
            document.getElementById('cgbtn').style.display = 'none';


            var backSign = document.createElement('div'); //        add id to it 
            backSign.classList.add('back-sign');
            backSign.id = 'back-sign';

            var image = new Image();

            image.src = makeUrl('public/arrow/home.png');
            backSign.appendChild(image);

            let span = document.createElement('span');
            span.id = 'g-gallery-title';
            span.classList.add('g-gallery-title');

            backSign.style.float = 'left'
            span.innerHTML = gallery;

            if (this._isLoggedIn()) {
                span.style.color = 'grey';
                span.style.cursor = 'pointer';
                span.addEventListener('click', this._editGallery.bind(this, gallery));
            }

            backSign.addEventListener('click', this._backToIndex.bind(this), false)
            if (mobile) {
                backSign.classList.add('mback-sign');
                span.style.fontSize = 12 + 'px';
                span.style.top = 9 + 'px';
            } else {
                backSign.classList.add('dback-sign');
                span.style.fontSize = 14 + 'px';
                span.style.top = 9 + 'px';
            }

            this.header.el.append(backSign);
            this.header.el.appendChild(span)

            //var arr = this.galleries[gallery];
            for (var i = 0; i < arr.length; i++) {
                this._galleryShow(arr[i], i + 1, div, gallery);
            }

            pool.appendChild(div);
            const ps = new PerfectScrollbar(div, {
                suppressScrollX: true
            });

            $(div).animate({
                left: '+=' + this.uploader.view
            }, 200)
        },

        _editGallery: function(gallery) {

            document.getElementById('g-gallery-title').remove();
            document.getElementById('back-sign').remove();
            let images = Collection.getGallery(gallery);
            document.getElementById('pool').innerHTML = '';
            let that = this;
            this._prepareEditGallery(gallery, function() {
                that._setUpload(gallery);
                for (let i = 0; i < images.length; i++) {
                    let child = document.getElementById('pool').children;
                    //this.addedToCollection(images[i],child)
                    //this._removeFromPool(images[i]);

                    that._addModel(images[i], child.length, null);
                    that._recalculateMargin()
                }
            });





        },

        _backToIndex: function() {
            try {
                document.getElementById('back-sign').remove();
                document.getElementById('g-gallery-title').remove()
                    // document.getElementById('homeback').style.display = 'block';	
            } catch (e) {

            }

            if (!this._isLoggedIn()) {
                if (document.getElementById('pp'))
                    document.getElementById('pp').remove();
                this.header.el.appendChild(this._profilePic())
            } else {
                document.getElementById('cgbtn').style.display = 'block';
            }

            Router.route(this.username, 'archive');

        },

        _getHeightView: function() {
            var header = 0;
            var height = 0;
            if (this.isMobile()) {
                header = this.header.height + this.main.mobile.top;
                height = this.windowHeight - header;
            } else {
                header = this.header.height + this.main.desktop.top;
                height = this.windowHeight - header;

            }

            return height;
        },
        _upload: function() {
            this.upload.notify(this.queue)
        },
        _remove: function() { // not supported by IE     
            var that = this;
            if (this.isMobile()) {
                $('.mtemplate-upload').filter(function(index) {
                    return this['green'] == 0;
                }).animate({
                    opacity: 0
                }, 400, function() {
                    that._removeFromPool({
                        src: this['name']
                    }, null);
                    this.remove();
                })
            } else {
                $('.template-upload').filter(function(index) {
                    return this['green'] == 0;
                }).animate({
                    opacity: 0
                }, 400, function() {
                    that._removeFromPool({
                        src: this['name']
                    }, null);
                    this.remove();
                })
            }
            this.remove.notify(this.removedDownload)
        },
        _removeThumb: function(arr) {


        },
        _setCover: function() {},
        _createGallery: function() {
            var isChrome = /chrome/i.test(navigator.userAgent);
            this.uploader.position = 0;
            $('#uploader').css('left', 0)
            var input = document.getElementById('input');
            var label = document.getElementById('input-label');
            document.getElementById('input-name').value = "";
            if ($(label).css('left') === '-100px')
                $(label).css('left', 0).css('opacity', 0.25);
            document.getElementById('homeback').style.display = 'none'
            document.getElementById('arrow').style.display = 'none';
            document.getElementById('cgbtn').style.display = 'none';
            document.getElementById('back-next').style.display = 'none';
            document.getElementById('back-reset').style.display = "block";
            document.getElementById('galback').style.display = 'none';


            var tile = document.getElementById('tile');
            if (tile && tile['up']) {
                if (this.windowWidth < this.mainWidth)

                    $('#tiler').animate({
                    top: '+=155'
                }, 400, function() {

                    tile['up'] = 0;
                    document.getElementById('pool').innerHTML = '';
                })
                else
                    $('#tiler').animate({
                        top: '+=224'
                    }, 400, function() {

                        tile['up'] = 0;
                        document.getElementById('pool').innerHTML = '';
                    })
            }

            $('.dtemplate-gallery').remove()
            $('.template-download').remove();
            $('.dtemplate-download').remove();
            $('.mtemplate-download').remove();
            $('.mtemplate-gallery').remove();
            if ($(document).width() > 900) {
                $('#back-reset').removeClass('mbreset');
                $('#back-reset').addClass('dbreset');
                $('#input-label').addClass('dinlabel');
                $('#input-name').addClass('dinname');
                $('#input-create').addClass('dincreate')
                input.style.width = '216px';
                if (isChrome) {
                    $('#input-create').css({
                        'padding-top': '4px',
                        'font-stretch': 'expanded',
                        'letter-spacing': '1px'
                    })

                } else {

                }
                input.style.top = "70px";
                input.style.left = '410px'
            } else {

                $('#back-reset').removeClass('dbreset');
                $('#back-reset').addClass('mbreset');
                $('#input-label').addClass('minlabel');
                $('#input-name').addClass('minname');
                $('#input-create').addClass('mincreate')
                var winsize = $(document).width();

                input.style.top = '60px';
                input.style.width = '175px';


                if (isChrome) {
                    $('#back-reset').css({
                        'font-size': '14px',
                        'padding-top': '2px'
                    })
                    $('#back-next').css({
                        'top': '12px'
                    })
                    $('#input-create').css({
                        'font-size': '14px',
                        'padding-top': '4px',
                        'font-stretch': 'expanded',
                        'letter-spacing': '1px'
                    })
                    $('#input-label').css({
                        'font-size': '14px'
                    })
                }

                var lft = parseInt((this.windowWidth - 275) / 2);
                input.style.left = lft + 100 + 'px';
            }

            input.style.display = 'block';
            label.style.display = 'block';

            document.getElementById('back-reset').innerHTML = 'back'


            // this.createGallery.notify("I have been clicked");    
        },


        _prepareEditGallery: function(gallery, callback) {
            var isChrome = /chrome/i.test(navigator.userAgent);
            this.uploader.position = 0;
            $('#uploader').css('left', 0)
            var input = document.getElementById('input');
            var label = document.getElementById('input-label');
            document.getElementById('input-name').value = "";
            if ($(label).css('left') === '-100px')
                $(label).css('left', 0).css('opacity', 0.25);
            document.getElementById('homeback').style.display = 'none'
            document.getElementById('arrow').style.display = 'none';
            document.getElementById('cgbtn').style.display = 'none';
            document.getElementById('back-next').style.display = 'none';
            document.getElementById('back-reset').style.display = "block";
            document.getElementById('galback').style.display = 'none';

            document.getElementById('back-reset').innerHTML = gallery;



            var tile = document.getElementById('tile');
            if (tile && tile['up']) {
                if (this.windowWidth < this.mainWidth)

                    $('#tiler').animate({
                    top: '+=155'
                }, 400, function() {
                    //document.getElementById('tile').src = makeUrl('public/arrow/tile.png');    
                    tile['up'] = 0;
                    document.getElementById('pool').innerHTML = '';
                    callback();
                })
                else
                    $('#tiler').animate({
                        top: '+=224'
                    }, 400, function() {
                        // document.getElementById('tile').src = makeUrl('public/arrow/tile.png');    
                        tile['up'] = 0;
                        document.getElementById('pool').innerHTML = '';
                        callback()
                    })
            }

            $('.dtemplate-gallery').remove()
            $('.template-download').remove();
            $('.dtemplate-download').remove();
            $('.mtemplate-download').remove();
            $('.mtemplate-gallery').remove();
            if ($(document).width() > 900) {
                $('#back-reset').removeClass('mbreset');
                $('#back-reset').addClass('dbreset');
                $('#input-label').addClass('dinlabel');
                $('#input-name').addClass('dinname');
                $('#input-create').addClass('dincreate')
                input.style.width = '216px';
                if (isChrome) {
                    $('#input-create').css({
                        'padding-top': '4px',
                        'font-stretch': 'expanded',
                        'letter-spacing': '1px'
                    })

                } else {

                }
                input.style.top = "70px";
                input.style.left = '410px'
            } else {

                $('#back-reset').removeClass('dbreset');
                $('#back-reset').addClass('mbreset');
                $('#input-label').addClass('minlabel');
                $('#input-name').addClass('minname');
                $('#input-create').addClass('mincreate')
                var winsize = $(document).width();

                input.style.top = '60px';
                input.style.width = '175px';


                if (isChrome) {
                    $('#back-reset').css({
                        'font-size': '14px',
                        'padding-top': '2px'
                    })
                    $('#back-next').css({
                        'top': '12px'
                    })
                    $('#input-create').css({
                        'font-size': '14px',
                        'padding-top': '4px',
                        'font-stretch': 'expanded',
                        'letter-spacing': '1px'
                    })
                    $('#input-label').css({
                        'font-size': '14px'
                    })
                }

                var lft = parseInt((this.windowWidth - 275) / 2);
                input.style.left = lft + 100 + 'px';
            }

            input.style.display = 'none';
            label.style.display = 'none';
        },


        _bckGallery: function() {
            var that = this;
            var howMuch = this._howMuchToSlide(false);
            if (this.uploader.busy || !howMuch) return;
            this.uploader.busy = 1;

            if (this.isMobile()) {

                $('#uploader').animate({
                    left: "-=" + howMuch
                }, 1000, function() {
                    that.uploader.position -= howMuch;
                    that.uploader.busy = 0;
                })
            } else {
                $()

                $('#uploader').animate({
                    left: "-=" + howMuch
                }, 1000, function() {
                    that.uploader.position -= howMuch;
                    that.uploader.busy = 0;
                })
            }
            this.bckGallery.notify("back Gallery has been clicked");
        },

        _howMuchToSlide: function(direction) {
            if (this.isMobile()) {
                var unit = this.mobile.width + this.mobile.margin;
                if (direction) {
                    if (Math.abs(this.uploader.position) > 2 * unit)
                        return 2 * unit;
                    else if (Math.abs(this.uploader.position) = unit)
                        return unit;
                    else
                        return Math.abs(this.uploader.position)
                } else {
                    var newLength = this.uploader.mobile + this.uploader.position
                    var left = newLength - this.uploader.view;
                    if (left > 2 * unit)
                        return 2 * unit;
                    else if (left > unit)
                        return unit;
                    else
                        return 0;
                }
            } else {
                var unit = this.desktop.width + this.desktop.margin;
                if (direction) {
                    if (Math.abs(this.uploader.position) >= 2 * unit)
                        return 2 * unit;
                    else if (Math.abs(this.uploader.position) == unit)
                        return unit;
                    else
                        return Math.abs(this.uploader.position);
                } else {
                    var newLength = this.uploader.desktop + this.uploader.position
                    var left = newLength - this.uploader.view;
                    if (left >= 2 * unit)
                        return 2 * unit;
                    else if (left >= unit)
                        return unit;
                    else
                        return left;
                }
            }
        },

        _nxtGallery: function() {
            var that = this;
            var howMuch = this._howMuchToSlide(true);
            if (this.uploader.busy || !howMuch) return;
            this.uploader.busy = 1;
            if (this.isMobile()) {

                $('#uploader').animate({
                    left: "+=" + howMuch
                }, 1000, function() {
                    that.uploader.position += howMuch;
                    that.uploader.busy = 0;
                })
            } else {

                $('#uploader').animate({
                    left: "+=" + howMuch
                }, 1000, function() {
                    that.uploader.position += howMuch;
                    that.uploader.busy = 0;

                })
            }
            this.nxtGallery.notify("next gallery has been clicked");
        },

        _arwUp: function() {
            let that = this;
            let contentArticle = document.getElementById('main');
            let iheader = document.getElementById('iheader');
            let tags = document.createElement('div');
            tags.innerHTML = tgs;
            
            
            document.body.appendChild(tags);
            if (this.isMobile()) {
                tags.style.width = this.config.mWidth + 'px';
            } else {
                tags.style.width = this.config.mainWidth + 'px';
            }

            tags.style.marginLeft = 'auto';
            tags.style.marginRight = 'auto';

            if (contentArticle.hasOwnProperty('hidden')) {
                contentArticle.style.display = 'none';
                iheader.style.display = 'none';
                tags.style.display = 'block';
            }


            contentArticle.style.display = 'none';
            iheader.style.display = 'none';
            tags.style.display = 'block';

            //tags.style.width = window.innerWidth + 'px';
            // tags.style.height = window.innerHeight + 'px';   

            let tagsContainer = document.getElementById('e-tags-container');
            let header = document.getElementById('e-tags-header');
            let btn = document.getElementById('e-tags-headerbtn');
            let mytags = document.getElementById('mytags');
            let back = document.getElementById('e-tags-back');
            back.src = makeUrl('public/arrow/close.png');

            if (document.getElementsByClassName('e-tag-location')[0])
                document.getElementsByClassName('e-tag-location')[0].remove();
            let location = document.createElement('div');
            let input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'tag'
            input.classList.add('e-tags-input')

            let hash = document.createElement('span');
            hash.innerHTML = '#'
            hash.classList.add('e-tags-hash')
            location.appendChild(hash)
            location.appendChild(input)

            let current = document.getElementById('e-tags-current')
            let prev = document.getElementById('e-tags-prev')
            let prevhead = document.getElementById('e-tags-prevhead');

            if (this.isMobile()) {
                tagsContainer.style.width = this.config.mWidth + 'px';
                header.style.height = 30 + 'px';
                mytags.style.width = this.config.mWidth + 'px';
                mytags.style.height = (window.innerHeight - 60) + 'px';
                mytags.style.position = 'relative';
                mytags.style.top = 20 + 'px';

                btn.classList.add('de-tags-headerbtn');
                back.classList.add('e-tags-back');
                location.classList.add('e-tags-location');
                location.style.left = ((this.config.mWidth) / 2 - 100) + 'px';

                current.style.height = 50 + 'px';
                current.style.width = this.config.mWidth + 'px';

                prev.style.height = (window.innerHeight - 110) + 'px';
                prevhead.style.height = 30 + 'px'
            } else {
                tagsContainer.style.width = this.config.mainWidth + 'px';
                header.style.height = 30 + 'px';
                mytags.style.width = this.config.mainWidth + 'px';
                mytags.style.height = (window.innerHeight - 60) + 'px';
                mytags.style.position = 'relative';
                mytags.style.top = 20 + 'px';

                btn.classList.add('de-tags-headerbtn');
                back.classList.add('e-tags-back');
                location.classList.add('e-tags-location');
                location.style.left = ((this.config.mainWidth) / 2 - 100) + 'px';

                current.style.height = 50 + 'px';
                current.style.width = this.config.mainWidth + 'px';

                prev.style.height = (window.innerHeight - 110) + 'px';
                prevhead.style.height = 30 + 'px'

            }

            btn.addEventListener('click', function() {
                if (input.value == '') return;
                let span = document.createElement('span');
                span.innerHTML = input.value;
                span.classList.add('e-tags-tagspan')
                current.appendChild(span);
            })

            back.addEventListener('click', function() {
                let tgs = [];

                if (document.getElementsByClassName('e-tags-tagspan')) {
                    for (let tag of document.getElementsByClassName('e-tags-tagspan')) {
                        tgs.push(tag.innerHTML)
                    }
                    that.tags = tgs;
                }

                tags.remove();
                contentArticle.style.display = 'block';
                iheader.style.display = 'block';
            })

            header.appendChild(location)
            this.arwUp.notify("arw Up gallery is clicked")
        },

        _arwDown: function() {
            let that = this;
            let contentArticle = document.getElementById('main');
            let iheader = document.getElementById('iheader');
            // let  dialog1=  document.getElementById('e-dialog');

            let dialog = document.createElement('div');
            dialog.innerHTML = lck;          

            document.body.appendChild(dialog);

            if (this.isMobile()) {
                dialog.style.width = this.config.mWidth + 'px';
            } else {
                dialog.style.width = this.config.mainWidth + 'px';
            }

            dialog.style.marginLeft = 'auto';
            dialog.style.marginRight = 'auto';

            if (contentArticle.hasOwnProperty('hidden')) {
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
            back.src = makeUrl('public/arrow/close.png');
            let location = document.createElement('div');
            let marker;


            if (this.isMobile()) {
                dialogContainer.style.width = this.config.mWidth + 'px';
                header.style.height = 30 + 'px';
                mymap.style.width = this.config.mWidth + 'px';
                mymap.style.height = (window.innerHeight - 60) + 'px';
                mymap.style.position = 'relative';
                mymap.style.top = 20 + 'px';
                mymap.style.backgroundColor = 'lightblue'
                btn.classList.add('de-dialog-headerbtn');
                back.classList.add('e-dialog-back')
                location.classList.add('e-dialog-location')
                location.style.left = ((this.config.mWidth) / 2 - 100) + 'px';
            } else {
                dialogContainer.style.width = this.config.mainWidth + 'px';
                header.style.height = 30 + 'px';
                mymap.style.width = this.config.mainWidth + 'px';
                mymap.style.height = (window.innerHeight - 60) + 'px';
                mymap.style.position = 'relative';
                mymap.style.top = 20 + 'px';
                mymap.style.backgroundColor = 'lightblue'
                btn.classList.add('de-dialog-headerbtn');
                back.classList.add('e-dialog-back')
                location.classList.add('e-dialog-location')
                location.style.left = ((this.config.mainWidth) / 2 - 100) + 'px';
            }

            // header.appendChild(back) 
            header.appendChild(location)

            let map = L.map('mapSelect').setView([51.505, -0.09], 13);
            L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 18,
                id: 'mapbox.streets',
                accessToken: 'pk.eyJ1IjoiMWlvMWwiLCJhIjoiY2psNThyd3luMGVsMjN4bnR3bXc4MXV2cyJ9.ks2qVsrV6d1rXu54-CyqIw'
            }).addTo(map);


            map.on('click', function(e) {
                location.innerHTML = e.latlng.toString()
                location.position = e.latlng;
                if (marker) {
                    map.removeLayer(marker);
                    marker = new L.Marker(e.latlng);
                    marker.addTo(map)
                } else {
                    marker = new L.Marker(e.latlng);
                    marker.addTo(map)
                }

            })



            back.addEventListener('click', function() {
                dialog.remove();
                contentArticle.style.display = 'block';
                iheader.style.display = 'block';

            })

            btn.addEventListener('click', function() {
                if (location.hasOwnProperty('position')) {
                    that.location = location.position;
                    that.getloc = [location.position.lng, location.position.lat];
                }

                dialog.remove();
                contentArticle.style.display = 'block';
                iheader.style.display = 'block';
            });

            document.appendChild(dialog);
            this.arwDown.notify("arw Down has been clicked");
        },

        _backReset: function() {
            document.getElementById('input').style.display = 'none';
            document.getElementById('back-reset').style.display = 'none';
            document.getElementById('back-next').style.display = 'none'; // TODO add class to do this all
            document.getElementById('cgbtn').style.display = 'block';
            document.getElementById('arrow').style.display = 'block';

            $('.template-upload').remove();
            $('.mtemplate-upload').remove();
            $('.mtemplate-gallery').remove();

            $('.dtemplate-gallery').remove();
            document.getElementById('pool').innerHTML = '';
            if (this.isMobile()) {
                document.getElementById('space-wrapper').style.left = '-277px';
            } else {
                document.getElementById('space-wrapper').style.left = '-324px';
            }
            document.getElementById('space-wrapper').style.display = 'none';
            document.getElementById('galback').style.display = 'block';

            document.getElementById('back-reset').style.textAlign = 'right';
            View._upTile();
            Router.route(username, '/images/' + document.getElementById('back-reset').innerHTML);

        },



        _galleries() {
            var that = this;
            var xhr = new XMLHttpRequest();
            xhr.open('GET', '/index');
            xhr.onreadystatechange = function() {
                if (this.readyState == 4) {
                    that.loadGalleries(xhr.responseText);
                }
            }

            xhr.send();
        },

        _browseFile: function() {
            $('#files').trigger('click');
        },

        _setUpload: function(gallery) {
            if (document.getElementById('input-name').value != '') {
                this.galleryName = document.getElementById('input-name').value; // TODO regex for gallery name
                document.getElementById('back-reset').innerHTML = this.galleryName;
            } else {
                document.getElementById('back-reset').innerHTML = gallery;
            }


            document.getElementById('back-reset').style.display = 'block'

            document.getElementById('input').style.display = 'none';
            document.getElementById('arrow').style.display = 'block';
            document.getElementById('back-next').style.display = 'block';
            document.getElementById('space-wrapper').style.display = 'block';
            var mobile = this.isMobile();
            if (mobile)
                $('#space-wrapper').animate({
                    left: "+=277"
                }, 1000);
            else
                $('#space-wrapper').animate({
                    left: "+=324"
                }, 1000);
            $('.space--remove-text').hover(function() {
                $(this).css('color', 'tomato');
                $('.space--remove').css('background-color', 'gray');
            }, function() {
                $('.space--remove').css('background-color', 'tomato');
                $(this).css('color', 'gray');
            })

            $('.space--upload-text').hover(function() {
                $('.space--upload').css('background-color', 'gray');
                $(this).css('color', 'green');
            }, function() {
                $('.space--upload').css('background-color', 'green');
                $(this).css('color', 'gray');
            })


        },

        _getInput: function(e) {
            var that = e.target;
            var files = that.files;
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                this._getOrientation(file, this._getImages, this)
                    //this._getImages(file)      
            }
        },

        _getImages: function(file, that, orientation) {
            if (orientation == -1 || orientation == -2) return;
            that.orientation = orientation;

            var reader = new FileReader();
            reader.addEventListener('load', function() {
                var image = new Image();
                image.name = file.name;
                that.files.push(file);
                image.addEventListener('load', that._renderTemplate.bind(that), false);
                image.src = reader.result;
            })

            reader.readAsDataURL(file);
        },

        _getOrientation: function(file, callback, that) {
            var reader = new FileReader();
            reader.onload = function(e) {

                var view = new DataView(e.target.result);

                if (view.getUint16(0, false) != 0xFFD8) return callback(file, that, -2);
                var length = view.byteLength,
                    offset = 2;
                while (offset < length) {
                    var marker = view.getUint16(offset, false);
                    offset += 2;
                    if (marker == 0xFFE1) {
                        if (view.getUint32(offset += 2, false) != 0x45786966) return callback(file, that, -1);
                        var little = view.getUint16(offset += 6, false) == 0x4949;
                        offset += view.getUint32(offset + 4, little);
                        var tags = view.getUint16(offset, little);
                        offset += 2;

                        for (var i = 0; i < tags; i++)
                            if (view.getUint16(offset + (i * 12), little) == 0x0112) {

                                that.fileName.push({
                                    "name": file.name,
                                    "value": view.getUint16(offset + (i * 12) + 8, little)
                                })
                                return callback(file, that, view.getUint16(offset + (i * 12) + 8, little));

                            }
                    } else if ((marker & 0xFF00) != 0xFF00) break;
                    else offset += view.getUint16(offset, false);
                }

                return callback(file, that, -1);
            };

            reader.readAsArrayBuffer(file);
        },
        _renderGallery: function(img) {
            var that = this;
            var mobile = this.isMobile();
            var image = new Image();
            var templateGallery = document.createElement('div');
            var gallery = document.createElement('div');
            var preview = document.createElement('div');
            var label = document.createElement('div');

            if (mobile) {

                if (img.width > img.height) {
                    image.width = this.mobile.width;
                    image.height = parseInt(this.mobile.width * (img.height / img.width));
                } else {
                    image.width = parseInt(this.mobile.width * (img.width / img.height));
                    image.height = this.mobile.width;
                }
                var marginLeft = parseInt((this.mobile.width - image.width) / 2);
                var marginTop = parseInt((this.mobile.width - image.height) / 2);
                image.style.position = 'relative';
                image.style.top = marginTop + 'px';
                image.style.left = marginLeft + 'px';

                preview.classList.add('mpreview');
                templateGallery.classList.add('mtemplate-gallery');
                label.classList.add('mgallery-name');

            } else {

                if (img.width > img.height) {
                    image.width = this.desktop.width;
                    image.height = parseInt(this.desktop.width * (img.height / img.width));
                } else {
                    image.width = parseInt(this.desktop.width * (img.width / img.height));
                    image.height = this.desktop.width;
                }
                var marginLeft = parseInt((this.desktop.width - image.width) / 2);
                var marginTop = parseInt((this.desktop.width - image.height) / 2);
                image.style.position = 'relative';
                image.style.top = marginTop + 'px';
                image.style.left = marginLeft + 'px';

                preview.classList.add('preview');
                templateGallery.classList.add('dtemplate-gallery');
                label.classList.add('gallery-name')
            }

            label.innerHTML = img.gallery;
            image.src = makeUrl('uploads/' + img.username + '/gallery/' + img.gallery + '/thumb/' + img.src);

            preview.appendChild(image);
            templateGallery.setAttribute('name', img.gallery);

            templateGallery.appendChild(preview);
            templateGallery.appendChild(label);

            image.onload = function() {
                $(templateGallery).animate({
                    opacity: 1
                }, 400);
            }
            that._uploader(true);
            that.uploader.el.appendChild(templateGallery);
            templateGallery.addEventListener('click', function() {
                //that._fullPool(img.gallery);       
            }, false)

        },
        _renderTemplate: function(e) {
            var image = e.target
            var width = image.width;
            var height = image.height;
            var that = this;
            var orientation = -1;
            var mobile = this.isMobile();
            for (var i = 0; i < this.fileName.length; i++) {
                if (this.fileName[i].name == image.name) {
                    orientation = this.fileName[i].value;
                    break;
                }
            }

            if (orientation < 0 && orientation > 9) return; // TODO error invalid orientation -1,-2 is not valid 

            var templateUpload = document.createElement("div");
            var preview = document.createElement('div');
            var canvas = document.createElement('canvas');

            var ctx = canvas.getContext('2d');

            if (4 < orientation && orientation < 9) {

                if (width > height) {
                    if (mobile) {
                        height = parseInt(100 * (height / width))
                        width = 100;
                    } else {
                        height = parseInt(150 * (height / width))
                        width = 150;
                    }

                } else {
                    if (mobile) {
                        width = parseInt(100 * (width / height));
                        height = 100;
                    } else {
                        width = parseInt(150 * (width / height));
                        height = 150;
                    }

                }

                canvas.width = height;
                canvas.height = width;

            } else {

                if (width > height) {
                    if (mobile) {
                        height = parseInt(100 * (height / width))
                        width = 100;
                    } else {
                        height = parseInt(150 * (height / width))
                        width = 150;
                    }

                } else {
                    if (mobile) {
                        width = parseInt(100 * (width / height));
                        height = 100;
                    } else {
                        width = parseInt(150 * (width / height));
                        height = 150;
                    }
                }

                canvas.width = width;
                canvas.height = height;
            }

            image.width = width;
            image.height = height;

            if (mobile) {
                var marginLeft = parseInt((100 - canvas.width) / 2);
                var marginTop = parseInt((100 - canvas.height) / 2);
                canvas.style.position = 'relative';
                canvas.style.top = marginTop + 'px';
                canvas.style.left = marginLeft + 'px';
            } else {
                var marginLeft = parseInt((150 - canvas.width) / 2);
                var marginTop = parseInt((150 - canvas.height) / 2);
                canvas.style.position = 'relative';
                canvas.style.top = marginTop + 'px';
                canvas.style.left = marginLeft + 'px';
            }

            switch (orientation) {
                case 2:
                    ctx.transform(-1, 0, 0, 1, width, 0);
                    break;
                case 3:
                    ctx.transform(-1, 0, 0, -1, width, height);
                    break;
                case 4:
                    ctx.transform(1, 0, 0, -1, 0, height);
                    break;
                case 5:
                    ctx.transform(0, 1, 1, 0, 0, 0);
                    break;
                case 6:
                    ctx.transform(0, 1, -1, 0, height, 0);
                    break;
                case 7:
                    ctx.transform(0, -1, -1, 0, height, width);
                    break;
                case 8:
                    ctx.transform(0, -1, 1, 0, 0, width);
                    break;
                default:
                    break;
            }

            if (mobile) {
                preview.classList.add('mpreview');
                templateUpload.classList.add('mtemplate-upload')
            } else {
                preview.classList.add('preview');
                templateUpload.classList.add('template-upload')
            }

            ctx.drawImage(image, 0, 0, image.width, image.height);
            preview.appendChild(canvas);


            canvas.style.borderBottom = "3px solid green";
            canvas['green'] = 1;
            canvas['name'] = image.name;
            templateUpload['green'] = 1;
            templateUpload.setAttribute('name', image.name);
            that._addToQueue(image.name);

            $(canvas).hover(function() {
                if (this['green'] == 1) {
                    canvas.style.borderBottom = "3px solid tomato"
                } else {
                    canvas.style.borderBottom = "3px solid green";
                }

            }, function() {
                if (canvas['green'] == 1) {
                    canvas.style.borderBottom = "3px solid green"
                } else {
                    canvas.style.borderBottom = "3px solid tomato";
                }

            })

            canvas.addEventListener('click', function() {
                if (this['green'] == 1) {
                    this['green'] = 0;
                    templateUpload['green'] = 0;
                    that._removeFromQueue(this['name']);
                    this.style.borderBottom = "3px solid tomato";
                } else {
                    this['green'] = 1;
                    templateUpload['green'] = 1;
                    that._addToQueue(this['name']);
                    this.style.borderBottom = "3px solid green";
                }


            }, false)

            var progressbar = document.createElement('canvas');
            $(progressbar).addClass('progressbar');
            if (mobile) {
                progressbar.width = 100;
                progressbar.height = 23;
            } else {
                progressbar.width = 150;
                progressbar.height = 25;
            }


            templateUpload.appendChild(preview);
            templateUpload.appendChild(progressbar);

            this._uploader(true);
            this.uploader.el.appendChild(templateUpload);
            $(templateUpload).animate({
                opacity: 1
            }, 400);
        },

        _removeFromQueue: function(name) {
            var index = this.queue.indexOf(name);
            if (index > -1) {
                this.queue.splice(index, 1);
            }
        },

        _addToQueue: function(name) {
            this.queue.push(name);
        },

        _progress: function(progress) {
            var canvas;
            if (this.isMobile())
                canvas = $(".mtemplate-upload[name='" + progress.name + "']").find('.progressbar')[0];
            else
                canvas = $(".template-upload[name='" + progress.name + "']").find('.progressbar')[0];
            // var prog = progress.recived/progress.expected; 
            var prog = progress.percent;
            var x = Math.floor(canvas.width / 2);
            var y = Math.floor(canvas.height / 2);
            var context = canvas.getContext('2d');
            var radius = 10 * Math.sqrt(prog);

            if (canvas.hasOwnProperty('progressing')) {
                context.beginPath();
                context.arc(parseInt(x), parseInt(y), radius.toFixed(2), 0, Math.PI * 2, true);
                context.closePath()
                context.fillStyle = 'green';
                context.fill();
            } else if (!canvas.hasOwnProperty('progressing')) {
                canvas['progressing'] = '1';
                context.beginPath();
                context.arc(parseInt(x), parseInt(y), 10, 0, Math.PI * 2, true);
                context.closePath();
                context.fillStyle = 'lightgray';
                context.fill();
            }

        },

        _clearUploadTemplate: function() {

        },

        _recalculateMargin: function() {
            var mobile = this.isMobile();
            var rows = this.pool.rowCount;

            if (mobile) {
                var num = document.getElementsByClassName('mtemplate-download');
                for (var i = 1; i < num.length + 1; i++) {
                    if (i % rows == 0) num[i - 1].style.marginRight = 0;
                    else num[i - 1].style.marginRight = this.pool.marginRight + 'px';
                }

            } else {
                var num = document.getElementsByClassName('template-download');

                for (var i = 1; i < num.length + 1; i++)
                    if ((i % rows == 0)) num[i - 1].style.marginRight = 0;
                    else num[i - 1].style.marginRight = this.pool.marginRight + 'px';
            }

        },
        /*--------------------------------- This can be reduced -----------------------------------------*/
        _marginRight: function() {
            var mobile = this.isMobile();
            var viewPort = this.uploader.view;

            if (mobile) {
                var space = viewPort - this.mobile.width;
                var unit = this.mobile.width + this.mobile.margin;
                var rem = space % unit;
                var num = Math.floor(space / unit);
                this.pool.rowCount = num + 1;

                this.pool.marginRight = parseInt(rem / num) + this.mobile.margin;
            } else {
                var space = viewPort - this.desktop.width;
                var unit = this.desktop.width + this.desktop.margin;
                var rem = space % unit;
                var num = Math.floor(space / unit);
                this.pool.rowCount = num + 1;
                this.pool.marginRight = parseInt(rem / num) + this.desktop.margin;
            }
        },
        _fullPool: function(gallery) {
            document.getElementById('pool').innerHTML = '';
            var arr = this.galleries[gallery];
            this._galSpace();
            for (var i = 0; i < arr.length; i++) {
                this._addModelToPool(arr[i], i + 1);
            }

        },

        _addModelToPool: function(thumb, index) {
            var that = this;
            var mobile = this.isMobile();
            var templateDownload = document.createElement('div');
            var image = new Image();

            if (mobile) {
                if (thumb.width > thumb.height) {
                    image.width = this.mobile.width;
                    image.height = parseInt(this.mobile.width * (thumb.height / thumb.width));

                } else {
                    image.width = parseInt(this.mobile.width * (thumb.width / thumb.height));
                    image.height = this.mobile.width;
                }

                templateDownload.classList.add('mtemplate-download');

                var left = parseInt((100 - image.width) / 2) + 'px';
            } else {
                templateDownload.classList.add('template-download');

                if (thumb.width > thumb.height) {
                    image.width = this.desktop.width;
                    image.height = parseInt(this.desktop.width * (thumb.height / thumb.width));

                } else {
                    image.width = parseInt(this.desktop.width * (thumb.width / thumb.height));
                    image.height = this.desktop.width;
                }
                var left = parseInt((150 - image.width) / 2) + 'px';
            }
            if ((index % this.pool.rowCount) == 0)
                templateDownload.style.marginRight = 0;
            else
                templateDownload.style.marginRight = this.pool.marginRight + 'px';
            templateDownload.setAttribute('name', thumb.src);
            templateDownload.setAttribute('gallery', thumb.gallery);
            templateDownload.setAttribute('index', index - 1);
            templateDownload['green'] = 1;

            image.style.position = 'relative';
            image.style.left = left;

            image.src = makeUrl("uploads/" + thumb.username + '/gallery/' + thumb.gallery + "/thumb/" + thumb.src);
            // $(image).addClass('template-green');

            image.addEventListener('load', function() {
                $(templateDownload).animate({
                    opacity: 1
                }, 400);
            })

            templateDownload.appendChild(image);
            var that = this;
            templateDownload.addEventListener('click', function(e) {
                that._upTile(e);
            })

            var pool = document.getElementById('pool');
            pool.appendChild(templateDownload)
        },


        _upTile: function(e) {
            var that = this;
            document.getElementById('homeback').style.display = 'none';
            document.getElementById('cgbtn').style.display = 'none';
            var tile = document.getElementById('tile');

            if (tile['up']) {
                if (this.windowWidth < this.mainWidth)

                    $('#tiler').animate({
                    top: '+=155'
                }, 1, function() {
                    //document.getElementById('tile').src = makeUrl('public/arrow/tile.png');    
                    tile['up'] = 0;
                    //document.getElementById('pool').innerHTML = '';
                })
                else
                    $('#tiler').animate({
                        top: '+=224'
                    }, 1, function() {
                        //document.getElementById('tile').src = makeUrl('public/arrow/tile.png');    
                        tile['up'] = 0;
                        //document.getElementById('pool').innerHTML = '';
                    })

            } else {
                //document.getElementById('pool').innerHTML = '';

                if (this.windowWidth < this.mainWidth)
                    $('#tiler').animate({
                        top: '-=155'
                    }, 1, function() {
                        //document.getElementById('tile').src = makeUrl('public/arrow/tileback.png');    
                        tile['up'] = 1;
                        /*
                                  if(e != null)
                                   that.slideShow = 1;
                                  if(e !=null && e !=1)
                                  that._showImage(e); */
                    })
                else
                    $('#tiler').animate({
                        top: '-=224'
                    }, 1, function() {
                        //document.getElementById('tile').src = makeUrl('public/arrow/tileback.png');    
                        tile['up'] = 1;
                        /* if(e != null) 
                         that.slideShow = 1;
                         if(e !=null && e != 1)
                         that._showImage(e);*/
                    })

            }
        },


        _addModel: function(thumb, index, callback) {
            var that = this;
            var mobile = this.isMobile();
            var templateDownload = document.createElement('div');
            var image = new Image();

            if (mobile) {
                templateDownload.classList.add('mtemplate-download');
                image.width = parseInt(thumb.width * 2 / 3);
                image.height = parseInt(thumb.height * 2 / 3);
                var left = parseInt((100 - image.width) / 2) + 'px';
            } else {
                templateDownload.classList.add('template-download');
                image.width = thumb.width;
                image.height = thumb.height;
                var left = parseInt((150 - image.width) / 2) + 'px';
            }
            if ((index % this.pool.rowCount) == 0)
                templateDownload.style.marginRight = 0;
            else
                templateDownload.style.marginRight = this.pool.marginRight + 'px';
            templateDownload.setAttribute('name', thumb.src);

            templateDownload['green'] = 1;

            image.style.position = 'relative';
            image.style.left = left;

            image.src = makeUrl("uploads/" + thumb.username + '/gallery/' + thumb.gallery + "/thumb/" + thumb.src);
            $(image).addClass('template-green');

            image.addEventListener('load', function() {
                if (callback)
                    $(templateDownload).animate({
                        opacity: 1
                    }, 400, function() {
                        callback()
                    });
                else
                    $(templateDownload).animate({
                        opacity: 1
                    }, 400);
            })

            $(image).hover(function() {
                var parent = this.parentElement;
                if (parent['green'] == 1) {
                    image.style.borderTop = '3px solid tomato';
                } else {
                    image.style.borderTop = '3px solid green';
                }
            }, function() {
                var parent = this.parentElement;
                if (parent['green'] == 1) {
                    image.style.borderTop = '3px solid green';
                } else {
                    image.style.borderTop = '3px solid tomato';
                }
            })

            image.addEventListener('click', function() {
                var parent = this.parentElement;
                if (parent['green'] == 1) {
                    parent['green'] = 0;
                    image.style.borderTop = '3px solid tomato';
                    that.removedDownload.push({
                        src: parent.getAttribute('name'),
                        height: 0,
                        width: 0
                    });
                } else {
                    parent['green'] = 1;
                    image.style.borderTop = '3px solid green';

                    var index = function(name) {
                        for (var i = 0; i < that.removedDownload.length; i++) {
                            if (that.removedDownload[i].src == name) {
                                return i;
                            }
                        }
                    }(parent.getAttribute('name'))

                    that.removedDownload.splice(index, 1);
                }
            }, false)

            templateDownload.appendChild(image);

            var pool = document.getElementById('pool');
            pool.appendChild(templateDownload);


        },

        _removeModel: function(thumb) {

        },

        _removeFromPool: function(args, callback) {
            var that = this;
            /* this.queue.splice(this.queue.indexOf(args.src),1); 
    	  for(var i = 0 ; i < this.files.length ; i++){
          if(this.files[i].name == args.src){ 
             this.files.splice(i,1);
             break;          
          } 	  
    	  }*/
            if (args.hasOwnProperty('height')) {
                if (this.isMobile()) {
                    $(".mtemplate-upload[name='" + args.src + "']").animate({
                        opacity: 0
                    }, 400, function() {
                        this.remove();
                        that._uploader(false);
                        if (callback) callback(args);
                    })
                } else {
                    $(".template-upload[name='" + args.src + "']").animate({
                        opacity: 0
                    }, 400, function() {
                        this.remove();
                        that._uploader(false);
                        if (callback) callback(args);
                    })
                }
            } else this._uploader(false);

            return;
        },

        _uploader: function(add) {
            var mobile = this.isMobile();
            var num, viewPort, unitLength;
            viewPort = this.uploader.view;
            if (mobile) {
                var num1 = document.getElementsByClassName('mtemplate-gallery').length;
                var num2 = document.getElementsByClassName('mtemplate-upload').length;
                num = Math.max(num1, num2);
                unitLength = this.mobile.width + this.mobile.margin;
            } else {
                var num1 = document.getElementsByClassName('dtemplate-gallery').length;
                var num2 = document.getElementsByClassName('template-upload').length;
                num = Math.max(num1, num2);
                unitLength = this.desktop.width + this.desktop.margin;
            }

            if (add) {
                if (mobile) {
                    var afterAdd = (num + 1) * unitLength;

                    if (afterAdd > viewPort) {
                        this.uploader.el.style.width = afterAdd + 'px';
                        this.uploader.mobile = afterAdd;
                    }
                } else {
                    var afterAdd = (num + 1) * unitLength;

                    if (afterAdd > viewPort) {
                        this.uploader.el.style.width = afterAdd + 'px';
                        this.uploader.desktop = afterAdd;
                    }
                }
            } else {
                if (mobile) {
                    var afterRemove = (num) * unitLength;
                    if (afterRemove > viewPort) {
                        this.uploader.el.style.width = afterRemove + 'px';
                        this.uploader.mobile = afterRemove;
                    } else {
                        this.uploader.el.style.width = viewPort + 'px';
                        this.uploader.mobile = viewPort;
                    }
                } else {
                    var afterRemove = (num) * unitLength;
                    if (afterRemove > viewPort) {
                        this.uploader.el.style.width = afterRemove + 'px';
                        this.uploader.desktop = afterRemove;
                    } else {
                        this.uploader.el.style.width = viewPort + 'px';
                        this.uploader.desktop = viewPort;
                    }
                }
            }
            return;
        },
        _removeDownloadTemplate: function(model) {
            var index = this.findIndex(this.removedDownload, model);
            var that = this;
            this.removedDownload.splice(index, 1);
            if (this.isMobile()) {
                $(".mtemplate-download[name='" + model.src + "']").animate({
                    opacity: 0
                }, 400, function() {
                    this.remove();
                    that._recalculateMargin()
                })
            } else {
                $(".template-download[name='" + model.src + "']").animate({
                    opacity: 0
                }, 400, function() {
                    this.remove();
                    that._recalculateMargin()
                })
            }

            return;
        },

        findIndex: function(arr, obj) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].src == obj.src) return i;
            }
            return -1;
        },

        loadGalleries: function(data) {
            if (document.getElementById('g-archive-view'))
                document.getElementById('g-archive-view').innerHTML = '';

            var result = null;
            if (Array.isArray(data.images))
                result = data.images;
            else
                result = JSON.parse(data);
            var galleries = {};
            for (var i = 0; i < result.length; i++) {
                var gallery = result[i].gallery;
                if (!galleries[gallery])
                    galleries[gallery] = [];

                galleries[gallery].push({
                    username: result[i].username,
                    text: result[i].text,
                    gallery: gallery,
                    src: result[i].src,
                    width: result[i].width,
                    height: result[i].height
                });
            }
            this.galleries = Object.assign({}, galleries);

            this._setPoolView();
            this._showGalleries();

        },

        _galleryTemplate: function(obj) {
            var template = document.createElement('div');
        },

        _hide: function() {
            document.getElementById('main').style.display = 'none';
        },

        _styleElements: function() {
            var that = this;
            var main = document.getElementById('indexContainer');
            var header = document.getElementById('iheader');
            var contentArticle = document.getElementById('contentArticle')

            this.activeEditor = true;
            this._createMenuEditor();
        },

        _returnMenuContent: function(type) {
            let html = '',
                template = '<span class="xbt-edit"><code class="btn-xs %btnClass%" title="%desc%" onmousedown="event.preventDefault();" onclick="doCommand(\'%cmd%\')"><i class="%iconClass%"></i> %cmd%</code></span>';
            commands.forEach(function(command) {
                if (command.type != type) return;
                commandRelation[command.cmd] = command;
                let temp = template;
                temp = temp.replace(/%iconClass%/gi, icon(command));
                temp = temp.replace(/%desc%/gi, command.desc);
                temp = temp.replace(/%btnClass%/gi, supported(command));
                temp = temp.replace(/%cmd%/gi, command.cmd);
                html += temp;
            });

            return html;
        },

        _createMenuEditor: function() {
            let that = this;
            let header = document.getElementById('gheader');
            header.style.display = 'block';
            const menu = ['basic', 'insert', 'style', 'color', 'font', 'justify', 'strike', 'action'];
            let iheader = document.createElement('div');
            iheader.id = 'i-header';
            let move = document.createElement('img');
            move.src = makeUrl("public/arrow/move.png");
            move.classList.add('i-menu-move');
            move.addEventListener('mousedown', iMouseDown, false);
            window.addEventListener('mouseup', iMouseUp, false);
            iheader.appendChild(move);
            let resize = document.createElement('span');
            resize.classList.add('i-menu-min');
            iheader.appendChild(resize);
            let downPng = document.createElement('img')
            downPng.src = makeUrl('public/arrow/iup.png');
            downPng.classList.add('i-menu-down');
            downPng.addEventListener('click', function() {
                $('.i-editItem').animate({
                    top: "+=200"
                }, 300, function() {
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

            menu.forEach(function(item) {
                let menuItem = document.createElement('div');
                menuItem.classList.add('i-menu', 'i-menu-elems')
                let span = document.createElement('span');
                span.classList.add('i-menu-middle');
                span.innerHTML = item;
                menuItem.appendChild(span);
                span.addEventListener('click', function(e) {
                    that._iMenu(this.innerHTML);
                })
                editItem.appendChild(menuItem);

            })

            header.appendChild(menuContainer);
        },

        _iMenu: function(act) {
            let that = this;
            let html = this._returnMenuContent(act);
            document.getElementsByClassName('i-subItem')[0].innerHTML = html;

            $('.i-editItem').animate({
                top: "-=200"
            }, 300, function() {
                document.getElementsByClassName('i-menu-down')[0].style.display = 'block';
            });

            if (act == "action")
                this.btns.forEach(function(item) {
                    that._createButton(item);
                })
        },

        _createButton: function(btn) {
            let that = this;
            let span = document.createElement('span');
            span.classList.add('xbt-edit');

            let code = "<code class='btn-xs'>" + btn + "</code>";
            span.innerHTML = code;
            document.getElementById('iheader').appendChild(span);
            document.getElementsByClassName('i-subItem')[0].appendChild(span)
            span.addEventListener('click', function() {
                that[btn].notify('');
            })
        }


    }



    /*============================================ Models ==============================================*/

    var Model = function(src, height, length) {
        this.src = src;
        this.height = height;
        this.length = length;
    }

    /*============================================ Collections ==========================================*/

    var Collection = (function() {
        let models = [];

        function setModels(data) {
            models.length = 0;
            models = data;
        }

        function getUser() {
            if (models.length != 0)
                return models[0].username;
        }

        function getModel(id) {
            return models.find(function(elem) {
                return elem._id == id;
            })
        }

        function getModelTwo(gallery, src) {
            return models.find(function(elem) {
                return (elem.gallery == gallery && elem.src == src)
            })
        }

        function getGallery(gal) {
            return models.filter(function(elem) {
                return elem.gallery == gal
            })
        }

        function addModel(model) {
            models.push(model);
        }

        function removeGallery(arr, gal) {
            let index;
            if (arr.length == 0) {
                models = models.filter(function(elem) {
                    return elem.gallery != gal;
                })
            } else {
                models = models.filter(function(elem) {
                    return undefined === arr.find(function(elm) {
                        return (elem.gallery == gal && elem.src == elm.src);
                    })
                })

            }


        }

        return {
            setArchive: setModels,
            getModel: getModel,
            getGallery: getGallery,
            getModelTwo: getModelTwo,
            addModel: addModel,
            getUser: getUser,
            removeCollection: removeGallery
        }
    })()

    var Router = (function() {
        let that = this;
        let validUrl = ['archive', 'images', 'show', 'gallery'];
        let events = {};

        for (let elem of validUrl)
            events[elem] = new Event(this);

        function router(username, url) {
            let backOrNext = false;
            if (url[0] == '#') {
                url = url.substring(1, url.length);
                backOrNext = true;
            }

            let splited = url.split('/');
            let length = splited.length;
            if (length == 1) {
                process(username, splited[0])
            } else if (length == 2) {
                process(username, splited[0], splited[1], backOrNext)
            } else if (length == 3) {
                process(username, splited[1], splited[2], backOrNext)
            };
        }

        function process(username, arg1, arg2, arg3) {
            let url;

            if (validUrl.indexOf(arg1) == -1) return;
            if (arg1 == 'gallery') arg1 = 'archive';

            events[arg1].notify({
                username: username,
                data: arg2
            })

            if (arg2 == null) {
                url = arg1;
            } else {
                url = arg1 + '/' + arg2;
            }

            if (arg1 == 'gallery')
                url = 'archive'

            if (!arg3)
                window.history.pushState(null, null, '/' + username + '/gallery/' + url);
        }

        return {
            route: router,
            event: events
        }
    })()

    /*========================================= Controller ============================================*/

    var Controller = (function() {

        // this.collection = new Collection(this);
        //this.view = new View(View,this);     
        View._start();

        function setUsername(username) {
            View.username = username;
        }
        socket.on('gal', function(data) {
            View.loadGalleries(data)
            Collection.setArchive(data.images);
            View.outsider.length = 0;
            if (!View.inited) {
                View._init()
                View._upTile(null);

            }

            View.outsider = data.images;
            View._showImages(data.images, data.images[0].gallery);
        })

        Router.event['gallery'].attach(function(sender, args) {
            setUsername(args.username);

            let style = window.getComputedStyle(document.getElementById('main'));

            if (style.getPropertyValue('display') == 'block') {
                View._backToIndex(View);
            }
        })

        Router.event['archive'].attach(function(sender, args) {
            setUsername(args.username);

            if (Collection.getUser() != args.username) {
                if (document.getElementById('pp'))
                    document.getElementById('pp').remove()
                let st = state();
                if (View._isLoggedIn()) {
                    document.getElementById('cgbtn').style.display = 'block';
                } else {
                    View.header.el.appendChild(View._profilePic());
                    document.getElementById('cgbtn').style.display = 'none';
                }


                if (st == 'gallery') {
                    if (document.getElementById('thumbview')) {

                    }
                    if (document.getElementById('g-gallery-title'))
                        document.getElementById('g-gallery-title').remove();

                    if (document.getElementById('back-sign')) document.getElementById('back-sign').remove();
                }

                if (st == 'show') {

                    document.getElementById('g-gallery-title').remove();
                    document.getElementById('back-sign').remove();
                    if (document.getElementById('thumbview'))
                        document.getElementsByClassName('thumbview')[0].remove();
                    View._closeShowImage.call(View);

                }

                args.archive = true;
                galleries(args, null);
            } else {

                let st = state();

                if (st == 'gallery') {
                    if (document.getElementById('thumbview')) {
                        try {
                            document.getElementById('back-sign').remove();
                            document.getElementById('g-gallery-title').remove()
                                // document.getElementById('homeback').style.display = 'block';	
                        } catch (e) {

                        }

                        if (!View._isLoggedIn()) {
                            if (document.getElementById('pp'))
                                document.getElementById('pp').remove();
                            View.header.el.appendChild(View._profilePic())
                        } else {
                            document.getElementById('cgbtn').style.display = 'block';
                        }
                    }
                    // document.getElementsByClassName('thumbview')[0].remove()
                    if (document.getElementById('g-gallery-title'))
                        document.getElementById('g-gallery-title').remove();


                    if (document.getElementById('back-sign'))
                        document.getElementById('back-sign').remove();
                };
                if (st == 'show') {
                    document.getElementById('g-gallery-title').remove();
                    document.getElementById('back-sign').remove();
                    document.getElementsByClassName('thumbview')[0].remove()
                    View._closeShowImage.call(View);
                }

                if (View._isLoggedIn())
                    document.getElementById('cgbtn').style.display = 'block'

                args.archive = true;
                galleries(args, View._showTile);
            }

        })

        Router.event['images'].attach(function(sender, args) {
            setUsername(args.username);

            if (Collection.getUser() != args.username) {
                let st = state();

                if (document.getElementById('pp'))
                    document.getElementById('pp').remove();

                if (st == 'gallery')
                    if (document.getElementById('thumbview'))
                        document.getElementsByClassName('thumbview')[0].remove();
                if (st == 'show')
                    View._closeShowImage.call(View);

                args.archive = false;
                galleries(args, showImage);
            } else {
                let gals = Collection.getGallery(args.data);
                if (gals.length == 0) return Router.route(args.username, 'archive');

                args.archive = false;
                let st = state();

                if (st == 'gallery')
                    if (document.getElementById('thumbview'))
                        document.getElementsByClassName('thumbview')[0].remove();
                if (st == 'show')
                    View._closeShowImage.call(View);

                document.getElementById('main').style.display = 'block'
                View._showImages(Collection.getGallery(args.data), args.data);
            }

        })

        function Incoming() {
            let style = window.getComputedStyle(document.getElementById('main'));

            if (style.getPropertyValue('display') == 'block') {
                let st = state()
                if (st == 'show') {
                    View._closeShowImage.call(View);
                    return;
                } else if (st == 'index') {

                }
            } else if (View.inited) {
                document.getElementById('main').style.display = 'block'
            } else {
                document.getElementById('main').style.display = 'block';
            }
        }


        function showImage(args) {
            View._showImages(Collection.getGallery(args.data), args.data);
        }

        function getGal(args) {
            socket.emit('getgal', {
                gal: args.data,
                username: args.username
            });
        }

        Router.event['show'].attach(function(sender, args) {
            let model;
            model = Collection.getModel(args.data)

            if (model === undefined)
                model = View.outsider.find(function(elem) {
                    return elem._id == args.data;
                })
            let style = window.getComputedStyle(document.getElementById('main'));
            let st = state();
            if (style.getPropertyValue('display') == 'block') {
                if (st == 'show')
                    View._browserConstruct.call(View, model.gallery, model.src)
                else
                    View._showImage(null, model.gallery, model.src)
                return;
            } else if (View.inited) {

            } else {

            }

        })

        function state() {
            let show = document.getElementsByClassName('image-view').length;
            let gallery = document.getElementsByClassName('thumbview').length;

            if (show)
                return 'show';
            else if (gallery)
                return 'gallery';
            else return 'archive';
        }

        let that = this;

        let events = [];
        let uploaded = 0;
        socket.on('thumb', function(data) {
            data.type = 'thumb';
            runUpload(data);
        })

        function runUpload(data) {
            if (events.length == 0)
                if (data.type == 'thumb')
                    onThumb(data);
                else
                    gContinue(data);
            else
                events.push(data);
        }


        function nextOne() {
            let data;
            if (events.length != 0) {
                data = events[0];
                events.splice(0, 1);
                if (data.type == 'thumb')
                    onThumb(data);
                else
                    gContinue(data);
            }


        }

        function onThumb(data) {
            Collection.addModel(data);
            let child = document.getElementById('pool').children;
            that.addedToCollection(data, child, thumbCallback);
        }


        function thumbCallback(data) {
            View._recalculateMargin()
                ++uploaded;
            console.log(data);
            console.log(uploaded)
            console.log(View.files.length)
            if (uploaded == View.files.length) {
                saveGallery(data);
            }

            nextOne();
        }

        socket.on('progress', function(data) {
            View._progress(data)
        })

        View.upload.attach(function(sender, args) {
            Upload(sender, args)
        })


        function galleries(args, callback) {
        	   app.createLayer();
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/gallery/index');
            //window.history.pushState(null,null,'/gallery/archive')
            xhr.onreadystatechange = function() {
                if (this.readyState == 4) {
                	  app.clearLayer();
                    Collection.setArchive(JSON.parse(xhr.responseText));
                    if (!View.inited);
                    View._init();
                    if (args.archive) {
                        View.loadGalleries(xhr.responseText);
                        View._showTile();

                        if (document.getElementById('thumbview'))
                            $(document.getElementById('thumbview')).animate({
                                left: '-=' + View.uploader.view
                            }, 360);

                    } else {
                        View.loadGalleries(xhr.responseText);
                        View._showTile();
                        callback.call(View, args);
                    }

                    document.getElementById('main').style.display = 'block';
                }
            }
            xhr.setRequestHeader('username', args.username);
            xhr.send();
        }


        socket.on('g-continue', function(data) {
            data.type = 'continue';
            runUpload(data);
        });


        function gContinue(data) {
            let reader = new FileReader();
            View._progress({
                percent: data['percent'],
                name: data['name']
            });
            var place = data['place'] * 524288; //The Next Blocks Starting Position
            var newFile; //The Variable that will hold the new Block of Data
            let index = View.files.findIndex(function(elem) {
                return elem.name == data['name']
            })

            reader.onload = function(e) {
                socket.emit('g-upload', {
                    'name': data['name'],
                    data: e.target.result,
                    gallery: View.galleryName
                });
                nextOne();
            }

            newFile = View.files[index].slice(place, place + Math.min(524288, (View.files[index].size - place)));
            reader.readAsBinaryString(newFile);
        }


        function Upload(sender, queue) {
            uploaded = 0;
            for (var i = 0; i < sender.files.length; i++) {
                if (queue.indexOf(sender.files[i].name) == -1) continue;
                socket.emit('g-start', {
                    'name': sender.files[i].name,
                    'size': sender.files[i].size
                })
            }
        }

        function copy(obj1, obj2) {
            for (var k in obj2) {
                obj1[k] = obj2[k];
            }

            return obj1;
        }

        function saveGallery(data) {
            let container;
            container = Object.assign({}, data);
            container.tag = View.tags;
            container.location = View.location;
            container.getloc = View.getloc;
            container.date = Date.now();
            container.gallery = data.gallery;
            container.type = 'gallery';
            container.username = username;
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/gallery/save');
            xhr.setRequestHeader('Content-Type', 'application/json')
            xhr.send(JSON.stringify(container));

            xhr.onreadystatechange = function(data) {
                if (this.readyState == 4) {
                    View.files.length = 0;
                    View.queue.length = 0;
                }
            }
        }

        function Remove(sender, queue) {
            let gallery = document.getElementById('back-reset').innerHTML;
            if (queue.length == 0)
                queue = Collection.getGallery(gallery);

            if (queue.length == 0) return;
            var delThumb = new XMLHttpRequest();
            delThumb.open('POST', '/gallery/delete');
            delThumb.onreadystatechange = function(data) {
                if (this.readyState == 4) {
                    that.removedFromCollection(queue);
                    Collection.removeCollection(queue, gallery);
                }
            }
            delThumb.setRequestHeader('Content-Type', 'application/json');
            delThumb.setRequestHeader('gallery', gallery)
            delThumb.send(JSON.stringify(queue));
        }

        View.remove.attach(function(sender, args) {
            return Remove(sender, args);
        })


        this.removedFromCollection = function(args) {
            console.log(args);
            for (let i = 0; i < args.length; i++) {
                View._removeDownloadTemplate(args[i]);
            }
        }

        this.addedToCollection = function(args, index, callback) {
            View._removeFromPool(args, function() {
                View._addModel(args, index, function() {
                    callback(args);
                });
            });
        }

        View.showImage.attach(function(sender, args) {
            View._showImage(args);
        })

        View.save.attach(function(sender, args) {
            sender._saveContent()
        })

        View.gallery.attach(function(sender, args) {
            View._showImages(args);
        })

        function readyUrl() {
            var path = window.location.pathname;
            var elements = path.split('/');
            if (elements.length == 3) {
                View._upTile(null);
                View._showImages(null, elements[1])
            } else if (elements.length == 4) {
                View._upTile(1);
                View._showImage(null, elements[2], elements[3])
            }
        }

    })()


    return {
        hide: View._hide.bind(View),
        router: function(username, path) {
            Router.route(username, path);
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