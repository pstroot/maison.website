var app = app || {};


app.GenericView = Backbone.View.extend({
	tagName: 'section',
	id: '',
	fadeSpeed: 300,			
	template: '',
	
	initialize: function() {
	 	_.bindAll(this, 'render');
	}, 
     
		
	close: function(){
		var self = this;
		this.$el.fadeTo(500,0, function(){
			self.trigger('onFadeOut');
			self.remove();
			self.unbind();
		});
		
	},
	
	onShow: function(){
		var self = this;
		
		this.$el.css("opacity",0);
		this.$el.fadeTo(300,1,function(){
			self.trigger("VIEW_SHOWING");	
		});
	}
			        
});


