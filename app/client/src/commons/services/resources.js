angular.module('services.resources', ['services.session'])

.factory('resources', ['$http', 'session', function($http, $session) {
	//var BASE = "http://104.236.72.69:3000"
	var BASE = "http://localhost:3000";
	var APIKEY = "bd90b560496a464c303794163b9cd60b1d301adf17179dd122f994cedeccbe484a0e049acf643c09f3f2f4fcedb04f9c8d3549f95374875e36f531b3874b04b5";
	$http.defaults.headers.common.apikey = APIKEY;

	return {
		// general
		
		login: function(data) {
			return $http({method: 'POST', url: BASE + '/login', data: data});
		},
		logout: function() {
			return $http({method: 'POST', url: BASE + '/logout', headers: {authorization: $session.currentSession._id}});
		},
		search: function(data) {
			return $http({method: 'GET', url: BASE + '/search', params: data, headers: {authorization: $session.currentSession._id}});
		},

		// courses

		createCourse: function(data) {
			return $http({method: 'POST', url: BASE + '/courses', data: data, headers: {authorization: $session.currentSession._id}});
		},
		getCourses: function() {
			return $http({method: 'GET', url: BASE + '/courses/me', headers: {authorization: $session.currentSession._id}});
		},
		getCoursesAdmin: function() {
			return $http({method: 'GET', url: BASE + '/courses', headers: {authorization: $session.currentSession._id}});
		},
		getCourseById: function(id) {
			return $http({method: 'GET', url: BASE + '/courses/' + id, headers: {authorization: $session.currentSession._id}});
		},
		getCoursesByCategory: function(category) {
			return $http({method: 'GET', url: BASE + '/courses/category/' + category, headers: {authorization: $session.currentSession._id}});
		},
		updateCourse: function(id, data) {
			return $http({method: 'PUT', url: BASE + '/courses/' + id, data: data, headers: {authorization: $session.currentSession._id}});
		},
		takeCourse: function(id) {
			return $http({method: 'PUT', url: BASE + '/courses/' + id + '/take', headers: {authorization: $session.currentSession._id}});
		},
		deleteCourse: function(id) {
			return $http({method: 'DELETE', url: BASE + '/courses/' + id, headers: {authorization: $session.currentSession._id}});	
		},

		// users

		createUser: function(data) {
			return $http({method: 'POST', url: BASE + '/users', data: data, headers: {authorization: $session.currentSession._id}});
		},
		getUsers: function() {
			return $http({method: 'GET', url: BASE + '/users', headers: {authorization: $session.currentSession._id}});
		},
		getMyUser: function() {
			return $http({method: 'GET', url: BASE + '/users/me', headers: {authorization: $session.currentSession._id}});
		},
		getUserById: function(id) {
			return $http({method: 'GET', url: BASE + '/users/' + id, headers: {authorization: $session.currentSession._id}});
		},
		updateMyUser: function(data) {
			return $http({method: 'PUT', url: BASE + '/users/me', data: data, headers: {authorization: $session.currentSession._id}});
		},
		updateUser: function(id, data) {
			return $http({method: 'PUT', url: BASE + '/users/' + id, data: data, headers: {authorization: $session.currentSession._id}});
		},
		updatePassword: function(id, password) {
			return $http({method: 'PUT', url: BASE + '/users/' + id + '/password', data: {password: password}, headers: {authorization: $session.currentSession._id}});
		},
		deleteUser: function(id) {
			return $http({method: 'DELETE', url: BASE + '/users/' + id, headers: {authorization: $session.currentSession._id}});	
		},

		// business

		createBusiness: function(data) {
			return $http({method: 'POST', url: BASE + '/business', data: data, headers: {authorization: $session.currentSession._id}});
		},
		getBusiness: function() {
			return $http({method: 'GET', url: BASE + '/business', headers: {authorization: $session.currentSession._id}});
		},
		getBusinessById: function(id) {
			return $http({method: 'GET', url: BASE + '/business/' + id, headers: {authorization: $session.currentSession._id}});
		},
		updateBusiness: function(id, data) {
			return $http({method: 'PUT', url: BASE + '/business/' + id, data: data, headers: {authorization: $session.currentSession._id}});
		},
		updatePasswordBusiness: function(id, password) {
			return $http({method: 'PUT', url: BASE + '/business/' + id + '/password', data: {password: password}, headers: {authorization: $session.currentSession._id}});
		},
		deleteBusiness: function(id) {
			return $http({method: 'DELETE', url: BASE + '/business/' + id, headers: {authorization: $session.currentSession._id}});	
		},

		// dependencies

		createDependency: function(data) {
			return $http({method: 'POST', url: BASE + '/dependencies', data: data, headers: {authorization: $session.currentSession._id}});
		},
		getDependencies: function() {
			return $http({method: 'GET', url: BASE + '/dependencies', headers: {authorization: $session.currentSession._id}});
		},
		getDependencyById: function(id) {
			return $http({method: 'GET', url: BASE + '/dependencies/' + id, headers: {authorization: $session.currentSession._id}});
		},
		updateDependency: function(id, data) {
			return $http({method: 'PUT', url: BASE + '/dependencies/' + id, data: data, headers: {authorization: $session.currentSession._id}});
		},
		deleteDependency: function(id) {
			return $http({method: 'DELETE', url: BASE + '/dependencies/' + id, headers: {authorization: $session.currentSession._id}});	
		},
	};
}])

.factory('myHttpInterceptor', ['$q', 'session', '$location', '$injector', 'ngToast', function($q, $session, $location, $injector, $ngToast) {
    return {
        responseError: function(response) {
            if (response.status == 401) {
            	$session.logout();
      			$location.path('/');
      			var $route = $injector.get('$route');
      			$route.reload();
            }
            return $q.reject(response);
        }
    };
}]);
