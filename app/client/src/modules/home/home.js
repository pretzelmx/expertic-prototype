angular.module('home', ['services.session', 'services.resources'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'home/home.html',
        controller: 'HomeCtrl',
        resolve: {
            isHome: ['session', '$location', function($session, $location) {
                if ($session.isAuthenticated())
                    return true;
                $location.path('/');
            }],
            courses: ['resources', 'session', function($resources, $session) {
                if (!$session.isAuthenticated())
                    return false;
                return $resources.getCourses().
                then(function(response) {
                    return response.data;
                });
            }],
            isCourse: function() {
                return false;
            }
        }
    })
    .when('/curso/:id', {
        templateUrl: 'home/home.html',
        controller: 'HomeCtrl',
        resolve: {
            isHome: ['session', '$location', '$q', function($session, $location, $q) {
                if ($session.isAuthenticated())
                    return true;
                $location.path('/');
                return $q.reject();
            }],
            courses: ['resources', 'session', function($resources, $session) {
                 if (!$session.isAuthenticated())
                    return false;
                return $resources.getCourses().
                then(function(response) {
                    return response.data;
                });
            }],
            isCourse: function() {
                return true;
            }
        }
    })
}])

.controller('HomeCtrl', ['$scope', 'resources', '$location', 'session', 'isHome', '$route', '$modal', 'isCourse', 'courses', 'ngToast', function($scope, $resources, $location, $session, $isHome, $route, $modal, $isCourse, $courses, $ngToast) {
    $scope.isHome = function() {
        return $isHome;
    };

    if ($isHome) {
        $scope.sections = $courses;
        var total = 0;
        $courses.forEach(function(course) {
            total += course.total;
        });
        $scope.total = total;
    }

    if ($isHome && $isCourse) {
        var modalInstance = $modal.open({
            templateUrl: 'courses/course.html',
            controller: 'CourseModalCtrl',
            resolve: {
                course: ['resources', '$route', function($resources, $route) {
                    return $resources.getCourseById($route.current.params.id).
                    then(function(response) {
                        return response.data;
                    });
                }]
            }
        });

        modalInstance.result.then(function(data) {
            $location.path('/');
        }, function(data) {
            $location.path('/');
        });
    }

    $scope.login = function(credential) {
        $resources.login(credential)
        .success(function(response, code) {
            if (code == 200) {
                $session.login(response.session, response.user);
                $route.reload();
            }
        })
        .error(function(response) {
            $ngToast.create({
                content: response.message,
                class: "danger"
            });
        });
    };

    $scope.open = function(id) {
        $location.path('/curso/' + id);
    };
}]);
