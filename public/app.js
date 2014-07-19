var app = angular.module("fluential",['ngTagsInput','ui.bootstrap','videosharing-embed']);



app.controller('FluentialCtrl', ['$scope', function ($scope) {

}]);

// need to convert hash to array for radiobuttons to work
app.filter('toArray', function () {
  'use strict';

  return function (obj) {
      if (!(obj instanceof Object)) {
          return obj;
      }

      return Object.keys(obj).map(function (key) {
          return Object.defineProperty(obj[key], '$key', {__proto__: null, value: key});
      });
  }
});

var ModalInstanceCtrl = function ($scope, $modalInstance, influencers) {

  $scope.influencers = influencers;
  $scope.selected = {
    influencer: $scope.influencers.first
  };

  // console.log($scope.selected);

  $scope.ok = function () {
    $modalInstance.close($scope.selected.profile);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}


// app.directive("trendLine",function(){

//  function link(scope,el,attrs){
//    var data = scope.data;
//    var color = d3.scale.category10();
//    var el = el[0];
//    var width = el.parentNode.clientWidth;
//    // console.log(width);
//    var height = el.parentNode.clientHeight;
//    // console.log(height);
//    var min = Math.min(width, height);

//     var line = d3.svg.line() 
//       .x(function(d) { return d.x })
//       .y(function(d) { return d.y });

//     var svg = d3.select(el).append('svg')
//     .attr("width",width)
//     .attr("height",height);

//     var g = svg.append("g");


//    var lines = g.selectAll("path")
//      .data([data]) 
//      .enter()
//      .append("path") 
//      .attr("d", line) 
//      .attr("fill", "none")
//      .attr("stroke", "#444444")
//      .attr("stroke-width", "2px");



//    scope.$watch(function(){
//        return el.parentNode.clientWidth * el.parentNode.clientHeight;
//      }, function(){

//        width = el.parentNode.clientWidth;
//        height = el.parentNode.clientHeight;

//        // if(width != svg.attr('width')) {
//          svg.attr({width: width, height: height});
//        // }

//        min = Math.min(width, height);
      

//        lines.attr("transform","translate("+width / 2 + "," + height / 2 + ")");

//        lines.attr("d", line);

//        scope.$watch('data', function(data){
//          lines.attr("d", line);
//        });
//    });

//   }


//  return {
//    link: link,
//    restrict: "EA",
//    scope: {data: '='}
//  }

// });

app.controller('TagsCtrl', ['$scope','$modal','$log','$http','$window','$filter','$q', function ($scope,$modal,$log,$http,$window,$filter,$q) {

  angular.element($window).on('resize',function(){
    $scope.$apply()
  });


  $scope.influencersData = {};

  $scope.influencers = ["PewDiePie", "holasoygerman", "smosh", "JennaMarbles", "nigahiga",  "RayWilliamJohnson", "ERB", "SkyDoesMinecraft", "TheFineBros", "portadosfundos", "werevertumorro", "vanossgaming", "CaptainSparklez", "TheSyndicateProject", "elrubiusomg", "vsauce", "collegehumor", "officialpsy", "lady16makeup", "freddiew",   "vitalyzdtv", "speedyw03", "ShaneDawsonTV", "RoosterTeeth", "ElektraRecords", "BlueXephos", "TobyGames", "MichellePhan", "Macbarbie07", "EpicMealtime", "enchufetv", "ksiolajidebt", "vegetta777", "RiotGamesInc", "SpinninRec", "Tobuscus"];

  // EXCLUDE THESE
  // "RihannaVEVO", "onedirectionvevo", "KatyPerryVEVO", "eminemVEVO","youtubeshowsus", "JustinBieberVEVO","TheOfficialSkrillex","VEVO","mileycyrusvevo", "TaylorSwiftVEVO","machinima","TheEllenShow",
    

    $scope.influencers.map(function(influencer){

          $http.get("http://gdata.youtube.com/feeds/api/users/" + influencer + "?alt=json")
          .success(function(data){

            var profileData = data.entry;

            var subscribers = profileData.yt$statistics.subscriberCount;

            var views = profileData.yt$statistics.totalUploadViews;


            $http.get("http://gdata.youtube.com/feeds/api/users/"+ influencer +"/uploads?alt=json&max-results=10")
              .success(function(videoData){

                var code = videoData.feed.entry[0].media$group.media$content[0].url.match(/v\/(.*)\?/)[1]
                
                var averageViewsArray = [];

                videoData.feed.entry.map(function(entry){
                  
                  averageViewsArray.push(entry.yt$statistics.viewCount);
          
                })

                
                var averageViews = d3.mean(averageViewsArray.map(Number));

                $scope.influencersData[influencer] = { profile: profileData, videos: videoData.feed.entry, username: influencer, code: code, subscribers: subscribers, views: views, averageViews: averageViews};

              });

         });

        });


  // window.setTimeout(function(){ console.log($scope.influencersData) }, 1000);
   

  $scope.radioModel = 'subscribers';


  $scope.filterProfiles = function() {
    var tags = this.tags.map(function(tag) { return tag.text });

    if(tags.length == 0) {
      $scope.filteredProfiles = $scope.influencersData;
      return; 
    }

    var influencersArray = _.filter($scope.influencersData, function(influencer) {
      // console.log(influencer.username)
      var keywords = [influencer.username]
      return keywords.some(function(keyword) {
        return (tags.indexOf(keyword) > -1);
      })
    })

    // console.log(influencersArray)

    $scope.filteredProfiles = _.object(_.map(influencersArray, function(influencer){
        return influencer.username
    }), influencersArray)

    // console.log($scope.filteredProfiles)
  }

  $scope.open = function (size,username) {
    // console.log(username);
    
    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: ModalInstanceCtrl,
      size: size,
      resolve: {
        influencers: function () {
          $scope.filteredOrderedProfiles = $filter('orderBy')($scope.filteredProfiles,$scope.radioModel,'!reverse');
          return $scope.filteredOrderedProfiles[username];
          
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



