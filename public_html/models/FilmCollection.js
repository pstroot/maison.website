
app.Film = Backbone.Model.extend({
	defaults: {
		title: 'FILM',
		slug: '',
		caption: '',
		mp4: '',
		webm: '',
		ogv: '',
		mov: '',
		width: '240',
		height: '360'
		
	},
	
		
	set: function(attributes, options) { 
		
		var origWidth = attributes.width
		var origHeight = attributes.height
		var targetHeight = 405;  
		var scaleRatio = targetHeight/origHeight
		
		attributes.width = 720; //792; // //parseInt(origWidth * scaleRatio); 
		attributes.height = 405; //446;  //parseInt(origHeight * scaleRatio); 
		
		var d = new Date(attributes.date.replace(/-/g, "/"))
		var mthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
		attributes.formattedDate = (d.getDate()+1) + " " + mthNames[d.getMonth()] + " " + d.getFullYear()
		
        return Backbone.Model.prototype.set.call(this, attributes, options);
    }
});



app.FilmCollection = Backbone.Collection.extend({
	model: app.Film,
	url : 'api/films',
	headline : '',
	

	parse: function(data) {		
		this.headline 	= data["headline"];	
		return data["films"];
	}

});
	