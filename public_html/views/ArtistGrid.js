app.ArtistsGridSquare = Backbone.View.extend({
	tagName: 'li',
	className: 'artist',
	fadeSpeed: 300,			
	template: '',
	category: '',
	
	initialize: function() {
		this.template = $('#artistTemplate').html();
		/*
		var self = this;
		$('.mainContent').scroll(function(d,h) {
			self.adjust_fade_based_on_position();
		});
		*/
	}, 
			
	adjust_fade_based_on_position: function(){
		var containerTop = $('.mainContent').position().top;
		var thisTop = this.$el.position().top;
		var thisPos = thisTop - containerTop;
		var visibleHeight =  $('.mainContent').height();
		//var pixelsForFading = visibleHeight - this.$el.height();		
		var percentScrolled = 1 - (thisPos/visibleHeight);		
		this.$el.css("opacity",percentScrolled);
	},
	
	events: {
		'mouseover': 'doMouseOver',
		'mouseout': 'doMouseOut'
	},
	
	render: function() { 
		var self = this;
		var tmpl = _.template( this.template ); 
		var theJSON = 	this.model.toJSON()	;	
		this.$el.html(tmpl( theJSON ) ); // this.el is what we defined in tagName. use $el to get access to jQuery html() function.				 
		this.$el.on('rollover' , this.doRollover, this);
		
		this.$el.find('.artistRollover').hide();
		this.$el.find('a').hide();

		this.$el.find('.artistThumb').addClass('preloading')
		this.$el.find('img.thumbImg').load(function() {			
			self.$el.find('a').fadeTo(self.fadeSpeed,1,function(){
				self.$el.find('.artistThumb').removeClass('preloading')	
			});
		}).attr('src', this.model.get("thumbnail"));	
		
				
		return this;	 // allows chaining			
	},   
	doMouseOver: function(){
		this.$el.find('.artistRollover').show();
		this.$el.find('.artistRollover').stop().fadeTo(this.fadeSpeed,1);
		this.$el.find('img').stop().fadeTo(this.fadeSpeed,.20);
	},
	doMouseOut: function(){
		this.$el.find('.artistRollover').stop().fadeTo(this.fadeSpeed, 0);
		this.$el.find('img').stop().fadeTo(this.fadeSpeed,1);
	}			        
	
});







app.ArtistGridView = app.GenericView.extend({
	className: 'artistList',
	models: null,
	
	initialize: function () {
		//console.log("Create New Artist Grid View")		
	}, 
	 
	 render: function (data) {
		this.models = this.collection.models;
	 },
	 
	 buildGrid: function(){
		this.$el.empty(); // clear out the grid so we can re-populate it
		var that = this;
		_.each(this.models, function (item){
			that.renderArtist(item);
		}, this);
		//this.$el.find('li').hide();	// hide everything at first so we can fade them in with "fadeInThumbnails"
		this.$el.find("li:nth-child(5n)").css("margin-right","0px"); // take the right margin off every 5th image so that it wraps nicely 
	 },
	 
	 renderArtist: function (item) {
		var artistsGridSquare = new app.ArtistsGridSquare({
			model:item
		});
		
		this.$el.append(artistsGridSquare.render().el);
	 },

	
	onShow: function(){
		this.buildGrid();
		//$('.bottomFade').show();
		this.$el.css("opacity",1); //
		this.fadeInThumbnails();		
	},
	

	close: function(){
		//$('.bottomFade').hide();
		app.GenericView.prototype.close.call(this);
	},
	
	fadeInThumbnails: function(){		
		this.$el.find('li').hide();		
		this.$el.find('li').each(function(i){
			$(this).delay(i*50).fadeTo(300,1);
			$(this).find('img.thumbImg').delay((i*50)+1).fadeTo(300,1);
		});
	}
	

})