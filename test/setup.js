require('babel-register')({
	// just transpile the tests
	only: filename => /n-logger\/test/.test(filename)
});
