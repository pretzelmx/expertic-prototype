angular.module('services.tracker', [])

.factory('tracker', ['$http', function($http) {
  var httpRequestTracker = {};
  httpRequestTracker.hasPendingRequests = function() {
    return $http.pendingRequests.length > 0;
  };
  return httpRequestTracker;
}]);
