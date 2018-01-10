require('babel-register')({
	// just transpile the tests
	ignore: filename => {
		console.log(filename);
		return !(/n-logger\/test/.test(filename));
	}
});
