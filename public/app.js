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


// theApp.factory('mainInfo', function($http) { 

//     var obj = {content:null};

//     $http.get('content.json').success(function(data) {
//         // you can do some processing here
//         obj.content = data;
//     });    

//     return obj;    
// });


// $scope.foo = "Hello World";
// mainInfo.success(function(data) { 
//     $scope.foo = "Hello "+data.contentItem[0].username;
// });




// app.factory("youtubeData",['$http',function($http){


//   return {

//     influencers: ["PewDiePie", "YouTube", "movies", "holasoygerman", "smosh", "RihannaVEVO", "onedirectionvevo", "JennaMarbles", "KatyPerryVEVO", "eminemVEVO", "nigahiga", "youtubeshowsus", "machinima", "RayWilliamJohnson", "ERB", "SkyDoesMinecraft", "JustinBieberVEVO", "TheEllenShow", "TheFineBros", "portadosfundos", "werevertumorro", "TheOfficialSkrillex", "TaylorSwiftVEVO", "vanossgaming", "CaptainSparklez", "TheSyndicateProject", "elrubiusomg", "vsauce", "collegehumor", "officialpsy", "lady16makeup", "freddiew", "VEVO", "mileycyrusvevo", "vitalyzdtv", "speedyw03", "ShaneDawsonTV", "RoosterTeeth", "ElektraRecords", "BlueXephos", "TobyGames", "MichellePhan", "Macbarbie07", "EpicMealtime", "enchufetv", "ksiolajidebt", "vegetta777", "RiotGamesInc", "SpinninRec", "Tobuscus"],

//     top50Influencers: function(influencers){
//       return influencers.map(function(influencer){
//          "http://gdata.youtube.com/feeds/api/users/"+ influencer +"/uploads?alt=json&max-results=10";
         
//       })
//     },
    
//     top10Videos: function(){
//       influencers.map(function(influencer){
//         return "http://gdata.youtube.com/feeds/api/users/"+ influencer +"?alt=json";     
//       })
//     }

//     };

// }]);




app.controller('TagsCtrl', ['$scope','$modal','$log','$http','$window','$filter', function ($scope,$modal,$log,$http,$window,$filter) {

	angular.element($window).on('resize',function(){
		$scope.$apply()
	});

  // console.log(youtubeData.influencers);
  // console.log(youtubeData.top10Videos());
  // console.log(youtubeData.top50Influencers());



  var top10;
  var top10Videos;
  var top50Influencers;







  $scope.influencers = ["PewDiePie", "YouTube", "movies", "holasoygerman", "smosh", "RihannaVEVO", "onedirectionvevo", "JennaMarbles", "KatyPerryVEVO", "eminemVEVO", "nigahiga", "youtubeshowsus", "machinima", "RayWilliamJohnson", "ERB", "SkyDoesMinecraft", "JustinBieberVEVO", "TheEllenShow", "TheFineBros", "portadosfundos", "werevertumorro", "TheOfficialSkrillex", "TaylorSwiftVEVO", "vanossgaming", "CaptainSparklez", "TheSyndicateProject", "elrubiusomg", "vsauce", "collegehumor", "officialpsy", "lady16makeup", "freddiew", "VEVO", "mileycyrusvevo", "vitalyzdtv", "speedyw03", "ShaneDawsonTV", "RoosterTeeth", "ElektraRecords", "BlueXephos", "TobyGames", "MichellePhan", "Macbarbie07", "EpicMealtime", "enchufetv", "ksiolajidebt", "vegetta777", "RiotGamesInc", "SpinninRec", "Tobuscus"];

    $scope.top10Videos = $scope.influencers.map(function(influencer){
      return "http://gdata.youtube.com/feeds/api/users/"+ influencer +"/uploads?alt=json&max-results=10";
    });

    $scope.top50Influencers = $scope.influencers.map(function(influencer){
      return "http://gdata.youtube.com/feeds/api/users/"+ influencer +"?alt=json";     
    })

      // $http.get("http://gdata.youtube.com/feeds/api/users/PewDiePie/uploads?alt=json&max-results=10")
      // .success(function(data,status,headers,config){
      //   // console.log(data);
      // });

      // console.log($scope.influencers);  
      // console.log($scope.top10Videos);
      // console.log($scope.top50Influencers);

      // $scope.top50Influencers.map(function(influencer){
      //   $http.get(influencer)
      //   .success(function(data){

      //  });
      // })



      // $scope.top10Videos.map(function(video){
      //   $http.get(video)
      //   .success(function(data){
      //     // console.log(data);
      //     $scope.videoData = data;
      //  });
      // })








    // $scope.top50Influencers.map(function(top50Influencer){
    //   $http.jsonp(top50Influencer)
    //   .success(data, status, headers, config){
    //     $scope.top50Data = data;
    //   };
    // });
  



	$scope.radioModel = 'subscribers';


	$scope.filterProfiles = function() {
		var tags = this.tags.map(function(tag) { return tag.text });

		if(tags.length == 0) {
			$scope.filteredProfiles = $scope.profiles
			return; 
		}

		$scope.filteredProfiles = $scope.profiles.filter(function(profile) {
			var keywords = profile.keywords.split(', ')

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


    


  $scope.historical = [
  {
    name: 'zoella',
    thumbnail: 'zoella.jpg',
    subscribers: 29,
    total_views: 124,
    average_views: 76,
    growth_rate: 327,
    keywords: 'girl, uk, cats',
    about: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quis repudiandae itaque, voluptatum sed magnam quaerat beatae animi voluptate eligendi quo velit quisquam ex necessitatibus, quibusdam, sit ullam ipsum. Dolores, ad!",
    video: "uXqoqifwPkY"
  },
  {
    name: 'joanan',
    thumbnail: 'zoella.jpg',
    subscribers: 1353,
    total_views: 431,
    average_views: 88,
    growth_rate: 1367,
    keywords: 'house, car, bicycle',
    about: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quis repudiandae itaque, voluptatum sed magnam quaerat beatae animi voluptate eligendi quo velit quisquam ex necessitatibus, quibusdam, sit ullam ipsum. Dolores, ad!",
    video: "RY0iOcmWdi8"
  },
  {
   	name: 'peter',
    thumbnail: 'zoella.jpg',
    subscribers: 435,
    total_views: 54003,
    average_views: 93300,
    growth_rate: 57776,
    keywords: 'dog, usa, running, crazy',
    about: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quis repudiandae itaque, voluptatum sed magnam quaerat beatae animi voluptate eligendi quo velit quisquam ex necessitatibus, quibusdam, sit ullam ipsum. Dolores, ad!",
    video: "jGJuLkgSV2k"
  },
  {
    name: 'sally',
    thumbnail: 'zoella.jpg',
    subscribers: 5000,
    total_views: 53543,
    average_views: 4933,
    growth_rate: 5426,
    keywords: 'dog, usa, running, cool',
    about: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quis repudiandae itaque, voluptatum sed magnam quaerat beatae animi voluptate eligendi quo velit quisquam ex necessitatibus, quibusdam, sit ullam ipsum. Dolores, ad!",
    video: "jGJuLkgSV2k"
  },
  {
    name: 'annie',
    thumbnail: 'zoella.jpg',
    subscribers: 12300,
    total_views: 535343,
    average_views: 9443,
    growth_rate: 5360,
    keywords: 'dog, walking, running, cool',
    about: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quis repudiandae itaque, voluptatum sed magnam quaerat beatae animi voluptate eligendi quo velit quisquam ex necessitatibus, quibusdam, sit ullam ipsum. Dolores, ad!",
    video: "jGJuLkgSV2k"
  },
  {
    name: 'vaidas',
    thumbnail: 'zoella.jpg',
    subscribers: 985,
    total_views: 56543,
    average_views: 3233,
    growth_rate: 600,
    keywords: 'cats, usa, running, crazy',
    about: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quis repudiandae itaque, voluptatum sed magnam quaerat beatae animi voluptate eligendi quo velit quisquam ex necessitatibus, quibusdam, sit ullam ipsum. Dolores, ad!",
    video: "jGJuLkgSV2k"
  }

  ];

  $scope.profiles = [
  {
    name: 'zoella',
    thumbnail: 'zoella.jpg',
    subscribers: 41,
    total_views: 1234,
    average_views: 576,
    growth_rate: 32,
    keywords: 'girl, uk, cats',
    about: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quis repudiandae itaque, voluptatum sed magnam quaerat beatae animi voluptate eligendi quo velit quisquam ex necessitatibus, quibusdam, sit ullam ipsum. Dolores, ad!",
    video: "uXqoqifwPkY"
  },
  {
    name: 'joanan',
    thumbnail: 'zoella.jpg',
    subscribers: 124353,
    total_views: 4321,
    average_views: 888,
    growth_rate: 13,
    keywords: 'house, car, bicycle',
    about: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quis repudiandae itaque, voluptatum sed magnam quaerat beatae animi voluptate eligendi quo velit quisquam ex necessitatibus, quibusdam, sit ullam ipsum. Dolores, ad!",
    video: "RY0iOcmWdi8"
  },
  {
    name: 'peter',
    thumbnail: 'zoella.jpg',
    subscribers: 12435,
    total_views: 543,
    average_views: 933,
    growth_rate: 56,
    keywords: 'dog, usa, running, crazy',
    about: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quis repudiandae itaque, voluptatum sed magnam quaerat beatae animi voluptate eligendi quo velit quisquam ex necessitatibus, quibusdam, sit ullam ipsum. Dolores, ad!",
    video: "jGJuLkgSV2k"
  },
  {
    name: 'sally',
    thumbnail: 'zoella.jpg',
    subscribers: 500000,
    total_views: 533543,
    average_views: 234933,
    growth_rate: 54526,
    keywords: 'dog, usa, running, cool',
    about: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quis repudiandae itaque, voluptatum sed magnam quaerat beatae animi voluptate eligendi quo velit quisquam ex necessitatibus, quibusdam, sit ullam ipsum. Dolores, ad!",
    video: "jGJuLkgSV2k"
  },
  {
    name: 'annie',
    thumbnail: 'zoella.jpg',
    subscribers: 123,
    total_views: 53536343,
    average_views: 94433,
    growth_rate: 536,
    keywords: 'dog, walking, running, cool',
    about: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quis repudiandae itaque, voluptatum sed magnam quaerat beatae animi voluptate eligendi quo velit quisquam ex necessitatibus, quibusdam, sit ullam ipsum. Dolores, ad!",
    video: "jGJuLkgSV2k"
  },
  {
    name: 'vaidas',
    thumbnail: 'zoella.jpg',
    subscribers: 98765,
    total_views: 53456543,
    average_views: 93233,
    growth_rate: 6,
    keywords: 'cats, usa, running, crazy',
    about: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quis repudiandae itaque, voluptatum sed magnam quaerat beatae animi voluptate eligendi quo velit quisquam ex necessitatibus, quibusdam, sit ullam ipsum. Dolores, ad!",
    video: "jGJuLkgSV2k"
  }
	
	];
	$scope.filteredProfiles = $scope.profiles;
	
}]);


var data = [1,2,3,4,5,6,6];

w = 400;
h = 400;
margin = 20,
y = d3.scale.linear().domain([0, d3.max(data)]).range([0 + margin, h - margin]);

x = d3.scale.linear().domain([0, data.length]).range([0 + margin, w - margin])





