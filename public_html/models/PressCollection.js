var app = app || {};


app.PressView = Backbone.Model.extend({
	defaults: {
		title: 'no name',
		description: '',
		id: '',
		footer_text: 'Click here for more...',
		url: ''
	}
});
	

app.PressCollection = Backbone.Collection.extend({
	model: app.PressView,
	url : 'api/press',
	
	
	parse: function(data) {	
		for (var key in data) {	
			var thisTitle = data[key]["title"];
			if(thisTitle){
				data[key]["title"] = thisTitle.replace(/ /gi, '&nbsp;&nbsp;');
			}
		}
		return data;
	}
	
});