app.ViewManager = Backbone.View.extend({

	el: "#mainContent",
	fadeSpeed: 200,
	
	initialize: function() {
		var self = this;
		_.extend(this, Backbone.Events);
		$('.artistJumpMenu').hide();
		
		$(window).resize(function() { self.setContentHeight(); });
		this.setContentHeight();
		setTimeout(function(){self.setContentHeight();}, 1000); // fire again in one second just in case.
		
		
		// if the artist collection has not yet been loaded, load it immediately. We need this right away in order to construct our jump menu in the top right corner
		if(!this.artistCollection){
			this.artistCollection = new app.ArtistCollection();	
			this.artistCollection.fetched = false;
			this.artistCollection.fetch({ 
				success: function () { 				
					self.artistCollection.fetched = true;
					self.showJumpMenu();
					self.trigger("ARTIST_COLLECTION_LOADED");
					//self.goto_photographs();
				} 				
			});	
			return;	
			
		}
		
	}, 
	
	
	setContentHeight: function(){
		var position = $('.mainContent').position();
		var contentHeight = $(window).height() - position.top - 5;
		// set the height of hte main content.
		$('.mainContent').css({
			"height":contentHeight+"px"
		});
	},
	
	show: function (newView) {
		var self = this;
		
		if(this.currentView != null){
			if(this.currentView == newView) return;
			this.closeView(this.currentView);
		}
			
		setTimeout(function(){
			self.currentView = newView;
			self.openView(self.currentView);
		}, this.fadeSpeed);
		
	},
	
	
	closeView: function (view) {
		if (view && view.close) {
			view.close();
		}
	},
	 
	openView: function (view) {
		if(view == null) return;
		view.render();
		this.$el.html(view.el);
		if (view.onShow) {
			view.onShow();
		}
	},
	
	
	
	
	/*//////////////////////////////////////////////////////////////////////////////////*/
	/*////////////////////////////// GRID OF PHOTOGRAPHIS //////////////////////////////*/
	/*//////////////////////////////////////////////////////////////////////////////////*/
	goto_photographs: function(){	
		
		var self = this;
		if(!app.artistCollection){
			self.showLoadingGraphic();
			app.artistCollection = new app.ArtistCollection();			
			app.artistCollection.fetch({ 
				success: function () { 
					self.hideLoadingGraphic();	
					self.goto_photographs();
				} 				
			});	
			return;	
		}
		this.photoGridView = this.photoGridView || new app.ArtistGridView({collection: app.artistCollection});	
		this.show(this.photoGridView);
	},
	
	
	/*//////////////////////////////////////////////////////////////////////////////////*/
	/*/////////////////////// SINGLE ARTIST WITH LIST OF IMAGES ////////////////////////*/
	/*//////////////////////////////////////////////////////////////////////////////////*/
	goto_artist: function(artistID){
		this.hideNews();
		var self = this;
		
		// artistCollection is loaded immediately on page load. so make sure that it exists before we build the artistView
		this.unbind('ARTIST_COLLECTION_LOADED');		
		if(!this.artistCollection.fetched){
			this.showLoadingGraphic();
			this.bind("ARTIST_COLLECTION_LOADED", function(){ this.goto_artist(artistID); }, this);
			return;
		}
		this.hideLoadingGraphic();
		
		
		this.showLoadingGraphic();
		this.newArtist = new app.ArtistView({id: artistID});
		this.newArtist.bind("ARTIST_PAGE_RENDERED",function(){
			self.hideLoadingGraphic();
			self.newArtist.unbind('ARTIST_PAGE_RENDERED',null,this);
		});
		
		this.show(this.newArtist);		
		
	},	
	
	/*//////////////////////////////////////////////////////////////////////////////////*/
	/*////////////////// SINGLE ARTIST - JUMP TO A SPECIFIC IMAGE  /////////////////////*/
	/*//////////////////////////////////////////////////////////////////////////////////*/
	goto_image: function(imageID,artistID){
		this.newArtist = this.newArtist || new app.ArtistView({id: artistID});		
		this.newArtist.showImage(imageID)
		this.show(this.newArtist);		
		
		this.hideNews();
	},
	
	
	

	/*//////////////////////////////////////////////////////////////////////////////////*/
	/*////////////////////////////////// ALL FILMS  ////////////////////////////////////*/
	/*//////////////////////////////////////////////////////////////////////////////////*/
	goto_films: function(){
		this.hideNews();
		
		var self = this;
		if(!app.filmCollection){
			self.showLoadingGraphic();
			app.filmCollection = new app.FilmCollection();			
			app.filmCollection.fetch({ 
				success: function () { 
					self.hideLoadingGraphic();	
					self.goto_films();
				} 				
			});	
			return;	
		}
		this.theFilmsView = this.theFilmsView || new app.FilmsView({collection: app.filmCollection});	
		this.show(this.theFilmsView);
		this.trigger("FILMS_COLLECTION_LOADED");
	},
	
	
	goto_film: function(filmID){
		var self = this;
		this.hideNews();
		
		if(!this.theFilmsView){
			this.goto_films(); // the films section has not yet loaded, so lod it now and listen for the event telling us that it has finished loading.
			//this.bind("FILMS_COLLECTION_LOADED",function(){ this.goto_film(filmID); });
			this.bind("FILMS_COLLECTION_LOADED",function(){ self.goto_film(filmID); });
		} else if(!this.theFilmsView.rendered){
			this.unbind("FILMS_COLLECTION_LOADED");
			this.theFilmsView.bind("VIEW_SHOWING",function(){ self.goto_film(filmID); })
		} else {
			this.unbind("VIEW_SHOWING");
			this.theFilmsView.jumpToFilm(filmID)
		}
		
	},
	
	
	
	
	/*//////////////////////////////////////////////////////////////////////////////////*/
	/*//////////////////////////////// INFORMATION  ////////////////////////////////////*/
	/*//////////////////////////////////////////////////////////////////////////////////*/
	goto_information: function(){
		this.show(new app.Info());
		this.hideNews();
	},
	
	
	/*//////////////////////////////////////////////////////////////////////////////////*/
	/*////////////////////////////////////// PRESS  ////////////////////////////////////*/
	/*//////////////////////////////////////////////////////////////////////////////////*/
	goto_press: function(){
		var self = this;
		if(!app.pressCollection){
			self.showLoadingGraphic();
			app.pressCollection = new app.PressCollection();
			app.pressCollection.fetch({ 
				success: function () {
					self.hideLoadingGraphic();				
					self.goto_press();
				} 
			});			
			return;	
		}
		
		this.thePress = this.thePress || new app.Press({collection: app.pressCollection});		
		this.show(this.thePress);
		this.hideNews();
	},
	
	
	
	/*//////////////////////////////////////////////////////////////////////////////////*/
	/*////////////////////////////////////  CONTACT ////////////////////////////////////*/
	/*//////////////////////////////////////////////////////////////////////////////////*/
	goto_contact: function(){		
		this.show(new app.Contact());
		this.hideNews();
	},

	

	
	/*//////////////////////////////////////////////////////////////////////////////////*/
	/*//////////////////////////////////  JUMP MENU ////////////////////////////////////*/
	/*//////////////////////////////////////////////////////////////////////////////////*/
	showJumpMenu: function(){
		$('.artistJumpMenu').fadeIn();
		if(this.artistCollection){		
			var sortedModels = this.artistCollection.sortBy(function(user){
			  return user.get("title");
			});
			
			var sortedCollection = new app.ArtistCollection(sortedModels);
			var jumpMenu = new app.JumpMenu({el: 'select#jumpTo', collection: sortedCollection});
			// TODO: listen for changes in the selected artist and update the selected item when event is fired.
		}
	},
	
	
	/*//////////////////////////////////////////////////////////////////////////////////*/
	/*/////////////////////////////////////  NEWS //////////////////////////////////////*/
	/*//////////////////////////////////////////////////////////////////////////////////*/
	showNews: function(){
		var self = this;
		if(!app.newsCollection){
			self.showLoadingGraphic();
			app.newsCollection = new app.NewsCollection();
			app.newsCollection.fetch({ 
				success: function () { 	
					self.hideLoadingGraphic();			
					self.showNews();
				} 
			});
			return;
		}
		
		app.newsView = app.newsView || new app.NewsView({collection: app.newsCollection});
		app.newsView.show();		
	},
	
	hideNews: function(){
		if(app.newsView) app.newsView.close();
	},
	
	
	
	/*//////////////////////////////////////////////////////////////////////////////////*/
	/*///////////////////////////// LOADING ANIMATION //////////////////////////////////*/
	/*//////////////////////////////////////////////////////////////////////////////////*/
	showLoadingGraphic: function(msg){
		var preloader = "<div class='preloader' style='display:none;'></div>";		
		$('body').append(preloader);
		$('.preloader').fadeIn(300);
	},
	hideLoadingGraphic: function(){
		
		$('.preloader').fadeOut(300, function(){
			$('.preloader').remove();
		});
		
	}
	
	 
});
	