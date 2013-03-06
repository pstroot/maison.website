var app = app || {};


app.Contact = app.GenericView.extend({

	tagName: 'section',
	className: 'content-box',
	id: 'contact',
	fadeSpeed: 300,			
	template: '',
	
	initialize: function() {
		this.template = $('#contactTemplate').html(); 	
	 	_.bindAll(this, 'render');
	}, 
			
	
	render: function() { 
		var tmpl = _.template( this.template ); 				
		this.$el.html(tmpl()); 			  
		$('body').append(this.$el)
		return this;	 // allows chaining			
	}     
		
			        
});


