
app.ImageModel = Backbone.Model.extend({

	defaults: {
		type: 'IMAGE',
		alt: '',
		slug: '',
		filename: '',
		thumbnail: '',
		large: '',
		fullsize: '',
		caption: ''	,
		artistSlug: ''	,
		width: '500'	,
		height: '500'	
	}
});



app.ImageCollection = Backbone.Collection.extend({
	model: app.ImageModel,
	artistID: '',
	headline: '',
	
	initialize: function(params){
		this.url =  "api/artists/"+params["id"];
		this.artistID = +params["id"];

        // do some logic here

        // if collection is empty, fetch from server
        
    },
	
	
	parse: function(data) {
		
		this.headline 	= data["title"];
		this.artistID	= data["id"];
		this.slug 		= data["slug"];
		this.coverImage = data["coverImage"];
		return data["images"];
	}
	
});
	