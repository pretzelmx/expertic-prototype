angular.module('directives.toolbar', ['services.resources'])

.directive('toolbar', ['session', 'ipCookie', '$location', 'resources', '$route', '$modal', function($session, $cookie, $location, $resources, $route, $modal) {
  return {
    templateUrl: 'directives/toolbar/toolbar.html',
    restrict: 'E',
    replace: true,
    scope: true,
    link: function($scope, $element, $attrs, $controller) {
      $scope.isAuthenticated = function() {
        return $session.isAuthenticated();
      };

      $scope.isAdmin = function() {
        return $session.isAdmin();
      };

      $scope.isRoot = function() {
        return $session.isRoot();
      };

      $scope.logout = function() {
        $resources.logout()
        .success(function(response) {
          $session.logout();
          $location.path('/');
          $route.reload();
        })
        .error(function(response) {
          alert(response.message);
        });
      };

      $scope.$watch(function() {
        return $session.currentUser;
      }, function(currentUser) {
        try {
          $scope.email = currentUser.email;
        }
        catch (err) {
          $scope.email = "";
        }
      });

      $scope.dataSearch = null;
      $scope.search = function(value) {
        $scope.result = $resources.search({data: value})
        .then(function(response) {
          return response.data;
        });
        return $scope.result;
      };

      $scope.setSelected = function(item) {
        console.log(item);
      };

      $scope.notifications = 2;
      $scope.showNotifications = function() {
        var modalInstance = $modal.open({
          templateUrl: 'directives/toolbar/notifications.html',
          controller: 'NotificationsCtrl'
        });
      };
    }
  };
}])

.controller('NotificationsCtrl', ['$scope', '$modalInstance', '$location', '$route', function($scope, $modalInstance, $location, $route) {
  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.close = function () {
    $modalInstance.dismiss();
  };

  $scope.$on('$routeChangeStart', function(){
    $modalInstance.dismiss();
  });

  $modalInstance.result.then(function (selectedItem) {
    $scope.selected = selectedItem;
  }, function (data) {});
}]);
