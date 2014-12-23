'use strict';

var Business = require('../models/business');

// POST

exports.createBusiness = function(req, res) {
	req.assert('email', 'Debe proporcionar un correo electrónico válido').isEmail();
	req.assert('name', 'Debe proporcionar el nombre o razón social de la empresa').notEmpty();
	req.assert('responsible', 'Debe proporcionar el nombre del responsable de la empresa').notEmpty();
	req.assert('rfc', 'Debe proporcionar RFC de la empresa').notEmpty();
	req.assert('password', 'La contraseña debe tener entre 6 y 20 caracteres').len(6, 20);
  	var errors = req.validationErrors();

  	if (errors)
    	return res.status(400).send({message: "La información proporcionada no es válida", errors: errors});

	Business.create(req.body)
	.then(function(response) {
		var business = response.toJSON();
  		res.status(201).send({message: "Empresa creada correctamente", business: business});
	})
	.then(undefined, function(err) {
		var error = "Ocurrió un problema al registrar la empresa";
		if (err.code === 11000)
			error = "La empresa ya está registrada";
		res.status(500).send({message: error, error: err});
	});
};

// GET

exports.getBusiness = function(req, res) {
	Business.find({roles: {$ne: ['guest']}}, 'email name rfc responsible roles updated_at category').exec()
	.then(function(response) {
		res.status(200).send(response);
	});
};

exports.getBusinessById = function(req, res) {
	Business.findById(req.params.id).exec()
	.then(function(response) {
		res.status(200).send(response);
	});
};

// PUT

exports.updateBusiness = function(req, res) {
	var id = req.params.id;
	req.body.updated_at = new Date();
	Business.findByIdAndUpdate(id, req.body, function(err, response) {
		if (err)
			res.status(500).send({message: "Ocurrió un error al actualizar la información", error: err});
		else
			res.status(200).send({message: "Se actualizó correctamente la información", user: response});
	});
};

exports.updatePasswordBusiness = function(req, res) {
	var id = req.params.id;
	Business.findById(id, function(err, response) {
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

exports.deleteBusiness = function(req, res) {
	var id = req.params.id;
	var business = {roles: ['guest']};
	Business.findByIdAndUpdate(id, business, function(err, business) {
		if (err)
			res.status(500).send({message: "Ocurrió un problema al eliminar la empresa"});
		else
			res.status(200).send({message: "Se eliminó correctamente la empresa"});
	});
};
