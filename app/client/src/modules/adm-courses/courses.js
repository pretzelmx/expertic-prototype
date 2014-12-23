angular.module('adm-courses', ['services.session', 'services.resources'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/admin/cursos', {
        templateUrl: 'adm-courses/courses.html',
        controller: 'AdminCoursesCtrl',
        resolve: {
            courses: ['session', 'resources', function($session, $resources) {
                var permission = $session.requestPermission('root');
                if (permission !== true)
                    return permission;
                return $resources.getCoursesAdmin().
                then(function(response) {
                    return response.data;
                });
            }],
            isCourse: function() {
                return false;
            }
        }
    })
    .when('/admin/curso/:id/:option', {
        templateUrl: 'adm-courses/courses.html',
        controller: 'AdminCoursesCtrl',
        resolve: {
            courses: ['session', 'resources', function($session, $resources) {
                var permission = $session.requestPermission('root');
                if (permission !== true)
                    return permission;
                return $resources.getCoursesAdmin().
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

.controller('AdminCoursesCtrl', ['$scope', 'courses', '$location', '$modal', 'isCourse', '$route', 'ngToast', 'resources', function($scope, $courses, $location, $modal, $isCourse, $route, $ngToast, $resources) {
    $scope.courses = $courses;

    $scope.view = function(id) {
        $location.path('/admin/curso/' + id + '/ver');
    };

    $scope.edit = function(id) {
        $location.path('/admin/curso/' + id + '/editar');
    };

    $scope.addCourse = function() {
        var modalInstance = $modal.open({
            templateUrl: 'adm-courses/course.html',
            controller: 'AdminCourseModalCtrl',
            keyboard: false,
            size: 'lg',
            backdrop: 'static',
            resolve: {
                editMode: function() {
                    return true;
                },
                data: function() {
                    return {
                        icon: "fa-plus",
                        title: "Agregar Curso",
                        message: "",
                    }
                },
                business: function() {
                    return $resources.getBusiness().
                    then(function(response) {
                        return response.data;
                    });
                },
                course: function() {
                    return {
                        folio: "",
                        name: "",
                        description: "",
                        business: null,
                        category: "",
                        hours: "",
                        format: "",
                        status: ""
                    }
                }
            }
        });
    };

    $scope.remove = function(course) {
        var modalInstance = $modal.open({
          templateUrl: 'profile/edit-dialog.html',
          controller: 'DeleteCourseModalCtrl',
          resolve: {
            data: function() {
                return {
                    icon: "fa-trash",
                    title: "Eliminar Curso",
                    message: "¿Desea eliminar el curso: " + course.name + "?"
                }
            },
            course: function() {
                return course;
            }
          }
        });
        modalInstance.result.then(function(response) {
            $route.reload();
            var message = "";
            var success = "";
            if (response.success) {
                message = "Se ha eliminado correctamente el curso: " + course.folio;
                success = "success";
            }
            else {
                message = response.message;
                success = "danger";
            }
            $ngToast.create({
                content: message,
                class: success
            });
        });
    };

    if ($isCourse) {
        var option = $route.current.params.option;
        var data = {
            icon: "", title: "", message: ""
        };
        var editMode = false;
        var config = {
            size: 'md', backdrop: true, keyboard: true
        };
        var template = "";

        if (option === "editar") {
            data.icon = "fa-pencil";
            data.title = "Editar Curso";
            editMode = true;
            config.size = 'lg';
            config.backdrop = 'static';
            config.keyboard = false;
            template = 'adm-courses/course.html';
        }
        else if (option === "ver") {
            data.icon = "fa-eye";
            data.title = "Curso";
            template = 'adm-courses/course-show.html';
        }
        var modalInstance = $modal.open({
            templateUrl: template,
            controller: 'AdminCourseModalCtrl',
            keyboard: config.keyboard,
            size: config.size,
            backdrop: config.backdrop,
            resolve: {
                editMode: function() {
                    return editMode;
                },
                data: function() {
                    return data;
                },
                business: function() {
                    return $resources.getBusiness().
                    then(function(response) {
                        return response.data;
                    });
                },
                course: ['resources', '$route', function($resources, $route) {
                    return $resources.getCourseById($route.current.params.id).
                    then(function(response) {
                        return response.data;
                    });
                }]
            }
        });

        $scope.$on('$routeChangeStart', function() {
            modalInstance.dismiss();
            $location.path('/admin/cursos');
        });
    }
}])

.controller('DeleteCourseModalCtrl', ['$scope', '$modalInstance', 'data', 'course', 'resources', function($scope, $modalInstance, $data, $course, $resources) {
    $scope.data = $data;

    $scope.ok = function () {
        $resources.deleteCourse($course._id)
        .success(function(response, code) {
            var result = {success: false, message: response.message};
            if (code == 200)
                result.success = true;
            $modalInstance.close(result);
        });
    };

    $scope.close = function () {
        $modalInstance.dismiss();
    };
}])

.controller('AdminCourseModalCtrl', ['$scope', 'course', 'business', '$modal', 'editMode', 'data', 'ngToast', 'resources', '$location', '$modalInstance', '$route', 'session', function($scope, $course, $business, $modal, $editMode, $data, $ngToast, $resources, $location, $modalInstance, $route, $session) {
    $scope.data = $data;
    $scope.course = $course;
    $scope.business = $business;

    $scope.editMode = ($route.current.params.option != undefined && $route.current.params.option == "editar") ? true : false;
    $scope.categories = [
        {description: "desarrollo", status: false},
        {description: "infraestructura", status: false},
        {description: "telecomunicaciones", status: false},
        {description: "soporte", status: false},
        {description: "seguridad", status: false}
    ];
    $scope.status = [
        {label: "Nuevo", value: "nuevo"},
        {label: "Iniciado", value: "iniciado"},
        {label: "Terminado", value: "terminado"},
    ];
    $scope.formats = [
        {label: "Presencial", value: "presencial"},
        {label: "En línea", value: "online"}
    ];

    if ($scope.course._id == undefined) {
        $scope.course.business = $scope.business[0]._id;
        $scope.course.format = $scope.formats[0].value;
        $scope.course.status = $scope.status[0].value;
    }
    else {
        if ($scope.editMode) {
            try {
                $scope.course.business = $scope.course.business._id;
            } catch (err) {
                $scope.course.business = $scope.business[0]._id;
            }   
        }
        else {
            try {
                $scope.course.business = $scope.course.business.name;
            } catch (err) {
                $scope.course.business = "";
            }
        }
    }

    if ($scope.course.category == "desarrollo")
        $scope.categories[0].status = true;
    else if ($scope.course.category == "infraestructura")
        $scope.categories[1].status = true;
    else if ($scope.course.category == "telecomunicaciones")
        $scope.categories[2].status = true;
    else if ($scope.course.category == "soporte")
        $scope.categories[3].status = true;
    else if ($scope.course.category == "seguridad")
        $scope.categories[4].status = true;

    $scope.selectImage = function(index) {
        $scope.categories = [
            {description: "desarrollo", status: false},
            {description: "infraestructura", status: false},
            {description: "telecomunicaciones", status: false},
            {description: "soporte", status: false},
            {description: "seguridad", status: false}
        ];
        $scope.categories[index].status = !$scope.categories[index].status;
        $scope.course.category = $scope.categories[index].description;
    };

    $scope.saveCourse = function() {
        if ($scope.course._id != undefined) {
            var id = $scope.course._id;
            delete $scope.course._id;
            delete $scope.course.__v;
            delete $scope.course.created_at;
            delete $scope.course.updated_at;
            $resources.updateCourse(id, $scope.course)
            .success(function(response, code) {
                if (code == 200) {
                    $ngToast.create({
                        content: "Se ha actualizado correctamente el curso",
                        class: "success"
                    });
                    $modalInstance.close();
                    $location.path('/admin/cursos');
                    $route.reload();
                }
            })
            .error(function(response, code) {
                $ngToast.create({
                    content: response.message,
                    class: "danger"
                });
            });
        }
        else {
            $resources.createCourse($scope.course)
            .success(function(response, code) {
                if (code == 201) {
                    $ngToast.create({
                        content: "Se ha creado correctamente el curso",
                        class: "success"
                    });
                    $modalInstance.close();
                    $location.path('/admin/cursos');
                    $route.reload();
                }
            })
            .error(function(response, code) {
                var message = "";
                if (code == 400) {
                    response.errors.forEach(function(error) {
                        message += "-" + error.msg + "<br>";
                    });
                }
                else
                    message = response.message;

                $ngToast.create({
                    content: message,
                    class: "danger"
                });
            });
        }
    };

    $scope.cancelCourse = function() {
        var modalInstance = $modal.open({
          templateUrl: 'profile/edit-dialog.html',
          controller: 'EditModalCtrl',
          resolve: {
            data: function() {
                return {
                    icon: $scope.data.icon,
                    title: $scope.data.title,
                    message: "¿Desea cancelar la operación: " + $scope.data.title + "?",
                }
            },
            keys: null,
            values: null
          }
        });

        modalInstance.result.then(function(values) {
            $modalInstance.dismiss();
            $location.path('/admin/cursos');
        });
    };

    $scope.close = function() {
        $modalInstance.dismiss();
        $location.path('/admin/cursos');
    };
}]);
