
var app = app || {};

app.ArtistView = app.GenericView.extend({
	
	className: 'artist-detail',
	id: '',
	fadeSpeed: 300,			
	template: '',
	showDefaultImage: true,
	loaded: false,
	rendered: false,
	activeModelIndex: 0,
	
	initialize: function() {
		 _.bindAll(this, 'showMouseHover', 'gotoNext', 'gotoPrevious');
		this.template = $('#artistDetailTemplate').html();
	}, 
	
	render: function() { 
		this.activeImageSlug = null;
		this.$el.html(''); 
		var self = this;
		
		// If the collection has not yet loaded, stop here and listen for when it has loaded.
		if(!this.collection || !this.collection.fetched){
			this.collection = new app.ImageCollection({id: this.id});
			this.collection.fetched = false;
			this.collection.fetch({ 
				success: function () { 
					self.collection.fetched = true;
					self.render();
				} 				
			});
			return;	
		}
			
			
		// Insert our HTML template
		var tmpl = _.template( this.template );			
		this.$el.html(tmpl({"title":this.collection.headline})); 			
		
		
			
		//determine the total width of the thumbnails. If it is less than the container, center them, if it is more than the container, left align them
		var totalWidth = 0;
		_.each(this.collection.models, function (item){
			var width = parseInt(item.get('width')) + 12;	// 12 = the padding for each thumbnail (6 * 2). 
			var height = parseInt(item.get('height'));
			var targetHeight = 	parseInt($('.artist-detail ul#artist-images').css("height"));
			var scaleRatio = targetHeight/height;
			var thisWidth = width * scaleRatio;	
			totalWidth += thisWidth;		
		});
		var containerWidth = parseInt($('.thumbnail-scroller').width());			
		if(totalWidth < containerWidth){
			var leftMargin = ((containerWidth - totalWidth)/2);
			$('.thumbnail-scroller').css('margin-left',leftMargin);
		} else {
			$('.thumbnail-scroller').css('margin-left','0px');
		}
		
		
		// this method calls itself after each thumnail is generated. This way we can load images one at a time.
		this.createThumb(0);
				
		// if there is not an active image, the show the first image.
		this.rendered = true;
		
		
		if(this.showDefaultImage && this.collection.models.length > 0){
			this.showImage(this.collection.models[0].get("slug"))
		}	
			
		$('.thumbnail-scroller').scroll(function(){ self.setScrollArrows();});
		$('.thumbnail-scroller').click(function(){ self.clickScrollTrack();});
		$('.scrollArrow#left').click(function(){ self.scrollThumbsBack() ;});
		$('.scrollArrow#right').click(function(){ self.scrollThumbsForward() ;});
		
		app.setCustomImageSizes(); // in index.html
		this.setUpArrows();
		this.trigger('ARTIST_PAGE_RENDERED')
		//this.renderImage();
	},  

	
	showImage: function(imageSlug){
		var self = this;
		this.showDefaultImage = false; // once an image is passed in, we no longer want to show the default image when the view is rendered.
	
		if(!this.rendered){				// if the view has not rendered yet, listen for it to be
			this.bind('ARTIST_PAGE_RENDERED', function(){ self.showImage(imageSlug); }, this);
		} else {
			this.unbind('ARTIST_PAGE_RENDERED',null,this);
			var imgModel = this.getImageBySlug(imageSlug);
			this.activeModelIndex = this.collection.indexOf(imgModel);
			var imgCaption = imgModel.get("caption");
			var imgLink = imgModel.get("fullsize");
			
			this.setScrollArrows();
			
			if(imgModel){		
				
				self.$el.find('.display-image-caption').fadeOut(self.fadeSpeed,function(){
					$(this).empty();
					imgCaption = imgCaption.replace(/ /gi, '&nbsp;&nbsp;&nbsp;&nbsp;');
					
					$(this).html(imgCaption);					
					$(this).fadeIn(self.fadeSpeed);
				});
				
				self.$el.find('img#display-image').fadeOut(self.fadeSpeed,function(){				// fade the existing image out
					self.$el.find('.display-image-container').addClass('preloading');				// add a preloading graphic
					self.$el.find('img#display-image').load(function() {							// load the image								// populate the caption
						self.$el.find('.display-image-container a').attr("href",imgLink);
						
						
						self.$el.find('img#display-image').fadeIn(self.fadeSpeed,function(){		//once loaded, fade the image in
							self.$el.find('.display-image-container').removeClass('preloading');	// remove the preloading graphic
						});						
					}).attr('src', imgModel.get("large"));		
				});
			};	
		}
	},
	
	clickScrollTrack: function(){
		console.log("STOP");
		$('.thumbnail-scroller').stop();
	},
	
	setScrollArrows: function(){
		
		var scrollAmount = $('.thumbnail-scroller')[0].scrollWidth - $('.thumbnail-scroller').width();
		var scrollPosition = $('.thumbnail-scroller').scrollLeft();
		
		if(scrollAmount == 0) {
			$('.scrollArrow#left').css("opacity",0);
			$('.scrollArrow#right').css("opacity",0);
			 $('.thumbnail-scroller').css("overflow-x","hidden");
			return;
		}
		
		
		$('.thumbnail-scroller').css("overflow-x","auto");
		
		
		if(scrollPosition > 0){
			$('.scrollArrow#left').css("opacity",1);
		} else {
			$('.scrollArrow#left').css("opacity",0);
		}
		
		if(scrollPosition < scrollAmount){
			$('.scrollArrow#right').css("opacity",1);
		} else {
			$('.scrollArrow#right').css("opacity",0);
		}	
	},
	
	
	
	getImageBySlug: function(slug){
		var self = this;
		var selectedItem = null;
		_.each(this.collection.models, function (item){
			if(item.get("slug") == slug){
				selectedItem = item;
				return(item);				
			}			
		});
		return(selectedItem);	
	},
		
	createThumb: function(i){	
		var self = this;
		
		var item = this.collection.models[i];
		
		if(item){
			var imageModel = new app.ImageModel(item.toJSON());	
			var newThumb = new app.ImageThumbnail({model:imageModel});		
			self.$el.find('#artist-images').append(newThumb.render().el)
			
			var thisThumbSrc = this.collection.models[i].get("thumbnail");
			newThumb.bind("IMAGE_LOADED",function(){
				setTimeout(function(){
					app.setCustomImageSizes(); // in index.html
					newThumb.unbind("IMAGE_LOADED");
					self.setScrollArrows()
					self.createThumb(i+1);
				},50);
			});
			newThumb.loadImgSrc(thisThumbSrc);
			
		}
			
	},
	
	setUpArrows: function(){
		var leftArrow = '<img src="images/cursor_left.png" class="scrollArrow" id="left">';
		var rightArrow = '<img src="images/cursor_right.png" class="scrollArrow" id="right">';
		
		var $l = $('.scrollArrow#left');
		var $r = $('.scrollArrow#right');
		
		var pos = $('.thumbnail-scroller').position();
		//$l.css({"left":"10px;",
		
		//this.$el.append(leftArrow);
		//this.$el.append(rightArrow);
	},
	
	
	events: {
		'mouseover': 'doMouseOver',
		'mouseout': 'doMouseOut',
		'mouseover #display-image': 'doMouseOverImg',
		'mouseout #display-image': 'doMouseOutImg'
	},
	
	doMouseOverImg: function(ev){ this.hoveredOverImage = true; console.log("over"); },
	doMouseOutImg: function(ev)	{ this.hoveredOverImage = false;console.log("out"); },
	
	doMouseOver: function(ev){
		var self = this;
		$('.display-image-container').bind('mousemove',self.showMouseHover);    
	},
	doMouseOut: function(ev){
		$('.display-image-container').css("cursor", "auto");
		var self = this;
		$('.display-image-container').unbind('mousemove', self.showMouseHover);
	},
	
	
	showMouseHover: function(e){
		var pos = $('.display-image-container').position();
		var xPos = (e.pageX - pos.left)
		var percentX = xPos / $('.display-image-container').width()
		
		$('.display-image-container').unbind('click',this.gotoNext); 
		$('.display-image-container').unbind('click',this.gotoPrevious);
		if(!this.hoveredOverImage){ // only do this if the mouse is NOT over the image. i.e. it's over the side of the image.
			if(percentX > .5){
				if(this.activeModelIndex < (this.collection.models.length-1)){				
					$('.display-image-container').bind('click',this.gotoNext);  
					$('.display-image-container').css("cursor", "url(http://www.maisondesprit.com/dev/images/cursor-right.cur), auto");
				} else {
					$('.display-image-container').css("cursor", "default");
				}
				
			} else if(percentX <= .5){
				if(this.activeModelIndex > 0){
					$('.display-image-container').bind('click',this.gotoPrevious);
					$('.display-image-container').css("cursor", "url(http://www.maisondesprit.com/dev/images/cursor-left.cur), auto");
				} else {
					$('.display-image-container').css("cursor", "default");
				}
			}
		}
	},
	
	
	
	gotoNext: function(e){ 	
		console.log("Go To Next")
		if(this.activeModelIndex == this.collection.models.length-1) return;
		var theSlug = this.collection.models[this.activeModelIndex+1].get('slug');
		app.router.navigate('/artists/'+this.collection.slug+"/"+theSlug, {trigger: true});
	},
	gotoPrevious: function(e){ 
		if(this.activeModelIndex == 0) return;
		var theSlug = this.collection.models[this.activeModelIndex-1].get('slug');
		app.router.navigate('/artists/'+this.collection.slug+"/"+theSlug, {trigger: true});
	},
	
	
	
	scrollThumbsForward: function(){
		this.scrollThumbnails("forward");
	},
	scrollThumbsBack: function(){
		this.scrollThumbnails("backward");
	},
	scrollThumbnails: function(direction){
		var scrollMax = $('.thumbnail-scroller')[0].scrollWidth
		var containerWidth = $('.thumbnail-scroller').width()
		var scrollPosition = $('.thumbnail-scroller').scrollLeft();
		var scrollAmount = scrollMax - containerWidth;		
		if(scrollAmount == 0) return;
		var scrollToHere = (direction == "forward") ? scrollPosition + containerWidth : scrollPosition - containerWidth
		if (scrollToHere > scrollMax) scrollToHere = scrollMax;
		if (scrollToHere < 0) scrollToHere = 0;
		
		$('.thumbnail-scroller').animate({
				scrollLeft: (scrollToHere)
			}, {
				easing: 'linear',
				duration: 500,
				complete: function(){
					//console.log(self)
				}
			});
	}
	
     
	
});





app.ImageThumbnail = Backbone.View.extend({
	tagName: 'li',		
	fadeSpeed: '100',	
	initialize: function() {
		this.template = $('#imageThumbnailTemplate').html();
		this.model.on( 'change' , this.render, this );
		//this.model.on( 'destroy' , this.remove, this );
		//this.model.on( 'visible' , this.toggleVisible, this );
	}, 
	render: function() { 	
		var self = this;
		
		var tmpl = _.template( this.template ); 	
		this.$el.html(tmpl( this.model.toJSON() ) ); // this.el is what we defined in tagName. use $el to get access to jQuery html() function.	
		//this.loadImgSrc(this.model.get("thumbnail"));			 				 
		return this;	 // allows chaining			
	}, 	
	   
	loadImgSrc: function(file){
		var self = this;
		
		self.$el.addClass('preloading');
		app.setCustomImageSizes(); // in index.html
		self.$el.find('a').css('opacity',0);
		self.$el.find('img').load(function() {
			self.$el.removeClass('preloading');
			self.$el.find('a').fadeTo(1000,1,function(){});			
			self.trigger("IMAGE_LOADED");
		}).attr('src', file);

		
	},
	
	events: {
		'mouseover': 'doMouseOver',
		'mouseout': 'doMouseOut',
		'click': 'doClick'
	},
	doMouseOver: function(){
		//this.$el.stop().fadeTo(this.fadeSpeed,1);
		this.$el.stop().fadeTo(this.fadeSpeed,.65);
	},
	doMouseOut: function(){
		//this.$el.stop().fadeTo(this.fadeSpeed,.65);
		this.$el.stop().fadeTo(this.fadeSpeed,1);
	},
	
	doClick: function(event){
		//console.log(this.options.thumbnail);
	}
	
});


