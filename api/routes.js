'use strict';

// Controllers

var users 			= require('./controllers/users'),
	business 		= require('./controllers/business'),
	courses 		= require('./controllers/courses'),
	dependencies 	= require('./controllers/dependencies');

module.exports = function(app, config) {
	// Rutas sin ningún tipo de autorización
	// NIVEL DE SEGURIDAD: 0

	app.all('*', function(req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
    	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    	res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization, Apikey');
    	if (req.method === 'OPTIONS') {
    		res.status(200).end();
    	}
    	next();
	});
	
	app.get('/', function(req, res) {
		res.send({status: 'ON', name: config.name, enviroment: config.enviroment});
	});

	// Rutas con autorización básica
	// NIVEL DE SEGURIDAD: 1

	app.all('*', function(req, res, next) {
		if (req.headers.apikey === config.keys.movil || req.headers.apikey === config.keys.app)
			next();
		else
			res.status(401).end();
	});

	app.post('/users', users.createUser);
	app.post('/login', users.login);

	// Rutas con autorización básica y por sesión
	// NIVEL DE SEGURIDAD: 2

	app.all('*', function(req, res, next) {
		users.checkSession(req, res, next);
	});

	app.post('/logout', users.logout);
	app.get('/search', users.search);

	app.get('/courses/me', courses.getCourses);
	app.get('/courses/:id', courses.getCourseById);
	app.get('/courses/category/:category', courses.getCourseByCategory);
	app.put('/courses/:id/take', courses.takeCourse);
	
	app.get('/users/me', users.getMyUserData);
	app.put('/users/me', users.updateMyUserData);

	// Rutas con autorización básica, por sesión y por rol
	// NIVEL DE SEGURIDAD: 3

	app.all('*', function(req, res, next) {
		users.checkPermission(req, res, next);
	});

	app.get('/users', users.getUsers);
	app.get('/users/:id', users.getUserById);
	app.put('/users/:id', users.updateUser);
	app.put('/users/:id/password', users.updatePassword);
	app.delete('/users/:id', users.deleteUser);

	app.post('/business', business.createBusiness);
	app.get('/business', business.getBusiness);
	app.get('/business/:id', business.getBusinessById);
	app.put('/business/:id', business.updateBusiness);
	app.put('/business/:id/password', business.updatePasswordBusiness);
	app.delete('/business/:id', business.deleteBusiness);

	app.post('/courses', courses.createCourse);
	app.get('/courses', courses.getCoursesAdmin);
	app.put('/courses/:id', courses.updateCourse);
	app.delete('/courses/:id', courses.deleteCourse);

	app.post('/dependencies', dependencies.createDependency);
	app.get('/dependencies', dependencies.getDependencies);
	app.get('/dependencies/:id', dependencies.getDependencyById);
	app.put('/dependencies/:id', dependencies.updateDependency);
	app.delete('/dependencies/:id', dependencies.deleteDependency);
};
