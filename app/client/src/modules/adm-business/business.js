angular.module('adm-business', ['services.session', 'services.resources'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/admin/empresas', {
        templateUrl: 'adm-business/business.html',
        controller: 'BusinessCtrl',
        resolve: {
            business: ['session', 'resources', function($session, $resources) {
                var permission = $session.requestPermission('root');
                if (permission !== true)
                    return permission;
                return $resources.getBusiness().
                then(function(response) {
                    return response.data;
                });
            }],
            isBusiness: function() {
                return false;
            }
        }
    })
    .when('/admin/empresa/:id/:option', {
        templateUrl: 'adm-business/business.html',
        controller: 'BusinessCtrl',
        resolve: {
            business: ['session', 'resources', function($session, $resources) {
                var permission = $session.requestPermission('root');
                if (permission !== true)
                    return permission;
                return $resources.getBusiness().
                then(function(response) {
                    return response.data;
                });
            }],
            isBusiness: function() {
                return true;
            }
        }
    })
}])

.controller('BusinessCtrl', ['$scope', 'business', '$location', '$modal', 'isBusiness', '$route', 'ngToast', function($scope, $business, $location, $modal, $isBusiness, $route, $ngToast) {
    $scope.business = $business;

    $scope.view = function(id) {
        $location.path('/admin/empresa/' + id + '/ver');
    };

    $scope.edit = function(id) {
        $location.path('/admin/empresa/' + id + '/editar');
    };

    $scope.addBusiness = function() {
        var modalInstance = $modal.open({
            templateUrl: 'adm-business/biz.html',
            controller: 'BusinessModalCtrl',
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
                        title: "Agregar Empresa",
                        message: "",
                    }
                },
                business: function() {
                    return {
                        email: "",
                        name: "",
                        categories: [],
                        responsible: "",
                        rfc: "",
                        description: ""
                    }
                }
            }
        });
    };

    $scope.remove = function(business) {
        var modalInstance = $modal.open({
          templateUrl: 'profile/edit-dialog.html',
          controller: 'DeleteBusinessModalCtrl',
          resolve: {
            data: function() {
                return {
                    icon: "fa-trash",
                    title: "Eliminar Empresa",
                    message: "¿Desea eliminar a la empresa: " + business.name + "?"
                }
            },
            business: function() {
                return business;
            }
          }
        });
        modalInstance.result.then(function(response) {
            $route.reload();
            var message = "";
            var success = "";
            if (response.success) {
                message = "Se ha eliminado correctamente la empresa: " + user.name;
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

    if ($isBusiness) {
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
            data.title = "Editar Empresa";
            editMode = true;
            config.size = 'lg';
            config.backdrop = 'static';
            config.keyboard = false;
            template = 'adm-business/biz.html';
        }
        else if (option === "ver") {
            data.icon = "fa-eye";
            data.title = "Empresa";
            template = 'adm-business/biz-show.html';
        }
        var modalInstance = $modal.open({
            templateUrl: template,
            controller: 'BusinessModalCtrl',
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
                business: ['resources', '$route', function($resources, $route) {
                    return $resources.getBusinessById($route.current.params.id).
                    then(function(response) {
                        return response.data;
                    });
                }]
            }
        });

        $scope.$on('$routeChangeStart', function() {
            modalInstance.dismiss();
            $location.path('/admin/empresas');
        });
    }
}])

.controller('DeleteBusinessModalCtrl', ['$scope', '$modalInstance', 'data', 'business', 'resources', function($scope, $modalInstance, $data, $business, $resources) {
    $scope.data = $data;

    $scope.ok = function () {
        $resources.deleteBusiness($business._id)
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

.controller('BusinessModalCtrl', ['$scope', 'business', '$modal', 'editMode', 'data', 'ngToast', 'resources', '$location', '$modalInstance', '$route', 'session', function($scope, $business, $modal, $editMode, $data, $ngToast, $resources, $location, $modalInstance, $route, $session) {
    $scope.data = $data;
    $scope.business = $business;
    $scope.editMode = ($route.current.params.option != undefined && $route.current.params.option == "editar") ? true : false;

    $scope.categories = [
        {description: "desarrollo", status: false},
        {description: "infraestructura", status: false},
        {description: "telecomunicaciones", status: false},
        {description: "soporte", status: false},
        {description: "seguridad", status: false}
    ];

    $business.categories.forEach(function(category) {
        if (category == "desarrollo")
            $scope.categories[0].status = true;
        if (category == "infraestructura")
            $scope.categories[1].status = true;
        if (category == "telecomunicaciones")
            $scope.categories[2].status = true;
        if (category == "soporte")
            $scope.categories[3].status = true;
        if (category == "seguridad")
            $scope.categories[4].status = true;
    });

    $scope.selectImage = function(image) {
        $scope.categories[image].status = !$scope.categories[image].status;
        $scope.business.categories = [];
        $scope.categories.forEach(function(category) {
            if (category.status)
                $scope.business.categories.push(category.description);
        });
    };

    $scope.saveBusiness = function() {
        if ($scope.business._id != undefined) {
            var id = $scope.business._id;
            delete $scope.business._id;
            delete $scope.business.__v;
            delete $scope.business.created_at;
            delete $scope.business.updated_at;
            $resources.updateBusiness(id, $scope.business)
            .success(function(response, code) {
                if (code == 200) {
                    $ngToast.create({
                        content: "Se ha actualizado correctamente el usuario",
                        class: "success"
                    });
                    $modalInstance.close();
                    $location.path('/admin/empresas');
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
            $resources.createBusiness($scope.business)
            .success(function(response, code) {
                if (code == 201) {
                    $ngToast.create({
                        content: "Se ha creado correctamente la empresa",
                        class: "success"
                    });
                    $modalInstance.close();
                    $location.path('/admin/empresas');
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

    $scope.cancelBusiness = function() {
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
            $location.path('/admin/empresas');
        });
    };

    $scope.close = function() {
        $modalInstance.dismiss();
        $location.path('/admin/empresas');
    };

    $scope.updatePassword = function() {
        var modalInstance = $modal.open({
          templateUrl: 'profile/edit-dialog.html',
          controller: 'EditModalCtrl',
          resolve: {
            data: function() {
                return {
                    icon: "fa-pencil",
                    title: "Cambiar Contraseña",
                    message: "Ingrese una nueva contraseña para la empresa: " + $scope.business.name,
                }
            },
            keys: function() {
                return [
                    {key: "Contraseña", type: "password"}
                ];
            },
            values: function() {
                return [
                    ""
                ];
            }
          }
        });

        modalInstance.result.then(function(response) {
            $resources.updatePasswordBusiness($scope.business._id, response[0])
            .success(function(response, code) {
                if (code == 200) {
                    $ngToast.create({
                        content: "Se ha actualizado correctamente la contraseña",
                        class: "success"
                    });
                }
            });
        });
    };
}]);
