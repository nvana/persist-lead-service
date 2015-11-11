module.exports = {
	checkReqHasFields: function(reqBody, fields, currentContext) {
		var missingMandatoryFields = []
		
		for(var i = 0; i < fields.length; i ++) {
			var key = fields[i]
			if(typeof(key) === 'string') {
				if(typeof(reqBody) !== 'object') {
					missingMandatoryFields.push((currentContext !== '' ? currentContext + '.' : '') + key)
				} else {
					if(!(key in reqBody)) {
						missingMandatoryFields.push((currentContext !== '' ? currentContext + '.' : '') + key)
					} else {
						if(reqBody[key] === undefined || !reqBody[key]) {
							missingMandatoryFields.push((currentContext !== '' ? currentContext + '.' : '') + key)
						}
					}
				}
			} else {
				if(typeof(key) === 'object') {
					if(reqBody[Object.keys(key)[0]] === undefined || !reqBody[Object.keys(key)[0]]) {
						missingMandatoryFields.push(Object.keys(key)[0])
					} else {
						missingMandatoryFields = missingMandatoryFields.concat(
							this.checkReqHasFields(reqBody[Object.keys(key)[0]], key[Object.keys(key)[0]], (currentContext !== '' ? currentContext + '.' : '') + Object.keys(key)[0])
						)
					}
				}
			}
		}
		return missingMandatoryFields
	}
}
