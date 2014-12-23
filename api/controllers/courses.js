'use strict';

var Course 	= require('../models/course'),
	Session = require('../models/session'),
	User 	= require('../models/user');

// POST

exports.createCourse = function(req, res) {
	req.assert('folio', 'Debe proporcionar el folio del curso').notEmpty();
	req.assert('name', 'Debe proporcionar el nombre del curso').notEmpty();
	req.assert('business', 'Debe proporcionar la empresa').notEmpty();
	req.assert('category', 'Debe proporcionar la categoría').notEmpty();
	req.assert('hours', 'Debe proporcionar la duración del curso').isInt();
	req.assert('format', 'Debe proporcionar el formato del curso').notEmpty();
  	var errors = req.validationErrors();

  	if (errors)
    	return res.status(400).send({message: "La información proporcionada no es válida", errors: errors});

	Course.create(req.body)
	.then(function(response) {
  		res.status(201).send({message: "Curso registrado correctamente", course: response});
	})
	.then(undefined, function(err) {
		var error = "Ocurrió un problema al registrar el curso";
		if (err.code === 11000)
			error = "El curso ya se encuentra registrado";
		res.status(500).send({message: error, error: err});
	});
};

// GET

exports.getCourses = function(req, res) {
	var results = [];
	var count = 0;
	var user = [];
	var interest = false;

	Session.findOne({_id: req.headers.authorization}).exec()
	.then(function(response) {
		if (!response)
			throw new Error();
		else
			return User.findOne({_id: response.user}, 'interests').exec();
	})
	.then(function(response) {
		user = response;
		return Course.count({category: 'desarrollo'}).exec();
	})
	.then(function(response) {
		count = response;
		user.interests.forEach(function(data) {
			if (data == 'desarrollo')
				interest = true;
		});
		return Course.find({category: 'desarrollo'}, '_id name description business status category created_at').populate('business', '_id name').limit(4).sort({created_at: -1}).exec();
	})
	.then(function(response) {
		results.push({category: 'desarrollo', total: count, interest: interest, courses: response});
		interest = false;
		return Course.count({category: 'infraestructura'}).exec();
	})
	.then(function(response) {
		count = response;
		user.interests.forEach(function(data) {
			if (data == 'infraestructura')
				interest = true;
		});
		return Course.find({category: 'infraestructura'}, '_id name description business status category created_at').populate('business', '_id name').limit(4).sort({created_at: -1}).exec();
	})
	.then(function(response) {
		results.push({category: 'infraestructura', total: count, interest: interest, courses: response});
		interest = false;
		return Course.count({category: 'telecomunicaciones'}).exec();
	})
	.then(function(response) {
		count = response;
		user.interests.forEach(function(data) {
			if (data == 'telecomunicaciones')
				interest = true;
		});
		return Course.find({category: 'telecomunicaciones'}, '_id name description business status category created_at').populate('business', '_id name').limit(4).sort({created_at: -1}).exec();
	})
	.then(function(response) {
		results.push({category: 'telecomunicaciones', total: count, interest: interest, courses: response});
		interest = false;
		return Course.count({category: 'soporte'}).exec();
	})
	.then(function(response) {
		count = response;
		user.interests.forEach(function(data) {
			if (data == 'soporte')
				interest = true;
		});
		return Course.find({category: 'soporte'}, '_id name description business status category created_at').populate('business', '_id name').limit(4).sort({created_at: -1}).exec();
	})
	.then(function(response) {
		results.push({category: 'soporte', total: count, interest: interest, courses: response});
		interest = false
		return Course.count({category: 'seguridad'}).exec();
	})
	.then(function(response) {
		count = response;
		user.interests.forEach(function(data) {
			if (data == 'seguridad')
				interest = true;
		});
		return Course.find({category: 'seguridad'}, '_id name description business status category created_at').populate('business', '_id name').limit(4).sort({created_at: -1}).exec();
	})
	.then(function(response) {
		results.push({category: 'seguridad', total: count, interest: interest, courses: response});
		interest = false
		return Course.count({category: 'otros'}).exec();
	})
	.then(function(response) {
		count = response;
		return Course.find({category: 'otros'}, '_id name description business status category created_at').populate('business', '_id name').limit(4).sort({created_at: -1}).exec();
	})
	.then(function(response) {
		results.push({category: 'otros', total: count, interest: false, courses: response});
		results.sort(function(x, y) {
			x = x.interest;
			y = y.interest;
    		return (x === y) ? 0 : x ? -1 : 1;
		});

		var empty = true;
		results.forEach(function(result) {
			if (result.courses.length > 0)
			empty = false;
		});

		if (empty)
			res.status(404).send({message: "No se encontraron cursos"});
		else
			res.status(200).send(results);
	})
	.then(undefined, function(err) {
		res.status(500).send({message: "Ocurrió un error al obtener los cursos", error: err});
	});
};

exports.getCoursesAdmin = function(req, res) {
	Course.find({}, 'folio name category business format hours status updated_at').populate('business', 'name').exec()
	.then(function(response) {
		res.status(200).send(response);
	});
};

exports.getCourseById = function(req, res) {
	Course.findById(req.params.id).populate('business', 'name').exec()
	.then(function(response) {
		res.status(200).send(response);
	});
};

exports.getCourseByCategory = function(req, res) {
	Course.find({category: req.params.category}, '_id name description business status category created_at').populate('business', '_id name').sort({created_at: -1}).exec()
	.then(function(response) {
		res.status(200).send(response);
	});
};

// PUT

exports.updateCourse = function(req, res) {
	var id = req.params.id;
	req.body.updated_at = new Date();
	Course.findByIdAndUpdate(id, req.body, function(err, response) {
		if (err)
			res.status(500).send({message: "Ocurrió un error al actualizar la información", error: err});
		else
			res.status(200).send({message: "Se actualizó correctamente la información", user: response});
	});
};

exports.takeCourse = function(req, res) {
	Session.findOne({_id: req.headers.authorization}).exec()
	.then(function(response) {
		User.findByIdAndUpdate(response.user, {$push: {courses: req.params.id}}, {safe: true, upsert: true}, function(err, response) {
		if (err)
			res.status(500).send({message: "Ocurrió un error al tomar el curso", error: err});
		else
			res.status(200).send({message: "Se tomó el curso correctamente"});
		});
	})
	.then(undefined, function(err) {
		res.status(500).send({message: "Ocurrió un error al tomar el curso", error: err});
	});
};

// DELETE

exports.deleteCourse = function(req, res) {
	Course.remove({_id: req.params.id}).exec()
	.then(function(response) {
		res.status(200).send({message: "Se eliminó correctamente el curso"});
	})
	.then(undefined, function(err) {
		res.status(500).send({message: "Ocurrió un problema al eliminar el curso"});
	});
};
