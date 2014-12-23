'use strict';

angular.module('app', [
	'ngRoute',
	'ivpusic.cookie',
	'ui.bootstrap',
	'ngToast',
	'home',
	'profile',
	'courses',
	'adm-users',
	'adm-business',
	'adm-courses',
	'adm-dependencies',
	'services.session',
	'services.tracker',
	'directives.toolbar',
	'templates.modules',
	'templates.commons',
	'templates.general'
])

.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('myHttpInterceptor');
}])

.config(['ngToastProvider', function(ngToast) {
	ngToast.configure({
		verticalPosition: 'bottom',
		horizontalPosition: 'left',
		dismissOnTimeout: true,
        timeout: 6000,
        dismissButton: true,
        dismissButtonHtml: '&times;',
        dismissOnClick: true,
        compileContent: true,
		maxNumber: 0
	});
}])

.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false
	});
	$routeProvider.otherwise({redirectTo: '/'});
}])

.run(['session', '$rootScope', function($session, $rootScope) {
	$rootScope.$on('$routeChangeStart', function(event, next, current) {});
	$session.requestCurrentUser();
}])

.controller('AppCtrl', ['$scope', '$location', 'tracker', function($scope, $location, $tracker) {
	$scope.year = new Date();
	$scope.$on('$locationChangeStart', function(event, next, current) {});
	$scope.hasPendingRequests = function () {
		return $tracker.hasPendingRequests();
	};
}]);
