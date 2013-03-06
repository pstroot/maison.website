var app = app || {};


app.Info = app.GenericView.extend({
	
	tagName: 'section',
	className: 'content-box',
	id: 'info',
	
	initialize: function() {
		this.template = $('#infoTemplate').html(); 
	 	_.bindAll(this, 'render');
	}, 
			
	
	render: function() { 
		var tmpl = _.template( this.template ); 				
		this.$el.html(tmpl()); 			  
		$('body').append(this.$el)
		$('.mainContent').scrollTop(0);
		return this;	 // allows chaining			
	}   
		
		        
});


