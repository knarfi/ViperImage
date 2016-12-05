// ViperImage.js 1.0.0
//
// (c) 2016 Mark Nijboer
// ViperImage is a client-side javascript plugin that offers a responsive,
// simple, but well styled image lightbox.

if (typeof ViperImage === "undefined") {

  // The constructor of ViperImage. This will setup the environment and build
  // the graphical interface.
  var ViperImage = function(elements, userOptions) {

    // Initialize a variable that checks initialisation errors during the setup.
    initErrors = false;

    // The default options of ViperImage. These can be changed by givin an
    // object as second argument to this constructor
    this.options = {
      "infinite" : true,
      "theme" : "dark"
    };

    // Debugging this plugin will show extra logs during the setup and the
    // execution of this plugin
    this.debug = false;

    // The parameter 'elements' should be an array of DOM nodes that should be
    // displayed as an image lightbox. If that array is not given, ViperImage
    // will throw an error.
    if (typeof elements !== "array") {

      // Initialize an empty object. The elements will be stored in an object
      // that holds multiple arrays. These arrays are determined by the gallery
      // this element belongs to.
      this.elements = {};

      // Fill the 'elements' class variable with the elements depending on
      // their gallery
      for (var i = 0; i < elements.length; i++) {
        if (typeof elements[i].getAttribute('rel') !== "undefined"
          && elements[i].getAttribute('rel') !== "") {
          var rel = elements[i].getAttribute('rel');

          if (typeof this.elements[rel] !== "undefined") {
            this.elements[rel].push(elements[i]);
          } else {
            this.elements[rel] = [elements[i]];
          }
        } else {

          // 'viper-default' is the group of the unspecified galleries.
          if (typeof this.elements['viper-default'] !== "undefined") {
            this.elements['viper-default'].push(elements[i]);
          } else {
            this.elements['viper-default'] = [elements[i]];
          }
        }
      }

      // Tag every element with their sequence number of the elements
      // variable
      for (elem in this.elements) {
        for (var i = 0; i < this.elements[elem].length; i++) {
          this.elements[elem][i].setAttribute('data-viper-image', i);
        }

      }

      // If debug mode is turned on, show additional logs
      if (this.debug) {
        console.debug('These elements have been found:');
        console.debug(this.elements);
      }

    } else {
      console.warn(
        "ViperImage expects at least an array of elements as an argument");
      initErrors = true;
    }

    // Set the user defined options if they are given.
    if (typeof userOptions === "object") {
      for (option in userOptions) {
        this.options[option] = userOptions[option];
      }

    }

    // If no errors were thrown proceed with the execution of the code, else
    // throw an error
    if (!initErrors) {
      this.addStylesToPage();
      this.buildElement();
    } else {
      if (this.debug) {
        console.debug('Terminated because of some initialisation errors.');
      }
    }

  };


  // Method that indicates whether the lightbox is currently open and being used.
  ViperImage.prototype.isActive = function() {
    var elem = document.querySelector('.viper-wrapper');
    return (" " + elem.className + " " ).indexOf( " active " ) > -1;
  };



  // 'addStylesToPage' is a method that takes the css, wraps it up in a <style>
  // element and puts it in the head of the page.
  ViperImage.prototype.addStylesToPage = function() {
    var css = "body.viper-overflow{overflow:hidden;}.viper-wrapper{opacity:0;visibility:hidden;-webkit-transition:.2s;transition:.2s}.viper-wrapper *{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.viper-wrapper.active{opacity:1;visibility:visible}.viper-background,.viper-content{display:block;background:rgba(15,15,15,.9);position:fixed;left:0;right:0;top:0;bottom:0;font-size:13px}.viper-wrapper.viper-light .viper-background{background:rgba(255,255,255,.9)}.viper-content{background:0 0}.viper-close,.viper-count{color:#fff;position:fixed;top:20px;cursor:pointer}.viper-wrapper.viper-light .viper-close{color:rgba(15,15,15,.9)}.viper-close{right:20px;-webkit-transition:.2s;transition:.2s}.viper-close:hover{color:#fff}.viper-count{color:rgba(255,255,255,.7);left:20px}.viper-wrapper.viper-light .viper-count{color:rgba(15,15,15,.7)}.viper-arrow-left,.viper-arrow-right{color:rgba(255,255,255,.6);font-size:24px;display:block;width:36px;height:36px;background:rgba(255,255,255,.1);border-radius:100%;line-height:30px;text-align:center;-webkit-transition:.2s;transition:.2s;cursor:pointer;position:fixed;top:50%;margin-top:-18px}.viper-wrapper.viper-light .viper-arrow-left,.viper-wrapper.viper-light .viper-arrow-right{color:rgba(15,15,15,.6);background:rgba(15,15,15,.1)}.viper-wrapper.viper-light .viper-arrow-left:hover,.viper-wrapper.viper-light .viper-arrow-right:hover{background:rgba(15,15,15,.5);color:rgba(15,15,15,1)}.viper-arrow-left:hover,.viper-arrow-right:hover{background:rgba(255,255,255,.5);color:#fff}.viper-arrow-left{left:20px}.viper-arrow-right{right:20px}@media (max-width:768px){.viper-arrow-left,.viper-arrow-right{color:transparent!important;width:40%;top:50px;bottom:80px;background:0 0!important;border-radius:0;-webkit-transition:.2s;transition:.2s;margin-top:0;height:auto}.viper-arrow-left{left:0}.viper-arrow-right{right:0}.viper-arrow-left:hover,.viper-arrow-right:hover{background:0 0;color:transparent}}.viper-image-holder{position:fixed;top:50px;bottom:80px;left:0;right:0;pointer-events:none;background-size:contain;background-position:center center;background-repeat:no-repeat;-webkit-transition:.2s;transition:.2s}.viper-image-holder.fadeout{opacity:0}.viper-captions{position:fixed;bottom:0;height:60px;left:0;right:0;color:#fff;text-align:center}.viper-captions .viper-description{color:rgba(255,255,255,.8)}.viper-captions .viper-author{color:rgba(255,255,255,.5);font-size:11px}.viper-wrapper.viper-light .viper-captions .viper-description{color:rgba(15,15,15,.8)}.viper-wrapper.viper-light .viper-captions .viper-author{color:rgba(15,15,15,.5)}";
    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');

    style.type = 'text/css';
    if (style.styleSheet){
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);
  };



  // 'BuildElement' adds the ViperImage DOM-element to the page.
  ViperImage.prototype.buildElement = function() {
    var viperElement = '<div class="viper-wrapper"> <div class="viper-background"></div> <div class="viper-content"> <div class="viper-close">&#x2573;</div> <div class="viper-count"> <span class="viper-current"></span> / <span class="viper-total"></span> </div> <div class="viper-image-holder"></div> <div class="viper-arrow-left"> &#x2039; </div> <div class="viper-arrow-right"> &#x203A; </div> <div class="viper-captions"> <div class="viper-description"></div> <div class="viper-author"></div> </div> </div> </div>';
    document.body.innerHTML += viperElement;

    // Add bindings to the newly added HTML
    this.addBindings();
  };



  // This method adds events to the ViperImage DOM-elements.
  ViperImage.prototype.addBindings = function() {
    this.addCloseBindings();
    this.addArrowButtonBindings();
    this.addSwipeBindings();
    this.addKeyboardBindings();
    this.addThumbnailBindings();

  };


  // This method adds bindings to all elements that close the ViperImage GUI
  ViperImage.prototype.addCloseBindings = function () {
    var backgroundElem = document.querySelector('.viper-background');
    var closeElem = document.querySelector('.viper-close');
    var wrapperElem = document.querySelector('.viper-wrapper');

    // A background click will close the lightbox
    backgroundElem.addEventListener('click', function() {
      wrapperElem.classList.remove('active');
      document.body.classList.remove('viper-overflow');
    });

    // A click on the close button will close the lightbox
    closeElem.addEventListener('click', function() {
      wrapperElem.classList.remove('active');
      document.body.classList.remove('viper-overflow');
    });
  };


  // This method adds bindings to the arrow buttons in the GUI
  ViperImage.prototype.addArrowButtonBindings = function() {
    var leftArrow = document.querySelector('.viper-arrow-left');
    var rightArrow = document.querySelector('.viper-arrow-right');
    var _this = this;

    // When the left arrow button is clicked, the previous image is loaded
    leftArrow.addEventListener('click', function() {
      _this.prevImage();
    });

    // When the right arrow button is clicked, the next image is loaded.
    rightArrow.addEventListener('click', function() {
      _this.nextImage();
    });
  };


  // For mobile, swipe gestures are implemented. A swipe from right to left
  // triggers that the next image is loaded, and a swipe from left to right
  // loads the previous image.
  ViperImage.prototype.addSwipeBindings = function() {
    var _this = this;

    window.addEventListener('touchstart', function handleTouchStart(evt) {
      if (_this.isActive()) {
        _this.xDown = evt.touches[0].clientX;
        _this.yDown = evt.touches[0].clientY;
      }
    }, false);
    window.addEventListener('touchmove', function handleTouchMove(evt) {
      if (_this.isActive()) {
        if ( ! _this.xDown || ! _this.yDown ) {
            return;
        }

        var xUp = evt.touches[0].clientX;
        var yUp = evt.touches[0].clientY;

        var xDiff = _this.xDown - xUp;
        var yDiff = _this.yDown - yUp;
        if(Math.abs( xDiff )+Math.abs( yDiff )>150) {

        if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
          if ( xDiff > 0 ) {

            // The user swiped from right to left
            _this.nextImage();
          } else {

            // The user swiped from left to right
            _this.prevImage();
          }
        }

        // Reset values
        _this.xDown = null;
        _this.yDown = null;
        }
      }
    }, false);
  };


  // This method add events to the thumbnails that open the ViperImage lightbox
  // when thumbnails are clicked.
  ViperImage.prototype.addThumbnailBindings = function() {
    var _this = this;
    var wrapperElem = document.querySelector('.viper-wrapper');

    for (gallery in this.elements) {
      for (var i = 0; i < this.elements[gallery].length; i++) {
        this.event(this.elements[gallery][i], "click", function(e) {

          // Prevent pagination triggered by clicking the <a> element
          e.preventDefault();

          // Show the GUI
          wrapperElem.classList.add('active');

          // Make the <body> { overflow: hidden } to disable vertical scrolling
          // while swiping through the images
          document.body.classList.add('viper-overflow');


          // Determine the theme color of the GUI
          if (_this.options.theme == "light") {
            wrapperElem.classList.add('viper-light');
          } else {
            wrapperElem.classList.remove('viper-light');
          }

          if (this.debug) {
            console.debug(_this);
          }

          // Set the targeted thumbnail to active
          _this.setActive(this, true);

          return false;
        });
      }
    }
  };


  // The arrow keys on the keyboard also trigger the previous and next images
  ViperImage.prototype.addKeyboardBindings = function() {
    window.addEventListener('keydown', function(e) {

      // The left arrow loads the previous image
      if (e.which == 37 && _this.isActive()) {
        _this.prevImage();
      } else

      // And the right arrow loads the next image
      if (e.which == 39 && _this.isActive()) {
        _this.nextImage();
      }
    });
  };

  // A method that returns the current active gallery
  ViperImage.prototype.getGallery = function (elem) {
    var element = null;

    if (typeof elem === "undefined") {
      element = this.activeImage;
    } else {
      element = elem;
    }

    if (typeof element.getAttribute('rel') !== "undefined"
      && element.getAttribute('rel') !== "") {
      return element.getAttribute('rel');
    } else {
      return 'viper-default';
    }
  };


  // A pure javascript implementation of
  // $(document).on(<event>, <element>, <callback>)
  ViperImage.prototype.event = function(element, evt, callback) {
    document.addEventListener(evt, function(e) {
      e.preventDefault();
      for (var target=e.target; target && target != this; target = target.parentNode) {
        if (target.isEqualNode(element)) {
            callback.call(target, e);
            break;
        }
      }
    }, false);
  }


  // 'setActive' displays the given element within the lightbox.
  ViperImage.prototype.setActive = function(element, thumbnailClick) {
    var imageHolder = document.querySelector('.viper-image-holder');
    var backgroundImage = "URL('" + element.href + "');";
    var currentLabel = document.querySelector('.viper-current');
    var totalLabel = document.querySelector('.viper-total');
    var descriptionLabel = document.querySelector('.viper-description');
    var authorLabel = document.querySelector('.viper-author');
    var gallery = this.getGallery(element);


    // Set the given image as active
    this.activeImage = element;

    if (this.debug) {
      console.debug('New image is being activated');
      console.debug(element);
      console.debug(backgroundImage);
    }

    // Add the image to the main image holder in the lightbox
    imageHolder.setAttribute('style', "background-image: " + backgroundImage);

    // Update the labels that indicate which image is active and how much
    // images are left in this slideshow
    currentLabel.innerText = parseInt(element.getAttribute('data-viper-image')) + 1;
    totalLabel.innerText = this.elements[gallery].length;

    // If available, set the title of the current image.
    if (typeof element.getAttribute('data-viper-title') !== "undefined" &&
     element.getAttribute('data-viper-title') != "") {
      descriptionLabel.innerText = element.getAttribute('data-viper-title');
    } else {
      descriptionLabel.innerText = "";
    }

    // If available, set the author of the current image
    if (typeof element.getAttribute('data-viper-author') !== "undefined" &&
     element.getAttribute('data-viper-author') != "") {
      authorLabel.innerText = element.getAttribute('data-viper-author');
    } else {
      authorLabel.innerText = "";
    }
  }



  // This method will activate the next image if it is available. If it is not
  // available but `options.infinite` is set true, it will show the first image
  ViperImage.prototype.nextImage = function() {
    var currentImageNumber = parseInt(this.activeImage.getAttribute('data-viper-image'));
    var currentImages = this.elements[this.getGallery()];

    if (this.debug) {
      console.debug('nextImage');
      console.debug(currentImageNumber);
    }

    // Decide whether to show the next available image or the first one.
    if (currentImageNumber < currentImages.length - 1) {
      this.setActive(currentImages[++currentImageNumber], false);
    } else if (this.options.infinite) {
      this.setActive(currentImages[0], false);
    }
  };


  // This method is the opposite of 'nextImage'. It will show the previous image
  // if available. If `options.infinite` is set true, the last image will be
  // shown.
  ViperImage.prototype.prevImage = function() {
    var currentImageNumber = parseInt(this.activeImage.getAttribute('data-viper-image'));
    var currentImages = this.elements[this.getGallery()];

    if (this.debug) {
      console.debug('prevImage');
      console.debug(currentImageNumber);
    }

    // Decide whether to show the previous image or the last image in the gallery
    if (currentImageNumber > 0) {
      this.setActive(currentImages[--currentImageNumber], false);
    } else if (this.options.infinite) {
      this.setActive(currentImages[currentImages.length -1], false);
    }
  };


} else {

  // Notify the user that the plugin is loaded twice.
  console.warn('Could not initialize name "ViperImage". The name is already in use.');
}
