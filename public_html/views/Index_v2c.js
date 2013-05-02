var app = app || {};


app.Index_v2c = app.GenericView.extend({

	tagName: 'section',
	className: 'content-index',
	id: 'index_v2c',	
	activeImage: 0,
	slideshowDelay: 4000,
	slideshowFadeSpeed: 3000,
	
	initialize: function(img) {
		this.url = img
		this.template = $('#index_v2c_Template').html(); 	
	 	_.bindAll(this, 'render');
	}, 
			
	
	render: function() { 
		var self = this;
		
		var tmpl = _.template( this.template ); 				
		this.$el.html(tmpl()); 			  
		$('body').append(this.$el)
		
		$('#index_v2c_centeredimage img').css("opacity",.5);
		
		// pick a random image to start at
		this.activeImage = Math.floor((Math.random()*$('#index_v2c_slideshow a').length))

		// fix some centering issues on chrome
		$('#index_v2c_centeredimage a img').load(function() {
			$(this).closest('a').width($(this).width())
			$(this).closest('a').hide();
		});
		
		$('#index_v2c_centeredimage a img').eq(this.activeImage).load(function() {		 	
			//console.log("first image loaded ("+self.activeImage+")")
			$(this).closest('a').fadeIn(600,function(){
				var int = setTimeout(function(){
					self.showNextImage();
					var int = setInterval(function(){self.showNextImage()},self.slideshowDelay);
				},500);
			});
			
		}); 


		// hide the text
		$('#index_v2c_text').hide()
		$('#index_v2c_text').delay(1000).fadeIn(1000);
		
		// hide all but the active image
		//$('#index_v2c_slideshow a').hide();
		//$('#index_v2c_slideshow a').eq(this.activeImage).fadeIn(400);
				
		// set a repeat timer to call "showNextImage()" which swaps out the image.
		
		
		
		
		
		return this;	 // allows chaining			
	} ,  
	
	showNextImage: function(){
		//console.log("Fade Out "+this.activeImage)
		var self = this;
		$('#index_v2c_centeredimage a').eq(this.activeImage).fadeOut(self.slideshowFadeSpeed);	// fade out the active image
			
		self.activeImage++;																			// increment our activeImage to the next
		if(self.activeImage >= $('#index_v2c_centeredimage a').length)  self.activeImage = 0;
		//console.log("-> Fade In "+this.activeImage)
		$('#index_v2c_centeredimage a').eq(self.activeImage).fadeIn(self.slideshowFadeSpeed);			// fade in the new image
	}
		
			        
});


