
app.Artist = Backbone.Model.extend({
	defaults: {
		title: 'no name',
		slug: '',
		thumbPath: 'images/covers/',
		coverImage: 'fpo.jpg'	
	}
});



app.ArtistCollection = Backbone.Collection.extend({
	model: app.Artist,
	url : 'api/artists'
});
	