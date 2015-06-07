function getNeed() {
	var d = new Date();
	var hour = d.getHours();

	var search = '';
	if ( hour < 11) {
		search = 'nature OR flower OR architecture';
	} else if (hour < 15 && hour > 11) {
		search = 'food OR architecture OR art'
	} else if (hour > 16 && hour < 20)  {
		search = 'art OR architecture OR history OR food';
	} else if (hour > 20)  {
		search = 'night'
	} else  {
		search = 'architecture';
	}
	return search;
}

var app = angular.module('flickr', ['ngRoute', 'geolocation']);

app.controller('FlickrCtrl',function($scope, $http, geolocation) {
	$scope.photos = [];
    $scope.modalOpened = false;
	$scope.loading = true;
	
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

	
	geolocation.getLocation().then(function(data){
		geoData = data.coords;
		console.log(geoData);
		current = new Date().getTime();

		var params={api_key:"8e8b0a8d39a7af07485e7b992084a350",per_page:7,format:"json",nojsoncallback:1,sort:"interestingness-desc",min_upload_date:current/1e3-604800,method:"flickr.photos.search",text:getNeed(),lat:geoData.latitude,lon:geoData.longitude,radius:"3",content_type:"1",extras:"description, date_taken, geo, tags, views, media,path_alias, url_sq, url_z"};
		
    	$http({method: 'GET', url: "https://api.flickr.com/services/rest/", params: params}).
        success(function(data, status, headers, config) {
			$scope.result = data.photos.photo;
			$scope.loading = false;
			console.log(data);		
			
	        $scope.result.forEach(function (photo) {
					
					var paramsFav={
						api_key:"8e8b0a8d39a7af07485e7b992084a350",
						photo_id:photo.id,
						format:"json",
						nojsoncallback:1,
						method:"flickr.photos.getFavorites",
						per_page:1
					};
					
			    	$http({method: 'GET', url: "https://api.flickr.com/services/rest/", params: paramsFav}).success(function(data, status, headers, config) {
						console.log(data.photo)
						photo['users_rating'] = data.photo.total
					
					});
					
	         });
			
			
			
			

        }).
        error(function(data, status, headers, config) {
			console.log('error get flickr');
         });


	});

	

});

app.directive('flickrs', function() {
		return {
			templateUrl: 'partials/see.html'
		};
	});
	
app.directive('login', function() {
		return {
			templateUrl: 'partials/login.html'
		};
	});