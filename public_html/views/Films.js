var app = app || {};

app.FilmsView = app.GenericView.extend({
	//el: '.artistList',
	className: 'films-content',
	models: null,
	activeFilmSlug: null,
	loaded: false,
	rendered: false,
	scrollContainer: null,
	
	initialize: function () {
		this.template = $('#filmTemplate').html();		
		var self = this;		
		$(window).resize(function() {
			self.setContentPosition();
		});
	}, 
	 
	 render: function (data) {
		 var self = this;
		console.log("Rendering Films");
		//this.colorsFadeIn();
		this.$el.empty(); // clear out the grid so we can re-populate it				
		var tmpl = _.template( this.template ); 
		
		this.$el.html(tmpl( {"headline":this.collection.headline, "data" : this.collection.toJSON()} ) );
		
		this.$el.find('.theLink').click(function(ev){
			return self.clickVideo(ev);
		});
		 
		this.rendered = true
		
		
		this.bind("VIEW_SHOWING",function(){
			this.scrollContainer = $('.filmList')
			this.scrollContainer.tinyscrollbar({ axis: 'x', size: 721 });
			// set initial volume to 50%
			$('video').each(function(){$(this)[0].volume = 0.5;});
		
		});
						
		this.trigger("FILMS_RENDERED");	
						
		// play the first film automatically.
		
		this.bind("VIEW_SHOWING",function(){ 
			if(Backbone.history.fragment == "films"){
				self.jumpToFilm(this.collection.models[0].get('slug'))
			}
		})
		
	 },
	 

	setContentPosition: function(){
		
		if(this.scrollContainer){
			try{
				this.scrollContainer.tinyscrollbar_update();
			} catch(err) {
				//console.log("ERROR " + err)	
			}
		}
		
		var contentHeight =  parseInt($('.mainContent').css("height"))
		var boxHeight =  parseInt($('.filmList .filmThumb').css("height"))*1.8
		var boxWidth =  parseInt($('.filmList .filmThumb').css("width"))
		var sidePadding =  parseInt($(window).width()/2 - boxWidth/2)
		// set the height of hte main content.
		$('.films-content').css("height",(contentHeight-60)+"px");
		$('.filmList').css("padding-top",(contentHeight-boxHeight)/2+"px");
		$('.filmList .filmThumb:first').css("margin-left",sidePadding+"px")
		$('.filmList .filmThumb:last').css("margin-right",sidePadding+"px")

		
		$('#scrollable .scrollbar').css("margin-left",(($('#scrollable').width() - 720)/2)+"px")
		
		console.log("Position h1")
		var position = $('.scrollbar').position();
		$('.films-content h1').css({
			top:(position.top - 20) + "px",
			left: (parseInt($(window).width()/2) +517) - ($('.films-content h1').width()) + "px"	
		});
	},
	
	 renderFilm: function (item) {
		var filmSquare = new app.FilmSquare({
			model:item
		});
		this.$el.append(filmSquare.render().el);
	 },

	
	onShow: function(){	
		app.GenericView.prototype.onShow.call(this);	
		this.setContentPosition();	
	},
	
	close: function(){
		var self = this
		//this.colorsReset();
		this.$el.find('video').each(function(){			
			self.stopVideo($(this));					
		});
		app.GenericView.prototype.close.call(this);
	},

	
	clickVideo: function(ev) {
		var $thisFilmThumb = $(ev.currentTarget).closest('.filmThumb');
		
		var self = this;
		this.$el.find('video').each(function(){
			if($(this).closest('a').attr('id') != $thisFilmThumb.attr('id')){
				self.stopVideo($(this));
			}		
		});
	
	},
	
	playVideo: function(elem){
		elem.stop(true,true).fadeIn(1000,function(){
			elem[0].play()
		});
		elem.closest('.filmThumb').find('.theLink').delay(1000).fadeOut();
		elem.closest('.filmThumb').find('.textarea').delay(1000).fadeOut(1000);			
		
	},
	stopVideo: function(elem){
		elem[0].pause();
		elem.closest('.filmThumb').find('.theLink').fadeIn(1000);
		elem.closest('.filmThumb').find('.textarea').fadeIn(1000);	
		elem.delay(1000).fadeOut(1000,function(){
			elem[0].pause();
		});		
	},
	
	
	jumpToFilm: function(filmSlug){		
		var self = this;
		this.unbind('rendered');
		
		var filmModel = this.getFilmBySlug(filmSlug);
		
		
		
		if(filmModel){	
			var $elem = self.$el.find('#film_'+filmModel.get('slug'));
			
			
			// stop any playing films except for this one.		
			this.$el.find('video').each(function(){
				if($(this).closest('a').attr('id') != $elem.attr('id')){
					self.stopVideo($(this));
				}		
			});
		
		
			var pos = $elem.position();			
			var videoPos = pos.left; // the position of the video in the scrollable container
			
			self.activeFilmSlug = 	filmSlug;
			
			var containerWidth = parseInt($('.films-content').width()); // the width of the container
			var videoWidth = parseInt($elem.width()); // the width of the video we're scrolling to
			var scrollToHere = (videoPos - (containerWidth/2) + (videoWidth/2))
			
			//console.log(videoPos)
			//console.log(containerWidth)
			//console.log(videoWidth)
			//console.log(scrollToHere)
			if(scrollToHere < 0) scrollToHere = 0
			self.playVideo($elem.find('video'));
			$('.overview').animate({
				left: (scrollToHere * -1)
			}, {
				easing: 'easeOutQuint',
				duration: 1000,
				step: function( currentLeft ){
					if(self.scrollContainer)self.scrollContainer.tinyscrollbar_update(currentLeft*-1) ;
				},
				complete: function(){
					self.scrollContainer.tinyscrollbar_update(scrollToHere) ;					
					//self.playVideo($elem.find('video'));
				}
			});
 
		}
	},
	
	
	getFilmBySlug: function(slug){
		var self = this;
		var selectedItem = null;
		_.each(this.collection.models, function (item){
			if(item.get("slug") == slug){
				selectedItem = item;
				return(item);				
			}			
		});
		return(selectedItem);	
	}

})






/*

app.singleFilmView = app.GenericView.extend({
	
	className: 'artist-detail',
	id: '',
	fadeSpeed: 300,			
	template: '',
	activeImageSlug: null,
	loaded: false,
	rendered: false,
		
	initialize: function() {
		this.template = $('#artistDetailTemplate').html();
		this.loadData(this.id);
	}, 
	
	loadData: function(id) {
		this.$el.html(''); 
		this.activeImageSlug = null;
		var self = this;
		this.loaded = false;
		this.id = id
		this.collection = new app.ImageCollection({id: this.id});
		this.bind('loaded', this.doRender, this)
	 	this.collection.fetch({ 
			success: function () { 
				self.loaded = true;	
				self.trigger('loaded');	
			} 				
		});	
	},
	
	render: function() { 
		if(this.loaded){		
			this.doRender();
		} else {			
			this.bind('loaded', this.doRender, this) ;// if the data hasn't loaded yet, then listen for it to finish
		}				
	},  
	
	doRender: function(){
		this.unbind('loaded');
		
		var self = this;
		
		this.$el.html(''); 
		var tmpl = _.template( this.template ); 				
			
		this.$el.html(tmpl({"title":this.collection.headline})); 
			
		// LOOP THROUGH EACH IMAGE AND CREATE AN "ImageThumbnail" OBJECT
		
		_.each(this.collection.models, function (item){
			var imageModel = new app.ImageModel(item.toJSON());	
			var newThumb = new app.ImageThumbnail({model:imageModel});		
			self.$el.find('#artist-images').append(newThumb.render().el)
		});
		
		//$('body').append(this.$el)	;
		
		// if there is not an active image, the show the first image.
		if(this.activeImageSlug == null && this.collection.models.length > 0){
			this.showImage(this.collection.models[0].get("slug"))
		}
		this.rendered = true;
		self.trigger('rendered');
		
	},
	
	
	
     
	
});




app.FilmThumbnail = Backbone.View.extend({
	tagName: 'li',		
	fadeSpeed: '100',
	
	initialize: function() {
		this.template = $('#imageThumbnailTemplate').html();
		this.model.on( 'change' , this.render, this );
		//this.model.on( 'destroy' , this.remove, this );
		//this.model.on( 'visible' , this.toggleVisible, this );
	}, 

	render: function() { 
		//console.log(this.model.get("alt"))	
		//console.log(this.model.toJSON())		
		var tmpl = _.template( this.template ); 	
		this.$el.html(tmpl( this.model.toJSON() ) ); // this.el is what we defined in tagName. use $el to get access to jQuery html() function.	
						 				 
		return this;	 // allows chaining			
	}, 	
	events: {
		'mouseover': 'doMouseOver',
		'mouseout': 'doMouseOut',
		'click': 'doClick'
	},
	doMouseOver: function(){
		this.$el.stop().fadeTo(this.fadeSpeed,1);
		this.$el.stop().fadeTo(this.fadeSpeed,.65);
	},
	doMouseOut: function(){
		this.$el.stop().fadeTo(this.fadeSpeed,.65);
		this.$el.stop().fadeTo(this.fadeSpeed,1);
	},
	
	doClick: function(event){
		//console.log(this.options.thumbnail);
	},
	
});

*/
