/*global describe, it*/
'use strict';

require('chai').should();
var logger = require('../main');

describe('Logger', function () {

	it('should exist', function () {
		logger.should.exist;
	});

});
