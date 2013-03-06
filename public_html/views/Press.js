var app = app || {};



app.Press = app.GenericView.extend({

	tagName: 'section',
	className: 'content-box',
	id: 'press',
	
	initialize: function() {
		this.template = $('#pressTemplate').html(); 	
		//this.collection.on("reset", this.render, this);
	}, 
		
	render: function() { 
		if(this.collection.models.length > 0){			
			var tmpl = _.template( this.template ); 
			this.$el.html(tmpl({"data" : this.collection.toJSON()})); 								  
			$('body').append(this.$el)
			$('.mainContent').scrollTop(0);		
		}
		return this;	 // allows chaining			
	}     
         
});


