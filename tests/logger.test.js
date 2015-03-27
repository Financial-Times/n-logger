'use script';

require('chai').should();
var logger = require('../main');

describe('Logger', function () {

	it('should exists', function () {
		logger.should.exist;
	});

});
