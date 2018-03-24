"use strict";

/******************************************************************/
/**********************Client-side auth****************************/
/******************************************************************/

(function (g, $) {

	// function creates object (calls abAuth.init - constructor)
	var abAuth = function () {
		return new abAuth.init();
	};

	//** object prototype **//
	abAuth.prototype = {

		loggedIn: function(){
	        var self = this;
			self.isAuthenticated = 1;
			$.ajaxSetup({
				headers: { "x-access-token": self.tokens.accessToken }
			});

			TIMER.set(() => self.refreshToken(), 8 * 1000, 'auth'); //50 * 60 * 1000
			return self;
		}, 

		loggedOut: function(){
	        var self = this;
			self.isAuthenticated = 0;
			$.ajaxSetup({
				headers: {}
			});
			TIMER.auth.destroy();
			return self;
		}, 

		refreshToken: function(){
	        var self = this;
			return $.ajax({
				method: "POST",
				url: "http://127.0.0.1:3000/auth/token",
				dataType: 'json',
				data: JSON.stringify({ 
					sub: self.tokenData.sub,
					refreshToken: self.tokens.refreshToken
				}),
				error: function(xhr, status, error) {
					console.log('auth.js: Error while refreshing token. Logging out..');
					localStorage.setItem('tokens', JSON.stringify({}));
					self.loggedOut();
				},
				success: function(data){
					console.log('auth.js: Access token refreshed, logging in..');
					self.tokens = data;
					localStorage.setItem('tokens', JSON.stringify(self.tokens));
					self.parseToken().loggedIn();
				}
			});
		}, 

		parseToken: function(){
	        var self = this;
			var base64Url = self.tokens.accessToken.split('.')[1],
				base64 = base64Url.replace('-', '+').replace('_', '/');
			self.tokenData = JSON.parse( g.atob(base64) );
			return self;
		}
	}	

	//** constructor **/
	abAuth.init = function() {
        var self = this;
		self.isAuthenticated = 0;

        self.promise = new Promise((resolve, reject) => {

            self.tokens = JSON.parse( localStorage.getItem('tokens') );

            if(self.tokens && Object.keys(self.tokens).length > 0) {
				self.parseToken();

				if (self.tokenData.exp > Math.floor(Date.now() / 1000)){
					console.log('auth.js: Access token hasn\'t expired, logging in..');
					self.loggedIn();
					resolve(self.isAuthenticated);				
				} else {
					console.log('auth.js: Access token expired, trying to refresh..');
					self.refreshToken().always(function() {
						resolve(self.isAuthenticated);				
					});
				}
			} else {
				console.log('auth.js: No tokens found in localStorage.');
				resolve(self.isAuthenticated);				
			}

        });
	}

	// trick borrowed from jQuery so we don't have to use the 'new' keyword
	abAuth.init.prototype = abAuth.prototype;
	// add our abAuth object to jQuery
	$.fn.abAuth = abAuth;

}(window, jQuery));  //pass external dependencies just for convenience, in case their names change outside later