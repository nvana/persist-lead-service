module.exports = {
	checkReqHasFields: function(reqBody, fields) {
		var missingMandatoryFields = []
		
		for(var i = 0; i < fields.length; i ++) {
			if(! (fields[i] in reqBody)) {
				missingMandatoryFields.push(fields[i])
			}
		}
		
		return missingMandatoryFields
	}
}