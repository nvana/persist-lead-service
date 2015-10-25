var dataCheck = require('../lib/dataCheck.js')
var assert = require('assert')

module.exports = [
	function() {
		assert.strictEqual(
			dataCheck.checkReqHasFields(
					{firstname: 'John Doe'}, ['firstname']
			).length,
			0,
			'firstname mandatory, firstname provided => must return [] meaning that no mandatory field\'s missing'
		)
	},
	
	function() {
		assert.deepEqual(
			dataCheck.checkReqHasFields(
					{}, ['firstname']
			),
			['firstname'],
			'firstname mandatory, firstname not provided => must return [\'firstname\'] meaning that firstname mandatory field\'s missing'
		)
	}
]