angular.module('courses', ['services.session', 'services.resources'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/cursos/:category', {
        templateUrl: 'courses/courses.html',
        controller: 'CoursesCtrl',
        resolve: {
            courses: ['resources', 'session', '$route', function($resources, $session, $route) {
                var permission = $session.requestPermission('root');
                if (permission !== true)
                    return permission;
                return $resources.getCoursesByCategory($route.current.params.category).
                then(function(response) {
                    return response.data;
                });
            }],
            isCourse: function() {
                return false;
            }
        }
    })
    .when('/curso/:id/:category', {
        templateUrl: 'courses/courses.html',
        controller: 'CoursesCtrl',
        resolve: {
            courses: ['resources', 'session', '$route', function($resources, $session, $route) {
                var permission = $session.requestPermission('root');
                if (permission !== true)
                    return permission;
                return $resources.getCoursesByCategory($route.current.params.category).
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

.controller('CoursesCtrl', ['$scope', 'resources', '$location', 'session', '$route', '$modal', 'isCourse', 'courses', function($scope, $resources, $location, $session, $route, $modal, $isCourse, $courses) {
    $scope.section = $route.current.params.category;
    $scope.courses = $courses;

    if ($isCourse) {
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
            $location.path('/cursos/' + $route.current.params.category);
        }, function(data) {
            $location.path('/cursos/' + $route.current.params.category);
        });
    }

    $scope.open = function (id) {
        $location.path('/curso/' + id + '/' + $route.current.params.category);
    };
}])

.controller('CourseModalCtrl', ['$scope', '$modalInstance', '$location', 'course', 'ngToast', 'resources', function($scope, $modalInstance, $location, $course, $ngToast, $resources) {
    var image = 'icon_other.png';
    var title = 'Curso';
    if ($course.category == 'desarrollo') {
        title = 'Curso de desarrollo';
        image = 'icon_development.png';
    }
    else if ($course.category == 'infraestructura') {
        title = 'Curso de infraestructura';
        image = 'icon_infrastructure.png';
    }
    else if ($course.category == 'telecomunicaciones') {
        title = 'Curso de telecomunicación';
        image = 'icon_telecomunication.png';
    }
    else if ($course.category == 'soporte') {
        title = 'Curso de soporte';
        image = 'icon_support.png';
    }
    else if ($course.category == 'seguridad') {
        title = 'Curso de seguridad';
        image = 'icon_security.png';
    }

    $scope.title = title;
    $scope.image = image;
    $scope.course = $course;

    $scope.ok = function () {
        $resources.takeCourse($course._id)
        .success(function(response, code) {
            if (code == 200) {
                $ngToast.create({
                    content: "Has tomado un nuevo curso: " + $scope.course.name,
                    class: "success"
                });
            }
        })
        .error(function(response) {
            $ngToast.create({
                content: response.message,
                class: "danger"
            });
        });
        $modalInstance.close();
    };

    $scope.close = function () {
        $modalInstance.dismiss();
    };

    $scope.$on('$routeChangeStart', function() {
        $modalInstance.dismiss();
    });
}]);
