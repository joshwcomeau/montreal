function getTimes(e){switch(e){case"Mad Max: Fury Road":return{times:"Today 1:15, 1:55, 4:05, 4:50, 6:55, 7:40, 9:55, 10:20, 10:25",location:"Banque Scotia Montreal 977 rue Ste-Catherine O.",trailer:"https://www.youtube.com/watch?v=XYGzRB4Pnq8"};case"Ex Machina":return{times:"Today 1:45, 4:30, 7:15, 9:15, 10:00",location:"Cineplex Forum 2313 Ste-Catherine Ouest",trailer:"https://www.youtube.com/watch?v=hEJnMQG9ev8"};case"Far From the Madding Crowd":return{times:"Today 4:30, 7:20, 10:10",location:"Cineplex Forum 2313 Ste-Catherine Ouest",trailer:"https://www.youtube.com/watch?v=WCm1XNVD_0c"};default:return{times:"Today -",location:"Banque Scotia Montreal 977 rue Ste-Catherine O."}}}

var app = angular.module("movieApp", ['ui.bootstrap', 'geolocation', 'ngResource', 'ngRoute']).config(['$httpProvider', function($httpProvider) {
	delete $httpProvider.defaults.headers.common["X-Requested-With"];
	$httpProvider.defaults.useXDomain = true;
	$httpProvider.defaults.withCredentials = true;
	$httpProvider.defaults.headers.common["Accept"] = "application/json";
	$httpProvider.defaults.headers.common["Content-Type"] = "application/json";
    }]);


app.config(function($compileProvider) {
  if (!location.host.match(/localhost/)) {
    $compileProvider.debugInfoEnabled(false);
  }
})

app.factory('movieSearch', function($resource){
	return {
		fetchMovieInfo: function(callback){

			var api = $resource('http://api.rottentomatoes.com/api/public/v1.0/lists/movies/in_theaters.json?apikey=:key&page_limit=:limit&callback=JSON_CALLBACK', {
				key: 'dpjxf3xsjbpj5wpmduveeseb',
				limit: 16
			}, {
				fetch:{method:'JSONP'}
			});

			api.fetch({}, function(response){
				console.log(response);
				callback(response);
			});
		}
	}
});



app.controller('movieController', function($scope, $http, movieSearch){
	$scope.loading = true;
	$scope.modalOpened = false;
	
    $scope.openLogin = function(){
        var self = this;
        $('.photoModal').modal('show');
        if($scope.modalOpened) return;
        $('.photoModal').modal('show');
        $('.photoModal').on('hide.bs.modal', function (e) {
            $scope.modalOpened = false;
        });
        $scope.modalOpened = true;
    },
	
	$scope.search = function() {
		
		//Watch Search
		movieSearch.fetchMovieInfo(function(data){
			var movies = data.movies;
			$scope.loading = false;
	        movies.forEach(function (movie) {
				if (movie.ratings.critics_score > 84){
					search = movie.title.replace(' ', '+');
	   		   	 	var posterUrl = 'http://www.omdbapi.com/?t=' + search + '&y=&plot=short&r=json';
	   		   	 	$http.get(posterUrl).success(function(response) { 
						console.log(response);
						movie['imdbVotes']= response.imdbVotes; 
						movie['bigPoster'] = response.Poster;
						movie['genre']= response.Genre;
						movie['Director']= response.Director;
						movie['Awards']= response.Awards;
						movie['showtimes'] = getTimes(movie.title);
						movie['plot'] = response.Plot;
						
						console.log(movie['showtimes']);

					}).error( );
					
				}
	         });
			$scope.result = movies;
		});
		

		
		
	}
	
});

app.directive('movies', function() {
		return {
			templateUrl: '../partials/watch.html'
		};
	});

app.directive('login', function() {
		return {
			templateUrl: '../partials/login.html'
		};
	});
	