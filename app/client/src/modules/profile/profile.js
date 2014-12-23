angular.module('profile', ['services.session', 'services.resources'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/perfil', {
        templateUrl: 'profile/profile.html',
        controller: 'ProfileCtrl',
        resolve: {
            user: ['resources', 'session', function($resources, $session) {
                var permission = $session.requestPermission('user');
                if (permission !== true)
                    return permission;
                return $resources.getMyUser().
                then(function(response) {
                    return response.data;
                });
            }]
        }
    })
    .when('/perfil/editar', {
        templateUrl: 'profile/edit.html',
        controller: 'ProfileEditCtrl',
        resolve: {
            user: ['resources', 'session', function($resources, $session) {
                var permission = $session.requestPermission('user');
                if (permission !== true)
                    return permission;
                return $resources.getMyUser().
                then(function(response) {
                    return response.data;
                });
            }]
        }
    })
    .when('/perfil/:id', {
        templateUrl: 'profile/profile.html',
        controller: 'ProfileCtrl',
        resolve: {
            user: ['resources', 'session', '$route', function($resources, $session, $route) {
                var permission = $session.requestPermission('user');
                if (permission !== true)
                    return permission;
                return $resources.getUserById($route.current.params.id).
                then(function(response) {
                    return response.data;
                });
            }]
        }
    })
}])

.controller('ProfileCtrl', ['$scope', 'user', '$route', function($scope, $user, $route) {
    $scope.user = $user;
    $scope.editMode = ($route.current.params.id === undefined) ? true : false;
}])

.controller('ProfileEditCtrl', ['$scope', 'user', '$modal', 'ngToast', 'resources', '$location', function($scope, $user, $modal, $ngToast, $resources, $location) {
    $scope.user = $user;

    $scope.interests = [
        {description: "desarrollo", status: false},
        {description: "infraestructura", status: false},
        {description: "telecomunicaciones", status: false},
        {description: "soporte", status: false},
        {description: "seguridad", status: false}
    ];

    $user.interests.forEach(function(interest) {
        if (interest == "desarrollo")
            $scope.interests[0].status = true;
        if (interest == "infraestructura")
            $scope.interests[1].status = true;
        if (interest == "telecomunicaciones")
            $scope.interests[2].status = true;
        if (interest == "soporte")
            $scope.interests[3].status = true;
        if (interest == "seguridad")
            $scope.interests[4].status = true;
    });

    $scope.selectImage = function(image) {
        $scope.interests[image].status = !$scope.interests[image].status;
        $scope.user.interests = [];
        $scope.interests.forEach(function(interest) {
            if (interest.status)
                $scope.user.interests.push(interest.description);
        });
    };

    $scope.add = function(option) {
        var title = "";
        var message = "";
        var keys = [];
        var values = [
            "", "", "", ""
        ];
        if (option == "studies") {
            title = "Agregar Educación";
            keys = [
                {key: "Título", type: "text"},
                {key: "Centro de estudios", type: "text"}
            ];
        }
        else if (option == "skills") {
            title = "Agregar Habilidad Técnica";
            keys = [
                {key: "Nombre", type: "text"}
            ];
        }
        else if (option == "trainings") {
            title = "Agregar Curso / Certificación";
            keys = [
                {key: "Título", type: "text"},
                {key: "Descripción", type: "text"}
            ];
        }
        else if (option == "career") {
            title = "Agregar Experiencia Laboral";
            keys = [
                {key: "Puesto de trabajo", type: "text"},
                {key: "Tiempo trabajando (Meses)", type: "text"},
                {key: "Sector (Privado / Público)", type: "text"},
                {key: "Descripción", type: "text"}
            ];
        }
        var modalInstance = $modal.open({
          templateUrl: 'profile/edit-dialog.html',
          controller: 'EditModalCtrl',
          resolve: {
            data: function() {
                return {
                    icon: "fa-plus",
                    title: title,
                    message: message,
                }
            },
            keys: function() {
                return keys;
            },
            values: function() {
                return values;
            }
          }
        });

        modalInstance.result.then(function(values) {
            var obj = null;
            if (option == "studies") {
                obj = {
                    title: values[0],
                    description: values[1]
                };
                $scope.user.studies.push(obj);
            }
            else if (option == "skills") {
                obj = values[0];
                $scope.user.skills.push(obj);
            }
            else if (option == "trainings") {
                obj = {
                    title: values[0],
                    description: values[1]
                };
                $scope.user.trainings.push(obj);
            }
            else if (option == "career") {
                obj = {
                    title: values[0],
                    time_working: values[1],
                    sector: values[2],
                    description: values[3]
                };
                $scope.user.career.push(obj);
            }
            $ngToast.create({
                content: "Se ha agregado correctamente: " + values[0],
                class: "success"
            });
        });
    };

    $scope.edit = function(option, index) {
        var title = "";
        var message = "";
        var keys = [];
        var values = [];
        if (option == "studies") {
            title = "Editar Educación";
            keys = [
                {key: "Título", type: "text"},
                {key: "Centro de estudios", type: "text"}
            ];
            values = [
                $scope.user.studies[index].title,
                $scope.user.studies[index].description
            ];
        }
        else if (option == "skills") {
            title = "Editar Habilidad Técnica";
            keys = [
                {key: "Nombre", type: "text"}
            ];
            values = [
                $scope.user.skills[index]
            ];
        }
        else if (option == "trainings") {
            title = "Editar Curso / Certificación"
            keys = [
                {key: "Título", type: "text"},
                {key: "Descripción", type: "text"}
            ];
            values = [
                $scope.user.trainings[index].title,
                $scope.user.trainings[index].description
            ];
        }
        else if (option == "career") {
            title = "Editar Experiencia Laboral";
            keys = [
                {key: "Puesto de trabajo", type: "text"},
                {key: "Tiempo trabajando (Meses)", type: "text"},
                {key: "Sector (Privado / Público)", type: "text"},
                {key: "Descripción", type: "text"}
            ];
            values = [
                $scope.user.career[index].title,
                $scope.user.career[index].time_working,
                $scope.user.career[index].sector,
                $scope.user.career[index].description
            ];
        }
        var modalInstance = $modal.open({
          templateUrl: 'profile/edit-dialog.html',
          controller: 'EditModalCtrl',
          resolve: {
            data: function() {
                return {
                    icon: "fa-pencil",
                    title: title,
                    message: message,
                }
            },
            keys: function() {
                return keys;
            },
            values: function() {
                return values;
            }
          }
        });

        modalInstance.result.then(function(values) {
            if (option == "studies") {
                $scope.user.studies[index].title = values[0];
                $scope.user.studies[index].description = values[1];
            }
            else if (option == "skills") {
                $scope.user.skills[index] = values[0];
            }
            else if (option == "trainings") {
                $scope.user.trainings[index].title = values[0];
                $scope.user.trainings[index].description = values[1];
            }
            else if (option == "career") {
                $scope.user.career[index].title = values[0];
                $scope.user.career[index].time_working = values[1];
                $scope.user.career[index].sector = values[2];
                $scope.user.career[index].description = values[3];
            }
            $ngToast.create({
                content: "Se ha editado correctamente",
                class: "success"
            });
        });
    };

    $scope.remove = function(option, index) {
        var title = "";
        var message = "";
        if (option == "studies") {
            title = "Eliminar Educación";
            message = "¿Desea eliminar la educación profesional: " + $scope.user.studies[index].title + "?";
        }
        else if (option == "skills") {
            title = "Eliminar Habilidad Técnica";
            message = "¿Desea eliminar la habilidad técnica: " + $scope.user.skills[index] + "?";
        }
        else if (option == "trainings") {
            title = "Eliminar Curso / Certificación";
            message = "¿Desea eliminar el curso / certificación: " + $scope.user.trainings[index].title + "?";
        }
        else if (option == "career") {
            title = "Eliminar Experiencia Laboral";
            message = "¿Desea eliminar la experiencia laboral: " + $scope.user.career[index].title + "?";
        }
        var modalInstance = $modal.open({
          templateUrl: 'profile/edit-dialog.html',
          controller: 'EditModalCtrl',
          resolve: {
            data: function() {
                return {
                    icon: "fa-trash",
                    title: title,
                    message: message
                }
            },
            keys: null,
            values: null
          }
        });

        modalInstance.result.then(function(values) {
            var object = "";
            if (option == "studies") {
                object = $scope.user.studies[index].title;
                $scope.user.studies.splice(index, 1);
            }
            else if (option == "skills") {
                object = $scope.user.skills[index];
                $scope.user.skills.splice(index, 1);
            }
            else if (option == "trainings") {
                object = $scope.user.trainings[index].title;
                $scope.user.trainings.splice(index, 1);
            }
            else if (option == "career") {
                object = $scope.user.career[index].title;
                $scope.user.career.splice(index, 1);
            }
            $ngToast.create({
                content: "Se ha eliminado correctamente: " + object,
                class: "success"
            });
        });
    };

    $scope.save = function() {
        delete $scope.user.__v;
        delete $scope.user.courses;
        delete $scope.user.created_at;
        delete $scope.user.updated_at;
        $scope.user.dependency = $scope.user.dependency._id;

        $resources.updateMyUser($scope.user)
        .success(function(response, code) {
            if (code == 200) {
                $ngToast.create({
                    content: "Se ha editado correctamente el perfil",
                    class: "success"
                });
                $location.path('/perfil');
            }
        })
        .error(function(response, code) {
            $ngToast.create({
                content: response.message,
                class: "danger"
            });
        });
    };

    $scope.cancel = function() {
        var modalInstance = $modal.open({
          templateUrl: 'profile/edit-dialog.html',
          controller: 'EditModalCtrl',
          resolve: {
            data: function() {
                return {
                    icon: "fa-user",
                    title: "Editar Perfil",
                    message: "¿Desea cancelar la operación: Editar Perfil?",
                }
            },
            keys: null,
            values: null
          }
        });

        modalInstance.result.then(function(values) {
            $location.path('/perfil');
        });
    };
}])

.controller('EditModalCtrl', ['$scope', '$modalInstance', 'data', 'keys', 'values', function($scope, $modalInstance, $data, $keys, $values) {
    $scope.data = $data;
    $scope.keys = $keys;
    $scope.values = $values;
    
    $scope.ok = function () {
        $modalInstance.close($scope.values);
    };

    $scope.close = function () {
        $modalInstance.dismiss();
    };
}]);
