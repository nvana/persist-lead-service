var express = require('express')
var bodyParser = require('body-parser')
var config = require('./config.json')
var leadModel = require('./model/Lead')
var dataCheck = require('./lib/dataCheck.js')
var mongoose = require('mongoose')
var LeadSchema = new mongoose.Schema(leadModel)
LeadSchema.plugin(require('mongoose-unique-validator'))
var Lead = mongoose.model('lead', LeadSchema)

mongoose.connect('mongodb://' + config.databaseURL + '/' + config.databaseName)
var app = express()
// parse text/json
app.use(bodyParser.json())

app.post('/add-new-lead', function(req, res) {
	var missingMandatoryFields = dataCheck.checkReqHasFields(req.body, 
	['title' , 'firstname', 'lastname', 'email', 'company', {'address' : ['street', 'zipCode', 'city', 'country'] }, 'complementaryNote'], '')
	if(missingMandatoryFields.length === 0) {
		var newLeadAttributes = {
			title: req.body.title,
      		firstname: req.body.firstname,
			lastname: req.body.lastname,
			email: req.body.email,
			birthday: req.body.birthday,
			company: req.body.company,
			budget: req.body.budget,
			celPhone: req.body.celPhone,
			officePhone: req.body.officePhone,
			address: req.body.address,
			complementaryNote: req.body.complementaryNote,
			creationDate: new Date(),
			updateDate: new Date()
		}
		
		var newLead = new Lead(newLeadAttributes);
		newLead.save(function (err) {
			if(err) {
				if(err.name === 'ValidationError') {
					res.json({
						success: false, 
						message: 'Another Lead with the same ' +  Object.keys(err.errors)[0] + ' already exists',
						statusCode: config.statusCodes.duplicateEntry[Object.keys(err.errors)[0]]
					})
				} else {
					res.json({success: false, message: 'Sorry, something went couldn\'t save the new lead' })	
				}
			} else {
				res.json({success: true, message: 'Correctly saved the new lead'})
			}
		})
	} else {
		res.json({
			success: false, 
			message: missingMandatoryFields + ': these fields are mandatory',
			statusCode: config.statusCodes.mandatoryFieldsMissing })
	}
})

app.post('/update-lead', function(req, res) {
	Lead.update({"email": req.body.email}, req.body, {}, function(err, numAffected) {
		if(err) {
			res.json({success: false, message: 'Sorry, something went couldn\'t save the new lead'})
		} else {
			if(numAffected.nModified === 0) {
				res.json({
					success: false, 
					message: 'Nothing new',
					statusCode: config.statusCodes.noFieldUpdated
				})
			}
			if(numAffected.nModified === 1) {
				res.json({success: true, message: 'Correctly updated the lead'})
			}
		}
	})
})
app.listen(3000)