var app = app || {};




app.NewsView = app.GenericView.extend({

	tagName: 'section',
	className: 'news-container',
	id: 'news',
	fadeSpeed: 300,			
	template: '',
	
	initialize: function() {
		this.template = $('#newsTemplate').html(); 	
		this.collection.on("reset", this.render, this);
		var self = this;
		$(window).resize(function() {
			self.setContentHeight();
		});
		
		this.render();
		
	}, 
			
	
	render: function() {
		this.$el.hide(); // hide at first so we can fade in
		
		this.$el.html(''); // clear out the HTML. We're going to re-generate it
		
		//var content = this.$el.html();
		var tmpl = _.template( this.template );
		
		this.$el.html(tmpl({"headline":this.collection.headline, "data" : this.collection.toJSON()})); 

		$('body').append(this.$el)

		this.setContentHeight();
		
		return this;	 // allows chaining			

	},   
	
	setContentHeight: function(){
		// set the height of hte main content.
		var contentHeight = $(window).height() - parseInt(this.$el.css("top")) - 2;
		this.$el.css({
			"height":contentHeight+"px",
			"overflow":"hidden"
		});
	},
	  
	close: function(){
		this.$el.stop(true,true).fadeOut(this.fadeSpeed);
	},
	show: function(){
		this.$el.stop(true,true).fadeIn(this.fadeSpeed);
	}
		
	

		        
});


