var app = angular.module("fluential",['ngTagsInput','ui.bootstrap','videosharing-embed']);



app.controller('FluentialCtrl', ['$scope', function ($scope) {

}]);

var ModalInstanceCtrl = function ($scope, $modalInstance, profiles) {

  $scope.profiles = profiles;
  $scope.selected = {
    profile: $scope.profiles[0]
  };

  console.log($scope.selected);

  $scope.ok = function () {
  	console.log('Yo')
    $modalInstance.close($scope.selected.profile);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}


app.directive("trendLine",function(){

	function link(scope,el,attrs){
		var data = scope.data;
		var color = d3.scale.category10();
		var el = el[0];
		var width = el.parentNode.clientWidth;
		console.log(width);
		var height = el.parentNode.clientHeight;
		console.log(height);
		var min = Math.min(width, height);

    var line = d3.svg.line() 
      .x(function(d) { return d.x })
      .y(function(d) { return d.y });

    var svg = d3.select(el).append('svg')
    .attr("width",width)
    .attr("height",height);

    var g = svg.append("g");


		var lines = g.selectAll("path")
	    .data([data]) 
	    .enter()
	    .append("path") 
	    .attr("d", line) 
	  	.attr("fill", "none")
	    .attr("stroke", "#444444")
	    .attr("stroke-width", "2px");



   scope.$watch(function(){
				return el.parentNode.clientWidth * el.parentNode.clientHeight;
			}, function(){

				width = el.parentNode.clientWidth;
				height = el.parentNode.clientHeight;

				// if(width != svg.attr('width')) {
					svg.attr({width: width, height: height});
				// }

				min = Math.min(width, height);
			

				lines.attr("transform","translate("+width / 2 + "," + height / 2 + ")");

				lines.attr("d", line);

				scope.$watch('data', function(data){
					lines.attr("d", line);
				});
		});

  }


	return {
		link: link,
		restrict: "EA",
		scope: {data: '='}
	}

});

app.controller('TagsCtrl', ['$scope','$modal','$log','$http','$window','$filter','$q', function ($scope,$modal,$log,$http,$window,$filter,$q) {

	angular.element($window).on('resize',function(){
		$scope.$apply()
	});


  var top10Videos;
  var top50Influencers;

  $scope.influencersData = [];
  $scope.videosData = [];

  // $scope.influencersData['videos'] = $scope.videosData.feed.entry
  // $scope.allData =

  // $scope.influencers = ["PewDiePie", "YouTube", "movies", "holasoygerman", "smosh", "RihannaVEVO", "onedirectionvevo", "JennaMarbles", "KatyPerryVEVO", "eminemVEVO", "nigahiga", "youtubeshowsus", "machinima", "RayWilliamJohnson", "ERB", "SkyDoesMinecraft", "JustinBieberVEVO", "TheEllenShow", "TheFineBros", "portadosfundos", "werevertumorro", "TheOfficialSkrillex", "TaylorSwiftVEVO", "vanossgaming", "CaptainSparklez", "TheSyndicateProject", "elrubiusomg", "vsauce", "collegehumor", "officialpsy", "lady16makeup", "freddiew", "VEVO", "mileycyrusvevo", "vitalyzdtv", "speedyw03", "ShaneDawsonTV", "RoosterTeeth", "ElektraRecords", "BlueXephos", "TobyGames", "MichellePhan", "Macbarbie07", "EpicMealtime", "enchufetv", "ksiolajidebt", "vegetta777", "RiotGamesInc", "SpinninRec", "Tobuscus"];
  $scope.influencers = ["PewDiePie", "holasoygerman", "smosh", "JennaMarbles"];

    $scope.top10Videos = $scope.influencers.map(function(influencer){
      return "http://gdata.youtube.com/feeds/api/users/"+ influencer +"/uploads?alt=json&max-results=10";
    });

    $scope.firstVideo = $scope.influencers.map(function(influencer){
      return "http://gdata.youtube.com/feeds/api/users/"+ influencer +"/uploads?alt=json&max-results=1";
    });

    $scope.top50Influencers = $scope.influencers.map(function(influencer){
      return "http://gdata.youtube.com/feeds/api/users/"+ influencer +"?alt=json";     
    })


    $scope.top50Influencers.map(function(influencer){

          $http.get(influencer)
          .success(function(data){

            return $scope.influencersData.push(data);
         });

        })

  

    $scope.top10Videos.map(function(video){

          $http.get(video)
          .success(function(data){

            return $scope.videosData.push(data);
         });
          
        })


   

	$scope.radioModel = 'subscribers';


	$scope.filterProfiles = function() {
		var tags = this.tags.map(function(tag) { return tag.text });

		if(tags.length == 0) {
			$scope.filteredProfiles = $scope.influencersData;
			return; 
		}

		$scope.filteredProfiles = $scope.influencersData.filter(function(influencer) {
			var keywords = influencer.entry.title.$t.split(' ')

			return keywords.some(function(keyword) {
				return (tags.indexOf(keyword) > -1);
			})
		})
	}

  $scope.open = function (size,index) {
  	console.log(index);
  	// console.log($scope.profiles[index].video);
    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: ModalInstanceCtrl,
      size: size,
      resolve: {
        profiles: function () {
          $scope.filteredOrderedProfiles = $filter('orderBy')($scope.filteredProfiles,$scope.radioModel,'!reverse');
          return $scope.filteredOrderedProfiles[index];
          
        }
      }
    });

    modalInstance.result.then(function (selectedProfile) {
      $scope.selected = selectedProfile;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  }


// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.
	

  $scope.tags = [];

  $scope.loadTags = function(query) {
    return $http.get('superheroes.json');
  };


	$scope.filteredProfiles = $scope.influencersData;
	
}]);




