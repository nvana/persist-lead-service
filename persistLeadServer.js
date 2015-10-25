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
	['firstname', 'lastname', 'email', 'company', 'address', 'sideNote'])
	if(missingMandatoryFields.length === 0) {
		var newLeadAttributes = {
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			email: req.body.email,
			company: req.body.company,
			address: req.body.address,
			sideNote: req.body.sideNote,
			creationDate: new Date(),
			updateDate: new Date()
		}
		
		var newLead = new Lead(newLeadAttributes);
		newLead.save(function (err) {
			err === true ? res.json({success: false, message: 'Sorry, something went couldn\'t save the new lead' }) :
				res.json({success: true, message: 'Correctly saved the new lead'})
		})
	} else {
		res.json({success: false, message: missingMandatoryFields + ': these fields are mandatory' })
	}
})

app.listen(3000)