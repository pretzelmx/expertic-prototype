'use strict';

var Dependency = require('../models/dependency');

// POST

exports.createDependency = function(req, res) {
	req.assert('name', 'Debe proporcionar el nombre de la dependencia').notEmpty();
	req.assert('responsible', 'Debe proporcionar el nombre del responsable de la dependencia').notEmpty();
	req.assert('admin', 'Debe proporcionar el administrador de la dependencia').notEmpty();
  	var errors = req.validationErrors();

  	if (errors)
    	return res.status(400).send({message: "La información proporcionada no es válida", errors: errors});

	Dependency.create(req.body)
	.then(function(response) {
  		res.status(201).send({message: "Dependencia creada correctamente", user: response});
	})
	.then(undefined, function(err) {
		var error = "Ocurrió un problema al registrar la dependencia";
		if (err.code === 11000)
			error = "La dependencia ya está registrada";
		res.status(500).send({message: error, error: err});
	});
};

// GET

exports.getDependencies = function(req, res) {
	Dependency.find({}).populate('admin', 'firstname lastname').exec()
	.then(function(response) {
		res.status(200).send(response);
	});
};

exports.getDependencyById = function(req, res) {
	Dependency.findById(req.params.id).populate('admin', 'firstname lastname').exec()
	.then(function(response) {
		res.status(200).send(response);
	});
};

// PUT

exports.updateDependency = function(req, res) {
	var id = req.params.id;
	req.body.updated_at = new Date();
	Dependency.findByIdAndUpdate(id, req.body, function(err, response) {
		if (err)
			res.status(500).send({message: "Ocurrió un error al actualizar la información", error: err});
		else
			res.status(200).send({message: "Se actualizó correctamente la información", user: response});
	});
};

// DELETE

exports.deleteDependency = function(req, res) {
	Dependency.remove({_id: req.params.id}).exec()
	.then(function(response) {
		res.status(200).send({message: "Se eliminó correctamente la dependencia"});
	})
	.then(undefined, function(err) {
		res.status(500).send({message: "Ocurrió un problema al eliminar la dependencia"});
	});
};
