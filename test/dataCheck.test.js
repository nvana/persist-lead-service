var dataCheck = require('../lib/dataCheck.js')
var assert = require('assert')

module.exports = [
	
	function() {
		assert.strictEqual(
			dataCheck.checkReqHasFields(
					{}, [], ''
			).length,
			0,
			'no mandatory field provided'
		)
	},
	
	function() {
		assert.strictEqual(
			dataCheck.checkReqHasFields(
					{firstname: 'John Doe'}, ['firstname'], ''
			).length,
			0,
			'firstname mandatory, firstname provided => must return [] meaning that no mandatory field\'s missing'
		)
	},
	
	function() {
		assert.deepEqual(
			dataCheck.checkReqHasFields(
					{}, ['firstname'], ''
			),
			['firstname'],
			'firstname mandatory, firstname not provided => must return [\'firstname\'] meaning that firstname mandatory field\'s missing'
		)
	},
	
	function() {
		assert.deepEqual(
			dataCheck.checkReqHasFields(
					{firstname: 'John Doe'}, ['firstname', 'lastname'], ''
			),
			['lastname'],
			'lastname mandatory, lastname not provided => must return [\'lastname\'] meaning that lastname mandatory field\'s missing'
		)
	},
	
	function() {
		assert.deepEqual(
			dataCheck.checkReqHasFields(
					{firstname: undefined}, ['firstname', 'lastname'], ''
			),
			['firstname', 'lastname'],
			'lastname mandatory, lastname not provided => must return [\'lastname\'] meaning that lastname mandatory field\'s missing'
		)
	},
	
	function() {
		assert.deepEqual(
			dataCheck.checkReqHasFields(
					{firstname: 'John', address: '3 rue toto' }, ['firstname', { 'address': ['street']} ], ''
			),
			[ 'address.street' ],
			'address is a json object, hence its field must be all provided '
		)
	},
	
	function() {
		assert.deepEqual(
			dataCheck.checkReqHasFields(
					{firstname: 'John' }, ['firstname', { 'address': ['street']} ], ''
			),
			[ 'address' ],
			'address is a json object, hence its field must be all provided '
		)
	},
	
	function() {
		assert.deepEqual(
			dataCheck.checkReqHasFields(
					{firstname: 'John', address: { 'street': {'oldName': 'honlulu'} } }, ['firstname', { 'address': [ { 'street': ['oldName', 'newName'] } ] } ], ''
			),
			[ 'address.street.newName' ],
			'address is a json object, hence its field must be all provided '
		)
	}
]