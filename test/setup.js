require('babel-register')({
	// just compile the tests
	only: filename => /n-logger\/test/.test(filename)
});
