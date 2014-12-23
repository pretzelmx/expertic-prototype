angular.module('adm-users', ['services.session', 'services.resources'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/admin/usuarios', {
        templateUrl: 'adm-users/users.html',
        controller: 'UsersCtrl',
        alias: 'users',
        resolve: {
            users: ['session', 'resources', function($session, $resources) {
                var permission = $session.requestPermission('root');
                if (permission !== true)
                    return permission;
                return $resources.getUsers().
                then(function(response) {
                    return response.data;
                });
            }],
            isUser: function() {
                return false;
            }
        }
    })
    .when('/admin/usuario/:id/:option', {
        templateUrl: 'adm-users/users.html',
        controller: 'UsersCtrl',
        resolve: {
            users: ['session', 'resources', function($session, $resources) {
                var permission = $session.requestPermission('root');
                if (permission !== true)
                    return permission;
                return $resources.getUsers().
                then(function(response) {
                    return response.data;
                });
            }],
            isUser: function() {
                return true;
            }
        }
    })
}])

.controller('UsersCtrl', ['$scope', 'users', '$location', '$modal', 'isUser', '$route', 'ngToast', 'resources', function($scope, $users, $location, $modal, $isUser, $route, $ngToast, $resources) {
    var users = [];
    $users.forEach(function(user) {
        user.rol = "Funcionario público";
        user.roles.forEach(function(rol) {
            if (rol == "admin")
                user.rol = "Administrador Dependencia";
        });
        user.roles.forEach(function(rol) {
            if (rol == "root")
                user.rol = "Administrador ExperTIC";
        });
        users.push(user);
    });
    $users = users;
    $scope.users = $users;

    $scope.view = function(id) {
        $location.path('/perfil/' + id);
    };

    $scope.edit = function(id) {
        $location.path('/admin/usuario/' + id + '/editar');
    };

    $scope.addUser = function() {
        var modalInstance = $modal.open({
            templateUrl: 'adm-users/user.html',
            controller: 'UserModalCtrl',
            keyboard: false,
            size: 'lg',
            backdrop: 'static',
            resolve: {
                data: function() {
                    return {
                        icon: "fa-plus",
                        title: "Agregar Usuario",
                        message: "",
                    }
                },
                dependencies: function() {
                    return $resources.getDependencies().
                    then(function(response) {
                        return response.data;
                    });
                },
                user: function() {
                    return {
                        interests: [],
                        extract: "",
                        password: "",
                        firstname: "",
                        lastname: "",
                        dependency: "",
                        area: "",
                        job: "",
                        time_working: "",
                        social_network: "",
                        studies: [],
                        skills: [],
                        trainings: [],
                        career: [],
                        roles: [
                            "authenticated"
                        ]
                    }
                }
            }
        });
    };

    $scope.remove = function(user) {
        var modalInstance = $modal.open({
          templateUrl: 'profile/edit-dialog.html',
          controller: 'DeleteUserModalCtrl',
          resolve: {
            data: function() {
                return {
                    icon: "fa-trash",
                    title: "Eliminar Usuario",
                    message: "¿Desea eliminar al usuario: " + user.firstname + " " + user.lastname + "?"
                }
            },
            user: function() {
                return user;
            }
          }
        });
        modalInstance.result.then(function(response) {
            $route.reload();
            var message = "";
            var success = "";
            if (response.success) {
                message = "Se ha eliminado correctamente el usuario: " + user.firstname + " " + user.lastname;
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

    if ($isUser) {
        var modalInstance = $modal.open({
            templateUrl: 'adm-users/user.html',
            controller: 'UserModalCtrl',
            keyboard: false,
            size: 'lg',
            backdrop: 'static',
            resolve: {
                data: function() {
                    return {
                        icon: "fa-pencil",
                        title: "Editar Usuario",
                        message: "",
                    }
                },
                dependencies: function() {
                    return $resources.getDependencies().
                    then(function(response) {
                        return response.data;
                    });
                },
                user: ['resources', '$route', function($resources, $route) {
                    return $resources.getUserById($route.current.params.id).
                    then(function(response) {
                        return response.data;
                    });
                }]
            }
        });

        $scope.$on('$routeChangeStart', function() {
            modalInstance.dismiss();
            $location.path('/admin/usuarios');
        });
    };
}])

.controller('DeleteUserModalCtrl', ['$scope', '$modalInstance', 'data', 'user', 'resources', function($scope, $modalInstance, $data, $user, $resources) {
    $scope.data = $data;

    $scope.ok = function () {
        $resources.deleteUser($user._id)
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

.controller('UserModalCtrl', ['$scope', 'user', 'dependencies', '$modal', 'data', 'ngToast', 'resources', '$location', '$modalInstance', '$route', 'session', function($scope, $user, $dependencies, $modal, $data, $ngToast, $resources, $location, $modalInstance, $route, $session) {
    $scope.data = $data;
    $scope.user = $user;
    $scope.dependencies = $dependencies;
    
    $scope.editMode = ($route.current.params.option != undefined && $route.current.params.option == "editar") ? true : false;

    if ($scope.user._id == undefined) {
        $scope.user.dependency = $scope.dependencies[0]._id;
    }
    else {
        if ($scope.editMode) {
            try {
                $scope.user.dependency = $scope.user.dependency._id;
            } catch (err) {
                $scope.user.dependency = $scope.dependencies[0]._id;
            }   
        }
    }

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

    $scope.saveUser = function() {
        if ($scope.user._id != undefined) {
            var id = $scope.user._id;
            delete $scope.user._id;
            delete $scope.user.__v;
            delete $scope.user.courses;
            delete $scope.user.created_at;
            delete $scope.user.updated_at;
            $resources.updateUser(id, $scope.user)
            .success(function(response, code) {
                if (code == 200) {
                    $ngToast.create({
                        content: "Se ha actualizado correctamente el usuario",
                        class: "success"
                    });
                    $modalInstance.close();
                    $location.path('/admin/usuarios');
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
            $resources.createUser($scope.user)
            .success(function(response, code) {
                if (code == 201) {
                    $ngToast.create({
                        content: "Se ha creado correctamente el usuario",
                        class: "success"
                    });
                    $modalInstance.close();
                    $location.path('/admin/usuarios');
                    $route.reload();
                }
            })
            .error(function(response, code) {
                var message = "";
                if (code == 400) {
                    response.errors.forEach(function(error) {
                        message += "- " + error.msg + "<br>";
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

    $scope.cancelUser = function() {
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
            $location.path('/admin/usuarios');
        });
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
                    message: "Ingrese una nueva contraseña para el usuario " + $scope.user.firstname + " " + $scope.user.lastname,
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
            $resources.updatePassword($scope.user._id, response[0])
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

    $scope.isRoot = false;
    $scope.user.roles.forEach(function(rol, i) {
        if (rol == "root") {
            $scope.isRoot = true;
        }
    });

    $scope.setRoot = function() {
        var isRoot = false;
        var index = 0;
        $scope.user.roles.forEach(function(rol, i) {
            if (rol == "root") {
                index = i;
                isRoot = true;
            }
        });
        if (isRoot) {
            $scope.isRoot = false;
            $scope.user.roles.splice(index);
        }
        else {
            $scope.user.roles.push("root");
            $scope.isRoot = true;
        }
    };
}]);
