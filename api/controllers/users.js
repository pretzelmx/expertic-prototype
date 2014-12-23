'use strict';

var Session 	= require('../models/session'),
	User 	 	= require('../models/user'),
	Business	= require('../models/business'),
	Course 		= require('../models/course'),
	utilities	= require('../utilities');

// POST

exports.createUser = function(req, res) {
	req.assert('email', 'Debe proporcionar un correo electrónico válido').isEmail();
	req.assert('password', 'La contraseña debe tener entre 6 y 20 caracteres').len(6, 20);
	req.assert('firstname', 'El nombre es requerido').notEmpty();
	req.assert('lastname', 'El apellido es requerido').notEmpty();
	req.assert('dependency', 'El nombre de la dependencia es requerido').notEmpty();
	req.assert('area', 'El área de la dependencia es requerido').notEmpty();
	req.assert('job', 'El puesto de trabajo es requerido').notEmpty();
  	var errors = req.validationErrors();

  	if (errors)
    	return res.status(400).send({message: "La información proporcionada no es válida", errors: errors});

	User.create(req.body)
	.then(function(response) {
		var user = response.toJSON();
		res.status(201).send({message: "Se creó correctamente el usuario", user: user});
	})
	.then(undefined, function(err) {
		var message = "Ocurrió un problema al crear el usuario";
		if (err.code === 11000)
			message = "El correo electrónico ya está en uso";
		res.status(500).send({message: message, error: err});
	});
};

exports.login = function(req, res) {
	req.assert('email', 'Debe proporcionar un correo electrónico válido').isEmail();
	req.assert('password', 'La contraseña debe tener entre 6 y 20 caracteres').len(6, 20);
	var errors = req.validationErrors();

  	if (errors)
    	return res.status(401).send({message: "La información proporcionada no es válida", errors: errors});

    var user = {};
	User.findOne({$and: [{email: req.body.email}, {roles: {$ne: ['guest']}}]}).exec()
	.then(function(response) {
		if (!response)
			res.status(404).send({message: "No existe el usuario"});
		else if (!response.authenticate(req.body.password))
			res.status(401).send({message: "La contraseña no coincide"});
		else {
			user = response.toJSON();
			return Session.remove({user: user._id}).exec()
		}
	})
	.then(function(response) {
		return Session.create({user: user._id});
	})
	.then(function(response) {
		res.status(200).send({message: "Ingreso correctamente", session: response, user: user})
	})
	.then(undefined, function(err) {
    	res.status(500).send({message: "Ocurrió un problema al ingresar", error: err});
  	});
};

exports.logout = function(req, res) {
	Session.remove({_id: req.headers.authorization}).exec()
	.then(function(response) {
		res.status(200).send({message: "Se cerro sesión correctamente"});
	})
	.then(undefined, function(err) {
		res.status(500).send({message: "Ocurrió un problema al cerrar sesión"})
	});
};

// GET

exports.search = function(req, res) {
	var search = req.query.data;
	var users = [];
	var courses = [];
	var business = [];

	User.find({$or: [{firstname: utilities.makePattern(search)}, {lastname: utilities.makePattern(search)}]}, '_id firstname lastname').limit(3).exec()
	.then(function(response) {
		response.forEach(function(user, i) {
			response[i] = {_id: user._id, name: user.firstname + ' ' + user.lastname, type: 'Persona'};
		});
		users = response;
		return Course.find({name: utilities.makePattern(search)}, '_id name category').limit(3).exec();
	})
	.then(function(response) {
		response.forEach(function(course, i) {
			response[i] = {_id: course._id, name: course.name, type: 'Curso'};
		});
		courses = response;
		return Business.find({name: utilities.makePattern(search)}, '_id name').limit(3).exec();
	})
	.then(function(response) {
		response.forEach(function(business, i) {
			response[i] = {_id: business._id, name: business.name, type: 'Empresa'};
		});
		business = response;
		var results = [];
		results.push.apply(results, users);
		results.push.apply(results, courses);
		results.push.apply(results, business);

		if (results.length == 0)
			res.status(404).send(results);
		else
			res.status(200).send(results);
	})
	.then(undefined, function(err) {
    	res.status(500).send({message: "Ocurrió un problema al realizar la búsqueda", error: err});
  	});
};

exports.getUsers = function(req, res) {
	User.find({roles: {$ne: ['guest']}}, 'email firstname lastname dependency social_network roles updated_at').populate('dependency', 'name').exec()
	.then(function(response) {
		res.status(200).send(response);
	});
};

exports.getUserById = function(req, res) {
	User.findById(req.params.id).populate('courses').populate('dependency', 'name').exec()
	.then(function(response) {
		res.status(200).send(response);
	});
};

exports.getMyUserData = function(req, res) {
	Session.findOne({_id: req.headers.authorization}).exec()
	.then(function(response) {
		return User.findOne({_id: response.user}).select('-salt -hashed_password').populate('courses', 'name description category').populate('dependency', 'name').exec();
	})
	.then(function(response) {
		res.status(200).send(response);
	})
	.then(undefined, function(err) {
		res.status(500).send({message: "Ocurrió un problema al obtener la información del usuario", error: err});
	});
};

// PUT

exports.updateMyUserData = function(req, res) {
	var id = req.body._id;
	req.body.updated_at = new Date();
	delete req.body._id;
	User.findByIdAndUpdate(id, req.body, function(err, response) {
		if (err)
			res.status(500).send({message: "Ocurrió un error al actualizar la información", error: err});
		else
			res.status(200).send({message: "Se actualizó correctamente la información", user: response});
	});
};

exports.updateUser = function(req, res) {
	var id = req.params.id;
	req.body.updated_at = new Date();
	User.findByIdAndUpdate(id, req.body, function(err, response) {
		if (err)
			res.status(500).send({message: "Ocurrió un error al actualizar la información", error: err});
		else
			res.status(200).send({message: "Se actualizó correctamente la información", user: response});
	});
};

exports.updatePassword = function(req, res) {
	var id = req.params.id;
	User.findById(id, function(err, response) {
		if (err)
			res.status(500).send({message: "Ocurrió un error al actualizar la contraseña", error: err});
		else {
			response.password = req.body.password;
			response.save(function(err, response) {
				if (err)
					res.status(500).send({message: "Ocurrió un error al actualizar la contraseña", error: err});
				else
					res.status(200).send({message: "Se actualizó correctamente la contraseña"});
			});
		}
	});
};

// DELETE

exports.deleteUser = function(req, res) {
	var id = req.params.id;
	Session.remove({user: id}).exec()
	.then(function(response) {
		var user = {roles: ['guest']};
		User.findByIdAndUpdate(id, user, function(err, user) {
			if (err)
				res.status(500).send({message: "Ocurrió un problema al eliminar el usuario"});
			else
				res.status(200).send({message: "Se eliminó correctamente el usuario"});
		});
	})
	.then(undefined, function(err) {
		res.status(500).send({message: "Ocurrió un problema al eliminar el usuario"});
	});
};

exports.checkSession = function(req, res, next) {
	Session.findOne({_id: req.headers.authorization}, 'user')
	.populate('user', 'roles')
	.exec(function(err, response) {
		if (err || !response)
			res.status(401).end();
		else {
			var authorized = true;
			var roles = response.user.roles;
			roles.forEach(function(role) {
				if (role === 'guest')
					authorized = false;
			});
			if (authorized)
				next();
			else
				res.status(401).end();
		}
	});
};

exports.checkPermission = function(req, res, next) {
	Session.findOne({_id: req.headers.authorization}, 'user')
	.populate('user', 'roles')
	.exec(function(err, response) {
		if (err || !response)
			res.status(401).end();
		else {
			var authorized = false;
			var roles = response.user.roles;
			roles.forEach(function(role) {
				if (role === 'admin' || role === 'root')
					authorized = true;
			});
			if (authorized)
				next();
			else
				res.status(401).end();
		}
	});
};
