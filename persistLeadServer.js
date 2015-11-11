var express = require('express')
var bodyParser = require('body-parser')
var config = require('./config.json')
var leadModel = require('./model/Lead')
var dataCheck = require('./lib/dataCheck.js')
var mongoose = require('mongoose')
var Lead = mongoose.model('lead', leadModel);
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
			err === true ? res.json({success: false, message: 'Sorry, something went couldn\'t save the new lead' }) :
				res.json({success: true, message: 'Correctly saved the new lead'})
		})
	} else {
		res.json({
			success: false, 
			message: missingMandatoryFields + ': these fields are mandatory',
			statusCode: config.statusCodes.mandatoryFieldsMissing })
	}
})

app.listen(3000)