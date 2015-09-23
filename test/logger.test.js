/* global describe, it */
'use strict';

require('chai').should();
const logger = require('../main');

describe('Logger', () => {

	it('should exist', () => {
		logger.should.exist;
	});

});
