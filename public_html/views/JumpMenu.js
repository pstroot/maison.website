var app = app || {};

app.JumpMenuOption = Backbone.View.extend({
	tagName: "option",
	
	initialize: function (collection) {
		_.bindAll(this, 'render');
	}, 
	

	events: {
		//'click': 'doSelect'
		//'change': 'doSelect'
	},
	
	
	render: function () {
		 $(this.el).html(this.model.get('title'));
		 $(this.el).attr('value', this.model.get('slug'));		 
		return this;						
	}
});


	
app.JumpMenu = Backbone.View.extend({

			
	events: {
		//'click': 'doSelect'
		'change': 'doSelect'
	},
	initialize: function(){
		//_.bindAll(this, 'addOne', 'addAll');
       // this.collection.bind('reset', this.addAll);
		this.addAll();
	},
	addAll: function(){
		this.collection.each(this.addOne);
	},
	
	addOne: function(item){
		$('select#jumpTo').append(new app.JumpMenuOption({ model: item }).render().el);
	},
	
	
	doSelect: function(item){
		console.log("Jump To New Artist")
		Backbone.history.navigate("/artists/" + this.$el.val(), true)
	}
});
	