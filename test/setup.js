require('babel-register')({
	// just transpile the tests
	ignore: filename => !(/n-logger\/test/.test(filename))
});
