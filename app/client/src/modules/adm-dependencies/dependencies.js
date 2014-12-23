angular.module('adm-dependencies', ['services.session', 'services.resources'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/admin/dependencias', {
        templateUrl: 'adm-dependencies/dependencies.html',
        controller: 'AdminDependenciesCtrl',
        resolve: {
            dependencies: ['session', 'resources', function($session, $resources) {
                var permission = $session.requestPermission('root');
                if (permission !== true)
                    return permission;
                return $resources.getDependencies().
                then(function(response) {
                    return response.data;
                });
            }],
            isDependency: function() {
                return false;
            }
        }
    })
    .when('/admin/dependencia/:id/:option', {
        templateUrl: 'adm-dependencies/dependencies.html',
        controller: 'AdminDependenciesCtrl',
        resolve: {
            dependencies: ['session', 'resources', function($session, $resources) {
                var permission = $session.requestPermission('root');
                if (permission !== true)
                    return permission;
                return $resources.getDependencies().
                then(function(response) {
                    return response.data;
                });
            }],
            isDependency: function() {
                return true;
            }
        }
    })
}])

.controller('AdminDependenciesCtrl', ['$scope', 'dependencies', '$location', '$modal', 'isDependency', '$route', 'ngToast', 'resources', function($scope, $dependencies, $location, $modal, $isDependency, $route, $ngToast, $resources) {
    $scope.dependencies = $dependencies;

    $scope.view = function(id) {
        $location.path('/admin/dependencia/' + id + '/ver');
    };

    $scope.edit = function(id) {
        $location.path('/admin/dependencia/' + id + '/editar');
    };

    $scope.addDependency = function() {
        var modalInstance = $modal.open({
            templateUrl: 'adm-dependencies/dependency.html',
            controller: 'AdminDependencyModalCtrl',
            keyboard: false,
            size: 'md',
            backdrop: 'static',
            resolve: {
                editMode: function() {
                    return true;
                },
                data: function() {
                    return {
                        icon: "fa-plus",
                        title: "Agregar Dependencia",
                        message: "",
                    }
                },
                users: function() {
                    return $resources.getUsers().
                    then(function(response) {
                        return response.data;
                    });
                },
                dependency: function() {
                    return {
                        name: "",
                        description: "",
                        responsible: ""
                    }
                }
            }
        });
    };

    $scope.remove = function(dependency) {
        var modalInstance = $modal.open({
          templateUrl: 'profile/edit-dialog.html',
          controller: 'DeleteDependencyModalCtrl',
          resolve: {
            data: function() {
                return {
                    icon: "fa-trash",
                    title: "Eliminar Dependencia",
                    message: "¿Desea eliminar la dependencia: " + dependency.name + "?"
                }
            },
            dependency: function() {
                return dependency;
            }
          }
        });
        modalInstance.result.then(function(response) {
            $route.reload();
            var message = "";
            var success = "";
            if (response.success) {
                message = "Se ha eliminado correctamente la dependencia: " + dependency.name;
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

    if ($isDependency) {
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
            data.title = "Editar Dependencia";
            editMode = true;
            config.size = 'md';
            config.backdrop = 'static';
            config.keyboard = false;
            template = 'adm-dependencies/dependency.html';
        }
        else if (option === "ver") {
            data.icon = "fa-eye";
            data.title = "Dependencia";
            template = 'adm-dependencies/dependency-show.html';
        }
        var modalInstance = $modal.open({
            templateUrl: template,
            controller: 'AdminDependencyModalCtrl',
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
                users: function() {
                    return $resources.getUsers().
                    then(function(response) {
                        return response.data;
                    });
                },
                dependency: ['resources', '$route', function($resources, $route) {
                    return $resources.getDependencyById($route.current.params.id).
                    then(function(response) {
                        return response.data;
                    });
                }]
            }
        });

        $scope.$on('$routeChangeStart', function() {
            modalInstance.dismiss();
            $location.path('/admin/dependencias');
        });
    }
}])

.controller('DeleteDependencyModalCtrl', ['$scope', '$modalInstance', 'data', 'dependency', 'resources', function($scope, $modalInstance, $data, $dependency, $resources) {
    $scope.data = $data;

    $scope.ok = function () {
        $resources.deleteDependency($dependency._id)
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

.controller('AdminDependencyModalCtrl', ['$scope', 'dependency', 'users', '$modal', 'editMode', 'data', 'ngToast', 'resources', '$location', '$modalInstance', '$route', 'session', function($scope, $dependency, $users, $modal, $editMode, $data, $ngToast, $resources, $location, $modalInstance, $route, $session) {
    $scope.data = $data;
    $scope.users = $users;
    $scope.dependency = $dependency;

    $scope.editMode = ($route.current.params.option != undefined && $route.current.params.option == "editar") ? true : false;

    if ($scope.dependency._id == undefined) {
        $scope.dependency.admin = $scope.users[0]._id;
    }
    else {
        if ($scope.editMode) {
            try {
                $scope.dependency.admin = $scope.dependency.admin._id;
            } catch (err) {
                $scope.dependency.admin = $scope.users[0]._id;
            }   
        }
    }

    $scope.saveDependency = function() {
        if ($scope.dependency._id != undefined) {
            var id = $scope.dependency._id;
            delete $scope.dependency._id;
            delete $scope.dependency.__v;
            delete $scope.dependency.created_at;
            delete $scope.dependency.updated_at;
            $resources.updateDependency(id, $scope.dependency)
            .success(function(response, code) {
                if (code == 200) {
                    $ngToast.create({
                        content: "Se ha actualizado correctamente la dependencia",
                        class: "success"
                    });
                    $modalInstance.close();
                    $location.path('/admin/dependencias');
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
            $resources.createDependency($scope.dependency)
            .success(function(response, code) {
                if (code == 201) {
                    $ngToast.create({
                        content: "Se ha creado correctamente la dependencia",
                        class: "success"
                    });
                    $modalInstance.close();
                    $location.path('/admin/dependencias');
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

    $scope.cancelDependency = function() {
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
            $location.path('/admin/dependencias');
        });
    };

    $scope.close = function() {
        $modalInstance.dismiss();
        $location.path('/admin/dependencias');
    };
}]);
