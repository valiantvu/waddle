(function(){

var NavbarController = function (Auth, $rootScope, $scope, UserRequests, MapFactory, $state, $dropdown){
  $scope.logout = Auth.logout;

  $scope.loadBucketlist = function () {
    UserRequests.getBucketList(window.sessionStorage.userFbID)
      .then(function (BucketData) {
        // Because the navbar controller does not inherit the map or feed scope,
        // current map has to be retrieved from MapFactory.  This is used to set the inbounds 
        // immediately when 'my bucketlist' is clicked
        MapFactory.markerQuadTree = MapFactory.handleUserCheckinData(BucketData.data);
        var bounds = MapFactory.currentMap.getBounds()
        MapFactory.filterFeedByBounds(bounds)
        $state.go('map.feed');
      });
  };
  
  if (UserRequests.allData) {
    $scope.photo = UserRequests.allData.fbProfilePicture;
    $scope.name = UserRequests.allData.name;
  }

  // var myDropdown = $dropdown(element, {title: 'blah', content: 'bsadsda'});

  $scope.dropdown = [
    {"text": "<p class= 'fa fa-download'>Friends</p>", "ui-sref": "map.friends"},
    {"text": '<p class="fa fa-globe"></p>&nbsp;Display an alert', click: '$alert("Holy guacamole!")'},
    {"text": '<p class="fa fa-external-link"></p>&nbsp;External link', href: '/auth/facebook', target: '_self'},
    {divider: true},
    {"text": 'Separated link', href: '#separatedLink'}
  ];
}

//Inject all the dependent services needed by the controller
NavbarController.$inject = ['Auth', '$rootScope', '$scope', 'UserRequests', 'MapFactory', '$state'];

angular.module('waddle.navbar', [])
  .controller('NavbarController', NavbarController);

})();
