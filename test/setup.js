require('babel-register')({
	// just transpile the tests
	ignore: filename => !(/test/.test(filename))
});
