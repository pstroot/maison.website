var app = app || {};


app.NewsModel = Backbone.Model.extend({
	defaults: {
		headline: 'NEWS!'
	}
});
	

app.NewsCollection = Backbone.Collection.extend({
	model: app.NewsModel,
	url : 'api/news',
	
	parse: function(data) {		
		this.headline 	= data["headline"];		
		return data["news"];
	}
	
});