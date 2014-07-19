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


app.controller('TagsCtrl', ['$scope','$modal','$log','$http','$window','$filter','$q', function ($scope,$modal,$log,$http,$window,$filter,$q) {

  angular.element($window).on('resize',function(){
    $scope.$apply()
  });

  $scope.influencersData = {};

  // $scope.influencers = ["ERB"]
  $scope.influencers = ["PewDiePie", "holasoygerman", "smosh", "JennaMarbles", "nigahiga",  "RayWilliamJohnson", "ERB", "SkyDoesMinecraft", "TheFineBros", "portadosfundos", "werevertumorro", "vanossgaming", "CaptainSparklez", "TheSyndicateProject", "elrubiusomg", "vsauce", "collegehumor", "officialpsy", "lady16makeup", "freddiew",   "vitalyzdtv", "speedyw03", "ShaneDawsonTV", "RoosterTeeth", "ElektraRecords", "BlueXephos", "TobyGames", "MichellePhan", "Macbarbie07", "EpicMealtime", "enchufetv", "ksiolajidebt", "vegetta777", "RiotGamesInc", "SpinninRec", "Tobuscus"];

  // EXCLUDE THESE
  // "RihannaVEVO", "onedirectionvevo", "KatyPerryVEVO", "eminemVEVO","youtubeshowsus", "JustinBieberVEVO","TheOfficialSkrillex","VEVO","mileycyrusvevo", "TaylorSwiftVEVO","machinima","TheEllenShow",

    

    $scope.influencers.map(function(influencer){

          $http.get("http://gdata.youtube.com/feeds/api/users/" + influencer + "?alt=json")
          .success(function(data){

            var profileData = data.entry;

            var subscribers = profileData.yt$statistics.subscriberCount;

            var views = profileData.yt$statistics.totalUploadViews;

            var contentLength = profileData.content.$t.length > 110 ? true : false;
            

            // console.log(contentLength);


            $http.get("http://gdata.youtube.com/feeds/api/users/"+ influencer +"/uploads?alt=json&max-results=10")
              .success(function(videoData){

                var code = videoData.feed.entry[0].media$group.media$content[0].url.match(/v\/(.*)\?/)[1]
                
                var averageViewsArray = [];

                videoData.feed.entry.map(function(entry){
                  
                  averageViewsArray.push(entry.yt$statistics.viewCount);
          
                })

                var averageViews = d3.mean(averageViewsArray.map(Number));

                $scope.influencersData[influencer] = { profile: profileData, videos: videoData.feed.entry, username: influencer, code: code, subscribers: subscribers, views: views, averageViews: averageViews, tooLongDescription: contentLength};

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



