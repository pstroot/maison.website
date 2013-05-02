var app = app || {};


app.Index_v2b = app.GenericView.extend({

	tagName: 'section',
	className: 'content-index',
	id: 'index_v2b',	

	
	initialize: function(img) {
		this.url = img
		this.template = $('#index_v2b_Template').html(); 	
	 	_.bindAll(this, 'render');
	}, 
			
	
	render: function() { 
		var tmpl = _.template( this.template ); 				
		this.$el.html(tmpl()); 			  
		$('body').append(this.$el)
		return this;	 // allows chaining			
	}     
		
			        
});


